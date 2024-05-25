const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Alireza1995!',
    database: 'battle-of-eternals',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'updatedPicture/'); // Directory where images will be saved
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
    }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
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

router.post('/replaceProfileImage', async (req, res) => {

    const { playerToken, avatarCode } = req.body;

    try {

        await pool.query('UPDATE users SET imageData = ? WHERE playerToken = ?', [avatarCode, playerToken]);
        res.status(200).json({ message: 'Profile image updated successfully' });

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

module.exports = router;