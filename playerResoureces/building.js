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

router.get('/', async (req, res) => {

    const userId = req.body.id;

    try {
        // Check if the user exists in the database
        const [existingUser] = await pool.query('SELECT * FROM userbuildings WHERE userId = ?', [userId]);

        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const buildingInformation = existingUser[0];
        console.log(buildingInformation);

        res.status(200).json({ message: 'Data found!', buildingInformation });

    } catch {
        console.error('Error find data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/updateTable', async (req, res) => {

    const { userId, buildingName, buildingData } = req.body;

    try {

        const [existingUser] = await pool.query('SELECT * FROM userbuildings WHERE playerToken = ?', [userId]);

        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

    const sql = `UPDATE userbuildings SET ${buildingName} = ? WHERE playerToken = ?`;
    await pool.query(sql, [JSON.stringify(buildingData), userId]);
    return res.status(200).json({ message: 'Building data updated successfully' });

    } catch (error) {
        console.error('Error find data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;