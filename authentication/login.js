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

    try {
        // Check if the user exists in the database
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the provided password matches the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, existingUser[0].password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const user = {
            playerToken: existingUser[0].playerToken,
            username: existingUser[0].username,
            avatarCode: existingUser[0].avatarCode,
            bio: existingUser[0].bio,
            wheat: existingUser[0].wheat,
            stone: existingUser[0].stone,
            wood: existingUser[0].wood,
            iron: existingUser[0].iron,
            clan: existingUser[0].clan_id,
            role: existingUser[0].clan_role,
            recivedRequests: existingUser[0].recivedRequests,
            force: existingUser[0].force
        };

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/playerToken', async (req, res) => {
    const { playerToken } = req.body;
    try {
        // Check if the user exists in the database
        const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = {
            playerToken: existingUser[0].playerToken,
            username: existingUser[0].username,
            avatarCode: existingUser[0].avatarCode,
            bio: existingUser[0].bio,
            wheat: existingUser[0].wheat,
            stone: existingUser[0].stone,
            wood: existingUser[0].wood,
            iron: existingUser[0].iron,
            clan: existingUser[0].clan_id,
            role: existingUser[0].clan_role,
            recivedRequests: existingUser[0].recivedRequests,
            force: existingUser[0].force
        };

        res.status(200).json({ message: 'Login successful', user });

    } catch {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

module.exports = router;
