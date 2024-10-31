const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const { json } = require('body-parser');

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
    const { email, password, username } = req.body;

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });

    }

    if (!isValidPassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    try {

        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const [existingUser2] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser2.length > 0) {
            return res.status(400).json({ error: 'username is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const now = new Date();
        const { x, y } = await generateRandomPosition(pool);


        const token = generateRandomToken();
        const defaultBuildings = [
            { building_id: 1, level: 1, position: { x: -303, y: 83 } },
            { building_id: 2, level: 1, position: { x: -280, y: -147 } }, 
            { building_id: 3, level: 1, position: { x: 213, y: -195 } }, 
            { building_id: 4, level: 1, position: { x: 134, y: 115 } }, 
            { building_id: 5, level: 1, position: { x: 4, y: 0 } }
        ];
        
        // Insert new user into the database
        await pool.query('INSERT INTO users (playerToken, email, password_hash, username, lastUpdated, citypositionX, citypositionY) VALUES (?, ?, ?, ?, ?, ?, ?)', [token, email, hashedPassword, username, now, x, y]);
        await pool.query('INSERT INTO playerbuildings (playerToken, buildings) VALUES (?, ?)', [token, JSON.stringify(defaultBuildings)]);

        res.status(201).json({ message: 'User registered successfully', playerToken: token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/addCity', async (req, res) => {
    const { playerEmail, cityName, cityPositionX, cityPositionY } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ? ORDER BY cities DESC', [playerEmail]);

        const cityCount = existingUser[0].cities + 1;

        const hashedPassword = existingUser[0].password_hash;
        const email = existingUser[0].email;
        const username = existingUser[0].username;
        const now = new Date();

        const token = generateRandomToken();
        // Insert new user into the database
        await pool.query('INSERT INTO users (playerToken, email, password_hash, username, cities, cityName, cityPositionX, cityPositionY, lastUpdated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [token, email, hashedPassword, username, cityCount, cityName, cityPositionX, cityPositionY, now]);
        await pool.query('INSERT INTO userbuildings (playerToken) VALUES (?)', [token]);

        res.status(201).json({ message: 'City registered successfully', playerToken: token });


    } catch (error) {
        console.error('Error registering city:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/getCities', async (req, res) => {
    const { email } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ? ORDER BY cities ASC', [email]);

        const validUsers = [];

        for (const user of users) {
            validUsers.push({
                playerToken: user.playerToken,
                cities: user.cities,
                cityName: user.cityName,
                citypositionX: user.citypositionX,
                cityPositionY: user.cityPositionY,
            });
        }

        res.status(201).json({ message: 'registerd cities', validUsers });


    } catch (error) {
        console.error('Error get city:', error);
        res.status(500).json({ error: 'Internal server error' });
    }


});

router.post('/checkRegister', async (req, res) => {
    const { email, username } = req.body;

    try {

        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const [existingUser2] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser2.length > 0) {
            return res.status(400).json({ error: 'username is already registered' });
        }

        res.status(201).json({ message: 'Email and username is unregisterd' });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

function generateRandomToken() {
    let token = '';
    for (let i = 0; i < 5; i++) {
        token += Math.floor(Math.random() * 10); // Generate random digit (0-9)
    }
    return token;
}

function isValidEmail(email) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return password.length >= 8;
}

async function generateRandomPosition(pool) {
    const start = 100;
    const end = 10000;
    const step = 100;

    const getRandomCoordinate = () => {
        const range = (end - start) / step + 1; // Calculate number of possible values
        const randomIndex = Math.floor(Math.random() * range); // Random index
        return start + randomIndex * step; // Convert index to coordinate
    };

    while (true) {
        const x = getRandomCoordinate();
        const y = getRandomCoordinate();

        const [existingUser] = await pool.query(
            'SELECT * FROM users WHERE citypositionX = ? AND citypositionY = ?',
            [x, y]
        );
        const [existingUser2] = await pool.query(
            'SELECT * FROM prize WHERE citypositionX = ? AND citypositionY = ?',
            [x, y]
        );

        if (existingUser.length === 0 || existingUser2.length === 0) {
            return { x, y };
        }
    }
}

module.exports = router;