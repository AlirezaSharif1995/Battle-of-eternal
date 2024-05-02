const express = require('express');
const mysql = require('mysql');
const router = express.Router();

// MySQL connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Alireza1995!',
    database: 'battle-of-eternals'
  };

const pool = mysql.createPool(dbConfig);


router.post('/', (req, res) => {
    const { username, password } = req.body;
  
    pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, results) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ error: 'An error occurred while registering user' });
      }
      console.log('User registered successfully:', results);
      res.json({ message: 'User registered successfully' });
    });
  });

  module.exports = router;