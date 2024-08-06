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
        const time = new Date();
        const timer = `h: ${time.getHours()}  m: ${time.getMinutes()}  D:${time.getDate()}  M:${time.getMonth() + 1}  Y:${time.getFullYear()}`;
        await pool.query('INSERT INTO messages (sender ,receiver, content, timeRT) VALUES (?, ?, ?, ?)', [sender, receiver, JSON.stringify(content), timer]);
        res.status(201).json({ message: 'Send Message successfully' });

    } catch (error) {
        console.error('Error sendMessage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/getMessages', async (req, res) => {
    const { username } = req.body;

    try {
        const [chats] = await pool.query('SELECT * FROM messages WHERE sender = ? OR receiver = ?', [username, username]);
        res.status(201).json({ chats });

    } catch (error) {
        console.error('Error getMessages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/getClanMessages', async (req, res) => {
    const { clan } = req.body;

    try {
        const [chats] = await pool.query(`
            SELECT m.*, u.avatarCode 
            FROM messages m
            LEFT JOIN users u ON m.sender = u.username
            WHERE m.clan = ?
        `, [clan]);

        res.status(201).json({ chats });
    } catch (error) {
        console.error('Error getClanMessages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/deleteMessage', async (req, res) => {
    const { id } = req.body;

    try {
        await pool.query('DELETE FROM messages WHERE id = ?', [id]);
        res.status(200).json({ message: `Message with id: ${id} deleted successfully` });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/readMessage', async (req, res) => {
    const { id } = req.body;

    try {
        await pool.query('UPDATE messages SET `read` = ? WHERE id = ?', [1, id]);
        res.status(200).json({ message: `Message with id: ${id} updated successfully` });
    } catch (error) {
        console.error('Error reading message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;