const assert = require('assert');
const libs   = process.cwd() + '/libs/';
const log    = require(libs + 'log')(module);

/**
 * @collection - name of target collection
 * Find target collection if there are any in DB
 */
let find = (collection) =>
{
	return new Promise(resolve =>
	{
		let Collection = require(libs + 'model/' + collection);

		Collection.find((err, result) =>
		{
			assert.equal(null, err);
			log.warn('Searching for "' + collection + 's" collection results...');

			resolve(result);
		});
	});
};

module.exports = find;