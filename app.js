const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');
const socket01 = require('./Sockets/socket01');

const { registrationRouter, loginRouter, forgetPassword, playerInfo } = require('./authentication');
const { building, playerResources, reportHandler, prize } = require('./playerResoureces');
const { createAlliance, allianceManager } = require('./Alliance');
const { wheatManager } = require('./blockchainManager');
const { warManager } = require('./wars');
const transition = require('./blockchainManager/transition');
const updatePlayerResources = require('./playerResoureces/updateResources');


const app = express();
app.use(express.json());

app.use('/register', registrationRouter);
app.use('/login', loginRouter);
app.use('/forgetPassword', forgetPassword);
app.use('/building', building);
app.use('/updateResources', playerResources);
app.use('/createAlliance', createAlliance);
app.use('/allianceManager', allianceManager);
app.use('/playerInfo', playerInfo);
app.use('/report', reportHandler);
app.use('/blockchainManager/wheatManager', wheatManager);
//app.use('/transition', transition);
app.use('/warManager', warManager);
app.use('/prize', prize);


app.use(express.static(path.join(__dirname, 'Build')));
app.get('/playGame', (req, res) => {
  res.sendFile(path.join(__dirname, 'Build', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'config2')));
app.get('/config2', (req, res) => {
  res.sendFile(path.join(__dirname, 'config2', 'index.html'));
});

const INTERVAL_TIME = 60 * 1000;
updatePlayerResources();
setInterval(updatePlayerResources, INTERVAL_TIME);

const server = http.createServer(app);
const io = socketIo(server);
socket01(io);

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
