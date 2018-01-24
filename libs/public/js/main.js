const assert = require('assert');
const libs   = process.cwd() + '/libs/';
const log    = require(libs + 'log')(module);
const config = require(libs + 'config');
const db     = require('./db');

let obj = {};

/**
 * Gather all departments data to obj, then get coordinates by address, then save all data from this obj to the db
 */
let result = () =>
{
	return new Promise(resolve =>
	{
		// Make requests and gather objects
		resolve(require('./collector')(obj));
	})
		.then(result => new Promise(resolve =>
		{
			log.warn('Departments gathering is done by collector.js!');
			// Get coordinates by address
			resolve(require('./yandex/geocoder')(result));
		}, error => log.error(error))
			.then(data => new Promise(resolve =>
			{
				log.warn('Geocoder received all coordinates!');
				// Save to db
				resolve(require('./db/saveCollection')(data, 'department'))
			}, error => log.error(error)))
		);
};

module.exports = result;