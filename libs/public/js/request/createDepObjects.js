/**
 *
 * Returns object with objects which contains all departments data
 */
let createDepObjects = (result, options) =>
{
	return result.map(str =>
	{
		let bankName   = require('./select')(str, 'bankName') || '';       // Bank name
		let title      = require('./select')(str, 'title') || '';          // Department name
		let link       = require('./select')(str, 'link') || '';           // Link to bank`s website
		let phone      = require('./select')(str, 'phone') || '';          // Phone number
		let city       = require('./select')(str, 'city') || '';           // Address city
		let address    = require('./select')(str, 'address') || '';        // Address street
		let additional = require('./select')(str, 'additional') || '';     // Address additional info
		let date       = require('./select')(str, 'date') || '';           // Last update time

		// Get all rates by <td>....</td></tr> template
		let ratesArr = str.match(/\<td.+?\>\<span.+?\>[^w]+?\<\/td\>\<\/tr\>/g) || [];
		// Sort by <td> tag
		ratesArr = ratesArr.join('').match(/\<td.+?\>[^w]+?\<\/td\>/g) || [];

		ratesArr = ratesArr.map(str =>
		{
			// Remove <span> tags
			str = str.replace(/(\<span.+?\>)/,'').replace(/(\<\/span\>)/,'');
			// Match currency rate, currencies names and type of exchange [ 'eurusd', 'buy', 1.198 ]
			let arr = str.match(/\<td.+?\>([^w]+?)\<i class="conv-btn (.+?)" data-c="(.+?)"/i) || [];
			// Remove first element from arr
			arr.shift();

			// Convert to number type
			arr = arr.map(str =>
			{
				if (isNaN(+str)) return str;
				return +str;
			});

			return arr.reverse();
		});

		// Object with rates
		let ratesTmpObj = {};

		// Buy rates
		ratesTmpObj.buy = ratesArr.filter((item, i) =>
		{
			if (item && item[1] === 'buy') return item;
			return false;
		});

		// Sell rates
		ratesTmpObj.sell = ratesArr.filter((item, i) =>
		{
			if (item && item[1] === 'sell') return item;
			return false;
		});

		// Create rates object
		let rates = {};

		// Convert buy and sell rates arrays to objects
		rates.buy = ratesTmpObj.buy.reduce((obj, arr) => ((
			function()
			{
				// There is may be "-" signs or NaN, so we should check it
				if (typeof arr[2] === 'number')
				{
					switch (arr[0])
					{
						// 1 BYN to USD currency convert
						case 'usd':
							obj['byn-usd'] = 1 / arr[2];
							break;

						// 1 BYN to EUR currency convert
						case 'eur':
							obj['byn-eur'] = 1 / arr[2];
							break;

						// 1 BYN to RUB currency convert (myfin has 100 RUB per ONE option)
						case 'rub':
							obj['byn-rub'] = 100 / arr[2];
							break;

						case 'eurusd':
							// 1 EUR to USD currency convert (myfin has same rates for both)
							if (options.currencyType === 'eur') obj['eur-usd'] = arr[2];
							break;

						case 'eurrur':
							// 1 EUR to RUB currency convert (myfin has same rates for both)
							if (options.currencyType === 'eur') obj['eur-rub'] = arr[2];
							break;

						case 'usdrur':
							// 1 USD to RUB currency convert (myfin has same rates for both)
							if (options.currencyType === 'usd') obj['usd-rub'] = arr[2];
							break;
					}
				}
				//else console.log(arr[2]);
			}()
		), obj), {});

		rates.sell = ratesTmpObj.sell.reduce((obj, arr) => ((
			function()
			{
				// There is may be "-" signs or NaN, so we should check it
				if (typeof arr[2] === 'number')
				{
					switch (arr[0])
					{
						// 1 USD to BYN currency convert
						case 'usd':
							obj['usd-byn'] = arr[2];
							break;

						// 1 EUR to BYN currency convert
						case 'eur':
							obj['eur-byn'] = arr[2];
							break;

						// 1 RUB to BYN currency convert
						case 'rub':
							obj['rub-byn'] = arr[2] / 100;
							break;

						case 'eurusd':
							// 1 USD to EUR currency convert (myfin has same rates for both)
							if (options.currencyType === 'usd') obj['usd-eur'] = 1 / arr[2];
							break;

						case 'eurrur':
							// 1 RUB to EUR currency convert (myfin has same rates for both)
							if (options.currencyType === 'rub') obj['rub-eur'] = 1 / arr[2];
							break;

						case 'usdrur':
							// 1 RUB to USD currency convert (myfin has same rates for both)
							if (options.currencyType === 'rub') obj['rub-usd'] = 1 / arr[2];
							break;
					}
				}
				//else console.log(arr[2]);
			}()
		), obj), {});

		// Add default currencies to rates object
		rates.buy['byn-byn'] = 1;
		rates.buy['usd-usd'] = 1;
		rates.buy['eur-eur'] = 1;
		rates.buy['rub-rub'] = 1;

		// Merge rates
		rates = require('../methods/MergeRecursive')(rates.buy, rates.sell);

		return {
			bankName,
			title,
			link,
			phone,
			city,
			address,
			additional,
			date,
			rates
		};
	});
};

module.exports = createDepObjects;