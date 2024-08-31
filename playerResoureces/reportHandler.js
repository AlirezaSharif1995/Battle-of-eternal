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

router.post('/clanPopulation', async (req, res) => {

    try {
        const { clan_id } = req.body;
        const [players] = await pool.query(
            'SELECT username, avatarCode, cities, clan_id, population FROM users WHERE clan_id = ? ORDER BY population DESC LIMIT 10',
            [clan_id]
        );
        res.send(players);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/clanRanking', async (req, res) => {
    try {
        // Query to calculate total population for each clan, including avatarCode, and order by total population
        const [topClans] = await pool.query(
            `SELECT c.id AS clan_id, c.name AS clan_name, c.avatarCode AS clan_avatar, COALESCE(SUM(u.population), 0) AS total_population
             FROM clans c
             LEFT JOIN users u ON c.id = u.clan_id
             GROUP BY c.id, c.name, c.avatarCode
             ORDER BY total_population DESC
             LIMIT 10`
        );

        res.json(topClans);
    } catch (error) {
        console.error("Error fetching clan rankings:", error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/attack', async (req, res) => {
    try {
        const [players] = await pool.query(
            'SELECT username, avatarCode, cities, clan_id, killedForce FROM users ORDER BY killedForce DESC LIMIT 10');
        res.send(players);

    } catch (error) {
        console.error("Error fetching attack rankings:", error);
        res.status(500).send('Internal Server Error');
    }

});

router.post('/defence', async (req, res) => {
    try {
        const [players] = await pool.query(
            'SELECT username, avatarCode, cities, clan_id, killedDefence FROM users ORDER BY killedDefence DESC LIMIT 10');
        res.send(players);

    } catch (error) {
        console.error("Error fetching defence rankings:", error);
        res.status(500).send('Internal Server Error');
    }

});

router.post('/raid', async (req, res) => {
    try {
        const [players] = await pool.query(
            'SELECT username, avatarCode, cities, clan_id, raid FROM users ORDER BY raid DESC LIMIT 10');
        res.send(players);

    } catch (error) {
        console.error("Error fetching raid rankings:", error);
        res.status(500).send('Internal Server Error');
    }

});

router.post('/attackClanRanking', async (req, res) => {
    try {
        const [topAttackClans] = await pool.query(
            `SELECT c.id AS clan_id, c.name AS clan_name, c.avatarCode AS clan_avatar, COALESCE(SUM(u.killedForce), 0) AS total_killedForce
             FROM clans c
             LEFT JOIN users u ON c.id = u.clan_id
             GROUP BY c.id, c.name, c.avatarCode
             ORDER BY total_killedForce DESC
             LIMIT 10`
        );

        res.json(topAttackClans);
    } catch (error) {
        console.error("Error fetching attack clan rankings:", error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/defenceClanRanking', async (req, res) => {
    try {
        const [topDefenceClans] = await pool.query(
            `SELECT c.id AS clan_id, c.name AS clan_name, c.avatarCode AS clan_avatar, COALESCE(SUM(u.killedDefence), 0) AS total_killedDefence
             FROM clans c
             LEFT JOIN users u ON c.id = u.clan_id
             GROUP BY c.id, c.name, c.avatarCode
             ORDER BY total_killedDefence DESC
             LIMIT 10`
        );

        res.json(topDefenceClans);
    } catch (error) {
        console.error("Error fetching defence clan rankings:", error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/raidClanRanking', async (req, res) => {
    try {
        const [topRaidClans] = await pool.query(
            `SELECT c.id AS clan_id, c.name AS clan_name, c.avatarCode AS clan_avatar, COALESCE(SUM(u.raid), 0) AS total_raid
             FROM clans c
             LEFT JOIN users u ON c.id = u.clan_id
             GROUP BY c.id, c.name, c.avatarCode
             ORDER BY total_raid DESC
             LIMIT 10`
        );

        res.json(topRaidClans);
    } catch (error) {
        console.error("Error fetching raid clan rankings:", error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/allPlayerPopulation', async (req, res) => {
    try {
        const [players] = await pool.query(
            'SELECT username, avatarCode, cities, clan_id, population FROM users ORDER BY population DESC LIMIT 100'
        );

        // Fetch clan names for each player
        for (const player of players) {
            const [clan] = await pool.query('SELECT name FROM clans WHERE id = ?', [player.clan_id]);
            if (clan.length > 0) {
                player.clanName = clan[0].name;
            } else {
                player.clanName = null;
            }
        }

        res.send(players);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/managerRole', async (req, res) => {
    try {
        const { clan_id } = req.body;  // Assuming clan_id is passed as a query parameter
        const [clanMembers] = await pool.query('SELECT username,playerToken, clan_role FROM users WHERE clan_role LIKE ? AND clan_id = ?', ['%manager%', clan_id]);
        res.send(clanMembers);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;