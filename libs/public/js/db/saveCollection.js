const assert = require('assert');
const libs = process.cwd() + '/libs/';
const log = require(libs + 'log')(module);

/**
 * @data - object with departments data, which should be saved to the db
 * @collection - name of target collection
 * Save all data to target collection
 */
let save = (data, collection) => {
	let Collection = require(libs + 'model/' + collection);

	for (let i in data) {
		let collectionPattern = new Collection(require('./patterns/' + collection)(data, i));

		let promise = collectionPattern.save();
		assert.ok(promise instanceof Promise);

		promise
			.then(doc => {
				assert.equal(doc.city, i);
				return doc;
			}, error => log.error(error))
			.then(doc => log.info(doc.city + ' city saved in ' + '"' + collection + 's" collection'));
	}
};

module.exports = save;
