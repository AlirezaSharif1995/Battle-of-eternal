const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
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

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const now = new Date();

        const token = generateRandomToken();
        // Insert new user into the database
        await pool.query('INSERT INTO users (playerToken, email, password_hash, username, lastUpdated) VALUES (?, ?, ?, ?, ?)', [token, email, hashedPassword, username, now]);
        await pool.query('INSERT INTO userbuildings (playerToken) VALUES (?)', [token]);

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

module.exports = router;