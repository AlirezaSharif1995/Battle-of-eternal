const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Alireza1995!',
  database: 'battle-of-eternals',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function updatePlayerResources() {
  const query = `
    SELECT 
      users.playerToken, 
      users.username, 
      users.wood, 
      users.stone, 
      users.wheat, 
      users.iron, 
      users.elixir, 
      playerStats.wood_production, 
      playerStats.stone_production, 
      playerStats.iron_production, 
      playerStats.wheat_production, 
      playerStats.elixir_production, 
      playerStats.storage_capacity
    FROM users
    JOIN playerStats ON users.playerToken = playerStats.playerToken
  `;

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching players and stats:', error);
      return;
    }

    results.forEach(player => {
      // Calculate updated resources
      let updatedWood = player.wood + player.wood_production;
      let updatedStone = player.stone + player.stone_production;
      let updatedWheat = player.wheat + player.wheat_production;
      let updatedIron = player.iron + player.iron_production;
      let updatedElixir = player.elixir + player.elixir_production;

      // Apply capacity limits
      const maxCapacity = player.storage_capacity;
      updatedWood = Math.min(updatedWood, maxCapacity);
      updatedStone = Math.min(updatedStone, maxCapacity);
      updatedWheat = Math.min(updatedWheat, maxCapacity);
      updatedIron = Math.min(updatedIron, maxCapacity);
      updatedElixir = Math.min(updatedElixir, maxCapacity);


      // Update resources in the database
      const updateQuery = `
        UPDATE users 
        SET wood = ?, stone = ?, wheat = ?, iron = ?, elixir = ? 
        WHERE playerToken = ?
      `;

      pool.query(updateQuery, [updatedWood, updatedStone, updatedWheat, updatedIron, updatedElixir, player.playerToken], updateError => {
        if (updateError) {
          console.error(`Error updating resources for ${player.username}:`, updateError);
        }
      });
    });
  });
}


module.exports = updatePlayerResources;
