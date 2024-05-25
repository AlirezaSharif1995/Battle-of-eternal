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

router.get('/clanMembers', async (req, res) => {
    try {
        const { clan_id } = req.body;
        const [clanMembers] = await pool.query('SELECT username, playerToken FROM users WHERE clan_id = ?', [clan_id]);
        res.send(clanMembers);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/clanPopulation', async (req, res) => {

    try {
        const { clan_id } = req.body;
        const [players] = await pool.query(
            'SELECT username, population FROM users WHERE clan_id = ? ORDER BY population DESC LIMIT 10',
            [clan_id]
        );
        res.send(players);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/allPlayerPopulation', async (req,res) => {

    try {
        const [players] = await pool.query(
            'SELECT username, population FROM users ORDER BY population DESC LIMIT 10'
        );
        res.send(players);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;