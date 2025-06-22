const crudRepository = require('./crud-repository.js');
const {Flight, Airplane,Airports,City} = require('../models');
const db = require('../models');
const { addRowLockOnFlights } = require('./queries.js');

class flightRepository extends crudRepository{
    constructor(){
        super(Flight);
    }
    // Custom Functions related to this model

    async getAllFlights(filter, sort){
        const response = await Flight.findAll({
            where: filter,
            order:sort,
            attributes:{
                exclude: ['createdAt','updatedAt']
            },
            include:[
                {
                    model:Airplane,
                    as : 'airplaneDetails',
                    attributes:{
                        exclude: ['createdAt','updatedAt']
                    }
                },
                {
                    model: Airports, // Include Departure Airport
                    attributes: ['code', 'name'], // Select fields you want
                    as: 'departureAirport', // Alias for the departure airport
                    include:{
                        model:City,
                        as:'city',
                        attributes:{
                            exclude: ['createdAt','updatedAt']
                        }
                    }
                },
                {
                    model: Airports, // Include Arrival Airport
                    attributes: ['code', 'name'], // Select fields you want
                    as: 'arrivalAirport', // Alias for the arrival airport
                    include:{
                        model:City,
                        as:'city',
                        attributes:{
                            exclude: ['createdAt','updatedAt']
                        }
                    }
                },
            ]
        });
        return response;
    }

    async updateSeats(flightId, seats, dec) {
        const transaction = await db.sequelize.transaction(); // Start a transaction
        try {
            // Lock the row using SELECT ... FOR UPDATE inside the transaction
            await db.sequelize.query(addRowLockOnFlights(), {
                replacements: { flightId }, // Parameterized query to avoid SQL injection
                transaction: transaction, // Use the transaction here
            });
        
            // Fetch the flight object (this will still happen within the transaction)
            const flight = await Flight.findByPk(flightId, { transaction: transaction });
            // DEC is a string
            if (dec === '1') {
                await flight.decrement('totalSeats', { by: seats, transaction: transaction });
            } else if(dec === '0') {
                await flight.increment('totalSeats', { by: seats, transaction: transaction });
            }
            // Commit the transaction after the operations
            await transaction.commit();
            return flight;
        } catch (error) {
            // If any error occurs, rollback the transaction
            await transaction.rollback();
            throw error; // Rethrow the error after rolling back
        }
    }
}

module.exports = flightRepository;
