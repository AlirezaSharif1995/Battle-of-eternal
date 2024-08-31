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

router.post('/add', async (req, res) => {
    try {
        const { loot } = req.body;
        const { x, y } = await generateRandomPosition(pool);
        const token = generateRandomToken();

        let gems;
        let number;

        switch (loot) {
            case 600:
                gems = 600;
                number = 30;
                break;
            case 300:
                gems = 300;
                number = 25;
                break;
            case 150:
                gems = 150;
                number = 20;
                break;
            case 50:
                gems = 50;
                number = 15;
                break;
            default:
                break;
        }

        const force =
            [
                {
                    "force": {
                        "load": 100,
                        "name": "Infantry",
                        "time": 0,
                        "level": 20,
                        "speed": 60,
                        "attack": 50,
                        "number": number,
                        "defence": 190,
                        "isSpecialForce": false
                    },
                    "forceName": "Infantry"
                },
                {
                    "force": {
                        "load": 50,
                        "name": "Swordsman",
                        "time": 0,
                        "level": 20,
                        "speed": 60,
                        "attack": 70,
                        "number": number,
                        "defence": 55,
                        "isSpecialForce": false
                    },
                    "forceName": "Swordsman"
                },
                {
                    "force": {
                        "load": 50,
                        "name": "Maceman",
                        "time": 0,
                        "level": 20,
                        "speed": 60,
                        "attack": 85,
                        "number": number,
                        "defence": 85,
                        "isSpecialForce": false
                    },
                    "forceName": "Maceman"
                },
                {
                    "force": {
                        "load": 50,
                        "name": "Spy",
                        "time": 0,
                        "level": 1,
                        "speed": 70,
                        "attack": 35,
                        "number": number,
                        "defence": 38,
                        "isSpecialForce": false
                    },
                    "forceName": "Spy"
                },
                {
                    "force": {
                        "load": 50,
                        "name": "Archer",
                        "time": 0,
                        "level": 1,
                        "speed": 70,
                        "attack": 70,
                        "number": number,
                        "defence": 70,
                        "isSpecialForce": false
                    },
                    "forceName": "Archer"
                },
                {
                    "force": {
                        "load": 50,
                        "name": "knight",
                        "time": 0,
                        "level": 1,
                        "speed": 160,
                        "attack": 120,
                        "targetBuilding": "ArmyCamp",
                        "number": number,
                        "defence": 122,
                        "isSpecialForce": false
                    },
                    "forceName": "knight"
                }
            ];

        // Insert into the database
        await pool.query('INSERT INTO prize (prizeID, cityPositionX, cityPositionY, `force`, loot) VALUES (?, ?, ?, ?, ?)', [token, x, y, [JSON.stringify(force)], [JSON.stringify(gems)]]);
        res.status(201).json({ message: 'Prize registered successfully', cityToken: token });

    } catch (error) {
        console.error('Error adding prize:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/delete', (req, res) => {
    
});

router.post('/get', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM prize');
        const validUsers = [];

        for (const user of users) {
            validUsers.push({
                PrizeID: user.prizeID,
                force: user.force,
                loot: user.loot,
                citypositionX: user.citypositionX,
                cityPositionY: user.cityPositionY,
            });
        }

        res.status(201).json({ message: 'registerd prize', validUsers });


    } catch (error) {
        console.error('Error get city:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

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

        const [existingUser2] = await pool.query(
            'SELECT * FROM prize WHERE citypositionX = ? AND citypositionY = ?',
            [x, y]
        );

        if (existingUser.length === 0 || existingUser2.length === 0) {
            return { x, y };
        }
    }
}

function generateRandomToken() {
    let token = '';
    for (let i = 0; i < 5; i++) {
        token += Math.floor(Math.random() * 10); // Generate random digit (0-9)
    }
    return token;
}

module.exports = router;
