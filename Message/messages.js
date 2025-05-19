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
    const { sender, receiver, message, isSendToAll } = req.body;

    try {
        const time = new Date();

        if (isSendToAll) {

            const [senderResult] = await pool.query('SELECT clan_id FROM users WHERE playerToken = ?', [sender]);
            if (senderResult.length === 0 || !senderResult[0].clan_id) {
                return res.status(400).json({ message: 'Clan not found for sender!' });
            }

            const clanId = senderResult[0].clan_id;

            const [clanMembers] = await pool.query(
                'SELECT playerToken FROM users WHERE clan_id = ? AND playerToken != ?',
                [clanId, sender]
            );

            if (clanMembers.length === 0) {
                return res.status(400).json({ message: 'No other members found in clan!' });
            }

            // ایجاد پیام برای هر عضو
            const messageValues = clanMembers.map(member => [sender, member.playerToken, message, time]);

            await pool.query(
                'INSERT INTO messages (sender, receiver, content, timeRT) VALUES ?',
                [messageValues]
            );

            return res.status(201).json({ message: 'Message sent to all clan members.' });
        } else {
            const [userResult] = await pool.query('SELECT playerToken FROM users WHERE username = ?', [receiver]);

            if (userResult.length === 0) {
                return res.status(400).json({ message: 'User not found!' });
            }

            await pool.query(
                'INSERT INTO messages (sender, receiver, content, timeRT) VALUES (?, ?, ?, ?)',
                [sender, userResult[0].playerToken, message, time]
            );

            return res.status(201).json({ message: 'Message sent successfully.' });
        }
    } catch (error) {
        console.error('Error sendMessage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/sendMessageClan', async (req, res) => {
    const { sender, clan, content } = req.body;

    try {
        const time = new Date();
        await pool.query('INSERT INTO messages (sender ,clan, content, timeRT) VALUES (?, ?, ?, ?)', [sender, clan, JSON.stringify(content), time]);
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
    const { sender, receiver } = req.body;

    if (!sender || receiver === undefined) {
        return res.status(400).json({ error: 'Sender and receiver are required.' });
    }

    try {
        if (parseInt(receiver) === 0) {
            // حذف تمام پیام‌هایی که sender یا receiver این کاربر هستند
            await pool.query(
                `DELETE FROM messages 
                 WHERE sender = ? OR receiver = ?`,
                [sender, sender]
            );

            return res.status(200).json({ message: `All messages for user ${sender} deleted.` });
        }

        // گرفتن توکن گیرنده با استفاده از username
        const [userResult] = await pool.query(
            'SELECT playerToken FROM users WHERE username = ?',
            [receiver]
        );

        if (userResult.length === 0) {
            return res.status(404).json({ error: 'Receiver user not found.' });
        }

        const receiverToken = userResult[0].playerToken;

        // حذف همه پیام‌های بین sender و receiver
        await pool.query(
            `DELETE FROM messages 
             WHERE (sender = ? AND receiver = ?) 
                OR (sender = ? AND receiver = ?)`,
            [sender, receiverToken, receiverToken, sender]
        );

        res.status(200).json({ message: `All messages between sender ${sender} and receiver ${receiver} deleted.` });
    } catch (error) {
        console.error('Error deleting messages:', error);
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