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
  const query = 'SELECT playerToken, username, wood, stone, wheat, iron, elixir, woodLevel, elixirLevel, stoneLevel, wheatLevel, ironLevel, ironCapacity, wheatCapacity, stoneCapacity, woodCapacity, elixirCapacity FROM users';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching players:', error);
      return;
    }

    results.forEach(player => {

      let updatedWood = player.wood + player.woodLevel;
      let updatedStone = player.stone + player.stoneLevel;
      let updatedWheat = player.wheat + player.wheatLevel;
      let updatedIron = player.iron + player.ironLevel;
      let updatedElixir = player.elixir + player.elixirLevel; // Corrected variable name

      const maxWoodCapacity = player.woodCapacity;
      const maxStoneCapacity = player.stoneCapacity;
      const maxWheatCapacity = player.wheatCapacity;
      const maxIronCapacity = player.ironCapacity;
      const maxElixirCapacity = player.elixirCapacity;

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
      if (updatedElixir > maxElixirCapacity) {  // Corrected variable name
        updatedElixir = maxElixirCapacity;      // Corrected variable name
      }

      // Update query
      const updateQuery = 'UPDATE users SET wood = ?, stone = ?, wheat = ?, iron = ?, elixir = ? WHERE playerToken = ?';

      connection.query(updateQuery, [updatedWood, updatedStone, updatedWheat, updatedIron, updatedElixir, player.playerToken], updateError => {
        if (updateError) {
          console.error(`Error updating resources for ${player.username}:`, updateError);
          return;
        }
      });
    });
  });
}


module.exports = updatePlayerResources;
