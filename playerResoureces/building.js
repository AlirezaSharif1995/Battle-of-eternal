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

    const {playerToken} = req.body;
console.log(playerToken)
    try {
        // Check if the user exists in the database
        const [existingUser] = await pool.query('SELECT * FROM playerbuildings WHERE playerToken = ?', [playerToken]);

        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const buildingInformation = existingUser[0].buildings;

        res.status(200).json(buildingInformation);

    } catch {
        console.error('Error find data:', error);
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