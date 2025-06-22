const express = require('express');
const { serverConfig } = require('./config');
const { Queue } = require('./config');

const CRON = require('./utils/common/cron-job');
const logger = require('./config/logger-config');

// Initializing express app and middleware like body-parser
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Registering routes
const apiRoutes = require('./routes')
app.use('/api', apiRoutes);
console.log("Port:", serverConfig.PORT)

app.listen(serverConfig.PORT, async () => {
    logger.info(`Server is running on port ${serverConfig.PORT}`);

    await Queue.connectQueue();
    logger.info('Connected to RabbitMQ');
    CRON();
}); 