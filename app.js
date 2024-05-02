const express = require('express');
const registrationRouter = require('./register');
const loginRouter = require('./login');


const app = express();
app.use(express.json());
app.use('/register',registrationRouter);
app.use('/login',loginRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
