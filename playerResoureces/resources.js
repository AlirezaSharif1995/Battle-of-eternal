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

router.post('/getForce', async (req, res) => {
  const { playerToken } = req.body;
  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = {
      force: existingUser[0].force
    }
    res.status(200).json(user);

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });

  }
});

router.post('/forceUpdate', async (req, res) => {
  const { playerToken, force } = req.body;
  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await pool.query('UPDATE users SET `force` = ? WHERE playerToken = ?', [JSON.stringify(force), playerToken]);
    res.status(200).json({ message: 'Force updated successfully' });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.post('/updateResourceRate', async (req, res) => {
  const { playerToken, type, data } = req.body;

  try {

    const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sql = `UPDATE users SET ${type} = ? WHERE playerToken = ?`;
    await pool.query(sql, [data, playerToken]);
    res.status(200).json({ message: 'Rate updated successfully' });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.post('/getResourceRate', async (req, res) => {
  const { playerToken } = req.body;

  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const rates = {
      ironRate: existingUser[0].ironLevel,
      wheatRate: existingUser[0].wheatLevel,
      stoneRate: existingUser[0].stoneLevel,
      woodRate: existingUser[0].woodLevel
    }
    res.status(200).json({ message: 'Rate get successfully', rates });


  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });

  }

});

router.post('/getCapacity', async (req, res) => {
  const { playerToken } = req.body;

  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const rates = {
      ironCapacity: existingUser[0].ironCapacity,
      wheatCapacity: existingUser[0].wheatCapacity,
      stoneCapacity: existingUser[0].stoneCapacity,
      woodCapacity: existingUser[0].woodCapacity
    }
    res.status(200).json({ message: 'Rate get successfully', rates });


  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });

  }
});

router.post('/updateResourceCapacity', async (req, res) => {
  const { playerToken, type, data } = req.body;

  try {

    const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sql = `UPDATE users SET ${type} = ? WHERE playerToken = ?`;
    await pool.query(sql, [data, playerToken]);
    res.status(200).json({ message: 'Capacity updated successfully' });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});
module.exports = router;
