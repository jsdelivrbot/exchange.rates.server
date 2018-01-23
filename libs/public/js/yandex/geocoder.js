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
		        	let response = res.result.features;
			        let i = 0;

			        for (let city in data)
			        {
				        for (let department in data[city])
				        {
				        	if (response[i])
					        {
					        	if (response[i].geometry && response[i].geometry.coordinates)
						        {
							        data[city][department].coordinates = response[i].geometry.coordinates;
						        }

						        if (response[i].properties && response[i].properties.metaDataProperty && response[i].properties.metaDataProperty.GeocoderMetaData && response[i].properties.metaDataProperty.GeocoderMetaData.text)
						        {
							        data[city][department].fullAddress = response[i].properties.metaDataProperty.GeocoderMetaData.text;
						        }
						        i++;
					        }
				        }
			        }
		        }
		        return data;
	        }, error => log.error(error));
};

module.exports = getLatLng;