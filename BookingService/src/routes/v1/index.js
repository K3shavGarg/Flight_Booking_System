const express = require('express');

const router = express.Router();


const bookingRouter = require('./booking-route');


router.use('/bookings', bookingRouter);


module.exports = router;