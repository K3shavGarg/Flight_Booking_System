const {airplaneRepository} = require('../repositories');
const {StatusCodes} = require('http-status-codes');
const { AppError } = require('../utils/errors');

const AirplaneRepository = new airplaneRepository();

async function createAirplane(data){
    try {
        const airplane = await AirplaneRepository.create(data);
        return airplane;
    } catch (error) {
        if(error.name === 'SequelizeValidationError'){
            // Read Sequelize Error Object
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new Airplane Object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirplanes(){
    try {
        const airplanes = await AirplaneRepository.getAll();
        return airplanes;
    } catch (error) {
        throw new AppError('Some Error Occured', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function getAirplane(id){
    try {
        const airplane = await AirplaneRepository.get(id);
        return airplane;
    } catch (error) {
        if(error.statusCodes === StatusCodes.NOT_FOUND){
            throw new AppError('Airplane not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError('Some Error Occured', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyAirplane(id){
    try {
        const response = await AirplaneRepository.destroy(id);
        return response;
    } catch (error) {
        if(error.statusCodes == StatusCodes.NOT_FOUND){
            throw new AppError('Not able to find the requested Airplane to destroy', StatusCodes.NOT_FOUND);
        }
        throw new AppError('Some Error Occured', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateAirplane(data,id){
    try {
        const response = await AirplaneRepository.update(data, id);
        return response;
    } catch (error) {
        if(error.statusCodes == StatusCodes.NOT_FOUND){
            throw new AppError('Not able to find the requested Airplane', StatusCodes.NOT_FOUND);
        }
        if(error.name === 'SequelizeValidationError'){
            // Read Sequelize Error Object
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Some Error Occured', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createAirplane,
    getAirplanes,
    getAirplane,
    destroyAirplane,
    updateAirplane
};