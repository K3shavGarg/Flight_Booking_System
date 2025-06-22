const cron = require('node-cron');
const { cancelOldBookings } = require('../../services/booking-service');
const logger = require('../../config/logger-config');


function scheduleTask(){
    // Every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        const startTime = Date.now();
        logger.info('[CRON] Running');
        try {
            await cancelOldBookings();
            logger.info(`[CRON] Completed in ${Date.now() - startTime}`);
        } catch (error) {
            logger.error('[CRON] cancelOldBookings failed:', err);
        }
    });
}

module.exports = scheduleTask;

