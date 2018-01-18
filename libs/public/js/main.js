const mongoose   = require('mongoose');
const assert     = require('assert');
const async      = require('async');
const libs       = process.cwd() + '/libs/';
const log        = require(libs + 'log')(module);
const Department = require(libs + 'model/department');


let currencyType = ['usd', 'eur', 'rub'];
let cityLink     = '';
let obj          = {};

let getData = () =>
{
	log.info('start');
	/**
	 * Merge objects with data for different currencies
	 */
	async.each(currencyType, function(type, next)
	{
		new Promise(resolve =>
		{
			let options = {
				city: cityLink,
				currencyType: type,
				host: 'myfin.by',
				path: '/currency/' + type + cityLink,
				method: 'POST'
			};

			resolve(require('./request')(options));
		})
			.then(res =>
			{
				require('./methods/MergeRecursive')(obj, res);
				next();
				return res;
			});
	}, function(err)
	{
		assert.equal(null, err);
		log.info('finished');
		//log.info(JSON.stringify(obj, '', 4));
		Department.remove({}, function(err)
		{
			for (let i in obj)
			{
				let department = new Department({
					name: i,
					bankName: obj[i].bankName,
					title: obj[i].title,
					link: obj[i].link,
					phone: obj[i].phone,
					city: obj[i].city,
					address: obj[i].address,
					additional: obj[i].additional,
					date: obj[i].date,
					rates: {
						"byn-byn": obj[i].rates["byn-byn"],
						"byn-usd": obj[i].rates["byn-usd"],
						"byn-eur": obj[i].rates["byn-eur"],
						"byn-rub": obj[i].rates["byn-rub"],

						"usd-usd": obj[i].rates["usd-usd"],
						"usd-byn": obj[i].rates["usd-byn"],
						"usd-eur": obj[i].rates["usd-eur"],
						"usd-rub": obj[i].rates["usd-rub"],

						"eur-eur": obj[i].rates["eur-eur"],
						"eur-byn": obj[i].rates["eur-byn"],
						"eur-usd": obj[i].rates["eur-usd"],
						"eur-rub": obj[i].rates["eur-rub"],

						"rub-rub": obj[i].rates["rub-rub"],
						"rub-byn": obj[i].rates["rub-byn"],
						"rub-usd": obj[i].rates["rub-usd"],
						"rub-eur": obj[i].rates["rub-eur"]
					}
				});

				department.save(function(err, department)
				{
					if (!err) log.info("New department - %s: %s", department.bankName, department.name);
					else return log.error(err);
				});
			}
		});
	});
};

module.exports = getData;