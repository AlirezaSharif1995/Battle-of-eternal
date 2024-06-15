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