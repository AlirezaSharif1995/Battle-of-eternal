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

        const attackerForces = attacker.force ? attacker.force : [];
        const defenderForces = defender.defence ? defender.defence : [];

        if (!Array.isArray(attackerForces) || !Array.isArray(defenderForces)) {
            console.error('Invalid forces data for attacker or defender.');
            return;
        }

        // Calculate total attack and defense power excluding Spies
        const totalAttackPower = attackerForces.reduce((total, force) => {
            if (force.force.name !== 'Spy') {
                return total + (force.force.attack * force.force.number);
            }
            return total;
        }, 0);

        const totalDefensePower = defenderForces.reduce((total, unit) => {
            if (unit.force.name !== 'Spy') {
                return total + (unit.force.defence * unit.force.number);
            }
            return total;
        }, 0);

        console.log(`Attacker total attack power: ${totalAttackPower}`);
        console.log(`Defender total defense power: ${totalDefensePower}`);

        let battleReport = `Battle ${battleId} ended. `;
        let winner;

        if (totalAttackPower > totalDefensePower) {
            winner = 'attacker';
            battleReport += 'Attacker won the battle.\n';

            // All defender forces wiped out (excluding Spies)
            defenderForces.forEach(unit => {
                if (unit.force.name !== 'Spy') {
                    unit.force.number = 0;
                }
            });

            // Calculate attacker casualties
            const remainingAttackPower = totalDefensePower; // Total defense power equals total attack power used
            const totalForcePower = attackerForces.reduce((total, force) => force.force.name !== 'Spy' ? total + (force.force.attack * force.force.number) : total, 0);

            attackerForces.forEach(force => {
                if (force.force.name !== 'Spy') {
                    const forcePower = force.force.attack * force.force.number;
                    const casualtyPercentage = forcePower / totalForcePower;
                    const casualties = remainingAttackPower * casualtyPercentage;
                    const initialNumber = force.force.number;
                    force.force.number -= Math.round(casualties / force.force.attack);

                    if (force.force.number < 0) {
                        force.force.number = 0;
                    }

                    battleReport += `${force.force.name} - Initial: ${initialNumber}, Remaining: ${force.force.number}, Casualties: ${initialNumber - force.force.number}\n`;
                }
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
            await pool.query('UPDATE users SET wood = ?, stone = ?, iron = ?, wheat = ?, defence = ? WHERE playerToken = ?',
                [defender.wood, defender.stone, defender.iron, defender.wheat, JSON.stringify(defenderForces), battle.defence]);
            await pool.query('UPDATE users SET wood = ?, stone = ?, iron = ?, wheat = ?, `force` = ? WHERE playerToken = ?',
                [attacker.wood, attacker.stone, attacker.iron, attacker.wheat, JSON.stringify(attackerForces), battle.attack]);

        } else {
            winner = 'defender';
            battleReport += 'Defender won the battle.\n';

            // All attacker forces wiped out (excluding Spies)
            attackerForces.forEach(force => {
                if (force.force.name !== 'Spy') {
                    force.force.number = 0;
                }
            });

            // Calculate defender casualties
            const remainingDefenseHealth = totalAttackPower; // Total attack power equals total defense health used
            const totalForceHealth = defenderForces.reduce((total, unit) => unit.force.name !== 'Spy' ? total + (unit.force.hp * unit.force.number) : total, 0);

            defenderForces.forEach(unit => {
                if (unit.force.name !== 'Spy') {
                    const forceHealth = unit.force.hp * unit.force.number;
                    const casualtyPercentage = forceHealth / totalForceHealth;
                    const casualties = remainingDefenseHealth * casualtyPercentage;
                    const initialNumber = unit.force.number;
                    unit.force.number -= Math.round(casualties / unit.force.hp);

                    if (unit.force.number < 0) {
                        unit.force.number = 0;
                    }

                    battleReport += `${unit.force.name} - Initial: ${initialNumber}, Remaining: ${unit.force.number}, Casualties: ${initialNumber - unit.force.number}\n`;
                }
            });

            // Update attacker forces in the database
            await pool.query('UPDATE users SET `force` = ? WHERE playerToken = ?',
                [JSON.stringify(attackerForces), battle.attack]);
            await pool.query('UPDATE users SET `defence` = ? WHERE playerToken = ?',
                [JSON.stringify(defenderForces), battle.defence]);
        }

        battleReport += `Final attacker resources: Wood: ${attacker.wood}, Stone: ${attacker.stone}, Iron: ${attacker.iron}, Wheat: ${attacker.wheat}\n`;
        battleReport += `Final defender resources: Wood: ${defender.wood}, Stone: ${defender.stone}, Iron: ${defender.iron}, Wheat: ${defender.wheat}\n`;

        console.log(battleReport);

        await pool.query('UPDATE ongoingwar SET result = ?, status = "Completed", winner = ? WHERE battleId = ?',
            [JSON.stringify(battleReport), winner, battleId]);

    } catch (error) {
        console.error('Error handling battle end:', error);
    }
}

