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

router.post('/sendMessage', async (req, res) => {
    const { sender, receiver, content } = req.body;

    try {
        await pool.query('INSERT INTO messages (sender ,receiver, content) VALUES (?, ?, ?)', [sender, receiver, JSON.stringify(content)]);
        res.status(201).json({ message: 'Send Message successfully' });

    } catch (error) {
        console.error('Error sendMessage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/getMessages', async (req, res) => {
    const { username } = req.body;

    try {
        const [chats] = await pool.query('SELECT * FROM messages WHERE sender OR receiver = ?', [username]);
        res.status(201).json({ chats });

    } catch (error) {
        console.error('Error getMessages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/getClanMessages', async (req, res) => {
    const { clan } = req.body;

    try {
        const [chats] = await pool.query('SELECT * FROM messages WHERE clan = ?', [clan]);
        res.status(201).json({ chats });

    } catch (error) {
        console.error('Error getClanMessages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});
module.exports = router;