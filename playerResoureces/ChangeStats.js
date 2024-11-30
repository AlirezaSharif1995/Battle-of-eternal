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

async function updatePlayerStats(playerToken, updatedValues, beforeValues) {
  
    const [stats] = await pool.execute(
        'SELECT * FROM playerstats WHERE playerToken = ?',
        [playerToken]
    );

    // Destructure the stats object from updatedValues
    const {
      civilization_points,
      build_time_reduction,
      population_consumers,
      training_time_reduction_percent,
      defense_power,
      ballon_destroy_point,
      member_limit,
      attack_limit,
      defense_power_increase_percent,
      troop_speed_boost,
      training_time_reduction,
      updating_time_reduction,
      elixir_production,
      wheat_production,
      iron_production,
      wood_production,
      stone_production,
      storage_capacity
    } = updatedValues.stats;

    // Initialize an empty object for the fields to update
    const updateFields = {};

    // Calculate differences and update fields
    if (defense_power !== undefined) {
        updateFields.defense_power = (defense_power - (beforeValues.defense_power || 0))+ stats[0].defense_power;
    }
    if (civilization_points !== undefined) {
        updateFields.civilization_points = (civilization_points - (beforeValues.civilization_points || 0)) + stats[0].civilization_points;
    }
    if (population_consumers !== undefined) {
        updateFields.population_consumers = (population_consumers - (beforeValues.population_consumers || 0))+ stats[0].population_consumers;
    }
    if (training_time_reduction !== undefined) {
        updateFields.training_time_reduction = (training_time_reduction - (beforeValues.training_time_reduction || 0))+ stats[0].training_time_reduction;
    }
    if (ballon_destroy_point !== undefined) {
        updateFields.ballon_destroy_point = (ballon_destroy_point - (beforeValues.ballon_destroy_point || 0))+ stats[0].ballon_destroy_point;
    }
    if (member_limit !== undefined) {
        updateFields.member_limit = (member_limit - (beforeValues.member_limit || 0))+ stats[0].member_limit;
    }
    if (attack_limit !== undefined) {
        updateFields.attack_limit = (attack_limit - (beforeValues.attack_limit || 0))+ stats[0].attack_limit;
    }
    if (defense_power_increase_percent !== undefined) {
        updateFields.defense_power_increase_percent = (defense_power_increase_percent - (beforeValues.defense_power_increase_percent || 0))+ stats[0].defense_power_increase_percent;
    }
    if (troop_speed_boost !== undefined) {
        updateFields.troop_speed_boost = (troop_speed_boost - (beforeValues.troop_speed_boost || 0))+ stats[0].troop_speed_boost;
    }
    if (updating_time_reduction !== undefined) {
        updateFields.updating_time_reduction = (updating_time_reduction - (beforeValues.updating_time_reduction || 0))+ stats[0].updating_time_reduction;
    }
    if (elixir_production !== undefined) {
        updateFields.elixir_production = (elixir_production - (beforeValues.elixir_production || 0))+ stats[0].elixir_production;
    }
    if (iron_production !== undefined) {
        updateFields.iron_production = (iron_production - (beforeValues.iron_production || 0))+ stats[0].iron_production;
    }
    if (wood_production !== undefined) {
        updateFields.wood_production = (wood_production - (beforeValues.wood_production || 0))+ stats[0].wood_production;
    }
    if (stone_production !== undefined) {
        updateFields.stone_production = (stone_production - (beforeValues.stone_production || 0))+ stats[0].stone_production;
    }
    if (storage_capacity !== undefined) {
        updateFields.storage_capacity = (storage_capacity - (beforeValues.storage_capacity || 0))+ stats[0].storage_capacity;
    }
    if (build_time_reduction !== undefined) {
        updateFields.build_time_reduction = (build_time_reduction - (beforeValues.build_time_reduction || 0))+ stats[0].build_time_reduction;
    }
    if (training_time_reduction_percent !== undefined) {
        updateFields.training_time_reduction_percent = (training_time_reduction_percent - (beforeValues.training_time_reduction_percent || 0))+ stats[0].training_time_reduction_percent;
    }
    if (wheat_production !== undefined) {
        updateFields.wheat_production = (wheat_production - (beforeValues.wheat_production || 0))+ stats[0].wheat_production;
    }
    
    let updateQuery = 'UPDATE playerstats SET ';
    const updateParams = [];
  
    // Dynamically build the update query and add the parameters
    Object.keys(updateFields).forEach((field, index, array) => {
      updateQuery += `${field} = ?`;
      updateParams.push(updateFields[field]);
  
      if (index < array.length - 1) {
        updateQuery += ', ';
      }
    });
  
    updateQuery += ' WHERE playerToken = ?';  // Add the condition to update by playerToken
    updateParams.push(playerToken);  // Add the playerToken as the final parameter
  
    // Execute the update query
    pool.query(updateQuery, updateParams, (error, results) => {
      if (error) {
        console.error('Error updating player stats:', error);
      } else {
        console.log('Player stats updated successfully!');
      }
    });
}

module.exports = { updatePlayerStats }