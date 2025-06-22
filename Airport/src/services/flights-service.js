const {flightRepository} = require('../repositories');
const {StatusCodes} = require('http-status-codes');
const { AppError } = require('../utils/errors');
const { Op } = require('sequelize');

const FlightRepository = new flightRepository();

async function createFlight(data){
    try {
        const flight = await FlightRepository.create(data);
        return flight;
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
            throw new AppError('Foreign Key Constraint is not been satisfied.',StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new Flight Object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllFlights(query) {
    let customFilter = {};
    let sortFilter = [];
    if(query.trips){
        [departureAirportId, arrivalAirportId] = query.trips.split("-");
        if(departureAirportId === arrivalAirportId){
            return [];
        }
        customFilter.departureAirportId = departureAirportId;
        customFilter.arrivalAirportId = arrivalAirportId;
    }
    
    if(query.price){
        [minPrice , maxPrice] = query.price.split("-");
        customFilter.price = {
            // if minPrice is undefined it is by default 0
            [Op.between] : [minPrice, ((maxPrice == undefined)? 200000 : maxPrice)]
        }
    }

    if(query.travellers){
        customFilter.totalSeats = {
            [Op.gte]: query.travellers
        }
    }

    if(query.tripDate){
        // Contains only date by default time is 00:00:00 
        const ending = query.tripDate + ' 23:59:00';
        customFilter.departureTime = {
            [Op.between]: [query.tripDate, ending] 
        }
        // Gives all the flights on that particular date
    }

    if(query.sort){
        const params = query.sort.split(",");
        const sortFilters = params.map((param) => param.split("_"));
        console.log(sortFilters);
        sortFilter = sortFilters;
        for (let index = 0; index < sortFilter.length; index++) {
            if(sortFilter[index][1] !== 'ASC' && sortFilter[index][1] !== 'DESC'){
                throw new AppError('Invalid sort query.',StatusCodes.BAD_REQUEST);
            }
        }
    }

    try {
        const flights = FlightRepository.getAllFlights(customFilter, sortFilter);
        return flights;
    } catch (error) {
        throw new AppError('Cannot fetch data of all flights', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getFlight(id){
    try {
        const flight = await FlightRepository.get(id);
        return flight;
    } catch (error) {
        if(error.statusCodes === StatusCodes.NOT_FOUND){
            throw new AppError('Flight not found', StatusCodes.NOT_FOUND);
        }
        console.log(error)
        throw new AppError('Some Error Occured', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateSeats(data) {
    try {
        const response = FlightRepository.updateSeats(data.flightId, data.seats, data.dec);
        return response;
    } catch (error) {
        throw new AppError('Cannot Update data of flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createFlight,
    getAllFlights,
    getFlight,
    updateSeats
};