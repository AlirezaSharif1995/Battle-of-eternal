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

router.post('/sendMessageClan', async (req, res) => {
    const { sender, clan, content } = req.body;

    try {
        const time = new Date();
        const timer = `h: ${time.getHours()}  m: ${time.getMinutes()}  D:${time.getDate()}  M:${time.getMonth() + 1}  Y:${time.getFullYear()}`;
        await pool.query('INSERT INTO messages (sender ,clan, content, timeRT) VALUES (?, ?, ?, ?)', [sender, clan, JSON.stringify(content), timer]);
        res.status(201).json({ message: 'Send Message successfully' });

    } catch (error) {
        console.error('Error sendMessage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/getMessages', async (req, res) => {

    try {
        // Retrieve the user based on playerToken
        const { playerToken } = req.body;

        const [userResult] = await pool.query('SELECT playerToken FROM users WHERE playerToken = ?', [playerToken]);

        if (userResult.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userResult[0].playerToken;

        // Retrieve chats involving the user
        const [chats] = await pool.query('SELECT * FROM messages WHERE sender = ? OR receiver = ?', [userId, userId]);

        // If no chats found, return an empty array
        if (chats.length === 0) {
            return res.status(200).json({ chats: [] });
        }

        // Loop through each chat to get sender and receiver information
        const formattedChats = await Promise.all(chats.map(async (chat) => {
            const [senderResult] = await pool.query('SELECT username, avatarCode FROM users WHERE playerToken = ?', [chat.sender]);
            const [receiverResult] = await pool.query('SELECT username, avatarCode FROM users WHERE playerToken = ?', [chat.receiver]);
        
            // Check if senderResult or receiverResult is empty
            if (!senderResult.length || !receiverResult.length) {
                throw new Error('Sender or receiver not found');
            }
        
            return {
                sender: {
                    playerToken: chat.sender,
                    username: senderResult[0].username,
                    avatarCode: senderResult[0].avatarCode
                },
                receiver: {
                    playerToken: chat.receiver,
                    username: receiverResult[0].username,
                    avatarCode: receiverResult[0].avatarCode
                },
                content: chat.content,
                time: chat.timeRT,
                id: chat.id
            };
        }));
        

        // Respond with the formatted chats
        res.status(201).json({ chats: formattedChats });

    } catch (error) {
        console.error('Error getMessages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/getClanMessages', async (req, res) => {
    const { clan } = req.body;

    try {
        // Retrieve chats involving the clan
        const [chats] = await pool.query(`
            SELECT m.*, u.username, u.avatarCode 
            FROM messages m
            LEFT JOIN users u ON m.sender = u.playerToken
            WHERE m.clan = ?
        `, [clan]);

        // If no chats found, return an empty array
        if (chats.length === 0) {
            return res.status(200).json({ chats: [] });
        }

        // Format the chat messages to include sender information
        const formattedChats = chats.map(chat => ({
            sender: {
                playerToken: chat.sender,
                username: chat.username,
                avatarCode: chat.avatarCode
            },
            content: chat.content,
            time: chat.timeRT,
            id: chat.id
        }));

        // Respond with the formatted chats
        res.status(201).json({ chats: formattedChats });

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