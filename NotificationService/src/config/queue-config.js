const amqplib = require('amqplib');
const { RABBITMQ_QUEUE_NAME, RABBITMQ_URL } = require('./server-config');
const logger = require('./logger-config');

let connection, channel;

async function connectQueue(retries = 5) {
    while(retries > 0) {
        try {
            connection = await amqplib.connect(RABBITMQ_URL);
            channel = await connection.createChannel();
            await channel.assertQueue(RABBITMQ_QUEUE_NAME);
            return channel;
        } catch (error) {
            retries--;
            logger.warn(`RabbitMQ not ready, retrying... (${5 - retries}/5)`);
            await new Promise(res => setTimeout(res, 10000));
        }
    }
    throw new Error('Could not connect to RabbitMQ after multiple attempts.');
}

module.exports = {
    connectQueue
}