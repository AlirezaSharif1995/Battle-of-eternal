const express = require('express');
const registrationRouter = require('./authentication/register');
const loginRouter = require('./authentication/login');
const forgetPassword = require('./authentication/forgetPassword');
const building = require('./playerResoureces/building');


const app = express();
app.use(express.json());
app.use('/register',registrationRouter);
app.use('/login',loginRouter);
app.use('/forgetPassword',forgetPassword);
app.use('/building',building);


const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
