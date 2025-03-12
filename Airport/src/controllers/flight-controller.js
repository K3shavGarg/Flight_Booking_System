const {flightService} = require('../services');
const {StatusCodes} = require('http-status-codes')
const {ErrorResponse,SuccessResponse} = require('../utils/common');


async function createFlight(req, res){
    try {
        const flight = await flightService.createFlight({
            flightNumber:req.body.flightNumber,
            airplaneId:req.body.airplaneId,
            departureAirportId:req.body.departureAirportId,
            arrivalAirportId:req.body.arrivalAirportId,
            arrivalTime:req.body.arrivalTime,
            departureTime:req.body.departureTime,
            price:req.body.price,
            totalSeats:req.body.totalSeats,
            boardingGate:req.body.boardingGate,
        });
        SuccessResponse.data = flight;
        return res.status(StatusCodes.CREATED)
                .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCodes)
                .json(ErrorResponse);
    }
}

async function getAllFlights(req, res) {
    try {
        const flights = await flightService.getAllFlights(req.query);
        SuccessResponse.data = flights;
        return res.status(StatusCodes.OK)
                    .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCodes)
                    .json(ErrorResponse);
    }
}

async function getFlightByid(req, res){
    try {
        const flight = await flightService.getFlight(req.params.id);
        SuccessResponse.data = flight;
        return res.status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCodes)
                    .json(ErrorResponse);
    }
}

async function updateSeats(req, res){
    try {

        const response = await flightService.updateSeats({
            flightId : req.params.id,
            seats : req.body.seats,
            dec: (req.body.dec == undefined) ? '1' : req.body.dec
        });
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCodes)
                    .json(ErrorResponse);
    }
}

module.exports = {
    createFlight,
    getAllFlights,
    getFlightByid,
    updateSeats
}