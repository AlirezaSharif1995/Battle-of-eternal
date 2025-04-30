const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');
const socket01 = require('./Sockets/socket01');
const compression = require('compression');
//const serveIndex = require('serve-index');

const { registrationRouter, loginRouter, forgetPassword, playerInfo } = require('./authentication');
const { building, playerResources, reportHandler, prize } = require('./playerResoureces');
const { createAlliance, allianceManager } = require('./Alliance');
const { wheatManager, contracts, NFT, kingManager } = require('./blockchainManager');
const { warManager } = require('./wars');
const { messages } = require('./Message');

const transition = require('./blockchainManager/transition');
const updatePlayerResources = require('./playerResoureces/updateResources');


const app = express();
app.use(compression());
app.use(express.json());
const cors = require('cors');

// Allow all origins (for development purposes, only recommended for dev environments)
app.use(cors({
  origin: '*', // یا برای محدود کردن فقط localhost می‌توانید از 'http://localhost:4000' استفاده کنید
  methods: ['GET', 'POST'], // متدهای مورد تایید
  allowedHeaders: ['Content-Type', 'Authorization'] // هدرهای مجاز
}));

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
app.use('/contracts', contracts);
app.use('/warManager', warManager);
app.use('/NFT', NFT);
app.use('/prize', prize);
app.use("/messages", messages);
app.use("/kingManager", kingManager);


app.use(express.static(path.join(__dirname, 'Build')));
app.get('/playGame', (req, res) => {
  res.sendFile(path.join(__dirname, 'Build', 'index.html'));
});
const folderPath = path.join(__dirname, 'config2');

// serve static files
// app.use('/book', express.static(folderPath));

// // enable directory listing
// app.use('/book', serveIndex(folderPath, { icons: true }));


const INTERVAL_TIME = 60 * 1000;
updatePlayerResources();
setInterval(updatePlayerResources, INTERVAL_TIME);

const server = http.createServer(app);
const io = socketIo(server);
socket01(io);

const port = 4000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
