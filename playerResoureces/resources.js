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

  const { playerToken, wheat, stone, wood, iron } = req.body;
  const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

  if (existingUser.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  try {
    await pool.query('UPDATE users SET wheat = ?, stone = ?, wood = ?, iron = ? WHERE playerToken = ?', [wheat, stone, wood, iron, playerToken]);
    res.status(200).json({ message: 'Data updated successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.post('/cupTransfer', async (req, res) => {

  const { playerToken, clan_id, cupAmount } = req.body;
  console.log(req.body);
  try {
    const [clanCup] = await pool.query('SELECT * FROM clans WHERE id = ?', clan_id);
    const [playerCups] = await pool.query('SELECT * FROM users WHERE playerToken = ?', playerToken);
    if (clanCup[0].clanCup < cupAmount) {
      return res.status(200).json({ message: 'clan cup is less than amount' });
    }
    await pool.query('UPDATE clans SET clanCup = ? WHERE id = ?', [(clanCup[0].clanCup - cupAmount), clan_id]);
    await pool.query('UPDATE users SET playerCup = ? WHERE playerToken = ?', [(playerCups[0].playerCup + cupAmount), playerToken]);
    res.status(200).json({ message: 'Data updated successful' });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

module.exports = router;
