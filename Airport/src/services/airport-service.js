const {airportRepository} = require('../repositories');
const {StatusCodes} = require('http-status-codes');
const { AppError } = require('../utils/errors');

const AirportRepository = new airportRepository();

async function createAirport(data){
    try {
        const airport = await AirportRepository.create(data);
        return airport;
    } catch (error) {
        if(error.name === 'SequelizeValidationError'){
            // Read Sequelize Error Object
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        if(error.name === 'SequelizeForeignKeyConstraintError'){
            throw new AppError('Foreign Key Constraint (CityId) is not been satisfied.',StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new Airport Object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirports(){
    try {
        const airports = await AirportRepository.getAll();
        return airports;
    } catch (error) {
        throw new AppError('Some Error Occured', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirport(airportId){
    try {
        const airport = await AirportRepository.get(airportId);
        return airport;
    } catch (error) {
        if(error.statusCodes === StatusCodes.NOT_FOUND){
            throw new AppError('Airport not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError('Some Error Occured', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyAirport(airportId){
    try {
        const response = await AirportRepository.destroy(airportId);
        return response;
    } catch (error) {
        if(error.statusCodes == StatusCodes.NOT_FOUND){
            throw new AppError('Not able to find the requested Airport to destroy', StatusCodes.NOT_FOUND);
        }
        throw new AppError('Some Error Occured', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateAirport(data,airportId){
    try {
        const response = await AirportRepository.update(data, airportId);
        return response;
    } catch (error) {
        if(error.statusCodes == StatusCodes.NOT_FOUND){
            throw new AppError('Not able to find the requested Airport', StatusCodes.NOT_FOUND);
        }
        if(error.name === 'SequelizeValidationError'){
            // Read Sequelize Error Object
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        if(error.name === 'SequelizeForeignKeyConstraintError'){
            throw new AppError('Foreign Key Constraint (CityId) is not been satisfied.',StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Some Error Occured', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createAirport,
    getAirports,
    getAirport,
    destroyAirport,
    updateAirport
};