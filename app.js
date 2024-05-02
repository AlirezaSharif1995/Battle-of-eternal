const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// MySQL connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Alireza1995!',
  database: 'battle-of-eternals'
};

const pool = mysql.createPool(dbConfig);

app.post('/register', (req, res) => {
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

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.error('Error logging in user:', err);
      return res.status(500).json({ error: 'An error occurred while logging in user' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    console.log('User logged in successfully:', results[0]);
    res.json({ message: 'User logged in successfully', user: results[0] });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
