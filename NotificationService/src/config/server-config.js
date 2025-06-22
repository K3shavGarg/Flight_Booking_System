const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT : process.env.PORT,
    GMAIL_EMAIL: process.env.GMAIL_EMAIL,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    RABBITMQ_URL: process.env.RABBITMQ_URL,
    RABBITMQ_QUEUE_NAME: process.env.RABBITMQ_QUEUE_NAME
}