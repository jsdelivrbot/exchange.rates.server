const assert = require('assert');
const libs   = process.cwd() + '/libs/';
const log    = require(libs + 'log')(module);
const config = require(libs + 'config');
const db     = require('./db');

let currentData = {};

/**
 * Gather all departments data to obj, then get coordinates by address, then save all data from this obj to the db
 */
let result = () =>
{
	return new Promise(resolve =>
	{
		// Make requests and gather objects
		resolve(require('./collector')(currentData));
	})
		.then(result => new Promise(resolve =>
		{
			assert.ok(result instanceof Object, '"result" is not an Object');

			log.info('Departments gathering is done by collector.js!');

			// Get coordinates by address
			resolve(require('./yandex/geocoder')(result));
		}, error => log.error(error))
			.then(data => new Promise(resolve =>
			{
				log.info('Geocoder received all coordinates!');
				//log.info(JSON.stringify(data,'',4));

				assert.ok(data instanceof Object, '"data" is not an Object');
				currentData = data;

				// Check if DB is already has target collection
				resolve(require('./db/findCollection')('department'));
				//resolve(require('./db/findCollection')('test'));
			}, error => log.error(error))
				.then(savedData => new Promise(resolve =>
				{
					assert.ok(savedData instanceof Array, '"searchResult" is not an Array');

					if (savedData.length > 0)
					{
						log.warn('Update the data in a DB...');
						let data = require('./db/updateCollection')('department', savedData, currentData);
						resolve(data);
					}
					else
					{
						log.warn('Save the data in a DB...');
						// Save to db
						resolve(require('./db/saveCollection')(currentData, 'department'))
					}

					//log.info(JSON.stringify(currentData,'',4));
				}, error => log.error(error)))
			)
		);
};

module.exports = result;