const amqplib = require('amqplib');
const { queueName,rabbitmq_url } = require('./server-config');
const logger = require('./logger-config');

let connection, channel;

async function connectQueue(retries = 5) {
    while(retries > 0) {
        try {
            connection = await amqplib.connect(rabbitmq_url);
            channel = await connection.createChannel();

            await channel.assertQueue(queueName);
            return;
        } catch (error) {
            retries--;
            logger.warn(`RabbitMQ not ready, retrying... (${5 - retries}/5)`);
            await new Promise(res => setTimeout(res, 9000));
        }
    }
    throw new Error('Could not connect to RabbitMQ after multiple attempts.');
}

async function sendData(data) {
    try {
        logger.info('Pushing booking success message to queue', {
            bookingId: data.bookingId,
            userId: data.userId,
            email: data.email,
        });
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    } catch (error) {
        logger.error('Error sending data to RabbitMQ:', error.message);
        console.log(error);
    }
}

module.exports = {
    sendData,
    connectQueue
}