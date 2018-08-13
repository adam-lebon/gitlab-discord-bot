const winston = require('winston');
const { MESSAGE, SPLAT } = require('triple-beam');

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format((info, opts) => {
            info[MESSAGE] = `${info.level}: [${info.message.toUpperCase()}] ${info[SPLAT].join(' ')}`
            return info;
        })()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

module.exports = {
    logger
};
