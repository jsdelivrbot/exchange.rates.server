const MultiGeocoder = require('multi-geocoder');
const geocoder = new MultiGeocoder({ provider: 'yandex-cache', coordorder: 'latlong' });
const libs = process.cwd() + '/libs/';
const log = require(libs + 'log')(module);

/**
 * Gets lat and lng for all departments addresses
 */
let getLatLng = (data) => {
	// Let`s find out how many departments in data object
	let count = require('../methods/propertyCounter')(data, 'title') || 0;
	let testCount = 0;

	// Get coordinates one by one, this is more stable way, than multiple request to get right coordinates for every department.
	let setCoord = (city, department, data) => {
		let address = data[ city ][ department ].address;
		if (address.indexOf(city) >= 0) {
			address = 'Беларусь, ' + address;
		} else {
			address = 'Беларусь, ' + city + ', ' + address;
		}
		testCount++;
		//log.warn('Number of requests ' + testCount + '/' + count);

		return geocoder.geocode([ address ])
			.then(res => {
				if (res && res.result && res.result.features) {
					let response = res.result.features;
					if (response[ 0 ]) {
						if (response[ 0 ].geometry && response[ 0 ].geometry.coordinates) {
							data[ city ][ department ].coordinates = response[ 0 ].geometry.coordinates;
						} else {
							data[ city ][ department ].coordinates = [ 0, 0 ];
						}

						if (response[ 0 ].properties && response[ 0 ].properties.metaDataProperty && response[ 0 ].properties.metaDataProperty.GeocoderMetaData && response[ 0 ].properties.metaDataProperty.GeocoderMetaData.text) {
							data[ city ][ department ].fullAddress = response[ 0 ].properties.metaDataProperty.GeocoderMetaData.text;
						}
					} else {
						data[ city ][ department ].coordinates = [ 0, 0 ];
					}
				} else {
					data[ city ][ department ].coordinates = [ 0, 0 ];
				}

				return data;
			}, error => log.error(error));
	};

	// Check if all coordinates are received
	let checkData = (city, department, data) => {
		let checkNum = require('../methods/propertyCounter')(data, 'coordinates') || 0;

		if (checkNum !== count - 1) {
			log.warn('Waiting for 3 sec until all coordinates will be received...' + checkNum + '(' + (count - 1) + ')');
			return new Promise(resolve => {
				setTimeout(() => {
					resolve(checkData(city, department, data));
				}, 3000);
			});
		} else {
			return new Promise(resolve => {
				resolve(setCoord(city, department, data));
			});
		}
	};

	let i = 1;
	for (let city in data) {
		if (data.hasOwnProperty(city)) {
			for (let department in data[ city ]) {
				if (data[ city ].hasOwnProperty(department)) {
					if (i === count) {
						return new Promise(resolve => {
							resolve(checkData(city, department, data));
						});
					} else {
						setCoord(city, department, data);
					}
					i++;
				}
			}
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
