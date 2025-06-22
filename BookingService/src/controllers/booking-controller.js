const { bookingService } = require('../services');


const { StatusCodes } = require('http-status-codes')
const { ErrorResponse, SuccessResponse } = require('../utils/common');
const logger = require('../config/logger-config');


async function createBooking(req, res) {
    try {
        const booking = await bookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.userId,
            noofSeats: req.body.noofSeats,
        });
        SuccessResponse.data = booking.toJSON();
        logger.info('Booking successful', {
            userId: req.userId,
            bookingId: SuccessResponse.data.id,
            durationMs: Date.now() - req.startTime
        });
        return res.status(StatusCodes.CREATED) // CHange statusCode
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        logger.error('Booking failed', {
            userId: req.userId,
            error: error.message,
            durationMs: Date.now() - req.startTime
        });
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

async function makePayment(req, res) {
    try {
        const response = await bookingService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.userId,
            bookingId: req.body.bookingId,
            email: req.email
        });
        SuccessResponse.data = response;
        logger.info('Payment successful', {
            userId: req.userId,
            bookingId: req.body.bookingId,
            durationMs: Date.now() - req.startTime
        });
        return res.status(StatusCodes.OK) // CHange statusCode
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        logger.error('Payment failed', {
            userId: req.userId,
            bookingId: req.body.bookingId,
            error: error.message,
            durationMs: Date.now() - req.startTime
        });
        return res.status(error.statusCodes)
            .json(ErrorResponse);
    }
}



module.exports = {
    createBooking,
    makePayment
}