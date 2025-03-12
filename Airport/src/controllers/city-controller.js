const {cityService} = require('../services');
const {StatusCodes} = require('http-status-codes')
const {ErrorResponse,SuccessResponse} = require('../utils/common');


async function createCity(req, res){
    try {
        const city = await cityService.createCity({
            name : req.body.name,
        });
        SuccessResponse.data = city;
        return res.status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCodes)
                .json(ErrorResponse);
    }
}

async function destroyCity(req, res){
    try {
        const response = await cityService.destroyCity(req.params.id);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCodes)
                    .json(ErrorResponse);
    }
}
async function updateCity(req, res){
    try {
        const response = await cityService.updateCity(req.params.id, req.body);
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
    createCity,
    destroyCity,
    updateCity
}