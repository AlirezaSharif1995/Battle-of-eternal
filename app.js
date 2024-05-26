const express = require('express');
const { registrationRouter, loginRouter, forgetPassword, playerInfo } = require('./authentication');
const { building, playerResources, reportHandler} = require('./playerResoureces');
const { createAlliance, allianceManager } = require('./Alliance');
const { wheatManager } = require('./blockchainManager');
const path = require('path');

const app = express();
app.use(express.json());
app.use('/register',registrationRouter);
app.use('/login',loginRouter);
app.use('/forgetPassword',forgetPassword);
app.use('/building',building);
app.use('/updateResources',playerResources);
app.use('/createAlliance',createAlliance);
app.use('/allianceManager',allianceManager);
app.use('/playerInfo',playerInfo);
app.use('/report',reportHandler);
app.use('/blockchainManager/wheatManager',wheatManager);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
