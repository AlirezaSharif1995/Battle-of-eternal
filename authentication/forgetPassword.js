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
    const userEmail = req.body.email;
    const token = req.body.token; 

    transporter.sendMail({
        from: '"Manataz Studio 👻" <Manatazstudio@gmail.com>', 
        to: userEmail, 
        subject: "Forget Password", 
        text: "Code for reset password: " + token,
    }, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            res.status(500).send("Error sending email");
        } else {
            console.log("Email sent: %s", info.messageId);
            res.send(`Message sent to ${userEmail}`);
        }
    });
});

module.exports = router;
