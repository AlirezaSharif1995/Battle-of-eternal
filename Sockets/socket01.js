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

module.exports = function (io) {

    io.on('connection', (socket) => {
        console.log('A user connected');
        io.emit('playerJoined', { message: 'A new player has joined the game!' });

        socket.on('playerLogin', async (playerId) => {

            try {
                const [player] = await pool.query('SELECT * FROM users WHERE playerToken = ?', playerId);
                const now = new Date();
                const lastUpdated = new Date(player.lastUpdated);
                const hoursPassed = Math.floor((now - lastUpdated) / (1000 * 60 * 60));

                let updatedResources = player;
                if (hoursPassed > 0) {
                    updatedResources = {
                        wood: player.wood + hoursPassed * 10,
                        wheat: player.wheat + hoursPassed * 10,
                        stone: player.stone + hoursPassed * 10,
                        iron: player.iron + hoursPassed * 10,
                    };

                    await pool.query('UPDATE users SET wood = ?, wheat = ?, stone = ?, iron = ?, lastUpdated = ? WHERE playerToken = ?',
                        [updatedResources.wood, updatedResources.wheat, updatedResources.stone, updatedResources.iron, now, playerId]);
                }
                console.log(updatedResources)
                socket.emit('update_resources', updatedResources);
            } catch (error) {
                console.error('Error updating player resources:', error);
            }
        });


        socket.on('message', (obj) => {
            console.log('Message received:', obj);

        });


        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};