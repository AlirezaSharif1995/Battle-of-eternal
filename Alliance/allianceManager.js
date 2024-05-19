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

    const { clan_id, playerToken, role } = req.body;
    try {
        await pool.query('UPDATE users SET clan_id = ?, clan_role = ? WHERE playerToken = ?', [clan_id, role, playerToken]);
        res.status(201).json({ message: 'Player joined successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/leave', async (req, res) => {

    const playerToken = req.body.ID;

    try {
        await pool.query('UPDATE users SET clan_id = ?, clan_role = ? WHERE playerToken = ?', [null, null, playerToken]);
        res.status(201).json({ message: 'Player left successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/clanInfo', async (req,res)=>{
    const { clan_id } = req.body;
    try {
        const [clan] = await pool.query('SELECT * FROM clans WHERE id = ?', [clan_id]);
        res.status(201).json({ message: 'clan information :', clan });

    } catch (error) {
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
    const { playerToken, clan_id } = req.body;
    try {

        const [rows] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Clan not found' });
        }

        const player = rows[0];
        const updatedRequestList = player.recivedRequests ? JSON.parse(player.recivedRequests) : [];

        if (!updatedRequestList.includes(clan_id)) {
            updatedRequestList.push(clan_id);
        } else {
            return res.status(400).json({ error: 'clan request already exists in the list' });
        }

        await pool.query('UPDATE users SET recivedRequests = ? WHERE playerToken = ?', [JSON.stringify(updatedRequestList), playerToken]);

        res.status(201).json({ message: 'Request sent!' });
    } catch (error) {
        console.error(error);  
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;