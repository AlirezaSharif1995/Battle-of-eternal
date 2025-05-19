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

router.post('/sendSpecialist', async (req, res) => {
    try {
        const { playerToken, mineId, count } = req.body;

        // Validate input
        if (!playerToken || !mineId || !count || count <= 0 || count > 100) {
            return res.status(400).json({ success: false, message: "Invalid input data!" });
        }

        // Check if the mine exists and has resources
        const [[mine]] = await pool.query("SELECT remaining_resources FROM mines WHERE id = ?", [mineId]);
        if (!mine) {
            return res.status(404).json({ success: false, message: "Mine not found!" });
        }
        if (mine.remaining_resources <= 0) {
            return res.status(400).json({ success: false, message: "Mine has no resources left!" });
        }

        // Get current specialist count from user_forces_json
        const [rows] = await pool.query(
            'SELECT forces FROM user_forces_json WHERE user_id = ?',
            [playerToken]
        );
        
        const userForces = rows[0].forces || '{}';
        const currentSpecialistCount = userForces['Specialist']?.quantity || 0;

        // Check if the player has enough specialists
        if (currentSpecialistCount < count) {
            return res.status(400).json({ success: false, message: "Not enough specialists!" });
        }

        // Check if the player already has specialists in this mine
        const [[existingSpecialist]] = await pool.query(
            "SELECT count FROM specialists WHERE playerToken = ? AND mine_id = ?",
            [playerToken, mineId]
        );

        if (existingSpecialist) {
            const newCount = existingSpecialist.count + count;
            if (newCount > 100) {
                return res.status(400).json({ success: false, message: "A maximum of 100 specialists can be sent to each mine!" });
            }

            // Update existing specialists count
            await pool.query("UPDATE specialists SET count = ? WHERE playerToken = ? AND mine_id = ?", 
                [newCount, playerToken, mineId]);
        } else {
            // Insert new specialist record if none exists
            await pool.query("INSERT INTO specialists (playerToken, mine_id, count) VALUES (?, ?, ?)", 
                [playerToken, mineId, count]);
        }

        // Decrease the specialist count in user_forces_json
        await pool.query(
            `UPDATE user_forces_json
            SET forces = JSON_SET(forces, '$.Specialist.quantity', ?)
            WHERE user_id = ?`,
            [currentSpecialistCount - count, playerToken]
        );

        return res.status(200).json({ success: true, message: "Specialists sent successfully!" });
    } catch (error) {
        console.error(`[ERROR] sendSpecialist API failed:`, error);
        return res.status(500).json({ success: false, message: "Internal server error!" });
    }
});

router.post('/getSpecialists', async (req, res) => {
    try {
        const { playerToken } = req.body;

        // Validate playerToken
        if (!playerToken) {
            return res.status(400).json({ success: false, message: "playerToken is required!" });
        }

        // Query to get specialists and the coordinates of mines
        const [specialists] = await pool.query(
            `SELECT s.mine_id, s.count, m.x AS mine_x, m.y AS mine_y
            FROM specialists s
            JOIN mines m ON s.mine_id = m.id
            WHERE s.playerToken = ?`,
            [playerToken]
        );

        const [rows] = await pool.query(
            'SELECT forces FROM user_forces_json WHERE user_id = ?',
            [playerToken]
        );
        
        const userForces = rows[0].forces || '{}';
        
        const specialistCount = userForces['Specialist']?.quantity || 0;
        
        // Return the list of specialists along with their mine coordinates
        return res.status(200).json({ success: true, specialists, specialistCount });
    } catch (error) {
        console.error(`[ERROR] getSpecialists API failed:`, error);
        return res.status(500).json({ success: false, message: "Internal server error!" });
    }
});

router.post('/returnSpecialists', async (req, res) => {
    try {
        const { playerToken, mineId, count } = req.body;

        if (!playerToken || !mineId || !count || count <= 0) {
            return res.status(400).json({ success: false, message: "Invalid input data!" });
        }

        const [[mine]] = await pool.query("SELECT id FROM mines WHERE id = ?", [mineId]);
        if (!mine) {
            return res.status(404).json({ success: false, message: "Mine not found!" });
        }

        const [[existingSpecialist]] = await pool.query(
            "SELECT count FROM specialists WHERE playerToken = ? AND mine_id = ?",
            [playerToken, mineId]
        );
        
        if (!existingSpecialist) {
            return res.status(404).json({ success: false, message: "No specialists found in this mine for the player!" });
        }

        if (existingSpecialist.count < count) {
            return res.status(400).json({ success: false, message: "You don't have enough specialists to return!" });
        }

        const newCount = existingSpecialist.count - count;
        if (newCount === 0) {

            await pool.query("DELETE FROM specialists WHERE playerToken = ? AND mine_id = ?", [playerToken, mineId]);
        } else {

            await pool.query("UPDATE specialists SET count = ? WHERE playerToken = ? AND mine_id = ?", [newCount, playerToken, mineId]);
        }

        const [rows] = await pool.query(
            'SELECT forces FROM user_forces_json WHERE user_id = ?',
            [playerToken]
        );
        
        const userForces = rows[0].forces || '{}';
        const currentSpecialistCount = userForces['Specialist']?.quantity || 0;

        await pool.query(
            `UPDATE user_forces_json
            SET forces = JSON_SET(forces, '$.Specialist.quantity', ?)
            WHERE user_id = ?`,
            [currentSpecialistCount + count, playerToken]
        );

        return res.status(200).json({ success: true, message: `${count} specialists returned successfully!` });
    } catch (error) {
        console.error(`[ERROR] returnSpecialists API failed:`, error);
        return res.status(500).json({ success: false, message: "Internal server error!" });
    }
});

