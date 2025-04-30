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

    const { clan_id, playerToken, clanRole } = req.body;
    try {
        await pool.query('UPDATE users SET clan_id = ?, clan_role = ? WHERE playerToken = ?', [clan_id, clanRole, playerToken]);

        const [rows] = await pool.query('SELECT * FROM clans WHERE id = ?', [clan_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Clan not found' });
        }

        const clan = rows[0];
        let updatedRequestList = clan.recivedRequests ? JSON.parse(clan.recivedRequests) : [];

        if (!updatedRequestList.includes(playerToken)) {
            return res.status(400).json({ error: 'Player not found in the list' });
        }

        updatedRequestList = updatedRequestList.filter(token => token !== playerToken);

        await pool.query('UPDATE clans SET recivedRequests = ? WHERE id = ?', [JSON.stringify(updatedRequestList), clan_id]);


        
        res.status(201).json({ message: 'Player joined successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/leave', async (req, res) => {

    const {playerToken} = req.body;

    try {
        await pool.query('UPDATE users SET clan_id = ?, clan_role = ? WHERE playerToken = ?', [0, null, playerToken]);
        res.status(201).json({ message: 'Player left successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/changeRole', async (req, res) => {

    const {playerToken, clanRole} = req.body;

    try {
        await pool.query('UPDATE users SET clan_role = ? WHERE playerToken = ?', [clanRole, playerToken]);
        res.status(201).json({ message: 'Player role changed successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/clanInfo', async (req, res) => {
    const { clan_id } = req.body;
    try {
        // دریافت اطلاعات قبیله
        const [clanResult] = await pool.query('SELECT * FROM clans WHERE id = ?', [clan_id]);

        if (clanResult.length === 0) {
            return res.status(404).json({ error: 'Clan not found' });
        }

        let clan = clanResult[0];

        // دریافت اعضای قبیله
        const [members] = await pool.query(
            'SELECT playerToken, avatarCode, username, clan_role AS clanRole FROM users WHERE clan_id = ?', 
            [clan_id]
        );

        // پردازش درخواست‌های دریافتی
        let receivedRequests = [];
        let receivedRequestsIds = [];

        if (clan.recivedRequests) {

            try {
                receivedRequestsIds = JSON.parse(clan.recivedRequests);
                if (!Array.isArray(receivedRequestsIds)) {
                    receivedRequestsIds = [];
                }
            } catch (e) {
                console.error("Error parsing recivedRequests:", e);
                receivedRequestsIds = [];
            }
        }

        if (receivedRequestsIds.length > 0) {
            const [requests] = await pool.query(
                'SELECT playerToken, username, avatarCode FROM users WHERE playerToken IN (?)',
                [receivedRequestsIds]
            );
            receivedRequests = requests;
        }

        res.status(201).json({ clan, members, receivedRequests });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/sendRequest', async (req, res) => {
    const { playerToken, clan_id } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM clans WHERE id = ?', [clan_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Clan not found' });
        }

        const clan = rows[0];
        const updatedRequestList = clan.recivedRequests ? JSON.parse(clan.recivedRequests) : [];

        if (!updatedRequestList.includes(playerToken)) {
            updatedRequestList.push(playerToken);
        } else {
            return res.status(400).json({ error: 'Player already exists in the list' });
        }

        await pool.query('UPDATE clans SET recivedRequests = ? WHERE id = ?', [JSON.stringify(updatedRequestList), clan_id]);

        res.status(201).json({ message: 'Request sent!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/invitePlayer', async (req, res) => {
    const { username, clan_id } = req.body;
    try {

        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const player = rows[0];
        const updatedRequestList = player.recivedRequests ? (player.recivedRequests) : [];

        if (!updatedRequestList.includes(clan_id)) {
            updatedRequestList.push(clan_id);
        } else {
            return res.status(400).json({ error: 'clan request already exists in the list' });
        }

        await pool.query('UPDATE users SET recivedRequests = ? WHERE username = ?', [JSON.stringify(updatedRequestList), username]);

        res.status(201).json({ message: 'Request sent!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/clanReject', async (req, res) => {
    const { playerToken, clan_id } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM clans WHERE id = ?', [clan_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Clan not found' });
        }

        const clan = rows[0];
        let updatedRequestList = clan.recivedRequests ? JSON.parse(clan.recivedRequests) : [];

        if (!updatedRequestList.includes(playerToken)) {
            return res.status(400).json({ error: 'Player not found in the list' });
        }

        updatedRequestList = updatedRequestList.filter(token => token !== playerToken);

        await pool.query('UPDATE clans SET recivedRequests = ? WHERE id = ?', [JSON.stringify(updatedRequestList), clan_id]);

        res.status(200).json({ message: 'Player rejected from the clan successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/rejectInvite', async (req, res) => {
    const { playerToken, clan_id } = req.body;
    try {
        // Fetch player by playerToken
        const [rows] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const player = rows[0];
        let updatedRequestList = player.recivedRequests ? JSON.parse(player.recivedRequests) : [];

        // Check if the clan_id is in the player's recivedRequests list
        if (!updatedRequestList.includes(clan_id)) {
            return res.status(400).json({ error: 'Clan request not found in the list' });
        }

        // Remove the clan_id from the recivedRequests list
        updatedRequestList = updatedRequestList.filter(id => id !== clan_id);

        // Update the player's recivedRequests list in the database
        await pool.query('UPDATE users SET recivedRequests = ? WHERE playerToken = ?', [JSON.stringify(updatedRequestList), playerToken]);

        res.status(200).json({ message: 'Clan request rejected successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/changeClanAvatar', async (req, res) => {
    const { avatarCode, clan_id } = req.body;

    try {

        await pool.query('UPDATE clans SET avatarCode = ? WHERE id = ?', [avatarCode, clan_id]);
        res.status(200).json({ message: 'Avatar updated successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/changeDyplomacy', async (req, res) => {
    const { diplomacy, clan_id } = req.body;

    try {

        await pool.query('UPDATE clans SET diplomacy = ? WHERE id = ?', [diplomacy, clan_id]);
        res.status(200).json({ message: 'diplomacy updated successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/changeMode', async (req, res) => {
    const { mode, clan_id } = req.body;

    try {

        await pool.query('UPDATE clans SET mode = ? WHERE id = ?', [mode, clan_id]);
        res.status(200).json({ message: 'mode updated successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/changeDescription', async (req, res) => {
    const { description, clan_id } = req.body;

    try {

        await pool.query('UPDATE clans SET description = ? WHERE id = ?', [description, clan_id]);
        res.status(200).json({ message: 'description updated successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/changeClanName', async (req, res) => {
    const { name, clan_id } = req.body;

    try {

        await pool.query('UPDATE clans SET name = ? WHERE id = ?', [name, clan_id]);
        res.status(200).json({ message: 'name updated successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;