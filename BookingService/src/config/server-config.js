const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    PORT : process.env.PORT,
    FLIGHT_SERVICE : process.env.FLIGHT_SERVICE,
    queueName: process.env.QUEUE_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    node_env: process.env.NODE_ENV,
    rabbitmq_url: process.env.RABBITMQ_URL,
}