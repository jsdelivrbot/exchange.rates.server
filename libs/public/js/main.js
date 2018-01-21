const assert = require('assert');
const libs   = process.cwd() + '/libs/';
const log    = require(libs + 'log')(module);
const config = require(libs + 'config');

let obj = {};

let result = () =>
{
	return new Promise(resolve =>
	{
		resolve(require('./collector')(obj));
	})
		.then(
			result => result,
			error => log.error(error)
		);
};

module.exports = result;