router.post('/mines', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                m.id AS mine_id,
                m.x, 
                m.y, 
                m.remaining_resources, 
                mt.name AS mine_name,
                mt.level,
                mt.capacity
            FROM mines m
            JOIN mine_types mt ON m.mine_type_id = mt.id
            WHERE m.expires_at > NOW();
        `);

        res.json( { mines: rows } );
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving mines data', err });
    }
});

async function generateMines() {
    const levels = [{ level: 1, count: 100 }, { level: 2, count: 50 }, { level: 3, count: 25 }];
    for (const resource of ["stone", "wood", "iron", "wheat"]) {
        for (const { level, count } of levels) {
            const [[mineType]] = await pool.query("SELECT id, capacity FROM mine_types WHERE name = ? AND level = ?", [resource, level]);
            if (!mineType) continue;

            for (let i = 0; i < count; i++) {
                const { x, y } = await generateRandomPositionForMine(-19000,19000,-10000,10000);
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 10);

                await pool.query("INSERT INTO mines (mine_type_id, x, y, remaining_resources, expires_at) VALUES (?, ?, ?, ?, ?)",
                    [mineType.id, x, y, mineType.capacity, expiresAt]);
            }
        }
    }
}

async function deleteExpiredMines() {
    const now = new Date();
    await pool.query("DELETE FROM mines WHERE expires_at <= ?", [now]);
    console.log("⛏️  Expired mines deleted at", now.toISOString());
}

async function generateRandomPositionForMine(minX, maxX, minY, maxY) {
    const step = 100;
    const getRandomCoordinate = (min, max) => min + Math.floor(Math.random() * ((max - min) / step + 1)) * step;

    while (true) {
        const x = getRandomCoordinate(minX, maxX);
        const y = getRandomCoordinate(minY, maxY);
        const [existingMine] = await pool.query("SELECT * FROM mines WHERE x = ? AND y = ?", [x, y]);
        if (existingMine.length === 0) {
            return { x, y };
        }
    }
}

setInterval(async () => {

    const now = new Date();

    if (now.getUTCHours() === 0 && now.getUTCMinutes() === 0) {
        console.log("🕛 00:00 UTC - Running daily mine refresh...");

        // حذف معادن اکسپایر شده
        await pool.query("DELETE FROM mines");
        console.log("⛏️  Expired mines deleted");

        // ایجاد معادن جدید
        await generateMines();
        console.log("🏗️  New mines generated");
    }
}, 60000);

async function processExtractions() {
    const specialists = await pool.query("SELECT * FROM specialists");
    for (const specialist of specialists[0]) {
        const [[mine]] = await pool.query("SELECT * FROM mines WHERE id = ?", [specialist.mine_id]);
        if (!mine || mine.remaining_resources <= 0) {
            await pool.query("DELETE FROM specialists WHERE id = ?", [specialist.id]);
            continue;
        }

        const extractAmount = specialist.count;  // هر متخصص ۱ استخراج در دقیقه
        const remaining = Math.max(0, mine.remaining_resources - extractAmount);

        await pool.query("UPDATE mines SET remaining_resources = ? WHERE id = ?", [remaining, mine.id]);

        // اضافه کردن منابع به انبار بازیکن
        const [[player]] = await pool.query("SELECT * FROM users WHERE playerToken = ?", [specialist.playerToken]);
        let resourceField = "";
        switch (mine.mine_type_id) {
            case 1: resourceField = "stone"; break;
            case 2: resourceField = "stone"; break;
            case 3: resourceField = "stone"; break;
            case 4: resourceField = "wood"; break;
            case 5: resourceField = "wood"; break;
            case 6: resourceField = "wood"; break;
            case 7: resourceField = "iron"; break;
            case 8: resourceField = "iron"; break;
            case 9: resourceField = "iron"; break;
            case 10: resourceField = "wheat"; break;
            case 11: resourceField = "wheat"; break;
            case 12: resourceField = "wheat"; break;
        }
        await pool.query(`UPDATE users SET ${resourceField} = ${resourceField} + ? WHERE playerToken = ?`, [extractAmount, player.playerToken]);
    }
}

setInterval(processExtractions, 60000);

module.exports = router;
