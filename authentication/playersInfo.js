const express = require('express');
const cron = require('node-cron');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Alireza1995!',
    database: 'battle-of-eternals',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper: Deduct Resources
async function deductResources(userId, levelUpData) {
    const [userData] = await pool.query('SELECT iron, wood, stone, wheat FROM users WHERE user_id = ?', [userId]);

    if (
        userData[0].wood < levelUpData.wood ||
        userData[0].iron < levelUpData.iron ||
        userData[0].wheat < levelUpData.wheat ||
        userData[0].stone < levelUpData.stone
    ) {
        throw new Error('Insufficient resources');
    }

    await pool.query(
        'UPDATE users SET wood = wood - ?, iron = iron - ?, wheat = wheat - ?, stone = stone - ? WHERE user_id = ?',
        [levelUpData.wood, levelUpData.iron, levelUpData.wheat, levelUpData.stone, userId]
    );
}

// Helper: Start Upgrade
async function startUpgrade(userId, forceName, currentLevel, nextLevel, durationInHours) {
    const [rows] = await pool.query(
        `INSERT INTO upgrade_queue (user_id, force_name, current_level, next_level, start_time, end_time)
         VALUES (?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? HOUR))`,
        [userId, forceName, currentLevel, nextLevel, durationInHours]
    );
    return rows.insertId;
}


