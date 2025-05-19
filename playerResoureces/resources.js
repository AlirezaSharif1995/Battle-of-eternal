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
  const { playerToken, forces } = req.body;

  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await pool.query('UPDATE users SET `force` = ? WHERE playerToken = ?', [[JSON.stringify(forces)], playerToken]);
    res.status(200).json({ message: 'Force updated successfully' });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.post('/getDefence', async (req, res) => {
  const { playerToken } = req.body;
  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = {
      force: existingUser[0].defence
    }
    res.status(200).json(user);

  } catch (error) {
    console.error('Error getDefence :', error);
    res.status(500).json({ error: 'Internal server error' });

  }
});

router.post('/defenceUpdate', async (req, res) => {
  const { playerToken, defences } = req.body;
  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await pool.query('UPDATE users SET `defence` = ? WHERE playerToken = ?', [JSON.stringify(defences), playerToken]);
    res.status(200).json({ message: 'Defences updated successfully' });

  } catch (error) {
    console.error('Error defenceUpdate :', error);
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
    console.error('Error updateResourceCapacity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.post('/updateResource', async (req, res) => {
  const { playerToken, type, data } = req.body;

  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sql = `UPDATE users SET ${type} = ? WHERE playerToken = ?`;
    await pool.query(sql, [data, playerToken]);
    res.status(200).json({ message: 'Resource updated successfully' });

  } catch (error) {
    console.error('Error updateResource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.post('/getResource', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists and get all playerTokens for the email
    const [existingUsers] = await pool.query('SELECT playerToken FROM users WHERE email = ?', [email]);

    if (existingUsers.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract all playerTokens
    const playerTokens = existingUsers.map(user => user.playerToken);

    if (playerTokens.length === 0) {
      return res.status(404).json({ error: 'No player tokens found for this user' });
    }

    // Convert playerTokens to a comma-separated list for SQL IN clause
    const playerTokensStr = playerTokens.map(token => `'${token}'`).join(',');

    // Query to get the sums of civilization, population, and users for the user's cities
    const [cityData] = await pool.query(`
      SELECT
        SUM(civilization) AS totalCivilization,
        SUM(population) AS totalPopulation,
        SUM(users) AS totalUsers
      FROM users
      WHERE playerToken IN (${playerTokensStr})
    `);

    // Get the total values from the query result
    const totalCivilization = cityData[0].totalCivilization || 0;
    const totalPopulation = cityData[0].totalPopulation || 0;
    const totalUsers = cityData[0].totalUsers || 0;

    res.status(200).json({ totalCivilization, totalPopulation, totalUsers });

  } catch (error) {
    console.error('Error getResource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function sendingForce(playerToken, receiverToken, forcesToSend) {
  try {
    const [sender] = await pool.query('SELECT * FROM user_forces_json WHERE user_id = ?', [playerToken]);
    const [receiver] = await pool.query('SELECT * FROM user_forces_json WHERE user_id = ?', [receiverToken]);
    const [senderUsername] = await pool.query('SELECT username FROM users WHERE playerToken = ?', [playerToken]);
    const [receiverUsername] = await pool.query('SELECT username FROM users WHERE playerToken = ?', [receiverToken]);

    if (sender.length === 0 || receiver.length === 0) {
      console.log("Sender or receiver not found");
      return;
    }

    let senderForces = (sender[0].forces);
    let formattedForces = {};

    if (typeof forcesToSend === 'object' && !Array.isArray(forcesToSend)) {
      Object.entries(forcesToSend).forEach(([forceName, count]) => {
        formattedForces[forceName] = count;
      });
    } else {
      console.log("forcesToSend is not a valid object:", forcesToSend);
      return;
    }

    // for (let unit in formattedForces) {
    //   if (!senderForces[unit] || senderForces[unit].quantity < formattedForces[unit]) {
    //     console.log(`Not enough ${unit} to send`);
    //     return;
    //   }
    // }

    // for (let unit in formattedForces) {
    //   senderForces[unit].quantity -= formattedForces[unit];
    // }

    let forcesWithLevel = {};
    for (let unit in formattedForces) {
      forcesWithLevel[unit] = {
        level: senderForces[unit].level,
        quantity: formattedForces[unit]
      };
    }

    await pool.query(
      'INSERT INTO guest_forces (senderToken, receiverToken, forces) VALUES (?, ?, ?)',
      [senderUsername[0].username, receiverUsername[0].username, JSON.stringify(forcesWithLevel)]
    );

    // await pool.query(
    //   'UPDATE user_forces_json SET forces = ? WHERE user_id = ?',
    //   [JSON.stringify(senderForces), playerToken]
    // );

    console.log('Forces sent successfully');

  } catch (error) {
    console.error('Error sending forces:', error);
  }
}

router.post('/backForce', async (req, res) => {
  const { id } = req.body;

  try {

    const [forceEntry] = await pool.query('SELECT * FROM guest_forces WHERE id = ?', [id]);

    if (forceEntry.length === 0) {
      return res.status(404).json({ error: 'Force entry not found' });
    }

    const { senderToken, forces } = forceEntry[0];
    const [sender] = await pool.query('SELECT playerToken FROM users WHERE username = ?', [senderToken]);


    const [playerForcesData] = await pool.query('SELECT forces FROM user_forces_json WHERE user_id = ?', [sender[0].playerToken]);

    if (playerForcesData.length === 0) {
      return res.status(404).json({ error: 'Player not found in forces database' });
    }

    let playerForces = (playerForcesData[0].forces); // Convert stored JSON to object
    let forcesToReturn = (forces); // Convert stored forces to object

    // Loop through each force unit and add it back to the player’s forces
    for (let unit in forcesToReturn) {
      if (!playerForces[unit]) {
        playerForces[unit] = {
          level: forcesToReturn[unit].level,
          quantity: forcesToReturn[unit].quantity
        };
      } else {
        playerForces[unit].quantity += forcesToReturn[unit].quantity;
      }
    }

    await pool.query('UPDATE user_forces_json SET forces = ? WHERE user_id = ?', [JSON.stringify(playerForces), sender[0].playerToken]);
    await pool.query('DELETE FROM guest_forces WHERE id = ?', [id]);

    res.status(200).json({ message: 'Forces returned successfully' });

  } catch (error) {
    console.error('Error processing force return:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/TimingAction', async (req, res) => {
  let { playerToken, receiverToken, forcesToSend, type } = req.body;
  const senderToken = playerToken;

  let formattedForces = {};

  if (Array.isArray(forcesToSend)) {
    forcesToSend.forEach(force => {
      formattedForces[force.forceName] = force.count;
    });
  } else {
    formattedForces = forcesToSend; // اگر فرمت درست بود، تغییر نده
  }

  try {

    const [senderData] = await pool.query(
      'SELECT citypositionX, citypositionY FROM users WHERE playerToken = ?',
      [senderToken]
    );

    const [receiverData] = await pool.query(
      'SELECT citypositionX, citypositionY, playerToken FROM users WHERE username = ?',
      [receiverToken]
    );

    if (senderData.length === 0 || receiverData.length === 0) {
      return res.status(404).json({ error: 'One or both players not found' });
    }

    if (type != 2) {

      const [senderTime] = await pool.query(
        'SELECT registerTime FROM users WHERE playerToken = ?',
        [senderToken]
      );

      const [receiverTime] = await pool.query(
        'SELECT registerTime FROM users WHERE username = ?',
        [receiverToken]
      );

      const senderDate = new Date(senderTime[0].registerTime);
      const receiverDate = new Date(receiverTime[0].registerTime);

      const now = new Date();

      const senderDays = Math.floor((now - senderDate) / (1000 * 60 * 60 * 24));
      const receiverDays = Math.floor((now - receiverDate) / (1000 * 60 * 60 * 24));
      const LIMIT_DAYS = 120;

      if (
        (senderDays <= LIMIT_DAYS && receiverDays > LIMIT_DAYS) ||
        (senderDays > LIMIT_DAYS && receiverDays <= LIMIT_DAYS)
      ) {
        return res.status(403).json('Players above or below 120 days cannot attack each other.');
      }
    }

    const [attackCount] = await pool.query(
      'SELECT * FROM moving_forces WHERE sender_id = ?',
      [senderToken]
    );

    const [playerStats] = await pool.query(
      'SELECT attack_limit FROM playerstats WHERE playerToken = ?',
      [senderToken]
    );

    if (playerStats.length === 0) {
      return res.status(404).json({ error: 'Player stats not found!' });
    }

    const attackLimit = playerStats[0].attack_limit;

    if (attackCount.length >= attackLimit) {
      return res.status(403).json({ error: `Attack limit reached! (${attackLimit} max)` });
    }

    const senderCity = senderData[0];
    const receiverCity = receiverData[0];

    const distance = calculateDistance(
      senderCity.citypositionX, senderCity.citypositionY,
      receiverCity.citypositionX, receiverCity.citypositionY
    );

    const [playerForcesData] = await pool.query(
      'SELECT forces FROM user_forces_json WHERE user_id = ?',
      [senderToken]
    );

    if (playerForcesData.length === 0) {
      return res.status(400).json({ error: 'Sender has no forces' });
    }

    let senderForces = (playerForcesData[0].forces);

    let minSpeed = Infinity;

    for (const forceName in formattedForces) {

      if (senderForces[forceName] && senderForces[forceName].quantity >= formattedForces[forceName]) {
        const forceLevel = senderForces[forceName].level;

        const [forceDetails] = await pool.query(
          'SELECT speed FROM forces WHERE name = ? AND level = ?',
          [forceName, forceLevel]
        );

        if (forceDetails.length > 0) {
          const forceSpeed = forceDetails[0].speed * 10;
          minSpeed = Math.min(minSpeed, forceSpeed);
          senderForces[forceName].quantity -= formattedForces[forceName];
        } else {
          return res.status(400).json({ error: `Force data not found for ${forceName}` });
        }
      } else {
        return res.status(400).json({ error: `Insufficient quantity for ${forceName}` });
      }
    }

    if (minSpeed === Infinity) {
      return res.status(400).json({ error: 'No valid forces found to send' });
    }

    const estimatedTime = distance / minSpeed;

    await pool.query(
      'UPDATE user_forces_json SET forces = ? WHERE user_id = ?',
      [JSON.stringify(senderForces), senderToken]
    );

    await pool.query(
      'INSERT INTO moving_forces (sender_id, receiver_id, forces, type, arrival_time) VALUES (?, ?, ?, ?, ADDTIME(NOW(), SEC_TO_TIME(?)))',
      [senderToken, receiverData[0].playerToken, JSON.stringify(formattedForces), type, estimatedTime * 3600]
    );

    res.status(200).json({ distance, minSpeed, estimatedTime });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/returnSendingForce', async (req, res) => {
  const { id } = req.body;

  try {
    // دریافت نیروهای در حال حرکت و پیدا کردن فرستنده
    const [movingForceData] = await pool.query(
      'SELECT sender_id, forces FROM moving_forces WHERE id = ?',
      [id]
    );

    if (movingForceData.length === 0) {
      return res.status(400).json({ error: 'No valid forces found to return' });
    }

    const senderId = movingForceData[0].sender_id;
    const returnedForces = (movingForceData[0].forces); // تبدیل به آبجکت

    // دریافت لیست نیروهای فعلی فرستنده
    const [playerForcesData] = await pool.query(
      'SELECT forces FROM user_forces_json WHERE user_id = ?',
      [senderId]
    );

    if (playerForcesData.length === 0) {
      return res.status(400).json({ error: 'Sender not found' });
    }

    let senderForces = (playerForcesData[0].forces); // تبدیل به آبجکت

    // اضافه کردن نیروهای برگشتی به نیروهای موجود
    for (const forceName in returnedForces) {
      if (senderForces[forceName]) {
        senderForces[forceName].quantity += returnedForces[forceName]; // اضافه کردن تعداد برگشتی
      } else {
        senderForces[forceName] = { level: 1, quantity: returnedForces[forceName] }; // ایجاد مقدار جدید در صورت نبودن
      }
    }

    // بروزرسانی موجودی نیروهای فرستنده
    await pool.query(
      'UPDATE user_forces_json SET forces = ? WHERE user_id = ?',
      [JSON.stringify(senderForces), senderId]
    );

    // حذف نیرو از `moving_forces`
    await pool.query(
      'DELETE FROM moving_forces WHERE id = ?',
      [id]
    );

    res.status(200).json({ message: 'Force returned successfully!!', updatedForces: senderForces });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/warsHistory', async (req, res) => {
  const { playerToken } = req.body;

  if (!playerToken) {
    return res.status(400).json({ error: 'playerToken is required' });
  }

  try {
    // 1. دریافت همه جنگ‌های مربوط به بازیکن
    const [wars] = await pool.query(
      `SELECT 
        id,
        attackerPlayerToken,
        defenderPlayerToken,
        mode,
        warStatus,
        result,
        defenderForce,
        attackerForce,
        createdAt
      FROM wars
      WHERE attackerPlayerToken = ? OR defenderPlayerToken = ?
      ORDER BY createdAt DESC`,
      [playerToken, playerToken]
    );

    if (!wars.length) {
      return res.status(404).json({ message: 'No wars found for this player.' });
    }

    // 2. استخراج همه توکن‌ها
    const allTokens = new Set();
    wars.forEach(war => {
      allTokens.add(war.attackerPlayerToken);
      allTokens.add(war.defenderPlayerToken);
    });

    const tokenList = Array.from(allTokens);

    // 3. گرفتن username و avatarCode برای هر بازیکن فقط یک بار
    const [users] = await pool.query(
      'SELECT playerToken, username, avatarCode FROM users WHERE playerToken IN (?)',
      [tokenList]
    );

    // 4. ساخت Map برای lookup سریع
    const userMap = {};
    for (const user of users) {
      userMap[user.playerToken] = {
        username: user.username,
        avatarCode: user.avatarCode
      };
    }

    // 5. ساخت خروجی history
    const history = wars.map(war => {
      const result = typeof war.result === 'string' ? JSON.parse(war.result) : war.result;
      const attackerForce = typeof war.attackerForce === 'string' ? JSON.parse(war.attackerForce) : war.attackerForce;
      const defenderForce = typeof war.defenderForce === 'string' ? JSON.parse(war.defenderForce) : war.defenderForce;

      const isAttacker = war.attackerPlayerToken === playerToken;
      const enemyToken = isAttacker ? war.defenderPlayerToken : war.attackerPlayerToken;

      const didWin = (result?.winner === (isAttacker ? 'attacker' : 'defender'));

      return {
        id: war.id,
        mode: war.mode,
        status: war.warStatus,
        result: didWin ? 'win' : 'lose',
        raidSummary: result?.raid || null,
        attackerCasualties: result?.attackerCasualties || {},
        defenderCasualties: result?.defenderCasualties || {},
        attackerForce: attackerForce || {},
        defenderForce: defenderForce || {},
        createdAt: war.createdAt,

        attacker: {
          token: war.attackerPlayerToken,
          username: userMap[war.attackerPlayerToken]?.username || 'Unknown',
          avatarCode: userMap[war.attackerPlayerToken]?.avatarCode || 'default'
        },
        defender: {
          token: war.defenderPlayerToken,
          username: userMap[war.defenderPlayerToken]?.username || 'Unknown',
          avatarCode: userMap[war.defenderPlayerToken]?.avatarCode || 'default'
        },

        enemyToken,
        enemyUsername: userMap[enemyToken]?.username || 'Unknown',
        enemyAvatar: userMap[enemyToken]?.avatarCode || 'default'
      };
    });

    return res.json({ history });

  } catch (err) {
    console.error('[ERROR] Failed to fetch war history:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const checkArrivedForces = async () => {
  if (checkArrivedForces.isRunning) return;
  checkArrivedForces.isRunning = true;

  try {
    const [forces] = await pool.query(
      'SELECT * FROM moving_forces WHERE arrival_time <= NOW()'
    );

    for (const force of forces) {
      const { sender_id, receiver_id, forces: rawForces, type } = force;
      const parsedForces = typeof rawForces === 'string' ? JSON.parse(rawForces) : rawForces;

      if (type === 0) {
        await handleBattleStart(sender_id, receiver_id, parsedForces);
      } else if (type === 2) {
        await sendingForce(sender_id, receiver_id, parsedForces);
      } else {
        console.warn(`[WARN] Unknown type "${type}" for moving force with id: ${force.id}`);
      }
    }

    const [result] = await pool.query(
      'DELETE FROM moving_forces WHERE arrival_time <= NOW()'
    );

    if (result.affectedRows > 0) {
      console.log(`[DEBUG] Removed ${result.affectedRows} arrived forces at ${new Date().toISOString()}`);
    }

  } catch (error) {
    console.error("[ERROR] Failed to check moving forces:", error);
  } finally {
    checkArrivedForces.isRunning = false;
  }
};

const handleBattleStart = async (attackerToken, defenderToken, attackerForces) => {
  try {
    const attackerStats = await calculateAttackerStats(attackerToken, attackerForces);
    const defenderStats = await calculateDefenderStats(defenderToken);
    const attackerFirst = JSON.parse(JSON.stringify(attackerStats));
    console.log(attackerFirst.detailed)

    console.log(`[COMPARE] ATTACK: ${attackerStats.totalAttackPower} vs DEFENSE: ${defenderStats.totalDefensePower}`);

    const attackerPower = attackerStats.totalAttackPower;
    const defenderPower = defenderStats.totalDefensePower;

    let winner = attackerPower > defenderPower ? 'attacker' : 'defender';

    const battleOutcome = applyBattleCasualties(winner, attackerStats, defenderStats);


    let raid = null;

    if (winner === 'attacker') {
      const survivingUnits = attackerStats.detailed.filter(unit => (unit.quantitySent ?? unit.quantity) > 0);
      const raidCapacity = await calculateRaidCapacity(survivingUnits);

      const [[attacker]] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [attackerToken]);
      const [[defender]] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [defenderToken]);
      const [[attackerStatsRow]] = await pool.query('SELECT storage_capacity FROM playerstats WHERE playerToken = ?', [attackerToken]);

      const attackerStorageCap = attackerStatsRow?.storage_capacity ?? Infinity;

      raid = distributeRaid(defender, attacker, raidCapacity, attackerStorageCap);

      for (const res in raid) {
        const amount = raid[res];
        const defenderBefore = Number(defender[res]) || 0;
        const attackerBefore = Number(attacker[res]) || 0;

        defender[res] = Math.max(0, defenderBefore - amount);
        attacker[res] = attackerBefore + amount;
      }

      await pool.query(
        'UPDATE users SET wood = ?, stone = ?, iron = ?, wheat = ?, elixir = ? WHERE playerToken = ?',
        [defender.wood, defender.stone, defender.iron, defender.wheat, defender.elixir, defenderToken]
      );

      await pool.query(
        'UPDATE users SET wood = ?, stone = ?, iron = ?, wheat = ?, elixir = ? WHERE playerToken = ?',
        [attacker.wood, attacker.stone, attacker.iron, attacker.wheat, attacker.elixir, attackerToken]
      );
      console.log('[RAID] Attacker looted:', raid);

    }

    const [[userRow]] = await pool.query('SELECT username FROM users WHERE playerToken = ?', [defenderToken]);
    const defenderUsername = userRow?.username;

    await updateUserForces(attackerToken, battleOutcome.attackerStats.detailed, true);
    await updateUserForces(defenderToken, battleOutcome.defenderStats.detailed, false);

    const guestCasualties = battleOutcome.defenderStats.detailed.filter(u => u.source === 'guest');
    await updateGuestForces(defenderUsername, guestCasualties);

    // Prepare war result for saving
    const warResult = {
      winner: battleOutcome.winner,
      attackerCasualties: battleOutcome.attackerCasualties,
      defenderCasualties: battleOutcome.defenderCasualties,
      raid: raid || null
    };
    console.log(attackerFirst.detailed)
    // Insert into wars table
    await pool.query(
      `INSERT INTO wars 
      (attackerPlayerToken, defenderPlayerToken, attackerForce, defenderForce, attackerMachine, mode, travelTime, scheduledStartTime, warStatus, result) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        attackerToken,
        defenderToken,
        JSON.stringify(attackerFirst.detailed),  // نیروهای حمله کننده
        JSON.stringify(defenderStats.detailed),  // نیروهای مدافع
        null,                                    // attackerMachine
        'battle',                                // mode
        0,                                       // travelTime
        new Date(),                              // scheduledStartTime
        'finished',                              // warStatus
        JSON.stringify(warResult)                // result
      ]
    );

  } catch (err) {
    console.error('[ERROR] handleBattleStart failed:', err);
  }
};

const calculateDefenderStats = async (defenderToken) => {
  const EXCLUDED_UNITS = ['Spy', 'King', 'Heavy Catapult', 'Battering ram', 'Specialist', 'Balloon'];

  try {
    // گرفتن username
    const [[userRow]] = await pool.query(
      'SELECT username FROM users WHERE playerToken = ?',
      [defenderToken]
    );

    if (!userRow) {
      console.warn(`[WARN] Username not found for defenderToken ${defenderToken}`);
      return { totalDefensePower: 0, totalHP: 0, detailed: [] };
    }

    const defenderUsername = userRow.username;

    // گرفتن نیروهای خودش
    const [[userForcesRow]] = await pool.query(
      'SELECT forces FROM user_forces_json WHERE user_id = ?',
      [defenderToken]
    );

    if (!userForcesRow || !userForcesRow.forces) {
      console.warn(`[WARN] No forces found for defender ${defenderToken}`);
      return { totalDefensePower: 0, totalHP: 0, detailed: [] };
    }

    const fullForces = typeof userForcesRow.forces === 'string'
      ? JSON.parse(userForcesRow.forces)
      : userForcesRow.forces;

    let totalDefensePower = 0;
    let totalHP = 0;
    let detailed = [];

    // محاسبه نیروهای خود بازیکن
    for (const forceName in fullForces) {
      const { level, quantity } = fullForces[forceName];
      if (quantity <= 0 || EXCLUDED_UNITS.includes(forceName)) continue;

      const [[forceData]] = await pool.query(
        'SELECT defense_power, hp FROM forces WHERE name = ? AND level = ?',
        [forceName, level]
      );
      if (!forceData) continue;

      const { defense_power, hp } = forceData;
      const totalForceDefense = defense_power * quantity;
      const totalForceHP = hp * quantity;

      totalDefensePower += totalForceDefense;
      totalHP += totalForceHP;

      detailed.push({
        name: forceName,
        level,
        quantity,
        defense_power,
        totalForceDefense,
        hp,
        totalForceHP,
        source: 'self'
      });
    }

    // گرفتن نیروهای کمکی (guest_forces) با username
    const [guestRows] = await pool.query(
      'SELECT forces FROM guest_forces WHERE receiverToken = ?',
      [defenderUsername]
    );

    for (const row of guestRows) {
      const guestForces = typeof row.forces === 'string' ? JSON.parse(row.forces) : row.forces;

      for (const forceName in guestForces) {
        const { level, quantity } = guestForces[forceName];
        if (quantity <= 0 || EXCLUDED_UNITS.includes(forceName)) continue;

        const [[forceData]] = await pool.query(
          'SELECT defense_power, hp FROM forces WHERE name = ? AND level = ?',
          [forceName, level]
        );
        if (!forceData) continue;

        const { defense_power, hp } = forceData;
        const totalForceDefense = defense_power * quantity;
        const totalForceHP = hp * quantity;

        totalDefensePower += totalForceDefense;
        totalHP += totalForceHP;

        detailed.push({
          name: forceName,
          level,
          quantity,
          defense_power,
          totalForceDefense,
          hp,
          totalForceHP,
          source: 'guest'
        });
      }
    }

    // لاگ نهایی
    console.log(`[DEBUG] Defender Forces Breakdown (Defense + HP):`);
    console.table(detailed);
    console.log(`[DEBUG] Total Defense Power: ${totalDefensePower}`);
    console.log(`[DEBUG] Total HP: ${totalHP}`);

    return { totalDefensePower, totalHP, detailed };

  } catch (error) {
    console.error('[ERROR] Failed to calculate defender stats:', error);
    return { totalDefensePower: 0, totalHP: 0, detailed: [] };
  }
};

const calculateAttackerStats = async (attackerToken, attackerForces) => {
  const EXCLUDED_UNITS = ['Spy', 'King', 'Heavy Catapult', 'Battering ram', 'Specialist', 'Balloon'];

  try {
    const [[userForcesRow]] = await pool.query(
      'SELECT forces FROM user_forces_json WHERE user_id = ?',
      [attackerToken]
    );

    if (!userForcesRow || !userForcesRow.forces) {
      console.warn(`[WARN] No forces found for attacker ${attackerToken}`);
      return { totalAttackPower: 0, totalHP: 0, detailed: [] };
    }

    const fullForces = typeof userForcesRow.forces === 'string'
      ? JSON.parse(userForcesRow.forces)
      : userForcesRow.forces;

    let totalAttackPower = 0;
    let totalHP = 0;
    let detailed = [];

    for (const forceName in attackerForces) {
      const quantitySent = attackerForces[forceName];
      const unitInfo = fullForces[forceName];

      if (!unitInfo || quantitySent <= 0) continue;
      if (EXCLUDED_UNITS.includes(forceName)) continue;

      const level = unitInfo.level;

      const [[forceData]] = await pool.query(
        'SELECT attack_power, hp FROM forces WHERE name = ? AND level = ?',
        [forceName, level]
      );

      if (!forceData) continue;

      const { attack_power, hp } = forceData;

      const totalForceAttack = attack_power * quantitySent;
      const totalForceHP = hp * quantitySent;

      totalAttackPower += totalForceAttack;
      totalHP += totalForceHP;

      detailed.push({
        name: forceName,
        level,
        quantitySent,
        attack_power,
        totalForceAttack,
        hp,
        totalForceHP
      });
    }

    console.log(`[DEBUG] Attacker Forces Breakdown (Attack + HP):`);
    console.table(detailed);
    console.log(`[DEBUG] Total Attack Power: ${totalAttackPower}`);
    console.log(`[DEBUG] Total HP: ${totalHP}`);

    return { totalAttackPower, totalHP, detailed };

  } catch (error) {
    console.error('[ERROR] Failed to calculate attacker stats:', error);
    return { totalAttackPower: 0, totalHP: 0, detailed: [] };
  }
};

const applyBattleCasualties = (winner, attackerStats, defenderStats) => {
  const attackerCasualties = {};
  const defenderCasualties = {};

  const attackerPower = attackerStats.totalAttackPower;
  const defenderPower = defenderStats.totalDefensePower;

  if (winner === 'attacker') {
    // مهاجم می‌بره → مدافع کاملاً نابود می‌شه
    defenderStats.detailed.forEach(unit => {
      defenderCasualties[unit.name] = unit.quantity;
      unit.quantity = 0;
    });

    // مهاجم تلفات نسبی می‌ده
    const totalAttack = attackerStats.detailed.reduce((sum, u) => sum + u.totalForceAttack, 0);
    attackerStats.detailed.forEach(unit => {
      const ratio = unit.totalForceAttack / totalAttack;
      const damage = defenderPower * ratio;
      const killed = Math.min(unit.quantitySent, Math.round(damage / unit.attack_power));
      attackerCasualties[unit.name] = killed;
      unit.quantitySent -= killed;
    });

  } else {
    // مدافع می‌بره → فقط نیروهای ارسال‌شده مهاجم باید بمیرن
    attackerStats.detailed.forEach(unit => {
      attackerCasualties[unit.name] = unit.quantitySent;
      unit.quantitySent = 0;
    });

    // مدافع تلفات نسبی می‌ده
    const totalDefense = defenderStats.detailed.reduce((sum, u) => sum + u.totalForceDefense, 0);
    defenderStats.detailed.forEach(unit => {
      const ratio = unit.totalForceDefense / totalDefense;
      const damage = attackerPower * ratio;
      const killed = Math.min(unit.quantity, Math.round(damage / unit.defense_power));
      defenderCasualties[unit.name] = killed;
      unit.quantity -= killed;
    });
  }

  return {
    attackerStats,
    defenderStats,
    attackerCasualties,
    defenderCasualties,
    winner
  };
};

const updateUserForces = async (playerToken, updatedForcesArray, isAttacker = false) => {
  try {
    const [[userForceRow]] = await pool.query(
      'SELECT forces FROM user_forces_json WHERE user_id = ?',
      [playerToken]
    );

    if (!userForceRow || !userForceRow.forces) {
      console.warn(`[WARN] No force record found for user ${playerToken}`);
      return;
    }

    let forcesObj = typeof userForceRow.forces === 'string'
      ? JSON.parse(userForceRow.forces)
      : userForceRow.forces;

    for (const unit of updatedForcesArray) {
      if (!forcesObj[unit.name]) continue;

      if (isAttacker) {
        // مهاجم: فقط از تعداد ارسال‌شده کم کن
        const quantitySent = unit.initialQuantitySent ?? unit.quantitySent;
        if (quantitySent !== undefined) {
          forcesObj[unit.name].quantity -= quantitySent;
          forcesObj[unit.name].quantity = Math.max(0, forcesObj[unit.name].quantity);
        }
      } else {
        // مدافع: مقدار نهایی رو جایگزین کن (چون در شهر بودن)
        forcesObj[unit.name].quantity = unit.quantity;
      }
    }

    await pool.query(
      'UPDATE user_forces_json SET forces = ? WHERE user_id = ?',
      [JSON.stringify(forcesObj), playerToken]
    );

    console.log(`[UPDATE] Forces updated for user ${playerToken}`);

  } catch (error) {
    console.error('[ERROR] Failed to update user forces:', error);
  }
};

const updateGuestForces = async (defenderUsername, damagedGuestUnits) => {
  try {
    if (!damagedGuestUnits || damagedGuestUnits.length === 0) return;

    // 1. گرفتن همه نیروهای کمکی برای این مدافع
    const [guestRows] = await pool.query(
      'SELECT id, senderToken, forces FROM guest_forces WHERE receiverToken = ?',
      [defenderUsername]
    );

    for (const row of guestRows) {
      let forcesObj = typeof row.forces === 'string' ? JSON.parse(row.forces) : row.forces;

      let updated = false;

      for (const damaged of damagedGuestUnits) {
        const guestUnit = forcesObj[damaged.name];
        if (guestUnit && guestUnit.level === damaged.level) {
          guestUnit.quantity = Math.max(0, guestUnit.quantity - damaged.quantity);
          updated = true;
        }
      }

      if (!updated) continue;

      // حذف نیروهایی که کاملاً صفر شدن
      for (const name in forcesObj) {
        if (forcesObj[name].quantity <= 0) {
          delete forcesObj[name];
        }
      }

      if (Object.keys(forcesObj).length === 0) {
        // همه نیروها صفر شدن → حذف کل ردیف
        await pool.query(
          'DELETE FROM guest_forces WHERE id = ?',
          [row.id]
        );
        console.log(`[DELETE] All guest forces wiped for sender ${row.senderToken}, row deleted.`);
      } else {
        // بروزرسانی با نیروهای باقی‌مانده
        await pool.query(
          'UPDATE guest_forces SET forces = ? WHERE id = ?',
          [JSON.stringify(forcesObj), row.id]
        );
        console.log(`[UPDATE] Guest forces updated for sender ${row.senderToken}`);
      }
    }

  } catch (error) {
    console.error('[ERROR] Failed to update guest forces:', error);
  }
};

const calculateRaidCapacity = async (survivingUnits) => {
  let total = 0;
  for (const unit of survivingUnits) {
    const [[row]] = await pool.query(
      'SELECT raid_capacity FROM forces WHERE name = ? AND level = ?',
      [unit.name, unit.level]
    );

    if (row) {
      total += (row.raid_capacity || 0) * (unit.quantitySent ?? unit.quantity);
    }
  }
  return total;
};

const distributeRaid = (defender, attacker, totalCapacity, attackerStorageCap) => {
  const resources = ['wood', 'stone', 'iron', 'wheat', 'elixir'];
  const loot = {};
  const perResource = Math.floor(totalCapacity / resources.length);

  for (const res of resources) {
    const defenderAmount = Number(defender[res]) || 0;
    const attackerAmount = Number(attacker[res]) || 0;

    const maxLoot = Math.min(
      defenderAmount,
      attackerStorageCap - attackerAmount,
      perResource
    );

    loot[res] = Math.max(0, maxLoot);
  }

  // توزیع باقیمانده ظرفیت غارت
  let used = Object.values(loot).reduce((a, b) => a + b, 0);
  let remaining = totalCapacity - used;

  for (const res of resources) {
    if (remaining <= 0) break;

    const extra = Math.min(
      (Number(defender[res]) || 0) - loot[res],
      attackerStorageCap - (Number(attacker[res]) || 0) - loot[res]
    );

    const added = Math.min(remaining, extra);
    loot[res] += added;
    remaining -= added;
  }

  return loot;
};

setInterval(checkArrivedForces, 10000);