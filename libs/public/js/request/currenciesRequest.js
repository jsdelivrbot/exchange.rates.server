const assert = require('assert');
const async = require('async');
const libs = process.cwd() + '/libs/';
const log = require(libs + 'log')(module);
const config = require(libs + 'config');

let currencyTypes = config.get('currencyTypes');

let result = (link, obj) => {
	return new Promise(resolve => {
		// Make request for each currency and then merge objects with data for different currencies
		async.each(currencyTypes, (type, next) => {
			new Promise(resolve => {
				let options = {
					cityLink: link,
					currencyType: type,
					host: 'myfin.by',
					path: '/currency/' + type + '/' + link,
					method: 'POST'
				};

				// For Minsk there is no link
				if (link === 'minsk') {
					options.path = '/currency/' + type;
				}

				resolve(require('../request')(options));
			})
				.then(res => {
					require('../methods/mergeRecursive')(obj, res);
					resolve(obj);
					next();
					return obj;
				});
		}, err => assert.equal(null, err));
	});
};

module.exports = result;
