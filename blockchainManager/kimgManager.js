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

router.post('/getKings', async (req, res) => {

    try {
        const { playerToken } = req.body;
        const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);
        if (existingUser.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        const user = {
          force: existingUser[0].king
        }
        res.status(200).json(user);
        
    } catch (error) {
        console.error('Error getKings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/updateKings', async (req, res) => {

  try {
    const { playerToken, king } = req.body;
    const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await pool.query('UPDATE users SET king = ? WHERE playerToken = ?', [[JSON.stringify(king)], playerToken]);
    res.status(200).json({ message: 'king updated successfully' });

  } catch (error) {
    console.error('Error updateKings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
