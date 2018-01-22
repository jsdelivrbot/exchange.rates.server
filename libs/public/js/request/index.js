const https = require('https');
const libs  = process.cwd() + '/libs/';
const log   = require(libs + 'log')(module);

function getData(options)
{
	/**
	 * Get data from host and then reorganize this data to object
	 */
	return new Promise(resolve =>
	{
		let result = {};
		let page = '';
		let req = https.request(options, res =>
		{
			res.on('readable', function()
			{
				let data = res.read();
				if (data) page += data;
			});

			res.on('end', () =>
			{
				page = page.match(/\<td\>\s*\<div class="ttl"\>(.|[\r\n])+?\<\/td\>\<\/tr\>/igm) || [];
				page = require('./createDepObjects')(page, options) || [];

				// Get current city
				let city = (page instanceof Array && page[0] && page[0].city) ? page[0].city : null;

				page = page.reduce((prevVal, curVal) => (prevVal[curVal.title] = curVal, prevVal), {});
				result[city] = page;

				resolve(result);
			});
		});

		req.on('error', err =>
		{
			if (err.code === 'ENOENT') { log.error("No such file or directory"); }
			else { log.error(err.message); }
		});

		req.end();
	});
}

module.exports = getData;