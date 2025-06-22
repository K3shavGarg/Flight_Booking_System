const { StatusCodes } = require("http-status-codes");
const logger = require("../config/logger-config");
const { AppError } = require("../utils/errors");

module.exports = (req, res, next) => {
    try{
        if(!req.body.subject || !req.body.content || !req.body.recepientEmail){
            throw new AppError("subject, content,recepientEmail should not be empty");
        }
        next();
    }catch(error){
        logger.error("Error in creating ticket", {
            error: error.message
        });
        errResponse = createErrorResponse();
        errResponse.message = 'Error in creating ticket';
        errResponse.error = error;
        return res.status(StatusCodes.BAD_REQUEST).json(errResponse);
    }
}

function createErrorResponse() {
    return {
        success: false,
        message: 'Something went wrong',
        data: {},
        error: {}
    };
}