const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const schedule = require('node-schedule');


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Alireza1995!',
    database: 'battle-of-eternals',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

router.post('/addWar', async (req, res) => {

    const { attack, defence, reportAttack, reportDefence } = req.body;

    try {

        const battleId = generateRandomToken();
        await pool.query('INSERT INTO wars (battleId, attack, defence, reportAttack, reportDefence) VALUES (?, ?, ?, ?, ?)', [battleId, attack, defence, reportAttack, reportDefence]);
        res.status(201).json({ message: 'war report saved successfully', battleId });

    } catch (error) {

        console.error('Error save report', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/warReport', async (req, res) => {

    const { battleId } = req.body;
    try {

        const [war] = await pool.query('SELECT * FROM wars WHERE battleId = ?', [battleId]);
        const [attackerName] = await pool.query('SELECT * FROM users WHERE playerToken = ?', war[0].attack);
        const [defenceName] = await pool.query('SELECT * FROM users WHERE playerToken = ?', war[0].defence);

        if (war.length === 0) {
            return res.status(404).json({ error: 'War not found' });
        }

        const report = {
            battleId: war[0].battleId,
            attackerName: attackerName[0].cityName,
            defenceName: defenceName[0].cityName,
            reportAttack: war[0].reportAttack,
            reportDefence: war[0].reportDefence
        }
        res.status(201).json(report);

    } catch (error) {

        console.error('Error war report:', error);
        res.status(500).json({ error: 'Internal server error' });

    }
});

router.post('/searchReport', async (req, res) => {
    const { playerToken } = req.body;
    try {
        const [wars] = await pool.query('SELECT battleId FROM wars WHERE attack = ? OR defence = ?', [playerToken, playerToken]);
        if (wars.length === 0) {
            return res.status(404).json({ error: 'War not found' });
        }

        const battleIds = wars.map(war => war.battleId);
        const formattedResult = `{${battleIds.join(',')}}`;

        res.status(200).json(formattedResult);
    } catch (error) {
        console.error('Error war report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function handleBattleEnd(battleId) {
    try {
        const [ongoingWarResult] = await pool.query('SELECT * FROM ongoingwar WHERE battleId = ?', [battleId]);
        const battle = ongoingWarResult[0];

        if (!battle) {
            console.error(`Battle with ID ${battleId} not found.`);
            return;
        }

        const [attackerResult] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [battle.attack]);
        const attacker = attackerResult[0];

        const [defenderResult] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [battle.defence]);
        const defender = defenderResult[0];

        const attackerForces = (attacker.force);
        const defenderForces = (defender.force);

        const totalAttackPower = attackerForces.reduce((total, force) => total + (force.force.attack * force.force.number), 0);
        const totalDefenseHealth = defenderForces.reduce((total, force) => total + (force.force.hp * force.force.number), 0);
        console.log(`Attacker: ${totalAttackPower}`);
        console.log(`Defender: ${totalDefenseHealth}`);

        let battleReport = `Battle ${battleId} ended. `;

        let winner;
        if (totalAttackPower > totalDefenseHealth) {
            winner = 'attacker';
            battleReport += 'Attacker won the battle.\n';

            // All defender forces wiped out
            defenderForces.forEach(force => {
                force.force.number = 0;
            });

            // Calculate attacker casualties
            const remainingAttackPower = totalDefenseHealth; // Total defense health equals total attack power used
            const totalForcePower = attackerForces.reduce((total, force) => total + (force.force.attack * force.force.number), 0);
            attackerForces.forEach(force => {
                const forcePower = force.force.attack * force.force.number;
                const casualtyPercentage = forcePower / totalForcePower;
                const casualties = remainingAttackPower * casualtyPercentage;
                const initialNumber = force.force.number;
                force.force.number -= Math.round(casualties / force.force.attack);
                if (force.force.number < 0) {
                    force.force.number = 0;
                }
                battleReport += `${force.force.name} - Initial: ${initialNumber}, Remaining: ${force.force.number}, Casualties: ${initialNumber - force.force.number}\n`;
            });

            // Calculate total raid capacity of surviving attacker forces
            const totalRaidCapacity = attackerForces.reduce((total, force) => total + (force.force.load * force.force.number), 0);

            // Calculate raid amount for each resource
            const raidAmounts = {
                wood: Math.min(defender.wood, totalRaidCapacity / 4),
                stone: Math.min(defender.stone, totalRaidCapacity / 4),
                iron: Math.min(defender.iron, totalRaidCapacity / 4),
                wheat: Math.min(defender.wheat, totalRaidCapacity / 4)
            };

            // Adjust resources if raid capacity exceeds one type of resource
            let remainingCapacity = totalRaidCapacity - (raidAmounts.wood + raidAmounts.stone + raidAmounts.iron + raidAmounts.wheat);
            ['wood', 'stone', 'iron', 'wheat'].forEach(resource => {
                if (remainingCapacity > 0) {
                    const additionalRaid = Math.min(defender[resource] - raidAmounts[resource], remainingCapacity);
                    raidAmounts[resource] += additionalRaid;
                    remainingCapacity -= additionalRaid;
                }
            });

            // Retrieve the attacker's resource capacities
            const attackerResourceCapacities = {
                woodCapacity: attacker.woodCapacity,
                stoneCapacity: attacker.stoneCapacity,
                ironCapacity: attacker.ironCapacity,
                wheatCapacity: attacker.wheatCapacity
            };

            // Deduct raided resources from defender and add to attacker
            Object.keys(raidAmounts).forEach(resource => {
                const capacityField = resource + 'Capacity';
                const attackerCurrentResource = attacker[resource];
                const capacityRemaining = attackerResourceCapacities[capacityField] - attackerCurrentResource;
                const raidAmount = Math.min(raidAmounts[resource], capacityRemaining);

                defender[resource] -= raidAmount;
                attacker[resource] += raidAmount;

                battleReport += `Raided ${resource}: ${raidAmount}\n`;
            });

            // Update defender and attacker resources in the database
            await pool.query('UPDATE users SET wood = ?, stone = ?, iron = ?, wheat = ?, `force` = ? WHERE playerToken = ?',
                [defender.wood, defender.stone, defender.iron, defender.wheat, JSON.stringify(defenderForces), battle.defence]);
            await pool.query('UPDATE users SET wood = ?, stone = ?, iron = ?, wheat = ?, `force` = ? WHERE playerToken = ?',
                [attacker.wood, attacker.stone, attacker.iron, attacker.wheat, JSON.stringify(attackerForces), battle.attack]);
        } else {
            winner = 'defender';
            battleReport += 'Defender won the battle.\n';

            // All attacker forces wiped out
            attackerForces.forEach(force => {
                force.force.number = 0;
            });

            // Calculate defender casualties
            const remainingDefenseHealth = totalAttackPower; // Total attack power equals total defense health used
            const totalForceHealth = defenderForces.reduce((total, force) => total + (force.force.hp * force.force.number), 0);
            defenderForces.forEach(force => {
                const forceHealth = force.force.hp * force.force.number;
                const casualtyPercentage = forceHealth / totalForceHealth;
                const casualties = remainingDefenseHealth * casualtyPercentage;
                const initialNumber = force.force.number;
                force.force.number -= Math.round(casualties / force.force.hp);
                if (force.force.number < 0) {
                    force.force.number = 0;
                }
                battleReport += `${force.force.name} - Initial: ${initialNumber}, Remaining: ${force.force.number}, Casualties: ${initialNumber - force.force.number}\n`;
            });

            // Update attacker forces in the database
            await pool.query('UPDATE users SET `force` = ? WHERE playerToken = ?',
                [JSON.stringify(attackerForces), battle.attack]);
            await pool.query('UPDATE users SET `force` = ? WHERE playerToken = ?',
                [JSON.stringify(defenderForces), battle.defence]);
        }

        battleReport += `Final attacker resources: Wood: ${attacker.wood}, Stone: ${attacker.stone}, Iron: ${attacker.iron}, Wheat: ${attacker.wheat}\n`;
        battleReport += `Final defender resources: Wood: ${defender.wood}, Stone: ${defender.stone}, Iron: ${defender.iron}, Wheat: ${defender.wheat}\n`;

        console.log(battleReport);
        await pool.query('UPDATE ongoingwar SET result = ? WHERE battleId = ?', [JSON.stringify(battleReport), battleId]);
        await pool.query('UPDATE ongoingwar SET status = ? WHERE battleId = ?', ["Completed", battleId]);
        await pool.query('UPDATE ongoingwar SET winner = ? WHERE battleId = ?', [winner, battleId]);


    } catch (error) {
        console.error('Error handling battle end:', error);
    }
}

router.post('/startWar', async (req, res) => {
    const { attack, defence } = req.body;

    try {
        // Retrieve attacker data including forces
        const [attackerResult] = await pool.query('SELECT citypositionX, citypositionY, `force` FROM users WHERE playerToken = ?', [attack]);
        const attacker = attackerResult[0];
        if (!attacker) {
            return res.status(404).json({ error: 'Attacker not found' });
        }

        // Retrieve defender data
        const [defenderResult] = await pool.query('SELECT citypositionX, citypositionY, `force` FROM users WHERE playerToken = ?', [defence]);
        const defender = defenderResult[0];
        if (!defender) {
            return res.status(404).json({ error: 'Defender not found' });
        }

        // Use the forces object directly
        const attackerForces = (attacker.force);

        // Calculate the Euclidean distance
        const distance = Math.sqrt(
            Math.pow(defender.citypositionX - attacker.citypositionX, 2) +
            Math.pow(defender.citypositionY - attacker.citypositionY, 2)
        );

        // Set a fixed travel time of 20 seconds for testing
        const travelTime = 20 / 60; // Convert seconds to minutes

        // Save the ongoing war information in the database
        const [result] = await pool.query(
            'INSERT INTO ongoingwar (attack, defence, distance, travelTime, startTime, status) VALUES (?, ?, ?, ?, NOW(), ?)',
            [attack, defence, distance, travelTime, 'ongoing']
        );
        const battleId = result.insertId;

        // Schedule a job to handle the end of travel time
        const travelTimeInMillis = travelTime * 60 * 1000; // Convert minutes to milliseconds
        schedule.scheduleJob(new Date(Date.now() + travelTimeInMillis), () => handleBattleEnd(battleId));

        // Send the distance and travel time in the response
        res.status(200).json({ distance, travelTime, battleId });

    } catch (error) {
        console.error('Error start War:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

function generateRandomToken() {
    let token = '';
    for (let i = 0; i < 5; i++) {
        token += Math.floor(Math.random() * 10); // Generate random digit (0-9)
    }
    return token;
}

module.exports = router;