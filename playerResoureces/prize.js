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
            console.warn(`[WARN] Invalid request data: playerToken=${playerToken}, mineId=${mineId}, count=${count}`);
            return res.status(400).json({ success: false, message: "Invalid input data!" });
        }

        // Check if the mine exists and has resources
        const [[mine]] = await pool.query("SELECT remaining_resources FROM mines WHERE id = ?", [mineId]);
        if (!mine) {
            console.warn(`[WARN] Mine ID ${mineId} not found!`);
            return res.status(404).json({ success: false, message: "Mine not found!" });
        }
        if (mine.remaining_resources <= 0) {
            console.warn(`[WARN] Mine ID ${mineId} has no resources left!`);
            return res.status(400).json({ success: false, message: "Mine has no resources left!" });
        }

        // Check if the player already has specialists in 3 different mines
        const [[playerMines]] = await pool.query(
            "SELECT COUNT(DISTINCT mine_id) AS mineCount FROM specialists WHERE playerToken = ?",
            [playerToken]
        );
        if (playerMines.mineCount >= 3) {
            console.warn(`[WARN] Player ${playerToken} already assigned specialists to 3 mines!`);
            return res.status(400).json({ success: false, message: "You cannot send specialists to more than 3 mines!" });
        }

        // Check if the player already has specialists in this mine
        const [[existingSpecialist]] = await pool.query(
            "SELECT count FROM specialists WHERE playerToken = ? AND mine_id = ?",
            [playerToken, mineId]
        );

        if (existingSpecialist) {
            // Update the count if specialists already exist in this mine
            const newCount = existingSpecialist.count + count;
            if (newCount > 100) {
                console.warn(`[WARN] Player ${playerToken} exceeded the limit of 100 specialists in mine ${mineId}!`);
                return res.status(400).json({ success: false, message: "A maximum of 100 specialists can be sent to each mine!" });
            }

            await pool.query("UPDATE specialists SET count = ? WHERE playerToken = ? AND mine_id = ?", 
                [newCount, playerToken, mineId]);
            console.log(`[INFO] Updated specialists in mine ${mineId} for player ${playerToken}. New count: ${newCount}`);
        } else {
            // Insert new specialist entry
            await pool.query("INSERT INTO specialists (playerToken, mine_id, count) VALUES (?, ?, ?)", 
                [playerToken, mineId, count]);
            console.log(`[INFO] Player ${playerToken} sent ${count} specialists to mine ${mineId}`);
        }

        return res.status(200).json({ success: true, message: "Specialists sent successfully!" });
    } catch (error) {
        console.error(`[ERROR] sendSpecialist API failed:`, error);
        return res.status(500).json({ success: false, message: "Internal server error!" });
    }
});

async function generateMines() {
    const levels = [{ level: 1, count: 200 }, { level: 2, count: 100 }, { level: 3, count: 50 }];
    for (const resource of ["stone", "wood", "iron", "wheat"]) {
        for (const { level, count } of levels) {
            const [[mineType]] = await pool.query("SELECT id, capacity FROM mine_types WHERE name = ? AND level = ?", [resource, level]);
            if (!mineType) continue;

            for (let i = 0; i < count; i++) {
                const { x, y } = await generateRandomPositionForMine();
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 10);

                await pool.query("INSERT INTO mines (mine_type_id, x, y, remaining_resources, expires_at) VALUES (?, ?, ?, ?, ?)",
                    [mineType.id, x, y, mineType.capacity, expiresAt]);
            }
        }
    }
}

async function generateRandomPositionForMine() {
    const start = 100, end = 10000, step = 100;
    const getRandomCoordinate = () => start + Math.floor(Math.random() * ((end - start) / step + 1)) * step;

    while (true) {
        const x = getRandomCoordinate();
        const y = getRandomCoordinate();
        const [existingMine] = await pool.query("SELECT * FROM mines WHERE x = ? AND y = ?", [x, y]);
        if (existingMine.length === 0) {
            return { x, y };
        }
    }
}

setInterval(async () => {
    const now = new Date();
    if (now.getUTCHours() === 0 && now.getUTCMinutes() === 0) {
        await generateMines();
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
            case 2: resourceField = "wood"; break;
            case 3: resourceField = "iron"; break;
            case 4: resourceField = "wheat"; break;
        }
        await pool.query(`UPDATE users SET ${resourceField} = ${resourceField} + ? WHERE playerToken = ?`, [extractAmount, player.playerToken]);
    }
}

setInterval(processExtractions, 60000);


module.exports = router;
