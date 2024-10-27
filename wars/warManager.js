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
        const attackerMachine = battle.attackerMachine;
        const defenderForces1 = defender.defence ? defender.defence : [];
        const defenderForces2 = defender.force ? defender.force : [];

        if (!Array.isArray(attackerForces) || !Array.isArray(defenderForces2)) {
            console.error('Invalid forces data for attacker or defender.');
            return;
        }

        let totalAttackPower = attackerForces.reduce((total, force) => {
            return total + (force.force.attack * force.force.number);
        }, 0);


        let totalDefensePower1 = defenderForces1.reduce((total, unit) => {
            if (unit.force.name !== 'Spy') {
                return total + (unit.force.defence * unit.force.number);
            }
            return total;
        }, 0);

        let totalDefensePower2 = defenderForces2.reduce((total, unit) => {
            if (unit.force.name !== 'Spy') {
                return total + (unit.force.defence * unit.force.number);
            }
            return total;
        }, 0);

        totalDefensePower = totalDefensePower1 + totalDefensePower2;

        let battleReport = `Battle ${battleId} ended.\n`;
        battleReport += `Attacker total attack power: ${totalAttackPower}.\n`;
        battleReport += `Defender total force power: ${totalDefensePower}.\n`;
        let winner;

        const attackKingEffects = attackerForces.reduce((total, unit) => {
            if (unit.force.name === 'King') {
                return total + (unit.force.effect);
            }
            return total;
        }, 0);

        const defenceKingEffect1 = defenderForces1.reduce((total, unit) => {
            if (unit.force.name === 'King') {
                return total + (unit.force.effect);
            }
            return total;
        }, 0);

        const defenceKingEffect2 = defenderForces2.reduce((total, unit) => {
            if (unit.force.name === 'King') {
                return total + (unit.force.effect);
            }
            return total;
        }, 0);

        battleReport += `attackKingEffects: ${attackKingEffects}.\n`;
        battleReport += `defenceKingEffectDefense: ${defenceKingEffect1} + defenceKingEffectForce: ${defenceKingEffect2}.\n`;


        totalAttackPower = totalAttackPower + (attackKingEffects * totalAttackPower);
        totalDefensePower = totalDefensePower + (totalDefensePower * defenceKingEffect1) + (totalDefensePower * defenceKingEffect2);

        if (totalAttackPower > totalDefensePower) {
            winner = 'attacker';
            battleReport += 'Attacker won the battle.\n';

            // All defender forces wiped out (excluding Spies and King)
            const wipeOutDefenderForces = (forces) => {
                forces.forEach(unit => {
                    if (unit.force.name !== 'Spy' && unit.force.name !== 'King') {
                        unit.force.number = 0;
                    }
                });
            };

            wipeOutDefenderForces(defenderForces1);
            wipeOutDefenderForces(defenderForces2);

            // Apply King damage: 0.1% of totalAttackPower
            const applyKingDamage = (forces, attackPower, type) => {
                const kingDamage = attackPower * 0.001;
                forces.forEach(unit => {
                    if (unit.force.name === 'King') {
                        if (kingDamage >= unit.force.defence) {
                            battleReport += `${type} King eliminated.\n`;
                            unit.force.number = 0;
                        } else {
                            battleReport += `${type} King took no damage.\n`;
                        }
                    }
                });
            };

            applyKingDamage(defenderForces1, totalAttackPower, 'Defender');
            applyKingDamage(defenderForces2, totalAttackPower, 'Defender');
            applyKingDamage(attackerForces, totalDefensePower, 'Attacker');

            // Calculate attacker casualties
            const remainingAttackPower = totalDefensePower;
            const totalForcePower = attackerForces.reduce((total, force) =>
                force.force.name !== 'Spy' && force.force.name !== 'Balloon' && force.force.name !== 'King'
                    ? total + (force.force.attack * force.force.number)
                    : total, 0);

            const allAttackerForces = [...attackerForces, ...attackerMachine];

            allAttackerForces.forEach(force => {
                if (force.force.name !== 'Spy' && force.force.name !== 'Balloon' && force.force.name !== 'King') {
                    const forcePower = force.force.attack * force.force.number;
                    const casualtyPercentage = forcePower / totalForcePower;
                    const casualties = remainingAttackPower * casualtyPercentage;
                    const initialNumber = force.force.number;
                    force.force.number -= Math.round(casualties / force.force.attack);
                    force.force.number = Math.max(force.force.number, 0); // Ensure no negative numbers

                    battleReport += `${force.force.name} - Initial: ${initialNumber}, Remaining: ${force.force.number}, Casualties: ${initialNumber - force.force.number}\n`;
                }
            });

            currentForces = attacker.force;

            // Update current forces from the battle results
            currentForces.forEach(currentForce => {
                const matchingForce = allAttackerForces.find(f => f.force.name === currentForce.force.name);
                if (matchingForce) {
                    currentForce.force.number += matchingForce.force.number;
                }
            });

            // Add any new forces from the battle
            allAttackerForces.forEach(newForce => {
                const existingForce = currentForces.find(f => f.force.name === newForce.force.name);
                if (!existingForce && newForce.force.number > 0) {
                    currentForces.push(newForce);
                }
            });

            await pool.query('UPDATE wars SET attackerMachine = ? WHERE id = ?', [JSON.stringify(attackerMachine), battleId]);
            battleReport += await handleMachineBattleEnd(battleId);
            // Calculate total raid capacity of surviving attacker forces
            const totalRaidCapacity = attackerForces.reduce((total, force) => total + (force.force.load * force.force.number), 0);

            // Calculate initial raid amounts, ensuring we don't raid more than the defender has
            const raidAmounts = ['wood', 'stone', 'iron', 'wheat', 'elixir'].reduce((result, resource) => {
                result[resource] = Math.min(defender[resource], totalRaidCapacity / 5);
                return result;
            }, {});

            // Adjust resources if raid capacity exceeds one type of resource
            let remainingCapacity = totalRaidCapacity - Object.values(raidAmounts).reduce((sum, amount) => sum + amount, 0);

            // Redistribute remaining capacity across resources proportionally to the defender's available resources
            ['wood', 'stone', 'iron', 'wheat', 'elixir'].forEach(resource => {
                if (remainingCapacity > 0 && defender[resource] > raidAmounts[resource]) {
                    const additionalRaid = Math.min(defender[resource] - raidAmounts[resource], remainingCapacity);
                    raidAmounts[resource] += additionalRaid;
                    remainingCapacity -= additionalRaid;
                }
            });

            // Deduct raided resources from defender and add to attacker, within their capacity
            const attackerResourceCapacities = {
                wood: attacker.woodCapacity,
                stone: attacker.stoneCapacity,
                iron: attacker.ironCapacity,
                wheat: attacker.wheatCapacity,
                elixir: attacker.elixirCapacity
            };

            Object.keys(raidAmounts).forEach(resource => {
                const raidAmount = Math.min(raidAmounts[resource], attackerResourceCapacities[resource] - attacker[resource]);
                defender[resource] = Math.max(defender[resource] - raidAmount, 0); // Ensure no negative resources
                attacker[resource] += raidAmount;
                battleReport += `Raided ${resource}: ${raidAmount}\n`;
            });


            // Update defender and attacker resources in the database
            await pool.query('UPDATE users SET wood = ?, stone = ?, iron = ?, wheat = ?, elixir = ?, `force` = ?, defence = ? WHERE playerToken = ?',
                [defender.wood, defender.stone, defender.iron, defender.wheat, defender.elixir, JSON.stringify(defenderForces2), JSON.stringify(defenderForces1), battle.defenderPlayerToken]);

            await pool.query('UPDATE users SET wood = ?, stone = ?, iron = ?, wheat = ?, elixir = ?, `force` = ? WHERE playerToken = ?',
                [attacker.wood, attacker.stone, attacker.iron, attacker.wheat, attacker.elixir, JSON.stringify(currentForces), battle.attackerPlayerToken]);
        } else {
            winner = 'defender';
            battleReport += 'Defender won the battle.\n';

            // Combine all defender forces
            const allDefenderForces = [...defenderForces1, ...defenderForces2];

            // Calculate total attack and defense power, excluding Spies
            const totalAttackPower = attackerForces.reduce((total, force) =>
                force.force.name !== 'Spy' ? total + (force.force.attack * force.force.number) : total, 0);

            const totalDefensePower = allDefenderForces.reduce((total, unit) =>
                unit.force.name !== 'Spy' ? total + (unit.force.defence * unit.force.number) : total, 0);

            // Apply King damage to defender forces
            const kingDamage = totalAttackPower * 0.001;
            allDefenderForces.forEach(unit => {
                if (unit.force.name === 'King') {
                    if (kingDamage >= unit.force.defence) {
                        battleReport += 'King defender eliminated.\n';
                        unit.force.number = 0; // King eliminated
                    } else {
                        battleReport += 'King defender took no damage.\n';
                    }
                }
            });

            // Apply King damage to attacker forces
            const attackerKingDamage = totalDefensePower * 0.001;
            attackerForces.forEach(force => {
                if (force.force.name === 'King') {
                    if (attackerKingDamage >= force.force.defence) {
                        battleReport += 'Attacker King eliminated.\n';
                        force.force.number = 0;
                    } else {
                        battleReport += 'Attacker King took no damage.\n';
                    }
                }
            });

            // Calculate defender casualties
            const remainingAttackPower = totalAttackPower;
            allDefenderForces.forEach(unit => {
                if (unit.force.name !== 'Spy' && unit.force.name !== 'King') {
                    const forceDefensePower = unit.force.defence * unit.force.number;
                    const damageProportion = forceDefensePower / totalDefensePower;
                    const damageDealt = remainingAttackPower * damageProportion;

                    const initialNumber = unit.force.number;
                    unit.force.number = Math.max(0, unit.force.number - Math.round(damageDealt / unit.force.defence));

                    battleReport += `${unit.force.name} - Initial: ${initialNumber}, Remaining: ${unit.force.number}, Casualties: ${initialNumber - unit.force.number}\n`;
                }
            });

            // Update defender forces in the database
            await pool.query('UPDATE users SET `defence` = ? WHERE playerToken = ?',
                [JSON.stringify(defenderForces1), battle.defenderPlayerToken]);

            await pool.query('UPDATE users SET `force` = ? WHERE playerToken = ?',
                [JSON.stringify(defenderForces2), battle.defenderPlayerToken]);
        }

        // Display final resource amounts for attacker and defender
        battleReport += `Final attacker resources: Wood: ${attacker.wood}, Stone: ${attacker.stone}, Iron: ${attacker.iron}, Wheat: ${attacker.wheat}, Elixir: ${attacker.elixir}\n`;
        battleReport += `Final defender resources: Wood: ${defender.wood}, Stone: ${defender.stone}, Iron: ${defender.iron}, Wheat: ${defender.wheat}, Elixir: ${defender.elixir}\n`;

        // Log the battle report
        console.log(battleReport);

        // Update war result and status in the database
        await pool.query('UPDATE wars SET result = ?, warStatus = "finished" WHERE id = ?',
            [JSON.stringify(battleReport), battleId]);
    }
    catch (error) {
        console.error('Error handling battle end:', error);
    }
};

