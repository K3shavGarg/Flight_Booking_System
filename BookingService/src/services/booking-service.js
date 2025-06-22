const axios = require('axios');

const { BookingRepository } = require('../repositories');
const db = require('../models');
const { serverConfig, Queue } = require('../config');
const { AppError } = require('../utils/errors');
const { StatusCodes } = require('http-status-codes');

const { enums } = require('../utils/common');
const logger = require('../config/logger-config');
const { BOOKED, CANCELLED, PENDING } = enums.BOOKING_status;

const bookingRepository = new BookingRepository();

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    logger.info('Transaction started for booking creation', {
        transactionId: transaction.id,
        flightId: data.flightId,
        userId: data.userId,
    });
    try {
        const flight = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;
        if (flightData.totalSeats < data.noofSeats) {
            throw new AppError("Not Enough Seats Available", StatusCodes.BAD_REQUEST);
        }
        const totalBillingAmnt = data.noofSeats * flightData.price;

        const bookingPayload = { ...data, totalCost: totalBillingAmnt };
        logger.info('Creating booking', {
            userId: data.userId,
            flightId: data.flightId,
            noofSeats: data.noofSeats,
            totalCost: totalBillingAmnt,
        });
        const booking = await bookingRepository.createBooking(bookingPayload, transaction);
        await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
            seats: data.noofSeats
        });
        booking.status = PENDING;
        await booking.save({ transaction: transaction });
        logger.info('Transaction committed', {
            transactionId: transaction.id
        });
        await transaction.commit();
        return booking;
    } catch (error) {
        logger.error('Transaction rolled back', {
            transactionId: transaction.id,
            reason: error.message,
            flightId: data.flightId,
            userId: data.userId,
        });
        await transaction.rollback();
        throw error;
    }
}

async function makePayment(data) {
    const startTime = Date.now();
    const transaction = await db.sequelize.transaction();
    logger.info('Transaction started for payment', {
        transactionId: transaction.id,
        bookingId: data.bookingId,
        userId: data.userId,
        totalCost: data.totalCost,
    });
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
        logger.info('Fetched booking details', {
            bookingId: data.bookingId,
            status: bookingDetails.status
        });
        if (bookingDetails.status == CANCELLED) {
            logger.warn('Booking already cancelled', { bookingId: data.bookingId });
            throw new AppError("This Booking has already been cancelled.", StatusCodes.BAD_REQUEST);
        }

        if (bookingDetails.status == BOOKED) {
            logger.warn('Booking already booked', { bookingId: data.bookingId });
            throw new AppError("This Booking has already been booked.", StatusCodes.BAD_REQUEST);
        }

        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        // Give the Time for 5 mins to complete the payment, if more than that Cancel the booking
        if (currentTime - bookingTime > 5 * 60 * 1000) {
            await cancelBooking(data.bookingId);
            throw new AppError("This Booking has already been Expired.", StatusCodes.BAD_REQUEST);
        }

        if (bookingDetails.totalCost != data.totalCost) {
            throw new AppError("The amount of payment doesn't match.", StatusCodes.BAD_REQUEST);
        }
        if (bookingDetails.userId != data.userId) {
            throw new AppError("The user corresponding to the booking doesn't match.", StatusCodes.BAD_REQUEST);
        }

        // Assunming payment is successfull
        // Update the state of Booking
        logger.info('Updating booking status to BOOKED', {
            bookingId: data.bookingId,
            userId: data.userId,
            totalCost: data.totalCost,
        });
        const response = await bookingRepository.update({ status: BOOKED }, data.bookingId, transaction);
        await transaction.commit();
        logger.info('Transaction committed for payment', {
            transactionId: transaction.id,
            bookingId: data.bookingId,
            userId: data.userId,
            durationMs: Date.now() - startTime
        });
        
        Queue.sendData({                  // No await cus we want to it to do async; like in background; Fire and Forget
            text: `Booking Successfull ${data.bookingId}`,
            recepientEmail: data.email,
            subject: 'Flight Booked'
        }).catch(err => {
            logger.error('Failed to send email', {
                error: err.message,
                bookingId: data.bookingId,
                userId: data.userId
            });
        });
        return response;
    } catch (error) {
        try {
            await transaction.rollback();
            logger.error('Transaction rolled back for payment', {
                transactionId: transaction.id,
                bookingId: data.bookingId,
                userId: data.userId,
                reason: error.message,
            });
        } catch (rollbackErr) {
            logger.error('Rollback failed', {
                originalError: error.message,
                rollbackError: rollbackErr.message,
                transactionId: transaction.id
            });
            throw rollbackErr;
        }
        throw error;
    }
}

async function cancelBooking(bookingId) {

    const transaction = await db.sequelize.transaction();
    logger.info('Transaction started for booking cancellation', {
        transactionId: transaction.id,
        bookingId: bookingId,
    });
    try {
        const bookingDetails = await bookingRepository.get(bookingId, transaction);
        if (bookingDetails.status == CANCELLED) {
            logger.warn('Booking already cancelled', { bookingId: bookingId });
            await transaction.commit();
            return true;
        }
        if (bookingDetails.status == BOOKED) {
            logger.warn('Booking already booked', { bookingId: bookingId });
            throw new AppError("This Booking has already been booked.", StatusCodes.BAD_REQUEST);
        }
        // Increase the seats
        await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`, {
            seats: bookingDetails.noofSeats,
            dec: "0"
        });
        logger.info('Updating booking status to CANCELLED', {
            bookingId: bookingId,
            userId: bookingDetails.userId,
        });
        await bookingRepository.update({ status: CANCELLED }, bookingId, transaction);

        await transaction.commit();
        logger.info('Transaction committed for booking cancellation', {
            transactionId: transaction.id,
            bookingId: bookingId
        });
    } catch (error) {
        await transaction.rollback();
        logger.error('Transaction rolled back for booking cancellation', {
            transactionId: transaction.id,
            bookingId: bookingId,
            reason: error.message,
        });
        throw error;
    }
}

async function cancelOldBookings() {
    try {
        const time = new Date(Date.now() - 300 * 1000);
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