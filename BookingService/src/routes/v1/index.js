const express = require('express');

const router = express.Router();


const bookingRouter = require('./booking-route');
const infoRouter = require('./info-router');

router.use('/bookings', bookingRouter);
router.use('/info', infoRouter);



module.exports = router;