const {airplaneService} = require('../services');
const {StatusCodes} = require('http-status-codes')
const {ErrorResponse,SuccessResponse} = require('../utils/common');


async function createAirplane(req, res){
    try {
        const airplane = await airplaneService.createAirplane({
            modelNumber: req.body.modelNumber,
            capacity: req.body.capacity
        });
        SuccessResponse.data = airplane;
        return res.status(StatusCodes.CREATED)
                .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCodes)
                .json(ErrorResponse);
    }
}

async function getAirplanes(req, res){
    try {
        const airplanes = await airplaneService.getAirplanes();
        SuccessResponse.data = airplanes;
        return res.status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;

        return res.status(error.statusCodes)
                    .json(ErrorResponse);
    }
}

async function getAirplane(req, res){
    try {
        const airplane = await airplaneService.getAirplane(req.params.id);
        SuccessResponse.data = airplane;
        return res.status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCodes)
                    .json(ErrorResponse);
    }
}

async function destroyAirplane(req, res){
    try {
        const response = await airplaneService.destroyAirplane(req.params.id);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCodes)
                    .json(ErrorResponse);
    }
}

async function updateAirplane(req, res){
    try {
        const response = await airplaneService.updateAirplane(req.body,req.params.id);
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
    createAirplane,
    getAirplanes,
    getAirplane,
    destroyAirplane,
    updateAirplane
}