const MultiGeocoder = require('multi-geocoder');
let geocoder = new MultiGeocoder({ provider: 'yandex-cache', coordorder: 'latlong' });

/**
 * Gets lat and lng for all departments addresses
 */
let getLatLng = (data) =>
{
	let addressArr = [];

	for (let city in data)
	{
		for (let department in data[city])
		{
			addressArr.push(data[city][department].address)
		}
	}

	return geocoder.geocode(addressArr)
	        .then(res =>
	        {
	        	if (res && res.result && res.result.features)
		        {
			        let i = 0;

			        for (let city in data)
			        {
				        for (let department in data[city])
				        {
				        	if (res.result.features[i] && res.result.features[i].geometry && res.result.features[i].geometry.coordinates)
					        {
						        data[city][department].coordinates = res.result.features[i].geometry.coordinates;
						        i++;
					        }
				        }
			        }
		        }
		        return data;
	        }, error => log.error(error));
};

module.exports = getLatLng;