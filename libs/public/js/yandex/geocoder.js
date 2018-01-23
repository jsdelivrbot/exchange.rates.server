const MultiGeocoder = require('multi-geocoder');
let geocoder = new MultiGeocoder({ provider: 'yandex-cache', coordorder: 'latlong' });

/**
 * Gets lat and lng for all departments addresses
 */
let getLatLng = (data) =>
{
	// Get coordinates one by one, this is more stable way, than multiple request to get right coordinates for every department
	let setCoord = (city, department, address) =>
	{
		return geocoder.geocode([address])
		        .then(res =>
		        {
			        if (res && res.result && res.result.features)
			        {
				        let response = res.result.features;
				        //console.log(response[0]);
				        if (response[0])
				        {
					        if (response[0].geometry && response[0].geometry.coordinates)
					        {
						        data[city][department].coordinates = response[0].geometry.coordinates;
					        }

					        if (response[0].properties && response[0].properties.metaDataProperty && response[0].properties.metaDataProperty.GeocoderMetaData && response[0].properties.metaDataProperty.GeocoderMetaData.text)
					        {
						        data[city][department].fullAddress = response[0].properties.metaDataProperty.GeocoderMetaData.text;
					        }
				        }
			        }
			        return data;
		        }, error => log.error(error));
	};

	let count = 0;
	for (let city in data)
	{
		count += Object.keys(data[city]).length;
	}

	let i = 1;

	for (let city in data)
	{
		for (let department in data[city])
		{
			if (i === count)
			{
				return new Promise(resolve =>
				{
					resolve(setCoord(city, department, data[city][department].address))
				});
			}
			else
			{
				setCoord(city, department, data[city][department].address);
			}
			i++;
		}
	}
};

/*let getLatLng = (data) =>
{
	let addressArr = [];

	for (let city in data)
	{
		for (let department in data[city])
		{
			addressArr.push(data[city][department].address);
		}
	}

	return geocoder.geocode(addressArr)
	               .then(res =>
	               {
		               if (res && res.result && res.result.features)
		               {
			               let response = res.result.features;
			               let i        = 0;

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
					               }
					               i++;
				               }
			               }
		               }
		               return data;
	               }, error => log.error(error));
};*/

module.exports = getLatLng;