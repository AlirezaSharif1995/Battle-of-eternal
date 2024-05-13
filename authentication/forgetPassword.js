const express = require('express');
const router = express.Router();

const mailgun = require('mailgun-js')({
    apiKey: 'pubkey-dc880ffb73d6de20009101249cbb70b7',
    domain: 'sandbox48d130a26fdd4c98a1eb63865ea3156b.mailgun.org'
});

router.get('/', (req, res) => {
    const { email } = req.query; // Assuming email is passed as a query parameter
    console.log("ok");
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
            res.status(500).send("Error sending email");
        } else {
            console.log(body);
            res.send("Email sent successfully");
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