async function handleSpyBattleEnd(battleId) {
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

        // Filter only Spy units
        const attackerSpies = attackerForces.filter(force => force.force.name === 'Spy');
        const defenderSpies1 = defenderForces1.filter(force => force.force.name === 'Spy');
        const defenderSpies2 = defenderForces2.filter(force => force.force.name === 'Spy');

        // Calculate total attack and defense power for spies
        const totalAttackerSpyPower = attackerSpies.reduce((total, spy) => total + (spy.force.attack * spy.force.number), 0);
        const totalDefenderSpyPower1 = defenderSpies1.reduce((total, spy) => total + (spy.force.defence * spy.force.number), 0);
        const totalDefenderSpyPower2 = defenderSpies2.reduce((total, spy) => total + (spy.force.defence * spy.force.number), 0);
        const totalDefenderSpyPower = totalDefenderSpyPower1 + totalDefenderSpyPower2;

        console.log(`Attacker total spy power: ${totalAttackerSpyPower}`);
        console.log(`Defender total spy power: ${totalDefenderSpyPower}`);

        let spyBattleReport = `Spy Battle ${battleId} ended. `;
        let winner;

        if (totalAttackerSpyPower > totalDefenderSpyPower) {
            winner = 'attacker';
            spyBattleReport += 'Attacker won the spy battle.\n';

            // // All defender forces wiped out (excluding Spies)
            // defenderForces1.forEach(unit => {
            //     if (unit.force.name === 'Spy') {
            //         unit.force.number = 0;
            //     }
            // });

            // // All defender forces wiped out (excluding Spies)
            // defenderForces2.forEach(unit => {
            //     if (unit.force.name === 'Spy') {
            //         unit.force.number = 0;
            //     }
            // });

            // Calculate attacker casualties
            const remainingAttackPower = totalDefenderSpyPower; // Total defense power equals total attack power used
            const totalForcePower = attackerForces.reduce((total, force) => force.force.name === 'Spy' ? total + (force.force.attack * force.force.number) : total, 0);

            attackerForces.forEach(force => {
                if (force.force.name === 'Spy') {
                    const forcePower = force.force.attack * force.force.number;
                    const casualtyPercentage = forcePower / totalForcePower;
                    const casualties = remainingAttackPower * casualtyPercentage;
                    const initialNumber = force.force.number;
                    force.force.number -= Math.round(casualties / force.force.attack);

                    if (force.force.number < 0) {
                        force.force.number = 0;
                    }

                    console.log(`${force.force.name} - Initial: ${initialNumber}, Remaining: ${force.force.number}, Casualties: ${initialNumber - force.force.number}\n`);
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

            // Provide intelligence to the attacker
            spyBattleReport += `Attacker obtained intelligence:\n`;
            spyBattleReport += `Defender resources - Wood: ${defender.wood}, Stone: ${defender.stone}, Iron: ${defender.iron}, Wheat: ${defender.wheat}\n`;
            spyBattleReport += `Defender forces: ${JSON.stringify(defenderForces1)}\n`;

            // Retrieve building information
            const [buildingsResult] = await pool.query('SELECT * FROM userbuildings WHERE playerToken = ?', [battle.defenderPlayerToken]);
            spyBattleReport += `Defender buildings: ${JSON.stringify(buildingsResult)}\n`;

        } else {
            winner = 'defender';
            spyBattleReport += 'Defender won the spy battle.\n';

            // All attacker spies wiped out
            attackerForces.forEach(unit => {
                if (unit.force.name === 'Spy') {
                    unit.force.number = 0;
                }
            });
            currentForces = attackerForces;
            // Calculate casualties for the defender
            const totalDamage = totalAttackerSpyPower; // Damage dealt to the defender
            const totalDefenderPower = defenderForces1.reduce((total, unit) => {
                if (unit.force.name === 'Spy') {
                    return total + (unit.force.defence * unit.force.number);
                }
                return total;
            }, 0) + defenderForces2.reduce((total, unit) => {
                if (unit.force.name === 'Spy') {
                    return total + (unit.force.defence * unit.force.number);
                }
                return total;
            }, 0); // Total defense power excluding spies

            // // Calculate casualties proportionally based on their power
            // [...defenderForces1, ...defenderForces2].forEach(unit => {
            //     if (unit.force.name === 'Spy') {
            //         const forcePower = unit.force.defence * unit.force.number; // Calculate defense power
            //         const casualtyProportion = forcePower / totalDefenderPower; // Determine proportion
            //         const casualties = Math.round(totalDamage * casualtyProportion); // Calculate casualties

            //         const initialNumber = unit.force.number;
            //         unit.force.number -= casualties;

            //         if (unit.force.number < 0) {
            //             unit.force.number = 0; // Prevent negative values
            //         }

            //         spyBattleReport += `${unit.force.name} - Initial: ${initialNumber}, Remaining: ${unit.force.number}, Casualties: ${initialNumber - unit.force.number}\n`;
            //     }
            // });
        }

        // Update the database with new force numbers
        await pool.query('UPDATE users SET `force` = ? WHERE playerToken = ?',
            [JSON.stringify(currentForces), battle.attackerPlayerToken]);
        await pool.query('UPDATE users SET `defence` = ?, `force` = ? WHERE playerToken = ?',
            [JSON.stringify(defenderForces1), JSON.stringify(defenderForces2), battle.defenderPlayerToken]);

        await pool.query('UPDATE wars SET result = ?, warStatus = "finished" WHERE id = ?',
            [JSON.stringify(spyBattleReport), battleId]);


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
            return `Battle with ID ${battleId} not found.`;
        }

        const attackerForces = battle.attackerMachine;
        let battleReport = `Machine action for ${battleId} ended.\n `;
        let buildingsDamagedReport = '';

        const [defenderBuildings] = await pool.query('SELECT * FROM userbuildings WHERE playerToken = ?', [battle.defenderPlayerToken]);
        const defenderBuildingsData = defenderBuildings[0];

        battleReport += 'Processing machine forces...\n';

        // Helper function to process building attack
        async function processBuildingAttack(targetBuilding, attackPower, forceName) {
            if (defenderBuildingsData && defenderBuildingsData[targetBuilding] != null) {
                const building = defenderBuildingsData[targetBuilding];

                if (building.isActive === 1) {
                    building.power -= attackPower;
                    battleReport += `Dealt ${attackPower} damage to ${targetBuilding}. Remaining HP: ${building.power}\n`;

                    if (building.power <= 0) {
                        building.power = 0; // Set the building's HP to 0 if it drops below 0
                        buildingsDamagedReport += `${targetBuilding} has been destroyed.\n`;
                        battleReport += (`${targetBuilding} has been destroyed.\n`);
                        defenderBuildings[0][targetBuilding] = null; // Remove the building if HP is 0
                    } else {
                        buildingsDamagedReport += `${targetBuilding} remaining HP: ${building.power}\n`;
                    }
                    

                    const query = `UPDATE userbuildings SET ${targetBuilding} = JSON_SET(${targetBuilding}, '$.power', ?, '$.isActive', ?) WHERE playerToken = ?`;
                    await pool.query(query, [building.power, building.isActive, battle.defenderPlayerToken]);
                } else {
                    battleReport += `${targetBuilding} is not active.\n`;
                }
            } else {
                battleReport += `${targetBuilding} does not exist in defender buildings.\n`;
            }
        }

        // Helper function to process Balloon attack
        async function processBalloonAttack(targetBuilding, balloonPower, force) {
            const defencePower = defenderBuildingsData['AirDefense'].attack;
            battleReport += `Air defense power: ${defencePower}\n`;

            if (defencePower >= balloonPower) {
                battleReport += 'All Balloons eliminated!\n';
                force.force.number = 0;
            } else {
                const remainingBalloonPower = balloonPower - defencePower;
                const remainingBalloonNumber = Math.ceil(remainingBalloonPower / force.force.attack);
                battleReport += `${remainingBalloonNumber} Balloons survived.\n`;

                force.force.number = remainingBalloonNumber;
                const attackPower = remainingBalloonNumber * force.force.attack;
                await processBuildingAttack(targetBuilding, attackPower, 'Balloon');
            }
        }

        // Process machine forces attacking buildings
        for (const force of attackerForces) {
            const targetBuilding = force.force.target;
            const attackPower = force.force.number * force.force.attack;

            battleReport += `Attacking ${targetBuilding} with ${force.force.name}.\n`;

            if (['BatteringRam', 'HeavyCatapult'].includes(force.force.name)) {
                await processBuildingAttack(targetBuilding, attackPower, force.force.name);
            } else if (force.force.name === 'Balloon') {
                const balloonPower = attackPower;
                await processBalloonAttack(targetBuilding, balloonPower, force);
            }
        }

        battleReport += 'Machine battle resolution completed successfully.\n';
        return battleReport;

    } catch (error) {
        console.error('Error handling machine battle end:', error);
        return `Error handling machine battle end: ${error.message}`;
    }
}

router.post('/startWar', async (req, res) => {
    const { attackerToken, defenderToken, attackerForce, attackerMachine, mode } = req.body;

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
            'INSERT INTO wars (attackerPlayerToken, defenderPlayerToken, attackerForce, attackerMachine, mode, travelTime, scheduledStartTime, warStatus) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)',
            [attackerToken, defenderToken, JSON.stringify(attackerForce), JSON.stringify(attackerMachine), mode, travelTime, 'scheduled']);

        const battleId = result.insertId;

        // Schedule a job to handle the end of travel time
        const travelTimeInMillis = travelTime * 60 * 1000; // Convert minutes to milliseconds

        switch (mode) {
            case 'battle':
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