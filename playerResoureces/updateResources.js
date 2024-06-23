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

// Function to update player resources
function updatePlayerResources() {
  const query = 'SELECT playerToken, username, wood, stone, wheat, iron, woodLevel, stoneLevel, wheatLevel, ironLevel, ironCapacity, wheatCapacity, stoneCapacity, woodCapacity FROM users';

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

      const maxWoodCapacity = player.woodCapacity;
      const maxStoneCapacity = player.stoneCapacity;
      const maxWheatCapacity = player.wheatCapacity;
      const maxIronCapacity = player.ironCapacity;

      if (updatedWood > maxWoodCapacity) {
        updatedWood = maxWoodCapacity;
      }
      if (updatedStone > maxStoneCapacity) {
        updatedStone = maxStoneCapacity;
      }
      if (updatedWheat > maxWheatCapacity) {
        updatedWheat = maxWheatCapacity;
      }
      if (updatedIron > maxIronCapacity) {
        updatedIron = maxIronCapacity;
      }

      // Update query
      const updateQuery = 'UPDATE users SET wood = ?, stone = ?, wheat = ?, iron = ? WHERE playerToken = ?';

      connection.query(updateQuery, [updatedWood, updatedStone, updatedWheat, updatedIron, player.playerToken], updateError => {
        if (updateError) {
          console.error(`Error updating resources for ${player.username}:`, updateError);
          return;
        }
      });
    });
  });
}

module.exports = updatePlayerResources;
