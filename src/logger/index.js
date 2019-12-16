const { createLogger, format, transports } = require('winston');

const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
    format: combine(
        timestamp(),
        customFormat,
    ),
    transports: [
        new transports.Console(),
    ]
});

// Write function that will be used with morgan
logger.stream = {
    write: function(message) {
        logger.info(message);
    }
};

module.exports = logger;
