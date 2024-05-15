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


router.get('/', async (req,res)=>{
    const { playerToken } = req.body;
    try {
        const [player] = await pool.query('SELECT * FROM clans WHERE id = ?', [playerToken]);

        const playerData = {
            username: player.username,
            avatar: player.avatar,
            cities: player.cities,
            clan: player.clan_id,
            population: player.population,
            bio: player.bio,


        }
        res.status(201).json({ message: 'player information :', player });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;