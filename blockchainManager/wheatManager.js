const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Alireza1995!',
    database: 'battle-of-eternals',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

router.get('/checkWheat', async (req, res) => {
  const { playerToken } = req.body;
  try {
    const [rows] = await pool.query('SELECT wheat FROM users WHERE playerToken = ?', [playerToken]);
    if (rows.length > 0) {
      res.json({ playerToken: playerToken, wheat: rows[0].wheat });
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/decrease', async (req, res) => {
  const { playerToken, amount } = req.body;
  try {
    const [rows] = await pool.query('SELECT wheat FROM users WHERE playerToken = ?', [playerToken]);
    if (rows.length > 0) {
      const currentWheat = rows[0].wheat;
      if (currentWheat >= amount) {
        await pool.query('UPDATE users SET wheat = wheat - ? WHERE playerToken = ?', [amount, playerToken]);
        res.json({ playerToken: playerToken, wheat: currentWheat - amount });
      } else {
        res.status(400).json({ error: 'Insufficient wheat' });
      }
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
