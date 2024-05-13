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

router.post('/join', async (req, res) => {

    const { clan_id, user_id, role } = req.body;
    try {
        await pool.query('UPDATE users SET clan_id = ?, clan_role = ? WHERE playerToken = ?', [clan_id, role, user_id]);
        res.status(201).json({ message: 'Player joined successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/leave', async (req, res) => {

    const { user_id } = req.body;
    try {
        await pool.query('UPDATE users SET clan_id = ?, clan_role = ? WHERE playerToken = ?', [null, null, user_id]);
        res.status(201).json({ message: 'Player left successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }

});

module.exports = router;