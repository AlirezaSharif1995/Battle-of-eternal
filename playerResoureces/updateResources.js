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
  const query = 'SELECT playerToken, username, wood, stone, wheat, iron, elixir, woodrate, stonerate, ironrate, wheatrate, elixirrate, capacity FROM users';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching players:', error);
      return;
    }

    results.forEach(player => {

      let updatedWood = player.wood + player.woodrate;
      let updatedStone = player.stone + player.stonerate;
      let updatedWheat = player.wheat + player.wheatrate;
      let updatedIron = player.iron + player.ironrate;
      let updatedElixir = player.elixir + player.elixirrate; // Corrected variable name

      const maxCapacity = player.capasity;

      if (updatedWood > maxCapacity) {
        updatedWood = maxCapacity;
      }
      if (updatedStone > maxCapacity) {
        updatedStone = maxCapacity;
      }
      if (updatedWheat > maxCapacity) {
        updatedWheat = maxCapacity;
      }
      if (updatedIron > maxCapacity) {
        updatedIron = maxCapacity;
      }
      if (updatedElixir > maxCapacity) {  // Corrected variable name
        updatedElixir = maxCapacity;      // Corrected variable name
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