router.post('/getPlayerInfo', async (req, res) => {
    const { playerToken } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);
        const [existingUser2] = await pool.query('SELECT * FROM playerstats WHERE playerToken = ?', [playerToken]);

        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = {
            username: existingUser[0].username,
            avatarCode: existingUser[0].avatarCode,
            bio: existingUser[0].bio,
            wheat: existingUser[0].wheat,
            stone: existingUser[0].stone,
            wood: existingUser[0].wood,
            iron: existingUser[0].iron,
            elixir: existingUser[0].elixir,
            avatarCode: existingUser[0].avatarCode,
            civilization: existingUser2[0].civilization_points,
            population: existingUser2[0].population_consumers
        };

        res.status(200).json(user);


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

router.post('/levelupForces', async (req, res) => {
    const { userId, forceName } = req.body;

    if (!userId || !forceName) {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        // Fetch user forces and upgrading forces from the database
        const [rows] = await pool.query(
            'SELECT forces, upgrading_forces FROM user_forces_json WHERE user_id = ?',
            [userId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Safely parse forces and upgrading_forces
        const forces = typeof rows[0].forces === 'string' 
            ? JSON.parse(rows[0].forces || '{}') 
            : rows[0].forces || {};

        const upgradingForces = typeof rows[0].upgrading_forces === 'string' 
            ? JSON.parse(rows[0].upgrading_forces || '{}') 
            : rows[0].upgrading_forces || {};

        // Check if the force exists
        if (!forces[forceName]) {
            return res.status(400).json({ message: 'Force not found' });
        }

        // Check if the force is already being upgraded
        if (upgradingForces[forceName]) {
            return res.status(400).json({ message: 'Force is already being upgraded' });
        }

        const currentLevel = forces[forceName].level || 1; // Default level is 1 if not present
        const nextLevel = currentLevel + 1;

        // Fetch level-up requirements for the next level
        const [forceDetails] = await pool.query(
            'SELECT wood_cost, iron_cost, elixir_cost, wheat_cost, upgrade_time FROM forces WHERE name = ? AND level = ?',
            [forceName, nextLevel]
        );
        if (forceDetails.length === 0) {
            return res.status(400).json({ message: 'Max level reached' });
        }

        const { wood_cost, iron_cost, elixir_cost, wheat_cost, upgrade_time } = forceDetails[0];

        // Deduct resources
        const deductionSuccess = await deductResources(userId, {
            wood_cost,
            iron_cost,
            elixir_cost,
            wheat_cost,
        });
        if (!deductionSuccess) {
            return res.status(400).json({ message: 'Insufficient resources' });
        }

        const upgradeDurationInSeconds = parseUpgradeDuration(upgrade_time);
        const endTime = new Date(Date.now() + upgradeDurationInSeconds * 1000);

        // Update upgradingForces
        upgradingForces[forceName] = {
            currentLevel,
            nextLevel,
            endTime,
        };

        // Save updated upgrading_forces back to the database
        await pool.query(
            'UPDATE user_forces_json SET upgrading_forces = ? WHERE user_id = ?',
            [JSON.stringify(upgradingForces), userId]
        );

        res.json({
            message: 'Upgrade started successfully',
            upgradingForces,
        });
    } catch (error) {
        console.error('Error processing level-up:', error.message, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/addForce', async (req, res) => {
    const { playerToken, forceName } = req.body;

    if (!playerToken || !forceName) {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        // Fetch current forces
        const [rows] = await pool.query('SELECT forces FROM user_forces_json WHERE user_id = ?', [playerToken]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Safely parse forces JSON
        let forces;
        try {
            forces = (rows[0].forces || '{}');
        } catch (err) {
            return res.status(500).json({ message: 'Failed to parse forces data' });
        }

        // Check if the force already exists
        if (forces[forceName]) {
            return res.status(400).json({ message: 'Force already exists' });
        }

        // Add new force with default level or properties
        forces[forceName] = {
            level: 1, // Default level
            quantity: 20
        };

        console.log("Updated Forces:", forces);

        // Update the forces JSON in the database
        await pool.query('UPDATE user_forces_json SET forces = ? WHERE user_id = ?', [JSON.stringify(forces), playerToken]);

        res.json({ message: 'Force added successfully', forces });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/getPlayerForces', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        // Fetch the player's forces from the `user_forces_json` table
        const [rows] = await pool.query('SELECT forces FROM user_forces_json WHERE user_id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userForces = (rows[0].forces || '{}');

        // Check if the player has any forces
        const forceNames = Object.keys(userForces);
        if (forceNames.length === 0) {
            return res.json({
                message: 'Player has no forces',
                forces: [],
            });
        }

        // Fetch details for the player's forces along with next-level costs
        const detailedForces = await Promise.all(
            forceNames.map(async (forceName) => {
                const level = userForces[forceName]?.level; // Get the player's level for this force
                if (!level) {
                    return null; // Skip if no level is found for the force
                }

                // Fetch current level details from the `forces` table
                const [currentLevelDetails] = await pool.query(
                    `SELECT name, level, attack_power, defense_power, raid_capacity, speed, hp
                     FROM forces 
                     WHERE name = ? AND level = ?`,
                    [forceName, level]
                );

                if (currentLevelDetails.length === 0) {
                    return null; // Skip if no details found for this force and level
                }

                // Fetch next level details from the `forces` table
                const [nextLevelDetails] = await pool.query(
                    `SELECT wheat_cost, wood_cost, iron_cost, elixir_cost, upgrade_time
                     FROM forces
                     WHERE name = ? AND level = ?`,
                    [forceName, level + 1]
                );

                // Build the response object for this force
                return {
                    ...currentLevelDetails[0], // Current level details
                    playerLevel: level, // Add the player's level for this force
                    createdAt: userForces[forceName]?.createdAt, // Add the creation date from player data
                    nextLevelCost: nextLevelDetails.length > 0
                        ? {
                            wheat: nextLevelDetails[0].wheat_cost,
                            wood: nextLevelDetails[0].wood_cost,
                            iron: nextLevelDetails[0].iron_cost,
                            elixir: nextLevelDetails[0].elixir_cost,
                            upgradeTime: nextLevelDetails[0].upgrade_time,
                        }
                        : null, // If no next level exists, set to null
                };
            })
        );

        // Filter out null values (in case of missing forces or mismatches)
        const filteredForces = detailedForces.filter((force) => force !== null);

        res.json({
            message: 'Player forces retrieved successfully',
            forces: filteredForces,
        });
    } catch (error) {
        console.error('Error fetching player forces:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

cron.schedule('*/10 * * * * *', async () => {
    try {
        // Fetch all users with active upgrading forces
        const [userRows] = await pool.query(
            'SELECT user_id, forces, upgrading_forces FROM user_forces_json WHERE JSON_LENGTH(upgrading_forces) > 0'
        );

        if (userRows.length === 0) {
            console.log('No upgrades in progress.');
            return;
        }

        for (const userRow of userRows) {
            const { user_id: userId, forces: forcesJSON, upgrading_forces: upgradingForcesJSON } = userRow;
            const localTime = new Date().toString();

            try {
                const forces = (forcesJSON || '{}');

                // Check if upgrading_forces is already an object, avoid parsing if it is
                const upgradingForces = typeof upgradingForcesJSON === 'object' 
                    ? upgradingForcesJSON 
                    : JSON.parse(upgradingForcesJSON || '{}');

                let upgradesCompleted = false;

                for (const [forceName, upgradeDetails] of Object.entries(upgradingForces)) {
                    const { endTime, nextLevel } = upgradeDetails;
                    const endTimeLocal = new Date(endTime).toString();


                    // Debug logs for time comparison
                    console.log(`Checking upgrade for user ${userId}, force: ${forceName}`, {
                        endTimeLocal,
                        currentTime: localTime,
                        isComplete: new Date(endTime) <= new Date(),
                    });

                    if (new Date(endTime) <= new Date()) {
                        if (forces[forceName]) {
                            forces[forceName].level = nextLevel; // Apply the upgrade
                        }
                        delete upgradingForces[forceName]; // Remove from upgrading forces
                        upgradesCompleted = true;
                        console.log(`Upgrade completed for user ${userId}, force: ${forceName}`);
                    }
                }

                if (upgradesCompleted) {
                    await pool.query(
                        'UPDATE user_forces_json SET forces = ?, upgrading_forces = ? WHERE user_id = ?',
                        [JSON.stringify(forces), JSON.stringify(upgradingForces), userId]
                    );
                }

            } catch (userError) {
                console.error(`Error processing upgrades for user ${userId}:`, userError);
            }
        }

        console.log('Upgrade check completed for all users.');
    } catch (error) {
        console.error('Error in scheduled task:', error);
    }
});





async function deductResources(userId, costs) {
    const { wood_cost, iron_cost, elixir_cost, wheat_cost } = costs;

    // Get the user's current resources
    const [resourceRows] = await pool.query('SELECT wood, iron, elixir, wheat FROM users WHERE playerToken = ?', [userId]);
    if (resourceRows.length === 0) throw new Error('User not found');

    const resources = resourceRows[0];

    // Check if the user has enough resources
    if (
        resources.wood < wood_cost ||
        resources.iron < iron_cost ||
        resources.elixir < elixir_cost ||
        resources.wheat < wheat_cost
    ) {
        return false;
    }

    // Deduct the resources
    await pool.query(
        'UPDATE users SET wood = wood - ?, iron = iron - ?, elixir = elixir - ?, wheat = wheat - ? WHERE playerToken = ?',
        [wood_cost, iron_cost, elixir_cost, wheat_cost, userId]
    );

    return true;
}

function parseUpgradeDuration(duration) {
    const hoursMatch = duration.match(/(\d+)h/);
    const minutesMatch = duration.match(/(\d+)m/);

    let hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    let minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

    return (hours * 3600) + (minutes * 60); // returns total duration in seconds
}




router.post('/', async (req, res) => {
    const { playerToken } = req.body;
    try {
        const [player] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

        const playerData = {
            username: player[0].username,
            avatarCode: player[0].avatarCode,
            cities: player[0].cities,
            clan: player[0].clan_id,
            population: player[0].population,
            bio: player[0].bio
        }
        res.status(201).json({ message: 'player information', playerData });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/recivedRequests', async (req, res) => {
    const { playerToken } = req.body;

    try {
        const [player] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

        const playerData = {
            recivedRequests: player[0].recivedRequests
        }
        res.status(201).json({ message: 'recived Requests', playerData });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/changeAvatar', async (req, res) => {

    const { playerToken, avatarCode } = req.body;

    try {

        await pool.query('UPDATE users SET avatarCode = ? WHERE playerToken = ?', [avatarCode, playerToken]);
        res.status(200).json({ message: 'Avatar updated successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/changeUsername', async (req, res) => {
    const { playerToken, username } = req.body;

    const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUser.length > 0) {
        return res.status(400).json({ error: 'username is already registered' });
    }

    try {
        await pool.query('UPDATE users SET username = ? WHERE playerToken = ?', [username, playerToken]);
        res.status(200).json({ message: 'Data updated successful' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/changeMedals', async (req, res) => {
    const { playerToken, medals } = req.body;

    try {
        await pool.query('UPDATE users SET medals = ? WHERE playerToken = ?', [medals, playerToken]);
        const [player] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

        const playerData = {
            medals: player[0].Medals
        }
        res.status(201).json({ message: 'medals', playerData });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/playerBorder', async (req, res) => {
    const { email, borderX, borderY } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM playeremailtable WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const ID = generateRandomToken();
        await pool.query('INSERT INTO playeremailtable (id, email, borderX, BorderY) VALUES (?, ?, ?, ?)', [ID, email, borderX, borderY]);
        res.status(201).json({ message: 'Email registerd succesfully!' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/getPlayerBorder', async (req, res) => {
    const { email } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM playeremailtable WHERE email = ?', [email]);

        if (existingUser.length < 0) {
            return res.status(400).json({ error: 'User not found!' });
        }

        const user = {
            borderX: existingUser[0].borderX,
            borderY: existingUser[0].borderY,
            civilization: existingUser[0].civilization,
            allPopulation: existingUser[0].allPopulation,
            users: existingUser[0].users
        }
        res.status(201).json({ user });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/updatePlayerBorder', async (req, res) => {
    const { email, type, data } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM playeremailtable WHERE email = ?', [email]);

        if (existingUser.length < 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const url = `UPDATE playeremailtable SET ${type} = ? WHERE email = ?`
        await pool.query(url, [data, email]);
        res.status(201).json({ message: 'updated succesfully!' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/getCityPos', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                playerToken, 
                email, 
                cityName, 
                cityPositionX, 
                citypositionY
            FROM 
                users
            `);

        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
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