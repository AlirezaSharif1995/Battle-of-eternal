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
            population: existingUser2[0].population_consumers,
            cityName: existingUser[0].cityName,
            clan: existingUser[0].clan_id,
            clanRole: existingUser[0].clan_role,
            gem: existingUser[0].gem,
            recivedRequests: existingUser[0].recivedRequests
        };

        res.status(200).json(user);


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

router.post('/levelupForces', async (req, res) => {
    const { playerToken, forceName } = req.body;
    const userId = playerToken;
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

router.post('/cancelLevelupForces', async (req, res) => {
    const { playerToken, forceName } = req.body;
    const userId = playerToken;
    if (!userId || !forceName) {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        // دریافت نیروها و نیروهای در حال آپدیت از دیتابیس
        const [rows] = await pool.query(
            'SELECT forces, upgrading_forces FROM user_forces_json WHERE user_id = ?',
            [userId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // پارس کردن اطلاعات ذخیره شده به صورت JSON
        const forces = typeof rows[0].forces === 'string'
            ? JSON.parse(rows[0].forces || '{}')
            : rows[0].forces || {};
        const upgradingForces = typeof rows[0].upgrading_forces === 'string'
            ? JSON.parse(rows[0].upgrading_forces || '{}')
            : rows[0].upgrading_forces || {};

        // بررسی اینکه آیا نیروی مورد نظر در حال آپدیت است یا خیر
        if (!upgradingForces[forceName]) {
            return res.status(400).json({ message: 'Force is not currently upgrading' });
        }

        // دریافت اطلاعات آپدیت برای نیروی مورد نظر
        const upgradeData = upgradingForces[forceName];
        const nextLevel = upgradeData.nextLevel;

        // دریافت هزینه‌های مربوط به آپدیت سطح بعدی از دیتابیس
        const [forceDetails] = await pool.query(
            'SELECT wood_cost, iron_cost, elixir_cost, wheat_cost FROM forces WHERE name = ? AND level = ?',
            [forceName, nextLevel]
        );
        if (forceDetails.length === 0) {
            return res.status(400).json({ message: 'Upgrade details not found' });
        }

        const { wood_cost, iron_cost, elixir_cost, wheat_cost } = forceDetails[0];

        // محاسبه 50٪ منابع برای بازگشت به کاربر (با گرد کردن به پایین)
        const refundWood = Math.floor(wood_cost * 0.5);
        const refundIron = Math.floor(iron_cost * 0.5);
        const refundElixir = Math.floor(elixir_cost * 0.5);
        const refundWheat = Math.floor(wheat_cost * 0.5);

        // بازگرداندن منابع به کاربر (تابع creditResources باید طبق نیازهای شما پیاده‌سازی شود)
        const creditSuccess = await creditResources(userId, {
            wood: refundWood,
            iron: refundIron,
            elixir: refundElixir,
            wheat: refundWheat,
        });
        if (!creditSuccess) {
            return res.status(500).json({ message: 'Error refunding resources' });
        }

        // حذف نیروی کنسل شده از شیء upgradingForces
        delete upgradingForces[forceName];

        // ذخیره تغییرات جدید upgrading_forces در دیتابیس
        await pool.query(
            'UPDATE user_forces_json SET upgrading_forces = ? WHERE user_id = ?',
            [JSON.stringify(upgradingForces), userId]
        );

        res.json({
            message: 'Upgrade cancelled successfully. 50% of the resources have been refunded.',
            refundedResources: {
                wood: refundWood,
                iron: refundIron,
                elixir: refundElixir,
                wheat: refundWheat,
            },
            upgradingForces,
        });
    } catch (error) {
        console.error('Error cancelling upgrade:', error.message, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/addForce', async (req, res) => {
    const { playerToken, forceName } = req.body;

    // Validate input
    if (!playerToken || !forceName) {
        return res.status(400).json({ message: 'Player token and force name are required' });
    }

    try {
        // Fetch current forces from the database
        const [rows] = await pool.query('SELECT forces FROM user_forces_json WHERE user_id = ?', [playerToken]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Parse the forces JSON safely
        let forces;
        try {
            forces = (rows[0].forces || '{}');
        } catch (err) {
            return res.status(500).json({ message: 'Failed to parse forces data' });
        }

        // Add or update the specified force
        if (forces[forceName]) {
            forces[forceName].quantity += 20; // Increment the quantity
        } else {
            forces[forceName] = {
                level: 1, // Default level
                quantity: 20
            };
        }

        console.log("Updated Forces:", forces);

        // Update the forces JSON in the database
        await pool.query('UPDATE user_forces_json SET forces = ? WHERE user_id = ?', [JSON.stringify(forces), playerToken]);

        // Send only the updated force in the response
        const updatedForce = forces[forceName];
        res.json({ message: 'Force updated successfully', forceName, updatedForce });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/getPlayerForces', async (req, res) => {
    const { playerToken } = req.body;

    if (!playerToken) {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        // دریافت نیروهای کاربر
        const [rows] = await pool.query(
            'SELECT forces, upgrading_forces FROM user_forces_json WHERE user_id = ?',
            [playerToken]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // دریافت نام کاربری
        const [Username] = await pool.query(
            'SELECT username FROM users WHERE playerToken = ?',
            [playerToken]
        );

        const upgradingForces = rows[0].upgrading_forces ? rows[0].upgrading_forces : {};
        const userForces = rows[0].forces || '{}';

        // دریافت نیروهای ارسال‌شده
        const [sentForces] = await pool.query(
            'SELECT id, forces, receiverToken FROM guest_forces WHERE senderToken = ?',
            [Username[0].username]
        );

        // دریافت نیروهای دریافت‌شده
        const [receivedForces] = await pool.query(
            'SELECT id, forces, senderToken FROM guest_forces WHERE receiverToken = ?',
            [Username[0].username]
        );

        // **✅ اضافه کردن دریافت نیروهای در حال حرکت**
        const [movingForces] = await pool.query(
            'SELECT id, sender_id, receiver_id, forces, start_time, arrival_time, type FROM moving_forces WHERE sender_id = ? OR receiver_id = ?',
            [playerToken, playerToken]
        );

        const forceNames = Object.keys(userForces);
        if (forceNames.length === 0) {
            return res.json({
                message: 'Player has no forces',
                forces: [],
                sentForces: [],
                receivedForces: [],
                movingForces: [] // ✅ اضافه شد
            });
        }

        const detailedForces = await Promise.all(
            forceNames.map(async (forceName) => {
                const level = userForces[forceName]?.level;
                const count = userForces[forceName]?.quantity;
                if (!level) return null;

                const [currentLevelDetails] = await pool.query(
                    'SELECT name, level, attack_power, defense_power, raid_capacity, speed, hp FROM forces WHERE name = ? AND level = ?',
                    [forceName, level]
                );

                const isUpgrading = upgradingForces[forceName] ? true : false;
                let remainingTime = 0;
                if (isUpgrading) {
                    const upgradeData = upgradingForces[forceName];
                    remainingTime = Math.max(new Date(upgradeData.endTime) - new Date(), 0);
                }
                if (currentLevelDetails.length === 0) return null;

                const [nextLevelDetails] = await pool.query(
                    'SELECT attack_power, defense_power, raid_capacity, speed, wheat_cost, wood_cost, iron_cost, elixir_cost, upgrade_time FROM forces WHERE name = ? AND level = ?',
                    [forceName, level + 1]
                );

                const [maxLevelDetails] = await pool.query(
                    'SELECT attack_power, defense_power, raid_capacity, speed, wheat_cost, wood_cost, iron_cost, elixir_cost, upgrade_time FROM forces WHERE name = ? AND level = 20',
                    [forceName]
                );

                const [createInfo] = await pool.query(
                    'SELECT * FROM updateforces WHERE name = ?',
                    [forceName]
                );
                return {
                    ...currentLevelDetails[0],
                    count,
                    createdAt: userForces[forceName]?.createdAt,
                    isUpgrading,
                    remainingTime,
                    nextLevelCost: nextLevelDetails.length > 0
                        ? {
                            wheat: nextLevelDetails[0].wheat_cost,
                            wood: nextLevelDetails[0].wood_cost,
                            iron: nextLevelDetails[0].iron_cost,
                            elixir: nextLevelDetails[0].elixir_cost,
                            attack_power: nextLevelDetails[0].attack_power,
                            raid_capacity: nextLevelDetails[0].raid_capacity,
                            speed: nextLevelDetails[0].speed,
                            defense_power: nextLevelDetails[0].defense_power,
                            upgradeTime: nextLevelDetails[0].upgrade_time,
                        }
                        : null,
                    maxLevelDetails: {
                        attack_power: maxLevelDetails[0].attack_power,
                        raid_capacity: maxLevelDetails[0].raid_capacity,
                        speed: maxLevelDetails[0].speed,
                        defense_power: maxLevelDetails[0].defense_power,
                    },
                    createInfo: createInfo[0]
                };
            })
        );

        const filteredForces = detailedForces.filter((force) => force !== null);

        res.json({
            message: 'Player forces retrieved successfully',
            forces: filteredForces,
            sentForces: sentForces.map(force => ({
                receiverToken: force.receiverToken,
                id: force.id,
                forces: Object.entries(typeof force.forces === 'string' ? JSON.parse(force.forces) : force.forces).map(([key, value]) => ({
                    name: key,
                    ...value
                }))
            })),
            receivedForces: receivedForces.map(force => ({
                senderToken: force.senderToken,
                id: force.id,
                forces: Object.entries(typeof force.forces === 'string' ? JSON.parse(force.forces) : force.forces).map(([key, value]) => ({
                    name: key,
                    ...value
                }))
            })),
            movingForces: movingForces.map(force => {
                const totalTime = new Date(force.arrival_time) - new Date(force.start_time); // کل زمان سفر (میلی‌ثانیه)
                const remainingTime = Math.max(new Date(force.arrival_time) - new Date(), 0); // زمان باقی‌مانده (میلی‌ثانیه)

                return {
                    id: force.id,
                    receiver_id: force.receiver_id,
                    arrival_time: force.arrival_time,
                    start_time: force.start_time,
                    totalTime: Math.floor(totalTime / 1000), // تبدیل به ثانیه
                    remainingTime: Math.floor(remainingTime / 1000), // تبدیل به ثانیه
                    type: force.type,
                    forces: Object.entries(typeof force.forces === 'string' ? JSON.parse(force.forces) : force.forces)
                        .map(([key, value]) => ({
                            name: key,
                            count: value // مقدار تعداد نیروها را اضافه کردیم
                        }))

                };
            })

        });

    } catch (error) {
        console.error('Error fetching player forces:', error);
        res.status(500).json({ message:error +  'Internal server error' });
    }
});

router.post('/createForces', async (req, res) => {
    const { playerToken, forceName, forceCount } = req.body;

    if (!playerToken || !forceName || !forceCount || isNaN(forceCount) || forceCount <= 0) {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        // Fetch player's forces and resources
        const [playerRows] = await pool.query(
            `SELECT forces FROM user_forces_json WHERE user_id = ?`,
            [playerToken]
        );

        const [playerResource] = await pool.query(
            `SELECT wheat, stone, wood, iron FROM users WHERE playerToken = ?`,
            [playerToken]
        );

        if (playerRows.length === 0) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // Parse player data
        const playerForces = (playerRows[0].forces || '{}');
        const playerResources = (playerResource[0] || '{}');

        // Fetch force details for level 1
        const [forceDetails] = await pool.query(
            `SELECT stone, wood, iron, wheat, production_time
             FROM updateforces 
             WHERE name = ?`,
            [forceName]
        );

        if (forceDetails.length === 0) {
            return res.status(404).json({ message: 'Force not found in database' });
        }

        const newForceDetails = forceDetails[0];

        const totalWheatCost = newForceDetails.wheat * forceCount;
        const totalWoodCost = newForceDetails.wood * forceCount;
        const totalIronCost = newForceDetails.iron * forceCount;
        const totalStoneCost = newForceDetails.stone * forceCount;

        // Convert production time (hh:mm:ss) to seconds
        const [hours, minutes, seconds] = newForceDetails.production_time.split(':').map(Number);
        const productionTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

        const totalProductionTimeInSeconds = productionTimeInSeconds * forceCount;

        const totalProductionTime = new Date(Date.now() + totalProductionTimeInSeconds * 1000);
        const formattedEndTime = toLocalMySQLDatetime(totalProductionTime);

        // Check if player has enough resources
        if (
            playerResources.wheat < totalWheatCost ||
            playerResources.wood < totalWoodCost ||
            playerResources.iron < totalIronCost ||
            playerResources.stone < totalStoneCost
        ) {
            return res.status(400).json({
                message: 'Not enough resources to create forces',
                required: {
                    wheat: totalWheatCost,
                    wood: totalWoodCost,
                    iron: totalIronCost,
                    stone: totalStoneCost,
                },
                available: playerResources,
            });
        }

        // Add force creation request to the `force_creation` table
        await pool.query(
            `INSERT INTO forcecreation (player_id, force_type, amount, required_wheat, required_wood, required_iron, required_stone, creation_start_time, creation_end_time, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)`,
            [
                playerToken,
                forceName,
                forceCount,
                totalWheatCost,
                totalWoodCost,
                totalIronCost,
                totalStoneCost,
                formattedEndTime,
                'in_progress'
            ]
        );

        // Deduct the required resources from the user's account
        await pool.query(
            `UPDATE users SET wheat = wheat - ?, wood = wood - ?, iron = iron - ?, stone = stone - ? WHERE playerToken = ?`,
            [totalWheatCost, totalWoodCost, totalIronCost, totalStoneCost, playerToken]
        );

        return res.status(200).json({
            message: 'Force creation request submitted successfully',
            forceCreation: {
                playerToken,
                forceName,
                forceCount,
                totalCosts: {
                    wheat: totalWheatCost,
                    wood: totalWoodCost,
                    iron: totalIronCost,
                    stone: totalStoneCost,
                },
                productionEndTime: totalProductionTime,
            },
        });
    } catch (error) {
        console.error('Error processing force creation:', error.message, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/getUpdatingForces', async (req, res) => {

    try {
        const { playerToken } = req.body;

        const [playerRows] = await pool.query(
            `SELECT upgrading_forces FROM user_forces_json WHERE user_id = ?`,
            [playerToken]
        );

        return res.status(200).json({
            message: 'updating force get successfully',
            forces: playerRows[0]
        });


    } catch (error) {
        console.error('Error get updating force:', error.message, error);
        return res.status(500).json({ message: 'get updating force' });
    }

});

router.post('/getCreatingForces', async (req, res) => {
    try {
        const { playerToken } = req.body;

        // Query to get forces for the player
        const [playerRows] = await pool.query(
            `SELECT * FROM forcecreation WHERE player_id = ?`,
            [playerToken]
        );

        if (playerRows.length === 0) {
            return res.status(200).json({ message: 'No forces found for the player' });
        }

        // Map forces with remaining time calculation
        const forcesWithEndTimeInSeconds = playerRows.map(force => {
            const creationEndTime = new Date(force.creation_end_time);
            const currentTime = Date.now();

            if (isNaN(creationEndTime.getTime())) {
                throw new Error(`Invalid creation_end_time format for force: ${force.force_type}`);
            }

            // Calculate remaining time in seconds
            const creationEndTimeSeconds = Math.max(0, Math.floor((creationEndTime - currentTime) / 1000));

            return {
                createID: force.id,
                name: force.force_type,
                count: force.amount,
                creation_end_time_seconds: creationEndTimeSeconds,
            };
        });

        return res.status(200).json({
            message: 'Creating forces retrieved successfully',
            forces: forcesWithEndTimeInSeconds,
        });
    } catch (error) {
        console.error('Error retrieving creating forces:', error.message, error);
        return res.status(500).json({ message: 'Failed to retrieve creating forces' });
    }
});

router.post('/cancelForceCreation', async (req, res) => {
    const { playerToken, createID } = req.body;
    console.log(req.body)
    if (!playerToken || !createID) {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        // Fetch the force creation entry
        const [forceEntryRows] = await pool.query(
            `SELECT * FROM forcecreation WHERE player_id = ? AND id = ?`,
            [playerToken, createID]
        );

        if (forceEntryRows.length === 0) {
            return res.status(404).json({ message: 'No active force creation found for this player and force type' });
        }

        const forceEntry = forceEntryRows[0];

        // Calculate 50% refund for each resource
        const refundWheat = Math.floor(forceEntry.required_wheat * 0.5);
        const refundWood = Math.floor(forceEntry.required_wood * 0.5);
        const refundIron = Math.floor(forceEntry.required_iron * 0.5);
        const refundStone = Math.floor(forceEntry.required_stone * 0.5);

        // Refund resources to the player
        await pool.query(
            `UPDATE users SET 
                wheat = wheat + ?, 
                wood = wood + ?, 
                iron = iron + ?, 
                stone = stone + ? 
             WHERE playerToken = ?`,
            [refundWheat, refundWood, refundIron, refundStone, playerToken]
        );

        // Delete the force creation entry
        await pool.query(
            `DELETE FROM forcecreation WHERE id = ?`,
            [forceEntry.id]
        );

        return res.status(200).json({
            message: 'Force creation canceled successfully',
            refundedResources: {
                wheat: refundWheat,
                wood: refundWood,
                iron: refundIron,
                stone: refundStone,
            },
        });
    } catch (error) {
        console.error('Error canceling force creation:', error.message, error);
        return res.status(500).json({ message: 'Internal server error' });
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
        await pool.query('UPDATE users SET username = ?, gem = gem - 1000 WHERE playerToken = ?', [username, playerToken]);
        res.status(200).json({ message: 'Data updated successful' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/changeBio', async (req, res) => {
    const { playerToken, bio } = req.body;

    try {
        await pool.query('UPDATE users SET bio = ? WHERE playerToken = ?', [bio, playerToken]);
        res.status(200).json({ message: 'Data updated successful' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/payGem', async (req, res) => {
    try {
        const { playerToken, type, buildingID } = req.body;

        const [playerRows] = await pool.query(
            `SELECT gem FROM users WHERE playerToken = ?`,
            [playerToken]
        );

        if (playerRows.length === 0) {
            return res.status(404).json({ message: 'Player not found' });
        }

        let currentGem = playerRows[0].gem;
        let requiredGem = 0;
        let tableName = "";
        let timeRemaining = 0;
        let startTime = null;

        if (type === "building") {
            tableName = "buildingupgrades";
        } else if (type === "force") {
            tableName = "forceupgrades";
        } else {
            return res.status(400).json({ message: "Invalid type" });
        }

        const [upgradeRows] = await pool.query(
            `SELECT startTime, endTime FROM ${tableName} WHERE buildingID = ? AND playerToken = ? AND completed = 0`,
            [buildingID, playerToken]
        );

        if (upgradeRows.length === 0) {
            return res.status(404).json({ message: 'Upgrade not found or already completed' });
        }

        startTime = new Date(upgradeRows[0].startTime);
        const endTime = new Date(upgradeRows[0].endTime);
        const now = new Date();

        timeRemaining = Math.max(0, Math.ceil((endTime - now) / (1000 * 60)));

        requiredGem = Math.ceil(timeRemaining / 5);

        if (currentGem < requiredGem) {
            return res.status(400).json({ message: "Not enough gems" });
        }

        await pool.query(
            `UPDATE users SET gem = gem - ? WHERE playerToken = ?`,
            [requiredGem, playerToken]
        );

        await pool.query(
            `UPDATE ${tableName} SET endTime = startTime WHERE buildingID = ? AND playerToken = ? AND completed = 0`,
            [buildingID, playerToken]
        );

        await processBuildingUpgrades();

        res.status(200).json({
            message: "Upgrade completed instantly",
            usedGem: requiredGem,
            remainingGem: currentGem - requiredGem
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/getTopRank', async (req, res) => {
    try {
        const { playerToken } = req.body;

        if (!playerToken) {
            return res.status(400).json({ error: 'Player token is required' });
        }

        const connection = await pool.getConnection();

        const [topPlayers] = await connection.query(`
            SELECT 
                ps.playerToken, 
                ps.population_consumers, 
                u.username, 
                u.avatarCode, 
                u.clan_id,
                c.name AS clan_name
            FROM playerstats ps
            JOIN users u ON ps.playerToken = u.playerToken
            LEFT JOIN clans c ON u.clan_id = c.id
            ORDER BY ps.population_consumers DESC
            LIMIT 100
        `);

        const [playerRankResult] = await connection.query(`
            SELECT COUNT(*) + 1 AS playerRank
            FROM playerstats
            WHERE population_consumers > (SELECT population_consumers FROM playerstats WHERE playerToken = ?)
        `, [playerToken]);

        const playerRank = playerRankResult.length > 0 ? playerRankResult[0].playerRank : null;

        const [topClans] = await connection.query(`
            SELECT 
                c.id AS clan_id, 
                c.name AS clan_name, 
                c.avatarCode, 
                SUM(ps.population_consumers) AS total_population,
                COUNT(u.playerToken) AS total_members
            FROM users u
            JOIN playerstats ps ON u.playerToken = ps.playerToken
            JOIN clans c ON u.clan_id = c.id
            GROUP BY c.id, c.name, c.avatarCode
            ORDER BY total_population DESC
            LIMIT 10
        `);

        connection.release();

        res.json({
            topPlayers,
            playerRank,
            topClans
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


const checkForceCreationCompletion = async () => {
    try {
        // Fetch all force creation requests where the end time has passed
        const [forceCreationRequests] = await pool.query(
            `SELECT * FROM forcecreation WHERE creation_end_time <= NOW() AND status = 'in_progress' `
        );

        if (forceCreationRequests.length === 0) {
            return;
        }

        // Process each completed force creation request
        for (let request of forceCreationRequests) {
            const { player_id, force_type, amount } = request;

            try {
                // Fetch the current forces of the player
                const [userForcesRows] = await pool.query(
                    `SELECT forces FROM user_forces_json WHERE user_id = ?`,
                    [player_id]
                );

                let userForces = (userForcesRows[0]?.forces && (userForcesRows[0]?.forces)) || {};

                // Add the newly created forces to the user's forces
                if (userForces[force_type]) {
                    // If force type exists, add to quantity (ensure 'quantity' field exists)
                    userForces[force_type].quantity = (userForces[force_type].quantity || 0) + amount;
                } else {
                    // If force type does not exist, initialize with quantity and level
                    userForces[force_type] = { quantity: amount, level: 1 }; // Assuming level 1 for new forces
                }

                // Update the user's forces in the database
                await pool.query(
                    `UPDATE user_forces_json SET forces = ? WHERE user_id = ?`,
                    [JSON.stringify(userForces), player_id]
                );

                await pool.query(
                    `DELETE FROM forcecreation WHERE id = ?`,
                    [request.id]
                );


                console.log(`Force creation completed for player ${player_id}: ${amount} ${force_type} forces added.`);
            } catch (error) {
                console.error('Error updating forces:', error.message);
            }

        }
    } catch (error) {
        console.error('Error processing force creation completion:', error.message, error);
    }
};

cron.schedule('*/10 * * * * *', checkForceCreationCompletion);

cron.schedule('* * * * *', async () => {
    try {
        // Fetch all users with active upgrading forces
        const [userRows] = await pool.query(
            'SELECT user_id, forces, upgrading_forces FROM user_forces_json WHERE JSON_LENGTH(upgrading_forces) > 0'
        );

        if (userRows.length === 0) {
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

function toLocalMySQLDatetime(date) {
    const pad = (n) => (n < 10 ? '0' + n : n); // Helper to pad single digits
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are 0-indexed
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function creditResources(userId, resourcesToCredit) {
    try {
        const { wood, iron, elixir, wheat } = resourcesToCredit;
        // به‌روزرسانی منابع کاربر با افزودن مقادیر دریافتی
        await pool.query(
            `UPDATE users
         SET wood = wood + ?,
             iron = iron + ?,
             elixir = elixir + ?,
             wheat = wheat + ?
         WHERE playerToken = ?`,
            [wood, iron, elixir, wheat, userId]
        );
        return true;
    } catch (error) {
        console.error("Error crediting resources:", error.message);
        return false;
    }
}

const processBuildingUpgrades = async () => {
    try {
        const now = new Date();
        const [upgrades] = await pool.execute(
            'SELECT * FROM buildingUpgrades WHERE endTime <= ? AND completed = 0',
            [now]
        );

        for (const upgrade of upgrades) {
            const { playerToken, buildingID } = upgrade;

            // دریافت اطلاعات ساختمان‌های بازیکن
            const [playerData] = await pool.execute(
                'SELECT buildings FROM playerbuildings WHERE playerToken = ?',
                [playerToken]
            );

            if (playerData.length === 0) continue;

            let buildings = playerData[0].buildings;
            let buildingToUpdate = buildings.find(b => b.building_id === buildingID);

            if (buildingToUpdate) {
                buildingToUpdate.level += 1; // افزایش سطح ساختمان

                // ذخیره ساختمان‌های به‌روز شده در دیتابیس
                await pool.execute(
                    'UPDATE playerbuildings SET buildings = ? WHERE playerToken = ?',
                    [JSON.stringify(buildings), playerToken]
                );
            }

            // دریافت آمار ساختمان جدید و قبلی
            const [stats] = await pool.execute(
                'SELECT stats FROM buildinglevels WHERE building_id = ? AND level = ?',
                [buildingID, buildingToUpdate.level]
            );

            const [statsBefore] = await pool.execute(
                'SELECT stats FROM buildinglevels WHERE building_id = ? AND level = ?',
                [buildingID, buildingToUpdate.level - 1]
            );
            // علامت‌گذاری ارتقا به‌عنوان تکمیل شده
            await pool.execute(
                'UPDATE buildingUpgrades SET completed = 1 WHERE playerToken = ? AND buildingID = ?',
                [playerToken, buildingID]
            );
        }
    } catch (error) {
        console.error("Error in processBuildingUpgrades:", error);
    }
};

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

function generateRandomToken() {
    let token = '';
    for (let i = 0; i < 5; i++) {
        token += Math.floor(Math.random() * 10); // Generate random digit (0-9)
    }
    return token;
}

router.get('/getIP', async (req, res) => {
try {
    res.status(201).json({ IP: '37.255.218.236' });

} catch (error) {

    res.status(500).json({ error: 'Internal server error' });
}
});
module.exports = router;