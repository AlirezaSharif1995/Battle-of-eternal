const express = require('express');
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


router.post('/', async (req, res) => {
    const { playerToken } = req.body;

    try {
        const [playerBuildingRows] = await pool.query(
            'SELECT buildings FROM playerbuildings WHERE playerToken = ?',
            [playerToken]
        );

        if (playerBuildingRows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const playerBuildings = playerBuildingRows[0].buildings;

        const buildingQueries = playerBuildings.map(({ building_id, level }) =>
            pool.query(
                `SELECT level, stats, cost, build_time 
                 FROM buildinglevels 
                 WHERE building_id = ? AND (level = ? OR level = ?)`,
                [building_id, level, level + 1] // Fetch data for both current and next levels
            )
        );

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

            return {
                ...building,
                current_level: currentLevelData,
                next_level: nextLevelData,
            };
        });

        res.status(200).json(combinedData);
    } catch (error) {
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



module.exports = router;