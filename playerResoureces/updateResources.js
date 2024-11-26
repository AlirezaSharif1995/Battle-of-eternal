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
  const query = 'SELECT playerToken, username, wood, stone, wheat, iron, elixir, woodrate, stonerate, ironrate, wheatrate, elixirrate, capacity FROM users';

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching players:', error);
      return;
    }

    results.forEach(player => {
      let updatedWood = player.wood + player.woodrate;
      let updatedStone = player.stone + player.stonerate;
      let updatedWheat = player.wheat + player.wheatrate;
      let updatedIron = player.iron + player.ironrate;
      let updatedElixir = player.elixir + player.elixirrate;

      const maxCapacity = player.capacity;

      updatedWood = Math.min(updatedWood, maxCapacity);
      updatedStone = Math.min(updatedStone, maxCapacity);
      updatedWheat = Math.min(updatedWheat, maxCapacity);
      updatedIron = Math.min(updatedIron, maxCapacity);
      updatedElixir = Math.min(updatedElixir, maxCapacity);

      const updateQuery = 'UPDATE users SET wood = ?, stone = ?, wheat = ?, iron = ?, elixir = ? WHERE playerToken = ?';

      pool.query(updateQuery, [updatedWood, updatedStone, updatedWheat, updatedIron, updatedElixir, player.playerToken], updateError => {
        if (updateError) {
          console.error(`Error updating resources for ${player.username}:`, updateError);
        }
      });
    });
  });
}

module.exports = updatePlayerResources;
