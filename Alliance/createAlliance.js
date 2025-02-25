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

router.post('/', async(req,res)=>{
    const { name, description, leader_id, avatarCode } = req.body;

    try {
        const token = generateRandomToken();
        const [existingUser] = await pool.query('SELECT gem FROM users WHERE playerToken = ?', [leader_id]);

        if(existingUser[0].gem < 100){
            return res.status(404).json({ message: 'Need More Gems!' });
        }

        await pool.query('INSERT INTO clans (id, name, description, leader_id, avatarCode) VALUES (?, ?, ?, ?, ?)', [token, name, description, leader_id, avatarCode]);
        await pool.query('UPDATE users SET clan_id = ?, clan_role = ?, gem = gem - 100 WHERE playerToken = ?', [token, "leader", leader_id]);
        res.status(201).json({ message: 'Alliance registered successfully', clanToken: token });
    } catch (error) {
        console.log(error);
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

module.exports = router;