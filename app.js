const express = require('express');
const { registrationRouter, loginRouter, forgetPassword } = require('./authentication');
const { building, playerResources} = require('./playerResoureces');
const { createAlliance, allianceManager } = require('./Alliance');

const app = express();
app.use(express.json());
app.use('/register',registrationRouter);
app.use('/login',loginRouter);
app.use('/forgetPassword',forgetPassword);
app.use('/building',building);
app.use('/updateResources',playerResources);
app.use('/createAlliance',createAlliance);
app.use('/allianceManager',allianceManager);


const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
