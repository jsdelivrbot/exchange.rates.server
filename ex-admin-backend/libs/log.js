const winston = require('winston');
winston.emitErrs = true;

/**
 * Add logger to the application
 */
function getLogger(module)
{
	let path = module.filename.split('\\').slice(-2).join('\\');

	return new winston.Logger({
		transports: [
			new winston.transports.File({
				level: 'error',
				filename: process.cwd() + '/logs/error.log',
				handleException: true,
				json: true,
				maxSize: 5242880, // 5 mb
				maxFiles: 2,
				colorize: false
			}),
			new winston.transports.Console({
				colorize: true,
				level: 'debug',
				label: path,
				handleException: true,
				json: false
			})
		],
		exitOnError: false
	});
}

module.exports = getLogger;