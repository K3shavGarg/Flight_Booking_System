const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../utils/errors');

const { serverConfig } = require('../config');
const logger = require('../config/logger-config');

function authMiddleware(req, res, next) {
    req.startTime = Date.now();

    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'No token provided'
        });
    }

    try {
        const secretKey = serverConfig.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey);

        if (!decoded.id || !decoded.sub) {
            throw new AppError('Invalid token', StatusCodes.UNAUTHORIZED);
        }

        req.userId = decoded.id;
        req.email = decoded.sub;
        logger.info(`Token verified for userId ${req.userId}`, {
            userId: req.userId,
            email: req.email,
            ip: req.ip,
        });
        next();
    } catch (error) {
        logger.warn('Invalid token', {
            ip: req.ip, 
            error: error.message,
        });

        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Invalid or expired token',
            error: error.message
        });
    }
}


module.exports = {
    authMiddleware
};