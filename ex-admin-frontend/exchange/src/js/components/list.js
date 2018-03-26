export default class List
{
	constructor(yandexMap, request, eventBus)
	{
		this.yMap = yandexMap;
		this.request = request;
		this.eventBus = eventBus;

		this.distance = 1000;

		// Subscribe to exchange currencies change
		this.eventBus.on('select:update', this.getSelectedCurrency.bind(this));

		// Subscribe to distance change
		this.eventBus.on('distance:value', num => this.distance = +num);
	}

	/**
	 *
	 * @param func - receive function
	 * @param wait - receive delay in ms
	 * @returns {function()}
	 */
	/*debounce(func, wait)
	{
		let timer;
		return () =>
		{
			clearTimeout(timer);
			let args = arguments;
			timer = setTimeout(() => { func.apply(null, args); }, wait);
		};
	}*/

	/**
	 *
	 * @param arr receive an array
	 * [selected currency, parent css class]
	 * from "select:update" subscribe
	 */
	getSelectedCurrency(arr)
	{
		if (typeof arr[0] === 'string')
		{
			if (arr[1] === 'select-input')
			{
				this.inputCurrency = arr[0].toLowerCase();
				//console.log(this.inputCurrency);
			}
			else if (arr[1] === 'select-output')
			{
				this.outputCurrency = arr[0].toLowerCase();
				//console.log(this.outputCurrency);
			}
		}

		// Get current location if inputCurrency && outputCurrency added
		if (this.inputCurrency && this.outputCurrency)
		{
			this.currentCurrencies = this.inputCurrency + '-' + this.outputCurrency;
			// If API were loaded
			if (this.yMap.executed)
			{
				// Render location
				this.yMap.getCurrentLocation();
			}
		}
	}

	/**
	 *
	 * @param city - the string which contain city name
	 * @returns {*} This function receive all departments from execute getRates
	 * function and then returns filtered list of departments
	 */
	getList(city)
	{
		if (city)
		{
			return this.request.getRates(city)
			           .then(data => this.getFilteredList(data))
			           .catch(error => console.error(error));
		}
		return null;
	}

	/**
	 *
	 * @param data receive object with all departments from getList() function
	 * @returns {0:{order:0}...n:{order:n}} - returns sorted object
	 */
	getFilteredList(data)
	{
		let filteredData = {};
		let filteredArr = [];

		for (let i in data) { filteredArr.push(data[i]); }

		let setOrderNumbers = (filteredArr) =>
		{
			for (let i = 0; i < filteredArr.length; i++)
			{
				filteredArr[i]['order'] = i;
				filteredData[i] = filteredArr[i];
			}
			// Returns object with sorted departments
			return filteredData;
		};

		return new Promise(resolve => resolve(
			// Add coordinates to all departments
			this.yMap.addCoordinatesToList(filteredArr)
			    .then(arr =>
			    {
				    if (this.yMap.currentLatLng)
				    {
					    return this.checkDistance(this.yMap.currentLatLng, arr);
				    }
				    return arr;
			    })
			    .then(arr =>
			    {
			    	if (this.distance)
				    {
					    return this.filterByDistance(this.distance, arr)
				    }
				    return arr;
			    })
				.then(arr => this.filterByRate(arr))
				.then(arr => this.filterByLimit(arr))
				.then(arr => this.setRateHelpers(arr))
				.then(arr =>
				{
					this.yMap.addPlacemarks(arr);
					return arr;
				})
				.then(arr => setOrderNumbers(arr))
				.catch(err => console.log(err))
		));
	}

	checkDistance(curLoc, arr)
	{
		return arr.map(obj =>
		{
			if (obj.coordinates && obj.coordinates[0] && obj.coordinates[1])
			{
				obj['distance'] = +this.getDistance(curLoc[0], curLoc[1], obj.coordinates[0], obj.coordinates[1])
				                       .toFixed(0);
				//console.log(obj['address']);
				//console.log(obj['distance']);
			}
			else
			{
				obj['distance'] = 9999999;
				//console.log(obj);
			}
			return obj;
		})
	}

	getDistance(lat1, long1, lat2, long2)
	{
		// The Earth radius
		let R = 6372795;
		// Convert coordinates to radians
		lat1 *= Math.PI / 180;
		lat2 *= Math.PI / 180;
		long1 *= Math.PI / 180;
		long2 *= Math.PI / 180;
		// Calculate cos and sin for lat, lng
		let cl1 = Math.cos(lat1);
		let cl2 = Math.cos(lat2);
		let sl1 = Math.sin(lat1);
		let sl2 = Math.sin(lat2);
		let delta = long2 - long1;
		let cdelta = Math.cos(delta);
		let sdelta = Math.sin(delta);
		// Length calculation for the big circle
		let y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
		let x = sl1 * sl2 + cl1 * cl2 * cdelta;
		let ad = Math.atan2(y, x);
		// Returns distance between two points (meters)
		return ad * R;
	}

	filterByDistance(targetDist, arr)
	{
		return arr.filter(obj =>
		{
			if (obj.distance && obj.distance <= targetDist)
			{
				return obj;
			}
		})
	}

	/**
	 *
	 * @param arr - receive an array with all departments which need to be sorted
	 */
	filterByRate(arr)
	{
		let cur = this.inputCurrency + '-' + this.outputCurrency;

		// Filter departments without target cur
		arr = arr.filter(obj => obj.rates[cur] ? obj : false);

		// Sort
		if (this.inputCurrency === 'byn')
		{
			arr.sort((a,b) => a.rates[cur] - b.rates[cur]);
		}
		else
		{
			arr.sort((a,b) => b.rates[cur] - a.rates[cur]);
		}

		return arr;
	}

	/**
	 *
	 * @param arr - receive an array with all departments which need to be sorted
	 */
	filterByLimit(arr)
	{
		let result = [];

		for (let i = 0; i <= 40; i++)
		{
			if (arr[i])
			{
				result.push(arr[i])
			}
		}

		return result;
	}

	setRateHelpers(arr)
	{
		let cur = this.currentCurrencies;
		let bestRate = arr[0].rates[cur];

		return arr.map(obj =>
		{
			if (obj.rates[cur] === bestRate)
			{
				obj.rates.helper = 'лучший курс';
			}
			else
			{
				let helper = obj.rates[cur] - bestRate;
				if (helper >= 0)
				{
					obj.rates.helper = '+' + helper.toFixed(3);
				}
				else
				{
					obj.rates.helper = helper.toFixed(3);
				}
			}
			return obj;
		});
	}
}