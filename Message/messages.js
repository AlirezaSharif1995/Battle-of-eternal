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
    const { sender, receiver, message } = req.body;

    try {
        const [userResult] = await pool.query('SELECT playerToken FROM users WHERE username = ?', [receiver]);
        if (userResult.length <= 0) {
            return res.status(400).json({ message: 'User not found!' });
        }

        const time = new Date();
        await pool.query('INSERT INTO messages (sender ,receiver, content, timeRT) VALUES (?, ?, ?, ?)', [sender, userResult[0].playerToken, message, time]);
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
        let { playerToken } = req.body;
        playerToken = String(playerToken);
        // بررسی اینکه کاربر وجود دارد یا نه
        const [userResult] = await pool.query('SELECT playerToken FROM users WHERE playerToken = ?', [playerToken]);
        if (userResult.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // دریافت تمامی پیام‌های مرتبط با بازیکن
        const [chats] = await pool.query(
            'SELECT * FROM messages WHERE sender = ? OR receiver = ? ORDER BY timeRT ASC',
            [playerToken, playerToken]
        );

        if (chats.length === 0) {
            return res.status(200).json({ chats: [] });
        }

        // نقشه‌ای برای دسته‌بندی پیام‌ها بر اساس ارتباط بین دو بازیکن
        const chatMap = new Map();

        for (const chat of chats) {
            // شناسایی طرف مقابل مکالمه
            const contactToken = chat.sender === playerToken ? chat.receiver : chat.sender;

            if (!chatMap.has(contactToken)) {
                // دریافت اطلاعات طرف مقابل از دیتابیس
                const [contactResult] = await pool.query(
                    'SELECT username, avatarCode FROM users WHERE playerToken = ?',
                    [contactToken]
                );

                if (contactResult.length === 0) continue;

                chatMap.set(contactToken, {
                    contact: {
                        playerToken: contactToken,
                        username: contactResult[0].username,
                        avatarCode: contactResult[0].avatarCode
                    },
                    messages: []
                });
            }

            // اضافه کردن پیام به بلاک چت مربوطه
            chatMap.get(contactToken).messages.push({
                sender: chat.sender,
                message: chat.content,
                time: chat.timeRT,
                id: chat.id,
                isFromPlayer: chat.sender === playerToken // اضافه کردن فلگ برای تشخیص پیام‌های بازیکن
            });
        }

        // ارسال چت‌ها در قالب جدید
        res.status(200).json({ chats: Array.from(chatMap.values()) });

    } catch (error) {
        console.error('Error in getMessages:', error);
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