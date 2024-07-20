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
        // Retrieve battle details
        const [battleResult] = await pool.query('SELECT attack, defence FROM ongoingwar WHERE battleId = ?', [battleId]);
        const battle = battleResult[0];
        if (!battle) {
            console.error('Battle not found');
            return;
        }

        // Retrieve attacker forces
        const [attackerResult] = await pool.query('SELECT `force` FROM users WHERE playerToken = ?', [battle.attack]);
        const attackerForces = (attackerResult[0].force);

        // Retrieve defender forces
        const [defenderResult] = await pool.query('SELECT `force` FROM users WHERE playerToken = ?', [battle.defence]);
        const defenderForces = (defenderResult[0].force);

        // Calculate total attack power for attacker
        const totalAttackPower = attackerForces.reduce((total, force) => total + (force.force.attack * force.force.number), 0);

        // Calculate total defense health for defender
        const totalDefenseHealth = defenderForces.reduce((total, force) => total + (force.force.hp * force.force.number), 0);

        // Determine the winner
        const winner = totalAttackPower > totalDefenseHealth ? 'attacker' : 'defender';

        // Handle casualties
        if (winner === 'attacker') {
            // All defender forces wiped out
            defenderForces.forEach(force => {
                force.force.number = 0;
            });

            // Calculate attacker casualties
            const remainingAttackPower = totalAttackPower - totalDefenseHealth;
            const totalForcePower = attackerForces.reduce((total, force) => total + (force.force.attack * force.force.number), 0);
            attackerForces.forEach(force => {
                const forcePower = force.force.attack * force.force.number;
                const casualtyPercentage = forcePower / totalForcePower;
                const casualties = remainingAttackPower * casualtyPercentage;
                force.force.number -= Math.round(casualties / force.force.attack);
                if (force.force.number < 0) {
                    force.force.number = 0;
                }
            });
        } else {
            // All attacker forces wiped out
            attackerForces.forEach(force => {
                force.force.number = 0;
            });

            // Calculate defender casualties
            const remainingDefenseHealth = totalDefenseHealth - totalAttackPower;
            const totalForceHealth = defenderForces.reduce((total, force) => total + (force.force.hp * force.force.number), 0);
            defenderForces.forEach(force => {
                const forceHealth = force.force.hp * force.force.number;
                const casualtyPercentage = forceHealth / totalForceHealth;
                const casualties = remainingDefenseHealth * casualtyPercentage;
                force.force.number -= Math.round(casualties / force.force.hp);
                if (force.force.number < 0) {
                    force.force.number = 0;
                }
            });
        }

        // Update forces in the database
        await pool.query('UPDATE users SET `force` = ? WHERE playerToken = ?', [JSON.stringify(attackerForces), battle.attack]);
        await pool.query('UPDATE users SET `force` = ? WHERE playerToken = ?', [JSON.stringify(defenderForces), battle.defence]);

        // Update battle status in the database
        await pool.query('UPDATE ongoingwar SET status = ?, winner = ? WHERE battleId = ?', ['completed', winner, battleId]);

        console.log(`Battle ${battleId} ended. Winner: ${winner}`);
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