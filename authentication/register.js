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
    const { email, password } = req.body;
    console.log(email+password)

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

        // Insert new user into the database
        await pool.query('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/enter-username', async (req, res) => {
    const { email, username } = req.body;

    try {
        // Update user document with the username
        await pool.query('UPDATE users SET username = ? WHERE email = ?', [username, email]);
        
        // If you want to send a response back to the client, you can do it here
        res.send('Username saved successfully!');
    } catch (error) {
        console.error('Error saving username:', error);
        res.status(500).json({ error: 'Error saving username' });
    }
});


function isValidEmail(email) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return password.length >= 8;
}

module.exports = router;