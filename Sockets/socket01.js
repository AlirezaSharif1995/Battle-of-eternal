module.exports = function (io) {

    io.on('connection', (socket) => {
        io.emit('playerJoined');
    });

    io('message', (obj)=>{

    });
}