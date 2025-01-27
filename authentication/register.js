const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const { json } = require('body-parser');

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
    const { email, password, username } = req.body;

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

        const [existingUser2] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser2.length > 0) {
            return res.status(400).json({ error: 'username is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // const { x, y } = await generateRandomPosition(pool);

        const token = generateRandomToken();
        const defaultBuildings = [
            { building_id: 1, level: 1, position: { x: -303, y: 83 } },
            { building_id: 2, level: 1, position: { x: -280, y: -147 } },
            { building_id: 3, level: 1, position: { x: 213, y: -195 } },
            { building_id: 4, level: 1, position: { x: 134, y: 115 } },
            { building_id: 5, level: 1, position: { x: 4, y: 0 } }
        ];

        const forces = "{\"Spy\": {\"level\": 1,\"quantity\": 0},\"Archer\": {\"level\": 1,\"quantity\": 0},\"Balloon\": {\"level\": 1,\"quantity\": 0},\"Infantry\": {\"level\": 1,\"quantity\": 0},\"Maceman\": {\"level\": 1,\"quantity\": 0},\"Swordsman\": {\"level\": 1,\"quantity\": 0},\"Horseman\": {\"level\": 1,\"quantity\": 0},\"Knights\": {\"level\": 1,\"quantity\": 0},\"Battering ram\": {\"level\": 1,\"quantity\": 0},\"Heavy Catapult\": {\"level\": 1,\"quantity\": 0}}";
        const cityPosition = (await generateRandomPosition(pool));

        // Insert new user into the database
        await pool.query('INSERT INTO users (playerToken, email, password_hash, username, cityPositionX, cityPositionY) VALUES (?, ?, ?, ?, ?, ?)', [token, email, hashedPassword, username, cityPosition.x, cityPosition.y]);
        await pool.query('INSERT INTO playerbuildings (playerToken, buildings) VALUES (?, ?)', [token, JSON.stringify(defaultBuildings)]);
        await pool.query('INSERT INTO playerstats (playerToken) VALUES (?)', [token]);
        await pool.query('INSERT INTO user_forces_json (user_id, forces) VALUES (?, ?)', [token, forces]);

        res.status(201).json({ message: 'User registered successfully', playerToken: token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/addCity', async (req, res) => {
    const { playerToken, cityName } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

        const hashedPassword = existingUser[0].password_hash;
        const email = existingUser[0].email;
        const username = existingUser[0].username;
        constavatarCode = existingUser[0].avatarCode;

        const token = generateRandomToken();
        const cityPosition = (await generateRandomPosition(pool));
        const defaultBuildings = [
            { building_id: 1, level: 1, position: { x: -303, y: 83 } },
            { building_id: 2, level: 1, position: { x: -280, y: -147 } },
            { building_id: 3, level: 1, position: { x: 213, y: -195 } },
            { building_id: 4, level: 1, position: { x: 134, y: 115 } },
            { building_id: 5, level: 1, position: { x: 4, y: 0 } }
        ];
        const forces = "{\"Spy\": {\"level\": 1,\"quantity\": 0},\"Archer\": {\"level\": 1,\"quantity\": 0},\"Balloon\": {\"level\": 1,\"quantity\": 0},\"Infantry\": {\"level\": 1,\"quantity\": 0},\"Maceman\": {\"level\": 1,\"quantity\": 0},\"Swordsman\": {\"level\": 1,\"quantity\": 0},\"Horseman\": {\"level\": 1,\"quantity\": 0},\"Knights\": {\"level\": 1,\"quantity\": 0},\"Battering ram\": {\"level\": 1,\"quantity\": 0},\"Heavy Catapult\": {\"level\": 1,\"quantity\": 0}}";

        // Insert new user into the database
        await pool.query('INSERT INTO users (playerToken, email, password_hash, username, cityPositionX, cityPositionY, cityName) VALUES (?, ?, ?, ?, ?, ?, ?)', [token, email, hashedPassword, username, cityPosition.x, cityPosition.y, cityName]);
        await pool.query('INSERT INTO playerbuildings (playerToken, buildings) VALUES (?, ?)', [token, JSON.stringify(defaultBuildings)]);
        await pool.query('INSERT INTO playerstats (playerToken) VALUES (?)', [token]);
        await pool.query('INSERT INTO user_forces_json (user_id, forces) VALUES (?, ?)', [token, forces]);

        res.status(201).json({ message: 'City registered successfully', playerToken: token });


    } catch (error) {
        console.error('Error registering city:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/getCities', async (req, res) => {
    const { playerToken } = req.body;

    try {
        const [player] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [player[0].email]);

        const validUsers = [];

        for (const user of users) {
            validUsers.push({
                playerToken: user.playerToken,
                username: user.username,
                avatar: user.avatarCode,
                cityName: user.cityName,
                bio: user.bio,
                population : user.population,
                citypositionY: user.citypositionY,
                citypositionX: user.citypositionX
            });
        }

        res.status(201).json({ message: 'registerd cities', validUsers });


    } catch (error) {
        console.error('Error get city:', error);
        res.status(500).json({ error: 'Internal server error' });
    }


});

router.post('/getAllCities', async (req, res) => {

    try {

        const [cities] = await pool.query('SELECT citypositionY, citypositionX, cityName, playerToken FROM users');
        res.status(201).json({ message: 'cities list', cities });

    } catch (error) {
        console.error('Error get city:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});


// HERE

router.post('/checkRegister', async (req, res) => {
    const { email, username } = req.body;

    try {

        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const [existingUser2] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser2.length > 0) {
            return res.status(400).json({ error: 'username is already registered' });
        }

        res.status(201).json({ message: 'Email and username is unregisterd' });


    } catch (error) {
        console.error(error);
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

function isValidEmail(email) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return password.length >= 8;
}

async function generateRandomPosition(pool) {
    const start = 100;
    const end = 10000;
    const step = 100;

    const getRandomCoordinate = () => {
        const range = (end - start) / step + 1; // Calculate number of possible values
        const randomIndex = Math.floor(Math.random() * range); // Random index
        return start + randomIndex * step; // Convert index to coordinate
    };
    while (true) {
        const x = getRandomCoordinate();
        const y = getRandomCoordinate();

        const [existingUser] = await pool.query(
            'SELECT * FROM users WHERE citypositionX = ? AND citypositionY = ?',
            [x, y]
        );
        console.log("here")

        const [existingUser2] = await pool.query(
            'SELECT * FROM prize WHERE citypositionX = ? AND citypositionY = ?',
            [x, y]
        );

        if (existingUser.length === 0 || existingUser2.length === 0) {
            return { x, y };
        }
    }
}

module.exports = router;