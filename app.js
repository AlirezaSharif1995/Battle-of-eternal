const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');
const socket01 = require('./Sockets/socket01');

const { registrationRouter, loginRouter, forgetPassword, playerInfo } = require('./authentication');
const { building, playerResources, reportHandler } = require('./playerResoureces');
const { createAlliance, allianceManager } = require('./Alliance');
const { wheatManager } = require('./blockchainManager');
const { warManager } = require('./wars');
const transition = require('./blockchainManager/transition');

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
app.use('/transition', transition);
app.use('/warManager', warManager);

app.use(express.static(path.join(__dirname, 'Build')));
app.get('/playGame', (req, res) => {
  res.sendFile(path.join(__dirname, 'Build', 'index.html'));
});

const server = http.createServer(app);
const io = socketIo(server);
socket01(io);

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
