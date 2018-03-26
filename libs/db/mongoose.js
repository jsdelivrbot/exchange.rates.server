const mongoose = require('mongoose');
const libs     = process.cwd() + '/libs/';
const log      = require(libs + 'log')(module);
const config   = require(libs + 'config');

let connect = () =>
{
	return new Promise(resolve =>
	{
		mongoose.connect(config.get('mongoose:uri'));
		const db = mongoose.connection;

		db.on('error', err => log.error('Connection error: ', err.message));
		db.once('open', () =>
		{
			log.info('Connected to DB');
			resolve(mongoose);
		});
	});
};

module.exports = connect;