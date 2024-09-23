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
        await pool.query('INSERT INTO wars (id, attack, defence, reportAttack, reportDefence) VALUES (?, ?, ?, ?, ?)', [battleId, attack, defence, reportAttack, reportDefence]);
        res.status(201).json({ message: 'war report saved successfully', battleId });

    } catch (error) {

        console.error('Error save report', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/warReport', async (req, res) => {

    const { battleId } = req.body;
    try {

        const [war] = await pool.query('SELECT * FROM wars WHERE id = ?', [battleId]);
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
        const [wars] = await pool.query('SELECT id FROM wars WHERE attack = ? OR defence = ?', [playerToken, playerToken]);
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
        const [ongoingWarResult] = await pool.query('SELECT * FROM wars WHERE id = ?', [battleId]);
        const battle = ongoingWarResult[0];

        if (!battle) {
            console.error(`Battle with ID ${battleId} not found.`);
            return;
        }

        const [attackerResult] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [battle.attackerPlayerToken]);
        const attacker = attackerResult[0];

        const [defenderResult] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [battle.defenderPlayerToken]);
        const defender = defenderResult[0];

        const attackerForces = battle.attackerForce;
        const defenderForces1 = defender.defence ? defender.defence : [];
        const defenderForces2 = defender.force ? defender.force : [];

        if (!Array.isArray(attackerForces) || !Array.isArray(defenderForces2)) {
            console.error('Invalid forces data for attacker or defender.');
            return;
        }

        const totalAttackPower = attackerForces.reduce((total, force) => {
            return total + (force.force.attack * force.force.number);
        }, 0);


        const totalDefensePower1 = defenderForces1.reduce((total, unit) => {
            if (unit.force.name !== 'Spy') {
                return total + (unit.force.defence * unit.force.number);
            }
            return total;
        }, 0);

        const totalDefensePower2 = defenderForces2.reduce((total, unit) => {
            if (unit.force.name !== 'Spy') {
                return total + (unit.force.defence * unit.force.number);
            }
            return total;
        }, 0);

        totalDefensePower = totalDefensePower1 + totalDefensePower2;

        console.log(`Attacker total attack power: ${totalAttackPower}`);
        console.log(`Defender total force power: ${totalDefensePower}`);


        let battleReport = `Battle ${battleId} ended. `;
        let winner;

        if (totalAttackPower > totalDefensePower) {
            winner = 'attacker';
            battleReport += 'Attacker won the battle.\n';

            // All defender forces wiped out (excluding Spies)
            defenderForces1.forEach(unit => {
                if (unit.force.name !== 'Spy') {
                    unit.force.number = 0;
                }
            });

            // All defender forces wiped out (excluding Spies)
            defenderForces2.forEach(unit => {
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

            currentForces = attacker.force;

            // Assuming currentForces holds the forces retrieved from the database
            currentForces.forEach(currentForce => {
                // Find the matching force in the updated attackerForces
                const matchingForce = attackerForces.find(f => f.force.name === currentForce.force.name);

                if (matchingForce) {
                    // Add the surviving forces from the battle to the current forces
                    currentForce.force.number += matchingForce.force.number;
                }
            });

            // Handle any forces in attackerForces that were not present in currentForces
            attackerForces.forEach(newForce => {
                const existingForce = currentForces.find(f => f.force.name === newForce.force.name);

                if (!existingForce && newForce.force.number > 0) {
                    // Add this new surviving force to currentForces
                    currentForces.push(newForce);
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
            await pool.query('UPDATE users SET wood = ?, stone = ?, iron = ?, wheat = ?, `force` = ?, defence = ? WHERE playerToken = ?',
                [defender.wood, defender.stone, defender.iron, defender.wheat, JSON.stringify(defenderForces2),  JSON.stringify(defenderForces1), battle.defenderPlayerToken]);
            await pool.query('UPDATE users SET wood = ?, stone = ?, iron = ?, wheat = ?, `force` = ? WHERE playerToken = ?',
                [attacker.wood, attacker.stone, attacker.iron, attacker.wheat, JSON.stringify(currentForces), battle.attackerPlayerToken]);

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
            const totalForceHealth = defenderForces2.reduce((total, unit) => unit.force.name !== 'Spy' ? total + (unit.force.hp * unit.force.number) : total, 0);

            defenderForces2.forEach(unit => {
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
                [JSON.stringify(defenderForces2), battle.defence]);
        }

        battleReport += `Final attacker resources: Wood: ${attacker.wood}, Stone: ${attacker.stone}, Iron: ${attacker.iron}, Wheat: ${attacker.wheat}\n`;
        battleReport += `Final defender resources: Wood: ${defender.wood}, Stone: ${defender.stone}, Iron: ${defender.iron}, Wheat: ${defender.wheat}\n`;

        console.log(battleReport);

        await pool.query('UPDATE wars SET result = ?, warStatus = "finished" WHERE id = ?',
            [JSON.stringify(battleReport), battleId]);

    } catch (error) {
        console.error('Error handling battle end:', error);
    }
}

async function handleSpyBattleEnd(battleId) {
    try {
        const [ongoingWarResult] = await pool.query('SELECT * FROM wars WHERE id = ?', [battleId]);
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
        await pool.query('UPDATE wars SET result = ?, status = "Completed", winner = ? WHERE id = ?',
            [JSON.stringify(spyBattleReport), winner, battleId]);

        console.log(spyBattleReport);

    } catch (error) {
        console.error('Error handling spy battle end:', error);
    }
}

async function handleMachineBattleEnd(battleId) {
    try {
        console.log(`Starting machine battle resolution for Battle ID: ${battleId}`);

        // Fetch the ongoing battle
        const [battleResult] = await pool.query('SELECT * FROM wars WHERE id = ?', [battleId]);
        const battle = battleResult[0];

        if (!battle) {
            console.error(`Battle with ID ${battleId} not found.`);
            return;
        }

        // Fetch attacker and defender information
        const [attackerResult] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [battle.attack]);
        const [defenderResult] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [battle.defence]);
        const attacker = attackerResult[0];
        const defender = defenderResult[0];

        // Fetch defender's buildings
        const [defenderBuildingsResult] = await pool.query('SELECT * FROM userbuildings WHERE playerToken = ?', [battle.defence]);
        const defenderBuildings = defenderBuildingsResult[0];

        const attackerForces = attacker.force ? attacker.force : [];

        let battleReport = `\nBattle ${battleId} ended. `;
        let winner;

        let totalMachineAttackPower = 0;
        let totalBuildingDefensePower = 0;
        let buildingsDamagedReport = '';

        console.log('Processing machine forces...');

        // Process machine forces attacking buildings
        for (const force of attackerForces) {
            if (['Balloon', 'Battering Ram', 'Heavy Catapult'].includes(force.force.name)) {
                const targetBuilding = force.targetBuilding;

                console.log(`Attacking ${targetBuilding} with ${force.force.name}.`);

                // Check if the targeted building exists and is active
                if (defenderBuildings[targetBuilding] && defenderBuildings[targetBuilding].isActive) {
                    const buildingLevel = defenderBuildings[targetBuilding].buildingLevel || 1;
                    const buildingHP = calculateBuildingHP(targetBuilding, buildingLevel);

                    // Initialize HP if not already set
                    defenderBuildings[targetBuilding].hp = defenderBuildings[targetBuilding].hp || buildingHP;

                    // Calculate and apply damage
                    const damageDealt = force.force.attack * force.force.number;
                    defenderBuildings[targetBuilding].hp -= damageDealt;

                    totalMachineAttackPower += damageDealt;
                    totalBuildingDefensePower += buildingHP;

                    console.log(`Dealt ${damageDealt} damage to ${targetBuilding}. Remaining HP: ${defenderBuildings[targetBuilding].hp}`);

                    // Check if the building is destroyed
                    if (defenderBuildings[targetBuilding].hp <= 0) {
                        buildingsDamagedReport += `${targetBuilding} has been destroyed.\n`;
                        console.log(`${targetBuilding} has been destroyed.`);
                        defenderBuildings[targetBuilding] = null; // Remove the building if HP is 0
                    } else {
                        buildingsDamagedReport += `${targetBuilding} remaining HP: ${defenderBuildings[targetBuilding].hp}\n`;
                    }
                } else {
                    console.log(`${targetBuilding} is not active or does not exist.`);
                }
            }
        }

        // Determine the winner based on total attack power and building defense
        if (totalMachineAttackPower > totalBuildingDefensePower) {
            winner = 'attacker';
            battleReport += 'Attacker won the battle.\n';
            console.log('Attacker won the battle.');
        } else {
            winner = 'defender';
            battleReport += 'Defender won the battle.\n';
            console.log('Defender won the battle.');
        }

        // Compile the final report
        battleReport += `Attacker total attack power: ${totalMachineAttackPower}\n`;
        battleReport += `Defender total defense power: ${totalBuildingDefensePower}\n`;
        battleReport += buildingsDamagedReport;

        console.log(`Battle Report:\n${battleReport}`);

        // Convert buildings data to JSON strings before saving to the database
        const updatedDefenderBuildings = {};
        for (const [key, value] of Object.entries(defenderBuildings)) {
            updatedDefenderBuildings[key] = value ? JSON.stringify(value) : null;
        }

        // Save the updated buildings back to the database
        await pool.query('UPDATE userbuildings SET ? WHERE playerToken = ?', [updatedDefenderBuildings, battle.defence]);

        // Update the ongoing war record with the battle result
        await pool.query('UPDATE wars SET result = ?, status = "Completed", winner = ? WHERE id = ?', [JSON.stringify(battleReport), winner, battleId]);

        console.log('Machine battle resolution completed successfully.');

    } catch (error) {
        console.error('Error handling machine battle end:', error);
    }
}

router.post('/startWar', async (req, res) => {
    const { attackerToken, defenderToken, attackerForce, mode } = req.body;

    try {
        const [attackerResult] = await pool.query('SELECT citypositionX, citypositionY, `force` FROM users WHERE playerToken = ?', [attackerToken]);
        const attacker = attackerResult[0];
        if (!attacker) {
            return res.status(404).json({ error: 'Attacker not found' });
        }

        let currentForces = attacker.force; // Assuming the forces are stored as JSON in the database

        // Loop through the sent forces and deduct from current forces
        attackerForce.forEach(sentForce => {
            let matchingForce = currentForces.find(f => f.force.name === sentForce.force.name);
            if (matchingForce) {
                matchingForce.force.number -= sentForce.force.number;
                if (matchingForce.force.number < 0) {
                    matchingForce.force.number = 0; // Prevent negative numbers
                }
            }
        });

        // Update the attacker's forces in the database
        const updatedForces = JSON.stringify(currentForces);
        await pool.query('UPDATE users SET `force` = ? WHERE playerToken = ?', [updatedForces, attackerToken]);


        // Retrieve defender data including city position, force, and defence
        const [defenderResult] = await pool.query('SELECT citypositionX, citypositionY FROM users WHERE playerToken = ?', [defenderToken]);
        const defender = defenderResult[0];
        if (!defender) {
            return res.status(404).json({ error: 'Defender not found' });
        }

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
            'INSERT INTO wars (attackerPlayerToken, defenderPlayerToken, attackerForce, mode, travelTime, scheduledStartTime, warStatus) VALUES (?, ?, ?, ?, ?, NOW(), ?)',
            [attackerToken, defenderToken, JSON.stringify(attackerForce), mode, travelTime, 'scheduled']);

        const battleId = result.insertId;

        // Schedule a job to handle the end of travel time
        const travelTimeInMillis = travelTime * 60 * 1000; // Convert minutes to milliseconds

        switch (mode) {
            case 'battle':
                schedule.scheduleJob(new Date(Date.now() + travelTimeInMillis), () => handleBattleEnd(battleId));
                // schedule.scheduleJob(new Date(Date.now() + travelTimeInMillis), () => handleMachineBattleEnd(battleId));
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
            'SELECT * FROM wars WHERE attackerPlayerToken = ? OR defenderPlayerToken = ?',
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
        await pool.query('DELETE FROM wars WHERE id = ?', [battleId]);
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