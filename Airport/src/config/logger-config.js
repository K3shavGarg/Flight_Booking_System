const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const {node_env}  = require('./server-config')
const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // log stack trace in errors
    format.json() // logs in JSON format for parsing
);

const logger = createLogger({
    level: 'info', // minimum level to log (can be 'debug' in dev)
    defaultMeta: {
        service: 'airport-service',
        environment : node_env
    },
    format: logFormat,
    transports: [
        // Console output
        new transports.Console({
            format: format.combine(
                format.colorize(), // color only in console
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.printf(({ level, message, timestamp, ...meta }) => {
                    return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
                })
            )
        }),

        // Combined logs (info and above)
        new transports.File({
            filename: 'logs/combined.log',
            level: 'info'
        }),

        // Error logs
        new transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),

        // Optional: Rotate logs daily
        new DailyRotateFile({
            filename: 'logs/daily-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'info'
        })
    ],
    exitOnError: false
});

module.exports = logger;
