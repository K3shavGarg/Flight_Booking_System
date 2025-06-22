const logger = require('../config/logger-config');
const {emailService} = require('../services');
const {StatusCodes} = require('http-status-codes');
const {SuccessResponse, ErrorResponse} = require('../utils/common');

async function createTicket(req, res){
    const startTime = Date.now();
    try {
        const ticket = await emailService.createTicket({
            subject: req.body.subject,
            content: req.body.content,
            recepientEmail: req.body.recepientEmail
        });
        SuccessResponse.data = ticket.toJSON();
        SuccessResponse.message = 'Ticket created successfully';
        logger.info(`Ticket created successfully`, {
            ticketId: SuccessResponse.data.id,
            recipientEmail: req.body.recepientEmail,
            subject: req.body.subject,
            duration: Date.now() - startTime
        });
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        logger.error(`Error creating ticket`, {
            error: error.message,
            recipientEmail: req.body.recepientEmail,
            subject: req.body.subject,
            duration: Date.now() - startTime
        });
        ErrorResponse.error = error.message;
        ErrorResponse.message = 'Failed to create ticket';
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}



module.exports = {
    createTicket
};