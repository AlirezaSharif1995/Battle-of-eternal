const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, 
    auth: {
        user: 'davion.homenick@ethereal.email',
        pass: 'XeSGvxqMEfXUE1bGq5'
    }
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
    const { email } = req.body;

    const token = generateRandomToken();
    transporter.sendMail({
        from: '"Manataz Studio " <Manatazstudio@gmail.com>', 
        to: email, 
        subject: "Forget Password", 
        text: "Code for reset password: " + token,
    }, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            res.status(500).send("Error sending email");
        } else {
            console.log("Email sent: %s", info.messageId);
            res.send("Email sent and token is : ", token);
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
