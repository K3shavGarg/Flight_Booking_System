const {airportService} = require('../services');
const {StatusCodes} = require('http-status-codes')
const {ErrorResponse,SuccessResponse} = require('../utils/common');


async function createAirport(req, res){
    try {
        const {name, code,cityId,address} = req.body;
        const airport = await airportService.createAirport({
            name, code,cityId,address
        });
        SuccessResponse.data = airport;
        return res.status(StatusCodes.CREATED)
                .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCodes)
                .json(ErrorResponse);
    }
}

async function getAirports(req, res){
    try {
        const airports = await airportService.getAirports();
        SuccessResponse.data = airports;
        return res.status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCodes)
                    .json(ErrorResponse);
    }
}

async function getAirport(req, res){
    try {
        const airport = await airportService.getAirport(req.params.id);
        SuccessResponse.data = airport;
        return res.status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCodes)
                    .json(ErrorResponse);
    }
}

async function destroyAirport(req, res){
    try {
        const response = await airportService.destroyAirport(req.params.id);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCodes)
                    .json(ErrorResponse);
    }
}

async function updateAirport(req, res){
    try {
        const response = await airportService.updateAirport(req.body,req.params.id);
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
    createAirport,
    getAirports,
    getAirport,
    destroyAirport,
    updateAirport
}