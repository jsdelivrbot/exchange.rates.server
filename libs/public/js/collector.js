const assert = require('assert');
const libs   = process.cwd() + '/libs/';
const log    = require(libs + 'log')(module);
const config = require(libs + 'config');

let cityLinks = config.get('cityLinks');

/**
 * Gather all departments data from all BLR cities
 */
let getData = (object) =>
{
	/**
	 * Merge objects with data for different cities
	 */
	let recursion = (object, i) =>
	{
		return new Promise(resolve => resolve(require('./request/currenciesRequest')(cityLinks[i], object)))
			.then(
				res =>
				{
					i++;
					if (cityLinks.length > i)
					{
						return new Promise(resolve => resolve(recursion(res, i)))
							.then(result => result, error => log.error(error));
					}
					else return res;
				},
				error => log.error(error));
	};

	return new Promise(resolve => resolve(recursion(object, 0)))
		.then(result => result, error => log.error(error));
};

module.exports = getData;