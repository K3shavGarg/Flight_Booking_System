const {cityRepository} = require('../repositories');
const {StatusCodes} = require('http-status-codes');
const { AppError } = require('../utils/errors');

const CityRepository = new cityRepository();

async function createCity(data){
    try {
        const city = await CityRepository.create(data);
        return city;
    } catch (error) {
        if(error.name === 'SequelizeUniqueConstraintError'){
            // Read Sequelize Error Object
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new City Object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyCity(id){
    try {
        const response = await CityRepository.destroy(id);
        return response;
    } catch (error) {
        if(error.statusCodes == StatusCodes.NOT_FOUND){
            throw new AppError('Not able to find the requested City to destroy', StatusCodes.NOT_FOUND);
        }
        throw new AppError('Some Error Occured', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateCity(id, data){
    try {
        const response = await CityRepository.update(data, id);
        return response;
    } catch (error) {
        if(error.statusCodes == StatusCodes.NOT_FOUND){
            throw new AppError('Not able to find the requested City', StatusCodes.NOT_FOUND);
        }
        if(error.name === 'SequelizeUniqueConstraintError'){
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
    createCity,
    destroyCity,
    updateCity
}