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

module.exports = router;