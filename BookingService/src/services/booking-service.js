const axios = require('axios');

const {BookingRepository} = require('../repositories');
const db = require('../models');
const {serverConfig} = require('../config');
const { AppError } = require('../utils/errors');
const { StatusCodes } = require('http-status-codes');

const {enums} = require('../utils/common');
const {BOOKED,CANCELLED, PENDING} = enums.BOOKING_status;

const bookingRepository = new BookingRepository();

async function createBooking(data){
    const transaction = await db.sequelize.transaction();
    try{   
        const flight = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;
        if(flightData.totalSeats < data.noofSeats){
            throw new AppError("Not Enough Seats Available",StatusCodes.BAD_REQUEST);
        }
        const totalBillingAmnt = data.noofSeats * flightData.price;

        const bookingPayload = {...data, totalCost : totalBillingAmnt};
        const booking = await bookingRepository.createBooking(bookingPayload, transaction);
        console.log('Sending request ');
        await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{
            seats: data.noofSeats
        });
        booking.status = PENDING;
        await booking.save();
        await transaction.commit();
        return booking;
    }catch (error){
        await transaction.rollback();
        throw error;
    }
}

async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
        if(bookingDetails.status == CANCELLED){
            throw new AppError("This Booking has already been cancelled.",StatusCodes.BAD_REQUEST);
        }
        
        if(bookingDetails.status == BOOKED){
            throw new AppError("This Booking has already been booked.",StatusCodes.BAD_REQUEST);
        }

        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        // Give the Time for 5 mins to complete the payment, if more than that Cancel the booking
        if(currentTime - bookingTime > 5*60*1000){
            await cancelBooking(data.bookingId);
            throw new AppError("This Booking has already been Expired.",StatusCodes.BAD_REQUEST);
        }

        if(bookingDetails.totalCost != data.totalCost){
            throw new AppError("The amount of payment doesn't match.",StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.userId != data.userId){
            throw new AppError("The user corresponding to the booking doesn't match.",StatusCodes.BAD_REQUEST);
        }
        
        // Assunming payment is successfull
        // Update the state of Booking

        const response = await bookingRepository.update({status : BOOKED},data.bookingId, transaction);
        await transaction.commit();
        return response;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelBooking(bookingId) {
    const transaction = await db.sequelize.transaction();

    try {
        const bookingDetails = await bookingRepository.get(bookingId, transaction);
        if(bookingDetails.status == CANCELLED){
            await transaction.commit();
            return true;
        }
        // Increase the seats
        await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`,{
            seats: bookingDetails.noofSeats,
            dec: "0"
        });

        await bookingRepository.update({status : CANCELLED},bookingId, transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelOldBookings() {
    try {
        const time = new Date(Date.now() - 300*1000);
        const response = await bookingRepository.cancelOldBookings(time);
        console.log(response);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    createBooking,
    makePayment,
    cancelOldBookings
}