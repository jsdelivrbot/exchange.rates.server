export default class yMap
{
	constructor(eventBus)
	{
		this.eventBus = eventBus;
		this.myMap = {};

		this.map = document.querySelector('.map');

		this.getAPI();
		//localStorage.clear();
	}

	/**
	 * This function receive api script from yandex
	 */
	getAPI()
	{
		let script = document.createElement('script');
		script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
		document.head.appendChild(script);

		script.onload = script.onerror = () =>
		{
			if (!this.executed)
			{
				this.getCurrentLocation();
				this.executed = true;
			}
		};
	}

	/**
	 * Get current location by browser geolocation
	 */
	getCurrentLocation()
	{
		// Check if the browser has support for the Geolocation API
		if (!navigator.geolocation)
		{
			console.error('There is some problem with navigator.geolocation');
		}
		else
		{
			navigator.geolocation.getCurrentPosition(position =>
			{
				if (position.coords)
				{
					// Get the coordinates of the current possition.
					let lat = position.coords.latitude;
					let lng = position.coords.longitude;

					// Check if myMap already exist
					if (!this.mapCheck)
					{
						this.currentLatLng = [lat, lng];
						this.initMap(this.currentLatLng);
					}
					else if (this.locationDescription)
					{
						this.eventBus.trigger('location:city', this.locationDescription);
					}
					else
					{
						console.error('Something gone wrong');
					}
				}
			});
		}
	}

	initMap(coordinates)
	{
		ymaps.ready(() =>
		{
			this.mapCheck = true;

			this.myMap = new ymaps.Map(this.map, {
				center: coordinates,
				zoom: 15,
				type: 'yandex#map',
				controls: ['zoomControl', 'typeSelector']
			});

			// Get current city by coordinates
			ymaps.geocode(coordinates)
			     .then(res => res.geoObjects.get(0).properties.getAll())
			     .then(res =>
			     {
			     	this.locationDescription = res.description;
			     	this.eventBus.trigger('location:city', res.description);
			     })
			     .catch(err => console.log(err));
		});
	}

	/**
	 *
	 * @param arr - Array with departments objects
	 * @returns [{*},{*}..] array with departments objects, which contains new key ['coordinates']
	 */
	addCoordinatesToList(arr)
	{
		let check = (str) =>
		{
			// Split address to array
			let addressArr = str.split(',');

			// Remove elements from array
			let remove = (key, arr) =>
			{
				key.map(keyStr =>
				{
					arr = arr.filter(str => str.indexOf(keyStr) < 0);
				});

				return arr;
			};

			// Remove this elements from address field
			let elemToRemove = ['цоколь', 'ТЦ', 'крыло', 'промузел', 'дискаунтер'];
			addressArr = remove(elemToRemove, addressArr);


			// Remove parent city if address contain another settlement
			let checkCity = (key, arr) =>
			{
				let str = arr.join(',');
				key.map(keyStr =>
				{
					if (str.indexOf(keyStr) >= 0)
					{
						arr.splice(0,1);
					}
				});

				return arr;
			};

			let city = ['Ратом', 'Щомыслиц', 'Сениц'];
			addressArr = checkCity(city, addressArr);

			return addressArr.join(',');
		};



		return new Promise(resolve =>
		{
			let getCoordinates = (i) =>
			{
				if (i < arr.length)
				{
					let address;

					if (arr[i].city && arr[i].address)
					{
						address = check(arr[i].city + ', ' + arr[i].address);
					}
					else
					{
						address = check(arr[i].additional);
					}

					ymaps.geocode(address)
					     .then(res =>
					     {
						     arr[i]['coordinates'] = res.geoObjects.get(0).geometry.getCoordinates();
						     //console.log(i + ' ' + arr[i]['coordinates']);
						     getCoordinates(i + 1);
					     })
					     .catch(err =>
					     {
						     arr[i]['coordinates'] = [0,0];
						     //console.log(arr[i]);
						     //console.error(err);
						     getCoordinates(i + 1);
					     });
				}
				else
				{
					console.log('coordinates received');
					// Set main array with departments to local storage
					localStorage.setItem('AllData:' + this.locationDescription, JSON.stringify(arr, "", 4));
					resolve(arr);
				}
			};

			// Get coordinates from local storage, if they are already been received
			let dataStorage = JSON.parse(localStorage.getItem('AllData:' + this.locationDescription)) || {};
			if (Object.keys(dataStorage).length > 1)
			{
				//console.log(dataStorage);
				arr = arr.map(obj =>
				{
					let newDepartment = true;
					dataStorage.map(storageObj =>
					{
						if (obj.title === storageObj.title)
						{
							newDepartment = false;
							//console.log('test');
							obj.coordinates = storageObj.coordinates;
						}
					});

					// If new department was added to list then get new coordinates
					if (newDepartment)
					{
						let address;

						if (obj.city && obj.address)
						{
							address = check(obj.city + ', ' + obj.address);
						}
						else
						{
							address = check(obj.additional);
						}

						ymaps.geocode(address)
						     .then(res =>
						     {
							     obj['coordinates'] = res.geoObjects.get(0).geometry.getCoordinates();
							     console.log(obj['coordinates']);
						     })
						     .catch(err =>
						     {
							     obj['coordinates'] = [0,0];
							     console.log(obj);
							     console.error(err);
						     });

						console.log('NEW coordinates received');
					}
					// Set main array with departments to local storage
					localStorage.setItem('AllData:' + this.locationDescription, JSON.stringify(arr, "", 4));
					return obj;
				});
				//console.log(arr);
				resolve(arr);
			}
			else
			{
				console.log('get coordinates...');
				getCoordinates(0);
			}
		});
	}

	/**
	 *
	 * @param arr receive an array with filtered list of departments
	 */
	addPlacemarks(arr)
	{
		let departmentsCollection = new ymaps.GeoObjectCollection();
		let presetCollection = ['islands#blueDotIconWithCaption', 'islands#darkGreenDotIconWithCaption', 'islands#redDotIconWithCaption', 'islands#violetDotIconWithCaption', 'islands#darkOrangeDotIconWithCaption', 'islands#blackDotIconWithCaption', 'islands#nightDotIconWithCaption', 'islands#yellowDotIconWithCaption', 'islands#darkBlueDotIconWithCaption', 'islands#greenDotIconWithCaption', 'islands#pinkDotIconWithCaption', 'islands#orangeDotIconWithCaption', 'islands#grayDotIconWithCaption', 'islands#lightBlueDotIconWithCaption', 'islands#brownDotIconWithCaption', 'islands#oliveDotIconWithCaption'];

		let myLocation = new ymaps.Placemark(this.currentLatLng, {
			iconCaption: 'Я здесь',
		},{
			preset: 'islands#grayDotIconWithCaption'
		});
		departmentsCollection.add(myLocation);

		// If coordinates of different plasemark are same, then change coordinates for one of them
		let copy = [];
		arr.map(obj => obj.coordinates ? copy.push(obj.coordinates) : obj);

		for (let i = 0; i < arr.length; i++)
		{
			for (let j = 0; j < copy.length; j++)
			{
				if (i !== j && arr[i].coordinates[0] === copy[j][0] && arr[i].coordinates[1] === copy[j][1])
				{
					arr[i].coordinates[0] += 0.0002;
				}
			}
		}


		console.log(arr);
		for (let i = 0; i < arr.length; i++)
		{
			let presetValue;
			if (!presetCollection[i])
			{
				presetValue = presetCollection[i - presetCollection.length];
			}
			else
			{
				presetValue = presetCollection[i];
			}

			let placemark = new ymaps.Placemark(arr[i].coordinates, {
				iconCaption: arr[i].name,
				balloonContentHeader: arr[i].name,
				balloonContentBody: arr[i].title,
				balloonContentFooter: arr[i].address + ' ' + arr[i].additional
			},{
				preset: presetValue
			});

			departmentsCollection.add(placemark);

			placemark.events.add('click', (e) =>
			{
				let coord = e.get('target').geometry.getCoordinates();
				this.getRoute(this.currentLatLng, coord);
			});
		}

		this.myMap.geoObjects.add(departmentsCollection);

		//departmentsCollection.events.add('click', (e) => console.log(e.geometry.getCoordinates()));
	}

	getRoute(startCoord, endCoord)
	{
		// Set multiRoute points.
		let pointA = startCoord;
		let pointB = endCoord;
		/**
		 * Create multiRoute.
		 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
		 */
		let multiRoute = new ymaps.multiRouter.MultiRoute({
			referencePoints: [
				pointA,
				pointB
			],
			params: {
				// Route type pedestrian
				routingMode: 'pedestrian'
			}
		}, {
			// Set the borders of the map to see total route
			boundsAutoApply: true
		});

		let multiRouteCollection = new ymaps.GeoObjectCollection();
		multiRouteCollection.add(multiRoute);

		// Add multiRoute to map
		this.myMap.geoObjects.add(multiRouteCollection);
	}
}