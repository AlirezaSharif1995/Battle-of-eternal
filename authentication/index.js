const registrationRouter = require('./register');
const loginRouter = require('./login');
const forgetPassword = require('./forgetPassword');
const playerInfo = require('./playersInfo');

module.exports = {
    registrationRouter: registrationRouter,
    loginRouter: loginRouter,
    forgetPassword: forgetPassword,
    playerInfo: playerInfo
};