const {StatusCodes} = require('http-status-codes');

const {ErrorResponse} = require('../utils/common');
const { AppError } = require('../utils/errors');
const { compare } = require('../utils/helper/datetime-helper');


function validateCreateRequest(req, res, next){
    if(!req.body.flightNumber){
        ErrorResponse.message = 'Something went wrong while creating flight';
        ErrorResponse.error = new AppError(['flightNumber is required'], StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse) 
    }
    if(!req.body.airplaneId){
        ErrorResponse.message = 'Something went wrong while creating flight';
        ErrorResponse.error = new AppError(['airplaneId is required'], StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse) 
    }
    if(!req.body.departureAirportId){
        ErrorResponse.message = 'Something went wrong while creating flight';
        ErrorResponse.error = new AppError(['departureAirportId is required'], StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse) 
    }
    if(!req.body.arrivalAirportId){
        ErrorResponse.message = 'Something went wrong while creating flight';
        ErrorResponse.error = new AppError(['arrivalAirportId is required'], StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse) 
    }
    if(!req.body.arrivalTime){
        ErrorResponse.message = 'Something went wrong while creating flight';
        ErrorResponse.error = new AppError(['arrivalTime is required'], StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse) 
    }
    if(!req.body.departureTime){
        ErrorResponse.message = 'Something went wrong while creating flight';
        ErrorResponse.error = new AppError(['departureTime is required'], StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse) 
    }
    if(!req.body.price){
        ErrorResponse.message = 'Something went wrong while creating flight';
        ErrorResponse.error = new AppError(['price is required'], StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse) 
    }
    if(!req.body.totalSeats){
        ErrorResponse.message = 'Something went wrong while creating flight';
        ErrorResponse.error = new AppError(['totalSeats is required'], StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse) 
    }
    if(!compare(req.body.arrivalTime, req.body.departureTime)){
        ErrorResponse.message = 'Something went wrong while creating flight.';
        ErrorResponse.error = new AppError(['Arrival time cannot be earlier than departure time.'], StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
    }
    if(req.body.arrivalAirportId === req.body.departureAirportId){
        ErrorResponse.message = 'Something went wrong while creating flight.';
        ErrorResponse.error = new AppError(['Arrival and Departure Airport cannot be same.'], StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
    }
    next();
}

function validateUpdateSeatsRequest(req, res, next) {
    if(!req.body.seats){
        ErrorResponse.message = 'Something went wrong while updating flight.';
        ErrorResponse.error = new AppError(['Seats is not found in the incoming request'], StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
            }
    if(req.body.dec && (req.body.dec !== '0' && req.body.dec !== '1')){
        ErrorResponse.message = 'Something went wrong while updating flight.';
        ErrorResponse.error = new AppError(['Dec should be 0 or 1'], StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
    }
    next();
}


module.exports = {
    validateCreateRequest,
    validateUpdateSeatsRequest
}