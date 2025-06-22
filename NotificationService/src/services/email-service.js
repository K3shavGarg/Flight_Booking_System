const { TicketRepository } = require('../repositories');
const { mailSender } = require('../config');
const { AppError } = require('../utils/errors');
const { StatusCodes } = require('http-status-codes');
const logger = require('../config/logger-config');

const ticketRepository = new TicketRepository();

async function sendMail(mailFrom, mailTo, subject, text) {
    try {
        logger.info(`Sending email`, {
            mailFrom,
            mailTo,
            subject
        });
        const response = await mailSender.sendMail({
            from: mailFrom,
            to: mailTo,
            subject,
            text
        });
        logger.info(`Email sent successfully`, {
            mailFrom,
            mailTo,
            messageId : response.messageId
        });
        return response;
    } catch (error) {
        logger.error(`Error sending email`, {
            error: error.message,
            mailFrom,
            mailTo,
        });
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

async function createTicket(data) {
    try {
        logger.info(`Creating ticket for recipient`, {
            recipientEmail: data.recepientEmail,
            subject: data.subject,
        });
        const response = await ticketRepository.create(data);
        return response;
    } catch (error) {
        logger.error(`Error creating ticket`, {
            error: error.message,
            recipientEmail: data.recepientEmail,
            subject: data.subject,
        });
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

async function getPendingEmails() {
    try {
        const res = await ticketRepository.getPendingTickets();
        return res;
    } catch (error) {
        console.log(error);
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};





module.exports = {
    sendMail,
    createTicket,
    getPendingEmails
}

