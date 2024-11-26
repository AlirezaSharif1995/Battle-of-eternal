const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const cron = require('node-cron');


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Alireza1995!',
    database: 'battle-of-eternals',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

router.post('/', async (req, res) => {
    const { playerToken } = req.body;

    try {
        // Fetch the player's buildings
        const [playerBuildingRows] = await pool.query(
            'SELECT buildings FROM playerbuildings WHERE playerToken = ?',
            [playerToken]
        );

        if (playerBuildingRows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const playerBuildings = playerBuildingRows[0].buildings;
        const updatingBuildings = await GetUpgradingBuildings(playerToken);


        // Fetch current and next level details for each building
        const buildingQueries = playerBuildings.map(({ building_id, level }) =>
            pool.query(
                `SELECT level, stats, cost, build_time 
                 FROM buildinglevels 
                 WHERE building_id = ? AND (level = ? OR level = ?)`,
                [building_id, level, level + 1]
            )
        );

        // Fetch max level and base stats for each building from the `buildings` table
        const [buildingInfoRows] = await pool.query(
            'SELECT id, max_level, base_stats FROM buildings'
        );

        // Create a mapping of building_id to its max_level and base_stats
        const buildingInfoMap = buildingInfoRows.reduce((map, row) => {
            map[row.id] = {
                max_level: row.max_level,
                base_stats: typeof row.base_stats === 'string' ? JSON.parse(row.base_stats) : row.base_stats,
            };
            return map;
        }, {});

        // Process results
        const results = await Promise.all(buildingQueries);

        const combinedData = playerBuildings.map((building, index) => {
            const rows = results[index][0];
            let currentLevelData = { stats: null };
            let nextLevelData = { stats: null, cost: null, build_time: null };

            rows.forEach(row => {
                const parsedStats = typeof row.stats === 'string' ? JSON.parse(row.stats) : row.stats;
                const parsedCost = typeof row.cost === 'string' ? JSON.parse(row.cost) : row.cost;

                if (row.level === building.level) {
                    currentLevelData = {
                        stats: parsedStats,
                    };
                } else if (row.level === building.level + 1) {
                    nextLevelData = {
                        stats: parsedStats,
                        cost: parsedCost,
                        build_time: row.build_time,
                    };
                }
            });

            // Retrieve max_level and base_stats from the map
            const buildingInfo = buildingInfoMap[building.building_id] || {};

            return {
                ...building,
                current_level: currentLevelData,
                next_level: nextLevelData,
                max_level: buildingInfo.max_level || null, // Add max level for the building
                base_stats: buildingInfo.base_stats || null, // Add base stats for the building
                updatingBuildings
            };
        });

        res.status(200).json(combinedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/updatePosition', async (req, res) => {
    const { playerToken, buildingID, newPosition } = req.body;

    if (!playerToken || !buildingID || !newPosition || typeof newPosition.x !== 'number' || typeof newPosition.y !== 'number') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {

        const [playerData] = await pool.execute(
            'SELECT buildings FROM playerbuildings WHERE playerToken = ?',
            [playerToken]
        );

        if (playerData.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        let buildings = (playerData[0].buildings);

        const buildingToUpdate = buildings.find(b => b.building_id === buildingID);
        if (buildingToUpdate) {
            buildingToUpdate.position.x = newPosition.x;
            buildingToUpdate.position.y = newPosition.y;
        } else {
            return res.status(404).json({ error: 'Building not found' });
        }

        const updatedBuildingsJson = JSON.stringify(buildings);
        await pool.execute(
            'UPDATE playerbuildings SET buildings = ? WHERE playerToken = ?',
            [updatedBuildingsJson, playerToken]
        );

        res.json({ message: 'Building position updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    } 
});

router.post('/RequestaddBuilding', async (req, res) => {
    try {
        
    } catch (error) {
        
    }
});

router.post('/ValidateBuildingUpgrade', async (req, res) => {
    try {
        const { playerToken, buildingID } = req.body;

        if (!playerToken || !buildingID) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        const [playerData] = await pool.execute(
            'SELECT buildings FROM playerbuildings WHERE playerToken = ?',
            [playerToken]
        );

        if (playerData.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const buildings = (playerData[0].buildings); // Parse JSON
        const buildingToValidate = buildings.find(b => b.building_id === buildingID);

        if (!buildingToValidate) {
            return res.status(404).json({ error: 'Building not found' });
        }

        const currentLevel = buildingToValidate.level;
        const [levelData] = await pool.execute(
            'SELECT cost, build_time FROM buildinglevels WHERE building_id = ? AND level = ?',
            [buildingID, currentLevel + 1]
        );

        if (levelData.length === 0) {
            return res.status(404).json({ error: 'Upgrade details not found' });
        }

        const upgradeCost = (levelData[0].cost); // Parse JSON cost
        const upgradeTime = levelData[0].build_time; // Time required for upgrade

        const [userData] = await pool.execute(
            'SELECT iron, wood, stone, wheat FROM users WHERE playerToken = ?',
            [playerToken]
        );

        if (userData.length === 0) {
            return res.status(404).json({ error: 'Player resources not found' });
        }

        const playerResources = userData[0];

        const hasEnoughResources = Object.keys(upgradeCost).every(resource => {
            return playerResources[resource] >= upgradeCost[resource];
        });

        if (!hasEnoughResources) {
            return res.status(400).json({ error: 'Not enough resources to upgrade the building' });
        }
        StartBuildingUpgrade(playerToken,buildingID);
        // Send validation response with upgrade details
        return res.status(200).json({
            message: 'Validation successful',
            upgradeCost,
            upgradeTime,
            buildingID,
            currentLevel,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/StartBuildingUpgrade', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { playerToken, buildingID } = req.body;

        if (!playerToken || !buildingID) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        const [playerData] = await connection.execute(
            'SELECT buildings FROM playerbuildings WHERE playerToken = ?',
            [playerToken]
        );

        if (playerData.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const buildings = (playerData[0].buildings); // Parse JSON
        const buildingToUpdate = buildings.find(b => b.building_id === buildingID);

        if (!buildingToUpdate) {
            return res.status(404).json({ error: 'Building not found' });
        }

        const currentLevel = buildingToUpdate.level;
        const [levelData] = await connection.execute(
            'SELECT cost, build_time FROM buildinglevels WHERE building_id = ? AND level = ?',
            [buildingID, currentLevel + 1]
        );

        if (levelData.length === 0) {
            return res.status(404).json({ error: 'Upgrade details not found' });
        }

        const upgradeCost = (levelData[0].cost); // Parse cost
        const upgradeTime = levelData[0].build_time;

        const [userData] = await connection.execute(
            'SELECT iron, wood, stone, wheat FROM users WHERE playerToken = ?',
            [playerToken]
        );

        if (userData.length === 0) {
            return res.status(404).json({ error: 'Player resources not found' });
        }

        const playerResources = userData[0];

        const hasEnoughResources = Object.keys(upgradeCost).every(resource => {
            return playerResources[resource] >= upgradeCost[resource];
        });

        if (!hasEnoughResources) {
            return res.status(400).json({ error: 'Not enough resources to upgrade the building' });
        }

        // Deduct resources
        const updatedResources = Object.keys(upgradeCost).reduce((acc, resource) => {
            acc[resource] = playerResources[resource] - upgradeCost[resource];
            return acc;
        }, {});

        await connection.beginTransaction();

        await connection.execute(
            'UPDATE users SET iron = ?, wood = ?, stone = ?, wheat = ? WHERE playerToken = ?',
            [updatedResources.iron, updatedResources.wood, updatedResources.stone, updatedResources.wheat, playerToken]
        );

        // Save upgrade start time and expected completion
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + upgradeTime * 1000); // Assuming upgradeTime is in seconds

        await connection.execute(
            'INSERT INTO buildingUpgrades (playerToken, buildingID, startTime, endTime) VALUES (?, ?, ?, ?)',
            [playerToken, buildingID, startTime, endTime]
        );

        await connection.commit();
        return res.status(200).json({ message: 'Building upgrade started successfully', endTime });
    } catch (error) {
        console.error(error);
        if (connection) await connection.rollback();
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

router.post('/GetUpgradingBuildings', async (req, res) => {
    try {
        const { playerToken } = req.body; // Get playerToken from request body

        if (!playerToken) {
            return res.status(400).json({ error: 'Player token is required' });
        }

        // Query to fetch uncompleted upgrades and calculate duration and remaining time
        const [upgrades] = await pool.execute(
            `SELECT 
                buildingID, 
                startTime, 
                endTime, 
                TIMESTAMPDIFF(SECOND, startTime, endTime) AS duration, 
                GREATEST(0, TIMESTAMPDIFF(SECOND, NOW(), endTime)) AS remainingTime
             FROM buildingUpgrades 
             WHERE playerToken = ? AND completed = 0`,
            [playerToken]
        );

        if (upgrades.length === 0) {
            return res.status(200).json({ message: 'No buildings are currently being upgraded for this player' });
        }

        // Format and return the response
        return res.status(200).json({
            message: 'Upgrading buildings retrieved successfully',
            upgrades: upgrades.map(upgrade => ({
                buildingID: upgrade.buildingID,
                duration: upgrade.duration, // Total duration in seconds
                remainingTime: upgrade.remainingTime, // Remaining time in seconds
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

cron.schedule('*/10 * * * * *', async () => {

    try {
        const now = new Date();
        const [upgrades] = await pool.execute(
            'SELECT * FROM buildingUpgrades WHERE endTime <= ? AND completed = 0',
            [now]
        );

        for (const upgrade of upgrades) {
            const { playerToken, buildingID } = upgrade;

            const [playerData] = await pool.execute(
                'SELECT buildings FROM playerbuildings WHERE playerToken = ?',
                [playerToken]
            );

            if (playerData.length === 0) continue;

            const buildings = (playerData[0].buildings);
            const buildingToUpdate = buildings.find(b => b.building_id === buildingID);

            if (buildingToUpdate) {
                buildingToUpdate.level += 1; // Increment level

                await pool.execute(
                    'UPDATE playerbuildings SET buildings = ? WHERE playerToken = ?',
                    [JSON.stringify(buildings), playerToken]
                );
            }

            // Mark upgrade as completed
            await pool.execute(
                'UPDATE buildingUpgrades SET completed = 1 WHERE playerToken = ? AND buildingID = ?',
                [playerToken, buildingID]
            );
        }
    } catch (error) {
        console.error(error);
    }
});

async function GetUpgradingBuildings(playerToken) {
    try {

        if (!playerToken) {
            return res.status(400).json({ error: 'Player token is required' });
        }

        // Query to fetch uncompleted upgrades and calculate duration and remaining time
        const [upgrades] = await pool.execute(
            `SELECT 
                buildingID, 
                startTime, 
                endTime, 
                TIMESTAMPDIFF(SECOND, startTime, endTime) AS duration, 
                GREATEST(0, TIMESTAMPDIFF(SECOND, NOW(), endTime)) AS remainingTime
             FROM buildingUpgrades 
             WHERE playerToken = ? AND completed = 0`,
            [playerToken]
        );

        if (upgrades.length === 0) {
            return ({ message: 'No buildings are currently being upgraded for this player' });
        }

        // Format and return the response
        return ({
            message: 'Upgrading buildings retrieved successfully',
            upgrades: upgrades.map(upgrade => ({
                buildingID: upgrade.buildingID,
                duration: upgrade.duration, // Total duration in seconds
                remainingTime: upgrade.remainingTime, // Remaining time in seconds
            })),
        });
    } catch (error) {
        console.error(error);
        return ({ error: 'Internal server error' });
    }
}

async function StartBuildingUpgrade(playerToken, buildingID) {
    
    const connection = await pool.getConnection();
    try {

        const [playerData] = await connection.execute(
            'SELECT buildings FROM playerbuildings WHERE playerToken = ?',
            [playerToken]
        );

        if (playerData.length === 0) {
            return ({ error: 'Player not found' });
        }

        const buildings = (playerData[0].buildings); // Parse JSON
        const buildingToUpdate = buildings.find(b => b.building_id === buildingID);

        if (!buildingToUpdate) {
            return ({ error: 'Building not found' });
        }

        const currentLevel = buildingToUpdate.level;
        const [levelData] = await connection.execute(
            'SELECT cost, build_time FROM buildinglevels WHERE building_id = ? AND level = ?',
            [buildingID, currentLevel + 1]
        );

        if (levelData.length === 0) {
            return ({ error: 'Upgrade details not found' });
        }

        const upgradeCost = (levelData[0].cost); // Parse cost
        const upgradeTime = levelData[0].build_time;

        const [userData] = await connection.execute(
            'SELECT iron, wood, stone, wheat FROM users WHERE playerToken = ?',
            [playerToken]
        );

        if (userData.length === 0) {
            return ({ error: 'Player resources not found' });
        }

        const playerResources = userData[0];

        const hasEnoughResources = Object.keys(upgradeCost).every(resource => {
            return playerResources[resource] >= upgradeCost[resource];
        });

        if (!hasEnoughResources) {
            return ({ error: 'Not enough resources to upgrade the building' });
        }

        // Deduct resources
        const updatedResources = Object.keys(upgradeCost).reduce((acc, resource) => {
            acc[resource] = playerResources[resource] - upgradeCost[resource];
            return acc;
        }, {});

        await connection.beginTransaction();

        await connection.execute(
            'UPDATE users SET iron = ?, wood = ?, stone = ?, wheat = ? WHERE playerToken = ?',
            [updatedResources.iron, updatedResources.wood, updatedResources.stone, updatedResources.wheat, playerToken]
        );

        // Save upgrade start time and expected completion
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + upgradeTime * 1000); // Assuming upgradeTime is in seconds

        await connection.execute(
            'INSERT INTO buildingUpgrades (playerToken, buildingID, startTime, endTime) VALUES (?, ?, ?, ?)',
            [playerToken, buildingID, startTime, endTime]
        );

        await connection.commit();
        return ({ message: 'Building upgrade started successfully', endTime });
    } catch (error) {
        console.error(error);
        if (connection) await connection.rollback();
        return ({ error: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
}
//Here
module.exports = router;