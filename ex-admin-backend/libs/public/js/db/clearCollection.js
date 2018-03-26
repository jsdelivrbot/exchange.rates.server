const assert = require('assert');
const libs   = process.cwd() + '/libs/';
const log    = require(libs + 'log')(module);

/**
 * @collection - name of target collection
 * Remove all data from target collection
 */
let clear = (collection) =>
{
	require(libs + 'model/' + collection).remove({}, err =>
	{
		assert.equal(null, err);
		log.info( '"' + collection + 's"' + ' collection is clear');
	});
};

module.exports = clear;