const express = require('express');
const router = express.Router();

const mailgun = require('mailgun-js')({
    apiKey: 'e9515ff744e3552f083aafff01fee01a-32a0fef1-c4c0e5b9',
    domain: 'sandbox48d130a26fdd4c98a1eb63865ea3156b.mailgun.org'
});

router.post('/', (req, res) => {
    const { email } = req.body; 

    const token = generateRandomToken();

    const data = {
        from: 'Manataz Studio <Manatazstudio@gmail.com>',
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
