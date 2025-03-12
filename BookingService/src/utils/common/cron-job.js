const cron = require('node-cron');
const { cancelOldBookings } = require('../../services/booking-service');


function scheduleTask(){
    cron.schedule('*/10 * * * * *', async () => {
        await cancelOldBookings();
    });
}

module.exports = scheduleTask;

