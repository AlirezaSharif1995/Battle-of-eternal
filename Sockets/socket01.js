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
    const connectedUsers = {};

    io.on('connection', (socket) => {
        console.log(`joined the chat`);
        // connectedUsers[id] = socket.id;
        // socket.broadcast.emit(`userJoined ${id} joined the chat`);

        socket.on('privateMessage', async (sender, clan, content) => {
            try {
                const time = new Date();
                const timer = `h: ${time.getHours()}  m: ${time.getMinutes()}  D:${time.getDate()}  M:${time.getMonth() + 1}  Y:${time.getFullYear()}`;
                console.log(content)
                await pool.query('INSERT INTO messages (sender, clan, contentRT, timeRT) VALUES (?, ?, ?, ?)', [sender, clan, content, timer]);

                console.log(`${sender} to ${clan} : ${content}`);

                io.emit('privateMessage', `${sender} , ${clan} , ${content} ,${timer} `);

            } catch (error) {
                console.error('Error sending private message:', error);
            }
        });

        socket.on('disconnect', () => {
            const userId = Object.keys(connectedUsers).find(key => connectedUsers[key] === socket.id);
            if (userId) {
                delete connectedUsers[userId];
                console.log(`${userId} went offline`);
                socket.broadcast.emit(`userDisconnected ${userId} left the chat`);
            }
        });
    });
};