async function handleSpyBattleEnd(battleId) {
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

        const attackerForces = attacker.force ? attacker.force : [];
        const defenderForces = defender.defence ? defender.defence : [];

        if (!Array.isArray(attackerForces) || !Array.isArray(defenderForces)) {
            console.error('Invalid forces data for attacker or defender.');
            return;
        }

        // Filter only Spy units
        const attackerSpies = attackerForces.filter(force => force.force.name === 'Spy');
        const defenderSpies = defenderForces.filter(force => force.force.name === 'Spy');

        if (attackerSpies.length === 0 || defenderSpies.length === 0) {
            console.error('One side has no spies, so no spy battle can occur.');
            return;
        }

        // Calculate total attack and defense power for spies
        const totalAttackerSpyPower = attackerSpies.reduce((total, spy) => total + (spy.force.attack * spy.force.number), 0);
        const totalDefenderSpyPower = defenderSpies.reduce((total, spy) => total + (spy.force.defence * spy.force.number), 0);

        console.log(`Attacker total spy power: ${totalAttackerSpyPower}`);
        console.log(`Defender total spy power: ${totalDefenderSpyPower}`);

        let spyBattleReport = `Spy Battle ${battleId} ended. `;
        let winner;

        if (totalAttackerSpyPower > totalDefenderSpyPower) {
            winner = 'attacker';
            spyBattleReport += 'Attacker won the spy battle.\n';

            // Wipe out defender spies
            defenderSpies.forEach(spy => {
                spy.force.number = 0;
            });

            // Provide intelligence to the attacker
            spyBattleReport += `Attacker obtained intelligence:\n`;

            // Resources information
            spyBattleReport += `Defender resources - Wood: ${defender.wood}, Stone: ${defender.stone}, Iron: ${defender.iron}, Wheat: ${defender.wheat}\n`;

            // Defense forces information
            spyBattleReport += `Defender forces: ${JSON.stringify(defenderForces)}\n`;

            // Retrieve building information
            const [buildingsResult] = await pool.query('SELECT * FROM userbuildings WHERE playerToken = ?', [battle.defence]);
            spyBattleReport += `Defender buildings: ${JSON.stringify(buildingsResult)}\n`;

        } else {
            winner = 'defender';
            spyBattleReport += 'Defender won the spy battle.\n';

            // Wipe out attacker spies
            attackerSpies.forEach(spy => {
                spy.force.number = 0;
            });
        }

        // Update spy numbers in the database
        attackerForces.forEach(force => {
            if (force.force.name === 'Spy') {
                const updatedSpy = attackerSpies.find(spy => spy.force.name === force.force.name);
                if (updatedSpy) {
                    force.force.number = updatedSpy.force.number;
                }
            }
        });

        defenderForces.forEach(force => {
            if (force.force.name === 'Spy') {
                const updatedSpy = defenderSpies.find(spy => spy.force.name === force.force.name);
                if (updatedSpy) {
                    force.force.number = updatedSpy.force.number;
                }
            }
        });

        // Update the database with new force numbers
        await pool.query('UPDATE users SET `force` = ? WHERE playerToken = ?', 
            [JSON.stringify(attackerForces), battle.attack]);
        await pool.query('UPDATE users SET `defence` = ? WHERE playerToken = ?', 
            [JSON.stringify(defenderForces), battle.defence]);

        // Update the ongoing war table with the result and winner
        await pool.query('UPDATE ongoingwar SET result = ?, status = "Completed", winner = ? WHERE battleId = ?', 
            [JSON.stringify(spyBattleReport), winner, battleId]);

        console.log(spyBattleReport);

    } catch (error) {
        console.error('Error handling spy battle end:', error);
    }
}

router.post('/startWar', async (req, res) => {
    const { attack, defence, mode } = req.body;

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
        const travelTime = 10 / 60; // Convert seconds to minutes
        const time = new Date();
        const timer = `h: ${time.getHours()}  m: ${time.getMinutes()}  D:${time.getDate()}  M:${time.getMonth() + 1}  Y:${time.getFullYear()}`;
        // Save the ongoing war information in the database
        const [result] = await pool.query(
            'INSERT INTO ongoingwar (attack, defence, distance, travelTime, startTime, status) VALUES (?, ?, ?, ?, NOW(), ?)',
            [attack, defence, distance, travelTime, 'ongoing']
        );
        const battleId = result.insertId;

        // Schedule a job to handle the end of travel time
        const travelTimeInMillis = travelTime * 60 * 1000; // Convert minutes to milliseconds

        switch (mode) {
            case 'standard':
                schedule.scheduleJob(new Date(Date.now() + travelTimeInMillis), () => handleBattleEnd(battleId));
                break;
            case 'spy':
                schedule.scheduleJob(new Date(Date.now() + travelTimeInMillis), () => handleSpyBattleEnd(battleId));
                break;
            default:
                console.error(`Unknown battle mode: ${battle.mode}`);
                return;
        }

        // Send the distance and travel time in the response
        res.status(200).json({ distance, travelTime, battleId, timer });

    } catch (error) {
        console.error('Error start War:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/warResult', async (req, res) => {
    const { playerToken } = req.body;

    try {
        const [attackerResults] = await pool.query(
            'SELECT * FROM ongoingwar WHERE attack = ? OR defence = ?',
            [playerToken, playerToken]
        );

        if (attackerResults.length === 0) {
            return res.status(404).json({ message: 'War not found' });
        }

        const playerInfoPromises = attackerResults.map(async result => {
            const [attackerCity] = await pool.query('SELECT cityName FROM users WHERE playerToken = ?', [result.attack]);
            const [defenderCity] = await pool.query('SELECT cityName FROM users WHERE playerToken = ?', [result.defence]);
            return {
                ...result,
                attackerCity: attackerCity.length > 0 ? attackerCity[0].cityName : null,
                defenderCity: defenderCity.length > 0 ? defenderCity[0].cityName : null,
            };
        });

        const warDetailsWithCities = await Promise.all(playerInfoPromises);

        res.status(200).json(warDetailsWithCities);

    } catch (error) {
        console.error('Error fetching war results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/deleteWar', async (req, res) => {
    const { battleId } = req.body;

    try {
        await pool.query('DELETE FROM ongoingwar WHERE battleId = ?', [battleId]);
        res.status(200).json({ message: `War with battleId: ${battleId} deleted successfully` });
    } catch (error) {
        console.error('Error deleting War:', error);
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