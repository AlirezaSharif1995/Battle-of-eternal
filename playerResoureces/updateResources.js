const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Alireza1995!',
    database: 'battle-of-eternals',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// updateResources.js
function updatePlayerResources() {
  const query = 'SELECT playerToken, username, wood, stone, wheat, iron, ironLevel, woodLevel, stoneLevel, wheatLevel FROM users';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching players:', error);
      return;
    }

    results.forEach(player => {
      const updatedWood = player.wood + player.woodLevel;
      const updatedStone = player.stone + player.stoneLevel;
      const updatedWheat = player.wheat + player.wheatLevel;
      const updatedIron = player.iron + player.ironLevel;
      const updateQuery = 'UPDATE players SET wood = ?, stone = ?, wheat = ?, iron = ? WHERE id = ?';

      connection.query(updateQuery, [updatedWood, updatedStone, updatedWheat, updatedIron, player.id], updateError => {
        if (updateError) {
          console.error(`Error updating resources for ${player.name}:`, updateError);
          return;
        }

        console.log(`Updated ${player.name}'s resources to wood: ${updatedWood}, stone: ${updatedStone}, wheat: ${updatedWheat}, iron: ${updatedIron}`);
      });
    });
  });
}

module.exports = updatePlayerResources;