const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');
const socket01 = require('./Sockets/socket01');

// Import your modules
const { registrationRouter, loginRouter, forgetPassword, playerInfo } = require('./authentication');
const { building, playerResources, reportHandler } = require('./playerResoureces');
const { createAlliance, allianceManager } = require('./Alliance');
const { wheatManager } = require('./blockchainManager');
const { warManager } = require('./wars');
const transition = require('./blockchainManager/transition');

// Initialize express app
const app = express();

// Middleware
app.use(express.json());

// Routes
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

// Serve static files
app.use(express.static(path.join(__dirname, 'Build')));

// Serve the main game page
app.get('/playGame', (req, res) => {
  res.sendFile(path.join(__dirname, 'Build', 'index.html'));
});

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

// Initialize socket connections
socket01(io);

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
