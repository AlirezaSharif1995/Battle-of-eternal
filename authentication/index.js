const registrationRouter = require('./register');
const loginRouter = require('./login');
const forgetPassword = require('./forgetPassword');

module.exports = {
    registrationRouter: registrationRouter,
    loginRouter: loginRouter,
    forgetPassword: forgetPassword
};