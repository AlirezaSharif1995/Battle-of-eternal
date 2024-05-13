const express = require('express');
const router = express.Router();

const mailgun = require('mailgun-js')({
    apiKey: 'pubkey-dc880ffb73d6de20009101249cbb70b7',
    domain: 'Manatazstudio@gmail.com',
    tls: {
        ciphers: 'SSLv3'
    }
});


router.get('/', (req, res) => {
    const { email } = req.body;

    const token = generateRandomToken();
    const data = {
        from: 'Manataz Studio " <Manatazstudio@gmail.com>',
        to: email,
        subject: "Forget Password",
        text: "Code for reset password: " + token
    };
    
    mailgun.messages().send(data, (error, body) => {
        if (error) {
            console.error(error);
        } else {
            console.log(body);
        }
    });
    

});


function generateRandomToken() {
    let token = '';
    for (let i = 0; i < 5; i++) {
        token += Math.floor(Math.random() * 10); // Generate random digit (0-9)
    }
    return token;
}

module.exports = router;
