const nodemailer = require('nodemailer');

const { GMAIL_EMAIL, GMAIL_PASSWORD } = require('./server-config');

const mailSender = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: GMAIL_EMAIL,
        pass: GMAIL_PASSWORD
    },
    connectionTimeout: 10000, // 10 seconds to establish connection
    greetingTimeout: 5000,    // 5 seconds to receive greeting
    socketTimeout: 15000,     // 15 seconds overall for sending email
});

module.exports = mailSender;