const {StatusCodes} = require('http-status-codes');
const crudRepository = require('./crud-repository');
const {Booking} = require('../models');
const { Op } = require('sequelize');

const {enums} = require('../utils/common');
const {CANCELLED, BOOKED} = enums.BOOKING_status;

class BookingRepository extends crudRepository {
    constructor(){
        super(Booking);
    }
    async createBooking(data, transaction) {
        try {
            console.log(data);
            const response = await Booking.create(data,{transaction : transaction});
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async get(id, transaction) {
        try {
            const response = await Booking.findByPk(id,{transaction : transaction});
            if(!response){
                throw new AppError('Not Found', StatusCodes.NOT_FOUND);
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    async update(data,id, transaction){ // here data is object
        try {
            const response = await Booking.update(data,
                {
                    where:{
                        id:id
                    }
                },
                {
                    transaction : transaction
                }
            );

            if(!response[0]){
                throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    async cancelOldBookings(time) {
        const response = await Booking.update(
            {
                status: CANCELLED
            },
            {
                where:{
                    [Op.and]:[
                        {
                            createdAt:{
                                [Op.lt] : time
                            }
                        },
                        {
                            status:{
                                [Op.ne] : BOOKED
                            }
                        },
                        {
                            status:{
                                [Op.ne] : CANCELLED
                            }
                        },
                    ]
                }
            }
        );
        return response;
    }
}

module.exports = BookingRepository;