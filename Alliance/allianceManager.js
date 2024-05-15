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

    const { playerToken } = req.body;
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

router.post('/sendRequest',async (req,res)=>{

    const{ playerToken, clan_id } = req.body;
    try {
        const [clan] = await pool.query('SELECT * FROM clans WHERE id = ?', [clan_id]);
        const updatedRequestList = clan.recivedRequest ? JSON.parse(clan.recivedRequest) : [];

        if (!updatedRequestList.includes(playerToken)) {
            updatedRequestList.push(playerToken);

        } else {
            return res.status(400).json({ error: 'player already exists in the list' });
        }

        await pool.query('UPDATE clans SET recivedRequests = ? WHERE id = ?', [JSON.stringify(updatedRequestList), clan_id]);
        res.status(201).json({ message: 'Request sent!' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }

});

module.exports = router;