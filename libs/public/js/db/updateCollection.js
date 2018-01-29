const assert = require('assert');
const libs   = process.cwd() + '/libs/';
const log    = require(libs + 'log')(module);

/**
 * @collection - name of target collection
 * @savedData - the data which stored in the target collection
 * @currentData - the new generated data with valid rates and other properties
 * Compare two instances
 */
let updateCollection = (collection, savedData, currentData) =>
{
	// "currentData" should be an Object
	if (!(currentData instanceof Object))
	{
		log.error('"currentData" is not an Object');
		return {};
	}

	// Define target collection schema
	let Collection = require(libs + 'model/' + collection);

	// "savedData" should be an Array of objects
	if (savedData instanceof Array)
	{
		for (let city in currentData)
		{
			// Check if current city already exist
			Collection.findOne({ city: city }, (err, data)  =>
			{
				assert.equal(null, err);

				let collectionPattern = new Collection(require('./patterns/' + collection)(currentData, city));

				// If current city is not found in db, then add it to db
				if (!data)
				{
					let promise = collectionPattern.save();
					assert.ok(promise instanceof Promise);

					promise
						.then(doc =>
						{
							assert.equal(doc.city, city);
							return doc;
						}, error => log.error(error))
						.then(doc => log.info(doc.city + ' city saved in ' + '"' + collection + 's" collection'));
				}
				// The city was found, let`s update departments
				else
				{
					for (let departmentName in currentData[city])
					{
						// Update department
						if (data.body[departmentName])
						{
							let currentDep = currentData[city][departmentName];
							let dbDep = data.body[departmentName];

							dbDep.date = currentDep.date;
							dbDep.rates = currentDep.rates;

							let promise = data.save();
							assert.ok(promise instanceof Promise);
							promise
								.then(doc =>
								{
									assert.equal(doc.city, city);
									return doc;
								}, error => log.error(error))
								.then(doc => log.info( doc.city + ' ' + doc.body[departmentName].title + ' department is updated in ' + '"' + collection + 's" collection'));
						}
						// Add new department
						else
						{

						}
					}
				}

				//log.info(JSON.stringify(data,'',4));
				//doc.name = 'jason bourne';
				//doc.visits.$inc();
				//doc.save();
			});
		}
	}
	else
	{
		log.error('"savedData" is not an Array');
	}
};

module.exports = updateCollection;