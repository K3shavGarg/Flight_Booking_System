const express = require('express');

const router = express.Router();

const {bookingController} = require('../../controllers');
const { authMiddleware } = require('../../middlewares');

router.post('/',authMiddleware.authMiddleware,bookingController.createBooking);


router.post('/payments',authMiddleware.authMiddleware, bookingController.makePayment);

module.exports = router;
