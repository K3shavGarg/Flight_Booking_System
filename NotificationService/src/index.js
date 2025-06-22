const express = require('express');
const { serverConfig, Queue } = require('./config');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiRoutes = require('./routes');
app.use('/api', apiRoutes);
const logger = require('./config/logger-config');
const { emailService } = require('./services');


app.listen(serverConfig.PORT, async () => {
    logger.info(`Server is running on port ${serverConfig.PORT}`);
    const channel = await Queue.connectQueue()
    if (!channel) {
        logger.error('Queue channel instance is not present');
    }
    logger.info(`Connected to ${serverConfig.RABBITMQ_QUEUE_NAME}`);
    logger.info('Starting RabbitMQ consumer...');
    await channel.consume(serverConfig.RABBITMQ_QUEUE_NAME, async (data) => {
        const emailInfo = JSON.parse(data.content.toString());

        try {
            await emailService.sendMail(
                serverConfig.GMAIL_EMAIL,
                emailInfo.recepientEmail,
                emailInfo.subject,
                emailInfo.text
            );
        } catch (error) {
            logger.error('Error while sending email in consumer', { error: error.message });
            // TODO: retry logic / Dead Letter Queue
        }
        channel.ack(data);
    });
});