const {bookingService} = require('../services');


const {StatusCodes} = require('http-status-codes')
const {ErrorResponse,SuccessResponse} = require('../utils/common');

async function createBooking(req, res){
    try {
        const booking = await bookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId, 
            noofSeats: req.body.noofSeats
        });
        SuccessResponse.data = booking;
        return res.status(StatusCodes.CREATED) // CHange statusCode
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}

async function makePayment(req, res){
    try {
        const response = await bookingService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.body.userId, 
            bookingId: req.body.bookingId
        });
        console.log(response)
        SuccessResponse.data = response;
        return res.status(StatusCodes.CREATED) // CHange statusCode
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCodes)
                .json(ErrorResponse);
    }
}



module.exports = {
    createBooking,
    makePayment
}