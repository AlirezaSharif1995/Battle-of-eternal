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

router.post('/', async (req, res) => {
    const { playerToken } = req.body;
    try {
        const [player] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

        const playerData = {
            username: player[0].username,
            avatarCode: player[0].avatarCode,
            cities: player[0].cities,
            clan: player[0].clan_id,
            population: player[0].population,
            bio: player[0].bio
        }
        res.status(201).json({ message: 'player information', playerData });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/recivedRequests', async (req, res) => {
    const { playerToken } = req.body;

    try {
        const [player] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

        const playerData = {
            recivedRequests: player[0].recivedRequests
        }
        res.status(201).json({ message: 'recived Requests', playerData });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/changeAvatar', async (req, res) => {

    const { playerToken, avatarCode } = req.body;

    try {

        await pool.query('UPDATE users SET avatarCode = ? WHERE playerToken = ?', [avatarCode, playerToken]);
        res.status(200).json({ message: 'Avatar updated successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/changeUsername', async (req, res) => {
    const { playerToken, username } = req.body;

    try {
        await pool.query('UPDATE users SET username = ? WHERE playerToken = ?', [username, playerToken]);
        res.status(200).json({ message: 'Data updated successful' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/changeMedals', async (req, res) => {
    const { playerToken, medals } = req.body;

    try {
        await pool.query('UPDATE users SET medals = ? WHERE playerToken = ?', [medals, playerToken]);
        const [player] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

        const playerData = {
            medals: player[0].Medals
        }
        res.status(201).json({ message: 'medals', playerData });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/playerBorder', async (req, res) => {
    const { email, borderX, borderY } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM playeremailtable WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const ID = generateRandomToken();
        await pool.query('INSERT INTO playeremailtable (id, email, borderX, BorderY) VALUES (?, ?, ?, ?)', [ID, email, borderX, borderY]);
        res.status(201).json({ message: 'Email registerd succesfully!' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/getPlayerBorder', async (req, res) => {
    const { email } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM playeremailtable WHERE email = ?', [email]);

        if (existingUser.length < 0) {
            return res.status(400).json({ error: 'User not found!' });
        }

        const user = {
            borderX: existingUser[0].borderX,
            borderY: existingUser[0].borderY,
            civilization: existingUser[0].civilization,
            allPopulation: existingUser[0].allPopulation,
            users: existingUser[0].users
        }
        res.status(201).json({ user });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/updatePlayerBorder', async (req, res) => {
    const { email, type, data } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM playeremailtable WHERE email = ?', [email]);

        if (existingUser.length < 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const url = `UPDATE playeremailtable SET ${type} = ? WHERE email = ?`
        await pool.query(url, [data, email]);
        res.status(201).json({ message: 'updated succesfully!' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/getCityPos', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                playerToken, 
                email, 
                cityName, 
                cityPositionX, 
                citypositionY
            FROM 
                users
            `);

        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/getPlayerInfoUsername', async (req, res) => {
    const { username } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ existingUser });

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

function generateRandomToken() {
    let token = '';
    for (let i = 0; i < 5; i++) {
        token += Math.floor(Math.random() * 10); // Generate random digit (0-9)
    }
    return token;
}

module.exports = router;