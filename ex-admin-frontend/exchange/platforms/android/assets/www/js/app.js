(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// components

var _select = require('./components/select');

var _select2 = _interopRequireDefault(_select);

var _list = require('./components/list');

var _list2 = _interopRequireDefault(_list);

var _ymap = require('./components/ymap');

var _ymap2 = _interopRequireDefault(_ymap);

var _footer = require('./components/footer');

var _footer2 = _interopRequireDefault(_footer);

var _burger = require('./components/burger');

var _burger2 = _interopRequireDefault(_burger);

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

var _map = require('./routes/map');

var _map2 = _interopRequireDefault(_map);

var _router = require('./utils/router');

var _router2 = _interopRequireDefault(_router);

var _eventBus = require('./utils/eventBus');

var _eventBus2 = _interopRequireDefault(_eventBus);

var _request = require('./utils/request');

var _request2 = _interopRequireDefault(_request);

var _utils = require('./utils/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// utils


// routes
var eventBus = new _eventBus2.default();
var yandexMap = new _ymap2.default(eventBus);
var request = new _request2.default();
var list = new _list2.default(yandexMap, request, eventBus);
var index = new _index2.default(list, eventBus);
var map = new _map2.default(yandexMap, eventBus);

new _burger2.default(eventBus);
new _select2.default(eventBus);
new _utils2.default();
new _footer2.default();
new _router2.default([index, map], eventBus);

},{"./components/burger":2,"./components/footer":3,"./components/list":4,"./components/select":5,"./components/ymap":6,"./routes/index":7,"./routes/map":8,"./utils/eventBus":9,"./utils/request":10,"./utils/router":11,"./utils/utils":12}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Burger = function Burger(eventBus) {
	var _this = this;

	_classCallCheck(this, Burger);

	this.eventBus = eventBus;

	this.distance = document.querySelector('#distance');
	this.distance.addEventListener('change', function (event) {
		return _this.eventBus.trigger('distance:value', event.target.value);
	});
};

exports.default = Burger;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Footer = function () {
	function Footer() {
		var _this = this;

		_classCallCheck(this, Footer);

		this.footer = document.querySelector('footer');

		this.footer.addEventListener('click', function (event) {
			return _this.updateHash(event);
		});
	}

	_createClass(Footer, [{
		key: 'updateHash',
		value: function updateHash(event) {
			console.log(event.target.classList);
			if (event.target.classList[0].indexOf('map') >= 0) {
				window.location.hash = 'map';
			} else if (event.target.classList[0].indexOf('banks') >= 0) {
				window.location.hash = 'banks';
			} else {
				window.location.hash = '';
			}
		}
	}]);

	return Footer;
}();

exports.default = Footer;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var List = function () {
	function List(yandexMap, request, eventBus) {
		var _this = this;

		_classCallCheck(this, List);

		this.yMap = yandexMap;
		this.request = request;
		this.eventBus = eventBus;

		this.distance = 1000;

		// Subscribe to exchange currencies change
		this.eventBus.on('select:update', this.getSelectedCurrency.bind(this));

		// Subscribe to distance change
		this.eventBus.on('distance:value', function (num) {
			return _this.distance = +num;
		});
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


	_createClass(List, [{
		key: 'getSelectedCurrency',
		value: function getSelectedCurrency(arr) {
			if (typeof arr[0] === 'string') {
				if (arr[1] === 'select-input') {
					this.inputCurrency = arr[0].toLowerCase();
					//console.log(this.inputCurrency);
				} else if (arr[1] === 'select-output') {
					this.outputCurrency = arr[0].toLowerCase();
					//console.log(this.outputCurrency);
				}
			}

			// Get current location if inputCurrency && outputCurrency added
			if (this.inputCurrency && this.outputCurrency) {
				this.currentCurrencies = this.inputCurrency + '-' + this.outputCurrency;
				// If API were loaded
				if (this.yMap.executed) {
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

	}, {
		key: 'getList',
		value: function getList(city) {
			var _this2 = this;

			if (city) {
				return this.request.getRates(city).then(function (data) {
					return _this2.getFilteredList(data);
				}).catch(function (error) {
					return console.error(error);
				});
			}
			return null;
		}

		/**
   *
   * @param data receive object with all departments from getList() function
   * @returns {0:{order:0}...n:{order:n}} - returns sorted object
   */

	}, {
		key: 'getFilteredList',
		value: function getFilteredList(data) {
			var _this3 = this;

			var filteredData = {};
			var filteredArr = [];

			for (var i in data) {
				filteredArr.push(data[i]);
			}

			var setOrderNumbers = function setOrderNumbers(filteredArr) {
				for (var _i = 0; _i < filteredArr.length; _i++) {
					filteredArr[_i]['order'] = _i;
					filteredData[_i] = filteredArr[_i];
				}
				// Returns object with sorted departments
				return filteredData;
			};

			return new Promise(function (resolve) {
				return resolve(
				// Add coordinates to all departments
				_this3.yMap.addCoordinatesToList(filteredArr).then(function (arr) {
					if (_this3.yMap.currentLatLng) {
						return _this3.checkDistance(_this3.yMap.currentLatLng, arr);
					}
					return arr;
				}).then(function (arr) {
					if (_this3.distance) {
						return _this3.filterByDistance(_this3.distance, arr);
					}
					return arr;
				}).then(function (arr) {
					return _this3.filterByRate(arr);
				}).then(function (arr) {
					return _this3.filterByLimit(arr);
				}).then(function (arr) {
					return _this3.setRateHelpers(arr);
				}).then(function (arr) {
					_this3.yMap.addPlacemarks(arr);
					return arr;
				}).then(function (arr) {
					return setOrderNumbers(arr);
				}).catch(function (err) {
					return console.log(err);
				}));
			});
		}
	}, {
		key: 'checkDistance',
		value: function checkDistance(curLoc, arr) {
			var _this4 = this;

			return arr.map(function (obj) {
				if (obj.coordinates && obj.coordinates[0] && obj.coordinates[1]) {
					obj['distance'] = +_this4.getDistance(curLoc[0], curLoc[1], obj.coordinates[0], obj.coordinates[1]).toFixed(0);
					//console.log(obj['address']);
					//console.log(obj['distance']);
				} else {
					obj['distance'] = 9999999;
					//console.log(obj);
				}
				return obj;
			});
		}
	}, {
		key: 'getDistance',
		value: function getDistance(lat1, long1, lat2, long2) {
			// The Earth radius
			var R = 6372795;
			// Convert coordinates to radians
			lat1 *= Math.PI / 180;
			lat2 *= Math.PI / 180;
			long1 *= Math.PI / 180;
			long2 *= Math.PI / 180;
			// Calculate cos and sin for lat, lng
			var cl1 = Math.cos(lat1);
			var cl2 = Math.cos(lat2);
			var sl1 = Math.sin(lat1);
			var sl2 = Math.sin(lat2);
			var delta = long2 - long1;
			var cdelta = Math.cos(delta);
			var sdelta = Math.sin(delta);
			// Length calculation for the big circle
			var y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
			var x = sl1 * sl2 + cl1 * cl2 * cdelta;
			var ad = Math.atan2(y, x);
			// Returns distance between two points (meters)
			return ad * R;
		}
	}, {
		key: 'filterByDistance',
		value: function filterByDistance(targetDist, arr) {
			return arr.filter(function (obj) {
				if (obj.distance && obj.distance <= targetDist) {
					return obj;
				}
			});
		}

		/**
   *
   * @param arr - receive an array with all departments which need to be sorted
   */

	}, {
		key: 'filterByRate',
		value: function filterByRate(arr) {
			var cur = this.inputCurrency + '-' + this.outputCurrency;

			// Filter departments without target cur
			arr = arr.filter(function (obj) {
				return obj.rates[cur] ? obj : false;
			});

			// Sort
			if (this.inputCurrency === 'byn') {
				arr.sort(function (a, b) {
					return a.rates[cur] - b.rates[cur];
				});
			} else {
				arr.sort(function (a, b) {
					return b.rates[cur] - a.rates[cur];
				});
			}

			return arr;
		}

		/**
   *
   * @param arr - receive an array with all departments which need to be sorted
   */

	}, {
		key: 'filterByLimit',
		value: function filterByLimit(arr) {
			var result = [];

			for (var i = 0; i <= 40; i++) {
				if (arr[i]) {
					result.push(arr[i]);
				}
			}

			return result;
		}
	}, {
		key: 'setRateHelpers',
		value: function setRateHelpers(arr) {
			var cur = this.currentCurrencies;
			var bestRate = arr[0].rates[cur];

			return arr.map(function (obj) {
				if (obj.rates[cur] === bestRate) {
					obj.rates.helper = 'лучший курс';
				} else {
					var helper = obj.rates[cur] - bestRate;
					if (helper >= 0) {
						obj.rates.helper = '+' + helper.toFixed(3);
					} else {
						obj.rates.helper = helper.toFixed(3);
					}
				}
				return obj;
			});
		}
	}]);

	return List;
}();

exports.default = List;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Select = function () {
	function Select(eventBus) {
		var _this = this;

		_classCallCheck(this, Select);

		this.eventBus = eventBus;

		this.currency = document.querySelector('.exchange-currencies');

		this.currency.addEventListener('change', function (event) {
			if (event.target.className !== 'select-item') return;
			_this.changeView([event.target.value, event.target.parentNode.className, true]);
		});
		// Get style sheet
		this.sheet = document.styleSheets[0];
		this.rules = this.sheet.rules;

		// Default views
		this.changeView(['BYN', 'select-input', true]);
		this.changeView(['USD', 'select-output', true]);
	}

	/**
  *
  * @param value - receive currency code (BYN, USD etc.)
  * @param parent - receive parent css class
  * @param query - true or false is equal to send new request to myfin or not
  */


	_createClass(Select, [{
		key: 'changeView',
		value: function changeView(_ref) {
			var _ref2 = _slicedToArray(_ref, 3),
			    value = _ref2[0],
			    parent = _ref2[1],
			    query = _ref2[2];

			switch (value) {
				case 'BYN':
					this.sheet.insertRule('.' + parent + ':before {background: url(../img/flag/d65.png) 10% 60% / 10% no-repeat;}', this.rules.length);
					break;

				case 'USD':
					this.sheet.insertRule('.' + parent + ':before {background: url(../img/flag/d176.png) 10% 60% / 10% no-repeat;}', this.rules.length);
					break;

				case 'EUR':
					this.sheet.insertRule('.' + parent + ':before {background: url(../img/flag/d72.png) 10% 60% / 10% no-repeat;}', this.rules.length);
					break;

				case 'RUR':
					this.sheet.insertRule('.' + parent + ':before {background: url(../img/flag/d56.png) 10% 60% / 10% no-repeat;}', this.rules.length);
					break;

				/*case 'PLN':
    	this.sheet.insertRule('.' + parent + ':before {background: url(../img/flag/d53.png) 10% 60% / 10% no-repeat;}', this.rules.length);
    	break;
    		case 'UAH':
    	this.sheet.insertRule('.' + parent + ':before {background: url(../img/flag/d61.png) 10% 60% / 10% no-repeat;}', this.rules.length);
    	break;*/
			}

			// Set only value himself without description in select field
			var options = document.querySelectorAll('.' + parent + ' .select-item option');

			for (var i = 0; i < options.length; i++) {
				if (options[i].selected) {
					if (options[i].value === 'RUR') {
						options[i].innerHTML = '100 ' + options[i].value;
						this.sheet.insertRule('.' + parent + ' select {padding: 4.5% 30.5%;}', this.rules.length);
					} else {
						options[i].innerHTML = options[i].value;
						this.sheet.insertRule('.' + parent + ' select {padding: 4.5% 39.5%;}', this.rules.length);
					}

					options[i].classList.add('hidden');

					// Send selected value to eventBus
					if (query) {
						this.eventBus.trigger('select:update', [options[i].value, parent]);
					}
				} else {
					switch (options[i].value) {
						case 'BYN':
							options[i].innerHTML = 'Белорусский рубль(BYN)';
							break;

						case 'USD':
							options[i].innerHTML = 'Доллар США(USD)';
							break;

						case 'EUR':
							options[i].innerHTML = 'Евро(EUR)';
							break;

						case 'RUR':
							options[i].innerHTML = 'Российский рубль(RUR)';
							break;

						/*case 'PLN':
      	options[i].innerHTML = 'Злотый(PLN)';
      	break;
      		case 'UAH':
      	options[i].innerHTML = 'Гривна(UAH)';
      	break;*/
					}
					options[i].classList.remove('hidden');
				}
			}
		}
	}]);

	return Select;
}();

exports.default = Select;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var yMap = function () {
	function yMap(eventBus) {
		_classCallCheck(this, yMap);

		this.eventBus = eventBus;
		this.myMap = {};

		this.map = document.querySelector('.map');

		this.getAPI();
		//localStorage.clear();
	}

	/**
  * This function receive api script from yandex
  */


	_createClass(yMap, [{
		key: 'getAPI',
		value: function getAPI() {
			var _this = this;

			var script = document.createElement('script');
			script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
			document.head.appendChild(script);

			script.onload = script.onerror = function () {
				if (!_this.executed) {
					_this.getCurrentLocation();
					_this.executed = true;
				}
			};
		}

		/**
   * Get current location by browser geolocation
   */

	}, {
		key: 'getCurrentLocation',
		value: function getCurrentLocation() {
			var _this2 = this;

			// Check if the browser has support for the Geolocation API
			if (!navigator.geolocation) {
				console.error('There is some problem with navigator.geolocation');
			} else {
				navigator.geolocation.getCurrentPosition(function (position) {
					if (position.coords) {
						// Get the coordinates of the current possition.
						var lat = position.coords.latitude;
						var lng = position.coords.longitude;

						// Check if myMap already exist
						if (!_this2.mapCheck) {
							_this2.currentLatLng = [lat, lng];
							_this2.initMap(_this2.currentLatLng);
						} else if (_this2.locationDescription) {
							_this2.eventBus.trigger('location:city', _this2.locationDescription);
						} else {
							console.error('Something gone wrong');
						}
					}
				});
			}
		}
	}, {
		key: 'initMap',
		value: function initMap(coordinates) {
			var _this3 = this;

			ymaps.ready(function () {
				_this3.mapCheck = true;

				_this3.myMap = new ymaps.Map(_this3.map, {
					center: coordinates,
					zoom: 15,
					type: 'yandex#map',
					controls: ['zoomControl', 'typeSelector']
				});

				// Get current city by coordinates
				ymaps.geocode(coordinates).then(function (res) {
					return res.geoObjects.get(0).properties.getAll();
				}).then(function (res) {
					_this3.locationDescription = res.description;
					_this3.eventBus.trigger('location:city', res.description);
				}).catch(function (err) {
					return console.log(err);
				});
			});
		}

		/**
   *
   * @param arr - Array with departments objects
   * @returns [{*},{*}..] array with departments objects, which contains new key ['coordinates']
   */

	}, {
		key: 'addCoordinatesToList',
		value: function addCoordinatesToList(arr) {
			var _this4 = this;

			var check = function check(str) {
				// Split address to array
				var addressArr = str.split(',');

				// Remove elements from array
				var remove = function remove(key, arr) {
					key.map(function (keyStr) {
						arr = arr.filter(function (str) {
							return str.indexOf(keyStr) < 0;
						});
					});

					return arr;
				};

				// Remove this elements from address field
				var elemToRemove = ['цоколь', 'ТЦ', 'крыло', 'промузел', 'дискаунтер'];
				addressArr = remove(elemToRemove, addressArr);

				// Remove parent city if address contain another settlement
				var checkCity = function checkCity(key, arr) {
					var str = arr.join(',');
					key.map(function (keyStr) {
						if (str.indexOf(keyStr) >= 0) {
							arr.splice(0, 1);
						}
					});

					return arr;
				};

				var city = ['Ратом', 'Щомыслиц', 'Сениц'];
				addressArr = checkCity(city, addressArr);

				return addressArr.join(',');
			};

			return new Promise(function (resolve) {
				var getCoordinates = function getCoordinates(i) {
					if (i < arr.length) {
						var address = void 0;

						if (arr[i].city && arr[i].address) {
							address = check(arr[i].city + ', ' + arr[i].address);
						} else {
							address = check(arr[i].additional);
						}

						ymaps.geocode(address).then(function (res) {
							arr[i]['coordinates'] = res.geoObjects.get(0).geometry.getCoordinates();
							//console.log(i + ' ' + arr[i]['coordinates']);
							getCoordinates(i + 1);
						}).catch(function (err) {
							arr[i]['coordinates'] = [0, 0];
							//console.log(arr[i]);
							//console.error(err);
							getCoordinates(i + 1);
						});
					} else {
						console.log('coordinates received');
						// Set main array with departments to local storage
						localStorage.setItem('AllData:' + _this4.locationDescription, JSON.stringify(arr, "", 4));
						resolve(arr);
					}
				};

				// Get coordinates from local storage, if they are already been received
				var dataStorage = JSON.parse(localStorage.getItem('AllData:' + _this4.locationDescription)) || {};
				if (Object.keys(dataStorage).length > 1) {
					//console.log(dataStorage);
					arr = arr.map(function (obj) {
						var newDepartment = true;
						dataStorage.map(function (storageObj) {
							if (obj.title === storageObj.title) {
								newDepartment = false;
								//console.log('test');
								obj.coordinates = storageObj.coordinates;
							}
						});

						// If new department was added to list then get new coordinates
						if (newDepartment) {
							var address = void 0;

							if (obj.city && obj.address) {
								address = check(obj.city + ', ' + obj.address);
							} else {
								address = check(obj.additional);
							}

							ymaps.geocode(address).then(function (res) {
								obj['coordinates'] = res.geoObjects.get(0).geometry.getCoordinates();
								console.log(obj['coordinates']);
							}).catch(function (err) {
								obj['coordinates'] = [0, 0];
								console.log(obj);
								console.error(err);
							});

							console.log('NEW coordinates received');
						}
						// Set main array with departments to local storage
						localStorage.setItem('AllData:' + _this4.locationDescription, JSON.stringify(arr, "", 4));
						return obj;
					});
					//console.log(arr);
					resolve(arr);
				} else {
					console.log('get coordinates...');
					getCoordinates(0);
				}
			});
		}

		/**
   *
   * @param arr receive an array with filtered list of departments
   */

	}, {
		key: 'addPlacemarks',
		value: function addPlacemarks(arr) {
			var _this5 = this;

			var departmentsCollection = new ymaps.GeoObjectCollection();
			var presetCollection = ['islands#blueDotIconWithCaption', 'islands#darkGreenDotIconWithCaption', 'islands#redDotIconWithCaption', 'islands#violetDotIconWithCaption', 'islands#darkOrangeDotIconWithCaption', 'islands#blackDotIconWithCaption', 'islands#nightDotIconWithCaption', 'islands#yellowDotIconWithCaption', 'islands#darkBlueDotIconWithCaption', 'islands#greenDotIconWithCaption', 'islands#pinkDotIconWithCaption', 'islands#orangeDotIconWithCaption', 'islands#grayDotIconWithCaption', 'islands#lightBlueDotIconWithCaption', 'islands#brownDotIconWithCaption', 'islands#oliveDotIconWithCaption'];

			var myLocation = new ymaps.Placemark(this.currentLatLng, {
				iconCaption: 'Я здесь'
			}, {
				preset: 'islands#grayDotIconWithCaption'
			});
			departmentsCollection.add(myLocation);

			// If coordinates of different plasemark are same, then change coordinates for one of them
			var copy = [];
			arr.map(function (obj) {
				return obj.coordinates ? copy.push(obj.coordinates) : obj;
			});

			for (var i = 0; i < arr.length; i++) {
				for (var j = 0; j < copy.length; j++) {
					if (i !== j && arr[i].coordinates[0] === copy[j][0] && arr[i].coordinates[1] === copy[j][1]) {
						arr[i].coordinates[0] += 0.0002;
					}
				}
			}

			console.log(arr);
			for (var _i = 0; _i < arr.length; _i++) {
				var presetValue = void 0;
				if (!presetCollection[_i]) {
					presetValue = presetCollection[_i - presetCollection.length];
				} else {
					presetValue = presetCollection[_i];
				}

				var placemark = new ymaps.Placemark(arr[_i].coordinates, {
					iconCaption: arr[_i].name,
					balloonContentHeader: arr[_i].name,
					balloonContentBody: arr[_i].title,
					balloonContentFooter: arr[_i].address + ' ' + arr[_i].additional
				}, {
					preset: presetValue
				});

				departmentsCollection.add(placemark);

				placemark.events.add('click', function (e) {
					var coord = e.get('target').geometry.getCoordinates();
					_this5.getRoute(_this5.currentLatLng, coord);
				});
			}

			this.myMap.geoObjects.add(departmentsCollection);

			//departmentsCollection.events.add('click', (e) => console.log(e.geometry.getCoordinates()));
		}
	}, {
		key: 'getRoute',
		value: function getRoute(startCoord, endCoord) {
			// Set multiRoute points.
			var pointA = startCoord;
			var pointB = endCoord;
			/**
    * Create multiRoute.
    * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
    */
			var multiRoute = new ymaps.multiRouter.MultiRoute({
				referencePoints: [pointA, pointB],
				params: {
					// Route type pedestrian
					routingMode: 'pedestrian'
				}
			}, {
				// Set the borders of the map to see total route
				boundsAutoApply: true
			});

			var multiRouteCollection = new ymaps.GeoObjectCollection();
			multiRouteCollection.add(multiRoute);

			// Add multiRoute to map
			this.myMap.geoObjects.add(multiRouteCollection);
		}
	}]);

	return yMap;
}();

exports.default = yMap;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Index = function () {
	function Index(list, eventBus) {
		var _this = this;

		_classCallCheck(this, Index);

		this.name = 'index';
		this.match = '';

		this.list = list;
		this.eventBus = eventBus;

		this.schedule = document.querySelector('.schedule');

		// Subscribe to city location change and then get the filtered data list
		this.eventBus.on('location:city', function (city) {
			_this.spinner.spin(_this.schedule);
			_this.showFilteredList(city);
		});
	}

	_createClass(Index, [{
		key: 'onEnter',
		value: function onEnter() {
			this.menu = document.querySelector('.menu .menu-quotes');
			this.menu.classList.add('menu-selected');

			this.schedule.classList.remove('hidden');

			this.footer = document.querySelector('footer .quotes-item');
			this.footer.classList.add('quotes-item-selected');

			// Start spinner
			this.spinner = new Spinner().spin(this.schedule);

			if (this.notFirstQuery) {
				this.showFilteredList(this.cityName);
			}
		}

		/**
   *
   * @param city is string which receive data from chain:
   * select.js: trigger "select:update" --->
   * list.js: getSelectedCurrency --->
   * location.js: getCurrentLocation -> trigger "location:data" --->
   * list.js: getLocation -> trigger "location:city" --->
   * index.js: showFilteredList --->
   * * list.js: getList --->
   * * * request.js: getRates -> return data to getList --->
   * * list.js: getFilteredList --->
   * index.js: setFilteredData
   */

	}, {
		key: 'showFilteredList',
		value: function showFilteredList(city) {
			var _this2 = this;

			this.cityName = city;

			this.notFirstQuery = true;

			/**
    *
    * @param data - object with filtered data which should be displayed in "schedule" div
    */
			var setFilteredData = function setFilteredData(data) {
				for (var i = 0; i < Object.keys(data).length; i++) {
					if (data.hasOwnProperty(i)) {
						if (data[i].rates[_this2.list.inputCurrency + '-' + _this2.list.outputCurrency]) {
							var address = data[i].address;
							if (data[i].additional) address += ' ' + data[i].additional;

							_this2.schedule.innerHTML += '\n\t\t\t\t\t\t\t<div class="row">\n\t\t\t\t\t\t\t\t<div class="bank-row">\n\t\t\t\t\t\t\t\t\t' + data[i].name + ' <span class="address">| ' + address + '</span>\n\t\t\t\t\t\t\t\t\t<span class="rate">' + data[i].rates[_this2.list.inputCurrency + '-' + _this2.list.outputCurrency] + '</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="details-row">\n\t\t\t\t\t\t\t\t\t' + data[i].date + ':00 | ' + data[i].city + '\n\t\t\t\t\t\t\t\t\t<span class="rate green">' + data[i].rates.helper + '</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t \t\t\t';
						}
					}
				}
			};

			if (typeof city === 'string') {
				// Returns promise
				this.list.getList(city).then(function (data) {
					_this2.spinner.stop();
					_this2.schedule.innerHTML = '';
					// Reset schedule
					setFilteredData(data);
				});
			}
		}
	}, {
		key: 'onLeave',
		value: function onLeave() {
			this.footer.classList.remove('quotes-item-selected');
			this.menu.classList.remove('menu-selected');

			this.schedule.classList.add('hidden');
		}
	}]);

	return Index;
}();

exports.default = Index;
;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = function () {
	function Map(yandexMap, eventBus) {
		_classCallCheck(this, Map);

		this.name = 'map';
		this.match = 'map';

		this.yMap = yandexMap;
		this.eventBus = eventBus;

		this.map = document.querySelector('.map');
	}

	_createClass(Map, [{
		key: 'onEnter',
		value: function onEnter() {
			this.footer = document.querySelector('footer .map-item');
			this.footer.classList.add('map-item-selected');

			this.map.classList.remove('hidden');

			//this.yMap.getCurrentLocation();
		}
	}, {
		key: 'drawMap',
		value: function drawMap() {}
	}, {
		key: 'onLeave',
		value: function onLeave() {
			this.footer.classList.remove('map-item-selected');
			this.map.classList.add('hidden');
		}
	}]);

	return Map;
}();

exports.default = Map;
;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventBus = function () {
	function EventBus() {
		_classCallCheck(this, EventBus);

		this.listeners = {};
	}

	_createClass(EventBus, [{
		key: "on",
		value: function on(name, handler) {
			this.listeners[name] = this.listeners[name] || [];
			this.listeners[name].push(handler);
		}
	}, {
		key: "off",
		value: function off(name, handler) {
			this.listeners[name] = this.listeners[name] || [];
			this.listeners[name] = this.listeners[name].filter(function (item) {
				return item !== handler;
			});
		}
	}, {
		key: "once",
		value: function once(name, handler) {
			var self = this;
			this.on(name, function getter(data) {
				handler(data);
				self.off(name, getter);
			});
		}
	}, {
		key: "trigger",
		value: function trigger(name, data) {
			(this.listeners[name] || []).map(function (handler) {
				return handler(data);
			});
		}
	}]);

	return EventBus;
}();

exports.default = EventBus;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function () {
	function Request() {
		_classCallCheck(this, Request);

		this.bankNamesFull = ['Абсолютбанк', 'Альфа-Банк', 'Банк БелВЭБ', 'Банк ВТБ', 'Банк Москва-Минск', 'Банк Решение', 'Белагропромбанк', 'Беларусбанк', 'Белгазпромбанк', 'Белинвестбанк', 'БНБ-Банк', 'БПС-Сбербанк', 'БСБ Банк', 'БТА Банк', 'Идея Банк', 'МТБанк', 'Паритетбанк', 'Приорбанк', 'СтатусБанк', 'Технобанк', 'ТК Банк', 'Франсабанк', 'Цептер Банк'];

		this.bankNamesCompare = ['абсолют', 'альфа', 'белвэб', 'втб', 'москва-минск', 'решение', 'белагропром', 'беларусбанк', 'белгазпром', 'белинвест', 'бнб', 'бпс', 'бсб', 'бта', 'идея', 'мтб', 'паритет', 'приор', 'статус', 'техно', 'тк банк', 'франса', 'цептер'];

		this.cityNames = ['Минск', 'Березино', 'Борисов', 'Вилейка', 'Воложин', 'Дзержинск', 'Жодино', 'Заславль', 'Ивенец', 'Клецк', 'Копыль', 'Крупки', 'Логойск', 'Любань', 'Марьина Горка', 'Мачулищи', 'Молодечно', 'Мядель', 'Нарочь', 'Несвиж', 'Плещеницы', 'Радошковичи', 'Слуцк', 'Смиловичи', 'Смолевичи', 'Солигорск', 'Старобин', 'Старые Дороги', 'Столбцы', 'Узда', 'Фаниполь', 'Червень', 'Брест', 'Барановичи', 'Белоозёрск', 'Береза', 'Высокое', 'Ганцевичи', 'Давид-Городок', 'Дрогичин', 'Жабинка', 'Иваново', 'Ивацевичи', 'Каменец', 'Кобрин', 'Лунинец', 'Ляховичи', 'Малорита', 'Микашевичи', 'Пинск', 'Пружаны', 'Столин', 'Витебск', 'Барань', 'Бешенковичи', 'Боровуха', 'Браслав', 'Верхнедвинск', 'Глубокое', 'Городок', 'Докшицы', 'Дубровно', 'Лепель', 'Лиозно', 'Миоры', 'Новолукомль', 'Новополоцк', 'Орша', 'Полоцк', 'Поставы', 'Россоны', 'Руба', 'Сенно', 'Толочин', 'Ушачи', 'Чашники', 'Шарковщина', 'Шумилино', 'Гомель', 'Брагин', 'Буда-Кошелёво', 'Ветка', 'Добруш', 'Ельск', 'Житковичи', 'Жлобин', 'Калинковичи', 'Корма', 'Костюковка', 'Лельчицы', 'Лоев', 'Лясковичи', 'Мозырь', 'Наровля', 'Октябрьский', 'Петриков', 'Речица', 'Рогачев', 'Светлогорск', 'Туров', 'Хойники', 'Чечерск', 'Гродно', 'Берёзовка', 'Большая Берестовица', 'Боровики', 'Волковыск', 'Вороново', 'Дятлово', 'Зельва', 'Ивье', 'Кореличи', 'Красносельский', 'Лида', 'Минчики', 'Мир', 'Мосты', 'Новогрудок', 'Островец', 'Ошмяны', 'Россь', 'Свислочь', 'Скидель', 'Слоним', 'Сморгонь', 'Щучин', 'Могилев', 'Белыничи', 'Бобруйск', 'Быхов', 'Глуск', 'Горки', 'Кировск', 'Климовичи', 'Кличев', 'Костюковичи', 'Краснополье', 'Кричев', 'Круглое', 'Мстиславль', 'Осиповичи', 'Славгород', 'Хотимск', 'Чаусы', 'Чериков', 'Шклов'];

		this.cityLinks = ['minsk', 'berezino', 'borisov', 'vileyka', 'volozhin', 'dzerzhinsk', 'zhodino', 'zaslavl', 'ivenets', 'kletsk', 'kopyl', 'krupki', 'logoysk', 'lyuban', 'marina_gorka', 'machulishchi', 'molodechno', 'myadel', 'naroch', 'nesvizh', 'pleschenicy', 'radoshkovichi', 'slutsk', 'smilovichi', 'smolevichi', 'soligorsk', 'starobin', 'staryye_dorogi', 'stolbcy', 'uzda', 'fanipol', 'cherven', 'brest', 'baranovichi', 'beloozyorsk', 'bereza', 'vysokoye', 'gancevichi', 'david-gorodok', 'drogichin', 'zhabinka', 'ivanovo', 'ivacevichi', 'kamenets', 'kobrin', 'luninec', 'lyakhovichi', 'malorita', 'mikashevichi', 'pinsk', 'pruzhany', 'stolin', 'vitebsk', 'baran', 'beshenkovichi', 'borovukha', 'braslav', 'verhnedvinsk', 'glubokoe', 'gorodok', 'dokshitsy', 'dubrovno', 'lepel', 'liozno', 'miory', 'novolukoml', 'novopolotsk', 'orsha', 'polotsk', 'postavy', 'rossony', 'ruba', 'senno', 'tolochin', 'ushachi', 'chashniki', 'sharkovshchina', 'shumilino', 'gomel', 'bragin', 'buda-koshelyovo', 'vetka', 'dobrush', 'yelsk', 'zhitkovichi', 'zhlobin', 'kalinkovichi', 'korma', 'kostyukovka', 'lelchitsy', 'loew', 'ljaskovichi', 'mozyr', 'narovla', 'oktyabrskii', 'petrikov', 'rechitsa', 'rogachev', 'svetlogorsk', 'turov', 'hojniki', 'chechersk', 'grodno', 'beryozovka', 'bolshaya-berestovica', 'boroviki', 'volkovisk', 'voronovo', 'dyatlovo', 'zelva', 'ivye', 'korelichi', 'krasnoselskiy', 'lida', 'minchiki', 'mir', 'mosty', 'novogrudok', 'ostrovec', 'oshmiany', 'ross', 'svisloch', 'skidel', 'slonim', 'smorgon', 'shchuchin', 'mogilev', 'belynichi', 'bobrujsk', 'byhov', 'glusk', 'gorki', 'kirovsk', 'klimovichi', 'klichev', 'kostyukovichi', 'krasnopolye', 'krichev', 'krugloye', 'mstislavl', 'osipovichi', 'slavgorod', 'hotimsk', 'chausy', 'cherikov', 'shklov'];

		this.data = {};
	}

	/**
  *
  * @param city - receive city name (minsk, slavgorod etc.)
  * @returns {Promise.<data>} - returns promise with all departments and rates
  */


	_createClass(Request, [{
		key: 'getRates',
		value: function getRates(city) {
			var _this = this;

			for (var i in this.cityNames) {
				if (city.indexOf(this.cityNames[i]) >= 0) {
					this.cityName = this.cityNames[i];
					this.cityLink = this.cityLinks[i];
					break;
				}
			}

			// Set default cityLink
			if (!this.cityLink) this.cityLink = 'minsk';

			// Source site url
			var url = 'https://myfin.by/currency/' + this.cityLink;

			return fetch('http://cors-proxy.htmldriven.com/?url=' + url).then(function (resp) {
				return resp.json();
			})
			// Get all departments and return array, every element of this array contain`s all department data
			.then(function (page) {
				return page.body.match(/\<td\>\s*\<div class="ttl"\>(.|[\r\n])+?\<\/td\>\<\/tr\>/igm) || [];
			})
			// Convert arr result to object
			.then(function (res) {
				return _this.createDepObjects(res).reduce(function (prevVal, curVal) {
					return prevVal[curVal.title] = curVal, prevVal;
				}, {});
			}).catch(function (reject) {
				return console.error(reject);
			});
		}

		/**
   *
   * @param result - receive an array with all departments data
   * returns array [{department data}, {department data}....]
   */

	}, {
		key: 'createDepObjects',
		value: function createDepObjects(result) {
			var _this2 = this;

			return result.map(function (str) {
				// Create temporary div
				var div = document.createElement('div');
				div.innerHTML = str;

				var name = _this2.select(div, '.ttl', 'name') || ''; // Bank name
				var title = _this2.select(div, '.ttl', 'text') || ''; // Department name
				var link = _this2.select(div, '.ttl a', 'href') || ''; // Reference to site
				var tel = _this2.select(div, '.tel', 'text') || ''; // Tel number
				var city = _this2.select(div, '.address', 'city') || ''; // Address city
				var address = _this2.select(div, '.address', 'address') || ''; // Address street
				var additional = _this2.select(div, '.address', 'additional') || ''; // Address additional info
				var date = _this2.select(div, '.date', 'text') || ''; // Last update time

				// Find all rates(except conversion) and return array with currency name and current rate
				var allRates = div.innerHTML.match(/\<span.+?\>(.+?)\<\/span\>\s*\<i class="conv-btn" data-c="(.+?)"/g) || [];

				// Remove unnecessary elements from array -> result array looks like [0] === 'currency name', [1] === 'current rate'
				allRates = allRates.map(function (str) {
					var arr = str.match(/\<span.+?\>(.+?)\<\/span\>\s*\<i class="conv-btn" data-c="(.+?)"/i) || [];

					// Remove unnecessary element
					arr.shift();

					// Convert to number type
					arr = arr.map(function (str) {
						if (isNaN(+str)) return str;
						return +str;
					});

					return arr.reverse();
				});

				// Object with rates
				var ratesResult = {};

				// Buy rates
				ratesResult.buy = allRates.filter(function (item, i) {
					if (i % 2) return item;
					return false;
				});
				// Sell rates
				ratesResult.sell = allRates.filter(function (item, i) {
					if (i % 2) return false;
					return item;
				});

				// Convert buy and sell rates arrays to objects
				var rates = ratesResult.buy.reduce(function (obj, arr) {
					return obj['byn-' + arr[0]] = arr[1], obj;
				}, {});
				rates = ratesResult.sell.reduce(function (obj, arr) {
					return obj[arr[0] + '-byn'] = arr[1], obj;
				}, rates);

				var allConversions = div.innerHTML.match(/(\d+\.\d+)\<i class="conv-btn" data-c="(.+?)"/g) || [];

				// Remove unnecessary elements from array -> result array looks like [0] === 'currency name', [1] === 'current rate'
				allConversions = allConversions.map(function (str) {
					var arr = str.match(/(\d+\.\d+)\<i class="conv-btn" data-c="(.+?)"/i) || [];

					// Remove unnecessary element
					arr.shift();

					// Convert to number type
					arr = arr.map(function (str) {
						if (isNaN(+str)) return str;
						return +str;
					});

					return arr.reverse();
				});

				// Conversion rates
				var conversionsResult = {};

				// Buy rates
				conversionsResult.buy = allConversions.filter(function (item, i) {
					if (i % 2) return false;
					return item;
				});
				// Sell rates
				conversionsResult.sell = allConversions.filter(function (item, i) {
					if (i % 2) return item;
					return false;
				});

				// Convert buy and sell rates arrays to objects
				rates = conversionsResult.buy.reduce(function (obj, arr) {
					return obj['eur-usd'] = arr[1], obj;
				}, rates);
				rates = conversionsResult.sell.reduce(function (obj, arr) {
					return obj['usd-eur'] = +(100 / arr[1] / 100).toFixed(3), obj;
				}, rates);

				// Add same currency rates
				rates['byn-byn'] = '1.000';
				rates['usd-usd'] = '1.000';
				rates['eur-eur'] = '1.000';
				rates['rur-rur'] = '1.000';

				return {
					name: name,
					title: title,
					link: link,
					tel: tel,
					city: city,
					address: address,
					additional: additional,
					date: date,
					rates: rates
				};
			});
		}

		/**
   *
   * @param source - div.innerHTML element with part of source page
   * @param css - css selector
   * @param type - type of value to return
   * @returns string with appropriate value, depends on the type parameter
   */

	}, {
		key: 'select',
		value: function select(source, css, type) {
			switch (type) {
				case 'href':
					return source.querySelector(css).href;

				case 'name':
					var name = source.querySelector(css).innerText.trim().toLowerCase();
					for (var i = 0; i < this.bankNamesCompare.length; i++) {
						if (name.indexOf(this.bankNamesCompare[i]) >= 0) {
							return this.bankNamesFull[i];
						}
					}
					return name;

				case 'city':
					for (var _i = 0; _i < this.cityLinks.length; _i++) {
						if (this.cityLink.indexOf(this.cityLinks[_i]) >= 0) {
							return this.cityNames[_i];
						}
					}
					return this.cityLink;

				case 'address':
				case 'additional':
					var address = source.querySelector(css).innerText.trim();
					if (type === 'address') {
						//console.log('______________________________________________');
						//console.log('sourse: ' + address);
					}
					var getPos = function getPos(symbol, str) {
						var arrPos = [];
						var pos = str.indexOf(symbol);
						while (pos !== -1) {
							arrPos.push(pos);
							pos = str.indexOf(symbol, pos + 1);
						}
						return arrPos;
					};

					var addSpace = function addSpace(arr, str) {
						var count = 0;
						for (var _i2 = 0; _i2 < arr.length; _i2++) {
							var firstPart = str.slice(0, arr[_i2] + count + 1);
							var secondPart = ' ' + str.slice(arr[_i2] + count + 1);
							str = firstPart + secondPart;
							count++;
						}
						return str;
					};

					// Add space after .
					var dotPos = getPos('.', address);
					address = addSpace(dotPos, address);
					// Add space after ,
					var commaPos = getPos(',', address);
					address = addSpace(commaPos, address);
					// Replace double spaces
					address = address.replace(/\s\s/g, ' ');

					var replace = function replace(str, a, b) {
						return str.replace(a, b);
					};

					// Replace
					address = replace(address, 'пр-т', 'пр');
					address = replace(address, 'проспект', 'пр');
					address = replace(address, 'пр-кт', 'пр');
					address = replace(address, 'пр ', 'пр. ');
					address = replace(address, 'пр,', 'пр.,');

					address = replace(address, 'п-дь', 'пл');
					address = replace(address, 'пл ', 'пл. ');
					address = replace(address, 'пл,', 'пл.,');

					address = replace(address, 'тракт', 'тр');
					address = replace(address, 'тракта', 'тр');
					address = replace(address, 'тра', 'тр');
					address = replace(address, 'тр-т', 'тр');
					address = replace(address, 'тр ', 'тр. ');
					address = replace(address, 'тр,', 'тр.,');

					address = replace(address, '2ул', 'ул');
					address = replace(address, '4ул', 'ул');
					address = replace(address, 'ул. Пр.', 'пр.');

					address = replace(address, 'бульвар', 'бул.');

					address = replace(address, 'поселок', 'пос.');
					address = replace(address, 'агрогородок', 'аг.');
					address = replace(address, 'деревня', 'д.');
					address = replace(address, 'п/о', 'д.');
					address = replace(address, 'Щомыслицкий с/с', 'д. Щомыслица');
					address = replace(address, 'вокзал', 'вок.');
					address = replace(address, 'обл. ,', '');
					address = replace(address, '223060', '');
					address = replace(address, '- ', ' ');
					address = replace(address, 'независимости', 'Независимости');
					address = replace(address, 'ленина', 'Ленина');
					address = replace(address, '. ,', '.,');

					// Split address to array
					var addressArr = address.split(' ');

					// Remove elements from array
					var remove = function remove(key, arr) {
						key.map(function (keyStr) {
							arr = arr.filter(function (str) {
								return str.indexOf(keyStr) < 0;
							});
						});

						return arr;
					};

					// Remove this elements from address field
					var elemToRemove = [this.cityName, 'г.', 'г,', 'область', 'р-н', 'р-он', 'район'];
					addressArr = remove(elemToRemove, addressArr);

					// Set capitalize letter
					var setCapitalize = function setCapitalize(arr) {
						if (arr[2] && arr[2][0] && isNaN(+arr[2][0])) {
							var split = arr[2].split('');
							if (split[0].match(/[а-я]/i)) {
								split[0] = split[0].toUpperCase();
								arr[2] = split.join('');
							}
						}

						return arr;
					};

					if (type === 'address') {
						addressArr = setCapitalize(addressArr);
					}

					address = addressArr.join(' ').trim();

					address = replace(address, 'Ул.', 'ул.');

					// This check need for case: if there is no slice executed, then additional info should be blank
					var check = false;

					var sliceInfo = function sliceInfo(str, sign) {
						if (str.indexOf(sign) >= 0) {
							if (type === 'address') {
								return str.slice(0, str.indexOf(sign)).trim();
							} else if (type === 'additional' && !check) {
								check = true;
								return str.slice(str.indexOf(sign) - 1).trim();
							}
						}
						return str;
					};

					address = sliceInfo(address, '(');
					address = sliceInfo(address, '«');
					address = sliceInfo(address, 'ТД');
					address = sliceInfo(address, 'ЦУМ');
					address = sliceInfo(address, 'ТЦ');
					address = sliceInfo(address, 'ТРЦ');
					address = sliceInfo(address, 'ВЦ');
					address = sliceInfo(address, 'ГУ');
					address = sliceInfo(address, 'санаторий');
					address = sliceInfo(address, 'Санаторий');
					address = sliceInfo(address, 'около');
					address = sliceInfo(address, 'павильон');
					address = sliceInfo(address, 'правое');
					address = sliceInfo(address, 'ст. метро');
					address = sliceInfo(address, 'пересечение');
					address = sliceInfo(address, 'АЗС');
					address = sliceInfo(address, 'универсам');
					address = sliceInfo(address, 'Универсам');
					address = sliceInfo(address, 'супермаркет');
					address = sliceInfo(address, 'Супермаркет');
					address = sliceInfo(address, 'Отделение');
					address = sliceInfo(address, 'Западный');
					address = sliceInfo(address, 'Комаровский');

					if (type === 'address') {
						if (address[address.length - 1] === ',') {
							address = address.slice(0, address.length - 1).trim();
						}
						//console.log('address: ' + address);
					} else if (type === 'additional') {
						if (!check) {
							address = '';
						}
						//console.log('additional: ' + address);
					}
					return address;

				default:
					return source.querySelector(css).innerText.trim();
			}
		}
	}]);

	return Request;
}();

exports.default = Request;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = function () {
	function Router(routes, eventBus) {
		_classCallCheck(this, Router);

		this.routes = routes || [];
		this.eventBus = eventBus;
		this.init();
	}

	_createClass(Router, [{
		key: 'init',
		value: function init() {
			var _this = this;

			window.addEventListener('hashchange', function () {
				return _this.handleUrl(window.location.hash);
			});
			this.handleUrl(window.location.hash);
		}
	}, {
		key: 'findPreviousActiveRoute',
		value: function findPreviousActiveRoute() {
			return this.currentRoute;
		}
	}, {
		key: 'findNewActiveRoute',
		value: function findNewActiveRoute(url) {
			var route = this.routes.find(function (routeItem) {
				if (typeof routeItem.match === 'string') {
					return url === routeItem.match;
				} else if (typeof routeItem.match === 'function') {
					return routeItem.match(url);
				} else if (routeItem.match instanceof RegExp) {
					return url.match(routeItem.match);
				}
			});

			if (!route) {
				route = this.routes['0']; // Главная страница
			}

			//console.log(`---> router findNewActiveRoute: ${url} -- ${(route || {}).name}`);
			return route;
		}
	}, {
		key: 'handleUrl',
		value: function handleUrl(url) {
			var _this2 = this;

			url = url.slice(1);

			var previousRoute = this.findPreviousActiveRoute();
			var newRoute = this.findNewActiveRoute(url);

			Promise.resolve().then(function () {
				return previousRoute && previousRoute.onLeave && previousRoute.onLeave(window.location.hash, _this2.eventBus);
			}).then(function () {
				return newRoute && newRoute.onBeforeEnter && newRoute.onBeforeEnter(window.location.hash, _this2.eventBus);
			}).then(function () {
				return newRoute && newRoute.onEnter && newRoute.onEnter(window.location.hash, _this2.eventBus);
			}).then(function () {
				_this2.currentRoute = newRoute;
			});
		}
	}]);

	return Router;
}();

exports.default = Router;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
	function Utils() {
		_classCallCheck(this, Utils);

		this.checkRotate();
		window.addEventListener('orientationchange', this.checkRotate.bind(this));
	}

	/**
  * Check if rotate is portrait or landscape
  */


	_createClass(Utils, [{
		key: 'checkRotate',
		value: function checkRotate() {
			var w = window.innerWidth;
			var h = window.innerHeight;
			var bgSize = w;

			w < h ? this.updateStyles(w, h, bgSize) : this.updateStyles(h, w, bgSize);
		}

		/**
   *
   * @param width - screen width
   * @param heigth - screen heigth
   * @param bgSize - the size of background image should equal to screen width
   */

	}, {
		key: 'updateStyles',
		value: function updateStyles(width, heigth, bgSize) {
			var body = document.querySelector('body');
			var header = document.querySelector('header');

			body.style.width = width + 'px';
			body.style.height = heigth + 'px';

			body.style.backgroundSize = bgSize + 'px';
			header.style.backgroundSize = bgSize + 'px';
		}
	}]);

	return Utils;
}();

exports.default = Utils;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGNoYW5nZVxcc3JjXFxqc1xcYXBwLmpzIiwiZXhjaGFuZ2VcXHNyY1xcanNcXGNvbXBvbmVudHNcXGJ1cmdlci5qcyIsImV4Y2hhbmdlXFxzcmNcXGpzXFxjb21wb25lbnRzXFxmb290ZXIuanMiLCJleGNoYW5nZVxcc3JjXFxqc1xcY29tcG9uZW50c1xcbGlzdC5qcyIsImV4Y2hhbmdlXFxzcmNcXGpzXFxjb21wb25lbnRzXFxzZWxlY3QuanMiLCJleGNoYW5nZVxcc3JjXFxqc1xcY29tcG9uZW50c1xceW1hcC5qcyIsImV4Y2hhbmdlXFxzcmNcXGpzXFxyb3V0ZXNcXGluZGV4LmpzIiwiZXhjaGFuZ2VcXHNyY1xcanNcXHJvdXRlc1xcbWFwLmpzIiwiZXhjaGFuZ2VcXHNyY1xcanNcXHV0aWxzXFxldmVudEJ1cy5qcyIsImV4Y2hhbmdlXFxzcmNcXGpzXFx1dGlsc1xccmVxdWVzdC5qcyIsImV4Y2hhbmdlXFxzcmNcXGpzXFx1dGlsc1xccm91dGVyLmpzIiwiZXhjaGFuZ2VcXHNyY1xcanNcXHV0aWxzXFx1dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUVBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUpBOzs7QUFKQTtBQVVBLElBQU0sV0FBVyx3QkFBakI7QUFDQSxJQUFNLFlBQVksbUJBQVMsUUFBVCxDQUFsQjtBQUNBLElBQU0sVUFBVSx1QkFBaEI7QUFDQSxJQUFNLE9BQU8sbUJBQVMsU0FBVCxFQUFvQixPQUFwQixFQUE2QixRQUE3QixDQUFiO0FBQ0EsSUFBTSxRQUFRLG9CQUFVLElBQVYsRUFBZ0IsUUFBaEIsQ0FBZDtBQUNBLElBQU0sTUFBTSxrQkFBUSxTQUFSLEVBQW1CLFFBQW5CLENBQVo7O0FBRUEscUJB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LE9BQU8sU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQVg7QUFDQSxPQUFJLFNBQVMsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWI7O0FBRUEsUUFBSyxLQUFMLENBQVcsS0FBWCxHQUFtQixRQUFRLElBQTNCO0FBQ0EsUUFBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixTQUFTLElBQTdCOztBQUVBLFFBQUssS0FBTCxDQUFXLGNBQVgsR0FBNEIsU0FBUyxJQUFyQztBQUNBLFVBQU8sS0FBUCxDQUFhLGNBQWIsR0FBOEIsU0FBUyxJQUF2QztBQUNBOzs7Ozs7a0JBcENtQixLIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLy8gY29tcG9uZW50c1xyXG5pbXBvcnQgU2VsZWN0IGZyb20gJy4vY29tcG9uZW50cy9zZWxlY3QnO1xyXG5pbXBvcnQgTGlzdCBmcm9tICcuL2NvbXBvbmVudHMvbGlzdCc7XHJcbmltcG9ydCB5TWFwIGZyb20gJy4vY29tcG9uZW50cy95bWFwJztcclxuaW1wb3J0IEZvb3RlciBmcm9tICcuL2NvbXBvbmVudHMvZm9vdGVyJztcclxuaW1wb3J0IEJ1cmdlciBmcm9tICcuL2NvbXBvbmVudHMvYnVyZ2VyJztcclxuXHJcbi8vIHJvdXRlc1xyXG5pbXBvcnQgSW5kZXggZnJvbSAnLi9yb3V0ZXMvaW5kZXgnO1xyXG5pbXBvcnQgTWFwIGZyb20gJy4vcm91dGVzL21hcCc7XHJcblxyXG4vLyB1dGlsc1xyXG5pbXBvcnQgUm91dGVyIGZyb20gJy4vdXRpbHMvcm91dGVyJztcclxuaW1wb3J0IEV2ZW50QnVzIGZyb20gJy4vdXRpbHMvZXZlbnRCdXMnO1xyXG5pbXBvcnQgUmVxdWVzdCBmcm9tICcuL3V0aWxzL3JlcXVlc3QnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi91dGlscy91dGlscyc7XHJcblxyXG5jb25zdCBldmVudEJ1cyA9IG5ldyBFdmVudEJ1cygpO1xyXG5jb25zdCB5YW5kZXhNYXAgPSBuZXcgeU1hcChldmVudEJ1cyk7XHJcbmNvbnN0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCgpO1xyXG5jb25zdCBsaXN0ID0gbmV3IExpc3QoeWFuZGV4TWFwLCByZXF1ZXN0LCBldmVudEJ1cyk7XHJcbmNvbnN0IGluZGV4ID0gbmV3IEluZGV4KGxpc3QsIGV2ZW50QnVzKTtcclxuY29uc3QgbWFwID0gbmV3IE1hcCh5YW5kZXhNYXAsIGV2ZW50QnVzKTtcclxuXHJcbm5ldyBCdXJnZXIoZXZlbnRCdXMpO1xyXG5uZXcgU2VsZWN0KGV2ZW50QnVzKTtcclxubmV3IFV0aWxzKCk7XHJcbm5ldyBGb290ZXIoKTtcclxubmV3IFJvdXRlcihbaW5kZXgsIG1hcF0sIGV2ZW50QnVzKTsiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBCdXJnZXJcclxue1xyXG5cdGNvbnN0cnVjdG9yKGV2ZW50QnVzKVxyXG5cdHtcclxuXHRcdHRoaXMuZXZlbnRCdXMgPSBldmVudEJ1cztcclxuXHJcblx0XHR0aGlzLmRpc3RhbmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Rpc3RhbmNlJyk7XHJcblx0XHR0aGlzLmRpc3RhbmNlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4gdGhpcy5ldmVudEJ1cy50cmlnZ2VyKCdkaXN0YW5jZTp2YWx1ZScsIGV2ZW50LnRhcmdldC52YWx1ZSkpO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvb3RlclxyXG57XHJcblx0Y29uc3RydWN0b3IoKVxyXG5cdHtcclxuXHRcdHRoaXMuZm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9vdGVyJyk7XHJcblxyXG5cclxuXHRcdHRoaXMuZm9vdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4gdGhpcy51cGRhdGVIYXNoKGV2ZW50KSk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVIYXNoKGV2ZW50KVxyXG5cdHtcclxuXHRcdGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QpO1xyXG5cdFx0aWYgKGV2ZW50LnRhcmdldC5jbGFzc0xpc3RbMF0uaW5kZXhPZignbWFwJykgPj0gMClcclxuXHRcdHtcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSAnbWFwJztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGV2ZW50LnRhcmdldC5jbGFzc0xpc3RbMF0uaW5kZXhPZignYmFua3MnKSA+PSAwKVxyXG5cdFx0e1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9ICdiYW5rcyc7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJyc7XHJcblx0XHR9XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlzdFxyXG57XHJcblx0Y29uc3RydWN0b3IoeWFuZGV4TWFwLCByZXF1ZXN0LCBldmVudEJ1cylcclxuXHR7XHJcblx0XHR0aGlzLnlNYXAgPSB5YW5kZXhNYXA7XHJcblx0XHR0aGlzLnJlcXVlc3QgPSByZXF1ZXN0O1xyXG5cdFx0dGhpcy5ldmVudEJ1cyA9IGV2ZW50QnVzO1xyXG5cclxuXHRcdHRoaXMuZGlzdGFuY2UgPSAxMDAwO1xyXG5cclxuXHRcdC8vIFN1YnNjcmliZSB0byBleGNoYW5nZSBjdXJyZW5jaWVzIGNoYW5nZVxyXG5cdFx0dGhpcy5ldmVudEJ1cy5vbignc2VsZWN0OnVwZGF0ZScsIHRoaXMuZ2V0U2VsZWN0ZWRDdXJyZW5jeS5iaW5kKHRoaXMpKTtcclxuXHJcblx0XHQvLyBTdWJzY3JpYmUgdG8gZGlzdGFuY2UgY2hhbmdlXHJcblx0XHR0aGlzLmV2ZW50QnVzLm9uKCdkaXN0YW5jZTp2YWx1ZScsIG51bSA9PiB0aGlzLmRpc3RhbmNlID0gK251bSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBmdW5jIC0gcmVjZWl2ZSBmdW5jdGlvblxyXG5cdCAqIEBwYXJhbSB3YWl0IC0gcmVjZWl2ZSBkZWxheSBpbiBtc1xyXG5cdCAqIEByZXR1cm5zIHtmdW5jdGlvbigpfVxyXG5cdCAqL1xyXG5cdC8qZGVib3VuY2UoZnVuYywgd2FpdClcclxuXHR7XHJcblx0XHRsZXQgdGltZXI7XHJcblx0XHRyZXR1cm4gKCkgPT5cclxuXHRcdHtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuXHRcdFx0bGV0IGFyZ3MgPSBhcmd1bWVudHM7XHJcblx0XHRcdHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7IGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7IH0sIHdhaXQpO1xyXG5cdFx0fTtcclxuXHR9Ki9cclxuXHJcblx0LyoqXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gYXJyIHJlY2VpdmUgYW4gYXJyYXlcclxuXHQgKiBbc2VsZWN0ZWQgY3VycmVuY3ksIHBhcmVudCBjc3MgY2xhc3NdXHJcblx0ICogZnJvbSBcInNlbGVjdDp1cGRhdGVcIiBzdWJzY3JpYmVcclxuXHQgKi9cclxuXHRnZXRTZWxlY3RlZEN1cnJlbmN5KGFycilcclxuXHR7XHJcblx0XHRpZiAodHlwZW9mIGFyclswXSA9PT0gJ3N0cmluZycpXHJcblx0XHR7XHJcblx0XHRcdGlmIChhcnJbMV0gPT09ICdzZWxlY3QtaW5wdXQnKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGhpcy5pbnB1dEN1cnJlbmN5ID0gYXJyWzBdLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyh0aGlzLmlucHV0Q3VycmVuY3kpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGFyclsxXSA9PT0gJ3NlbGVjdC1vdXRwdXQnKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGhpcy5vdXRwdXRDdXJyZW5jeSA9IGFyclswXS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRcdC8vY29uc29sZS5sb2codGhpcy5vdXRwdXRDdXJyZW5jeSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBHZXQgY3VycmVudCBsb2NhdGlvbiBpZiBpbnB1dEN1cnJlbmN5ICYmIG91dHB1dEN1cnJlbmN5IGFkZGVkXHJcblx0XHRpZiAodGhpcy5pbnB1dEN1cnJlbmN5ICYmIHRoaXMub3V0cHV0Q3VycmVuY3kpXHJcblx0XHR7XHJcblx0XHRcdHRoaXMuY3VycmVudEN1cnJlbmNpZXMgPSB0aGlzLmlucHV0Q3VycmVuY3kgKyAnLScgKyB0aGlzLm91dHB1dEN1cnJlbmN5O1xyXG5cdFx0XHQvLyBJZiBBUEkgd2VyZSBsb2FkZWRcclxuXHRcdFx0aWYgKHRoaXMueU1hcC5leGVjdXRlZClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdC8vIFJlbmRlciBsb2NhdGlvblxyXG5cdFx0XHRcdHRoaXMueU1hcC5nZXRDdXJyZW50TG9jYXRpb24oKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gY2l0eSAtIHRoZSBzdHJpbmcgd2hpY2ggY29udGFpbiBjaXR5IG5hbWVcclxuXHQgKiBAcmV0dXJucyB7Kn0gVGhpcyBmdW5jdGlvbiByZWNlaXZlIGFsbCBkZXBhcnRtZW50cyBmcm9tIGV4ZWN1dGUgZ2V0UmF0ZXNcclxuXHQgKiBmdW5jdGlvbiBhbmQgdGhlbiByZXR1cm5zIGZpbHRlcmVkIGxpc3Qgb2YgZGVwYXJ0bWVudHNcclxuXHQgKi9cclxuXHRnZXRMaXN0KGNpdHkpXHJcblx0e1xyXG5cdFx0aWYgKGNpdHkpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiB0aGlzLnJlcXVlc3QuZ2V0UmF0ZXMoY2l0eSlcclxuXHRcdFx0ICAgICAgICAgICAudGhlbihkYXRhID0+IHRoaXMuZ2V0RmlsdGVyZWRMaXN0KGRhdGEpKVxyXG5cdFx0XHQgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIGRhdGEgcmVjZWl2ZSBvYmplY3Qgd2l0aCBhbGwgZGVwYXJ0bWVudHMgZnJvbSBnZXRMaXN0KCkgZnVuY3Rpb25cclxuXHQgKiBAcmV0dXJucyB7MDp7b3JkZXI6MH0uLi5uOntvcmRlcjpufX0gLSByZXR1cm5zIHNvcnRlZCBvYmplY3RcclxuXHQgKi9cclxuXHRnZXRGaWx0ZXJlZExpc3QoZGF0YSlcclxuXHR7XHJcblx0XHRsZXQgZmlsdGVyZWREYXRhID0ge307XHJcblx0XHRsZXQgZmlsdGVyZWRBcnIgPSBbXTtcclxuXHJcblx0XHRmb3IgKGxldCBpIGluIGRhdGEpIHsgZmlsdGVyZWRBcnIucHVzaChkYXRhW2ldKTsgfVxyXG5cclxuXHRcdGxldCBzZXRPcmRlck51bWJlcnMgPSAoZmlsdGVyZWRBcnIpID0+XHJcblx0XHR7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZmlsdGVyZWRBcnIubGVuZ3RoOyBpKyspXHJcblx0XHRcdHtcclxuXHRcdFx0XHRmaWx0ZXJlZEFycltpXVsnb3JkZXInXSA9IGk7XHJcblx0XHRcdFx0ZmlsdGVyZWREYXRhW2ldID0gZmlsdGVyZWRBcnJbaV07XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gUmV0dXJucyBvYmplY3Qgd2l0aCBzb3J0ZWQgZGVwYXJ0bWVudHNcclxuXHRcdFx0cmV0dXJuIGZpbHRlcmVkRGF0YTtcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gcmVzb2x2ZShcclxuXHRcdFx0Ly8gQWRkIGNvb3JkaW5hdGVzIHRvIGFsbCBkZXBhcnRtZW50c1xyXG5cdFx0XHR0aGlzLnlNYXAuYWRkQ29vcmRpbmF0ZXNUb0xpc3QoZmlsdGVyZWRBcnIpXHJcblx0XHRcdCAgICAudGhlbihhcnIgPT5cclxuXHRcdFx0ICAgIHtcclxuXHRcdFx0XHQgICAgaWYgKHRoaXMueU1hcC5jdXJyZW50TGF0TG5nKVxyXG5cdFx0XHRcdCAgICB7XHJcblx0XHRcdFx0XHQgICAgcmV0dXJuIHRoaXMuY2hlY2tEaXN0YW5jZSh0aGlzLnlNYXAuY3VycmVudExhdExuZywgYXJyKTtcclxuXHRcdFx0XHQgICAgfVxyXG5cdFx0XHRcdCAgICByZXR1cm4gYXJyO1xyXG5cdFx0XHQgICAgfSlcclxuXHRcdFx0ICAgIC50aGVuKGFyciA9PlxyXG5cdFx0XHQgICAge1xyXG5cdFx0XHQgICAgXHRpZiAodGhpcy5kaXN0YW5jZSlcclxuXHRcdFx0XHQgICAge1xyXG5cdFx0XHRcdFx0ICAgIHJldHVybiB0aGlzLmZpbHRlckJ5RGlzdGFuY2UodGhpcy5kaXN0YW5jZSwgYXJyKVxyXG5cdFx0XHRcdCAgICB9XHJcblx0XHRcdFx0ICAgIHJldHVybiBhcnI7XHJcblx0XHRcdCAgICB9KVxyXG5cdFx0XHRcdC50aGVuKGFyciA9PiB0aGlzLmZpbHRlckJ5UmF0ZShhcnIpKVxyXG5cdFx0XHRcdC50aGVuKGFyciA9PiB0aGlzLmZpbHRlckJ5TGltaXQoYXJyKSlcclxuXHRcdFx0XHQudGhlbihhcnIgPT4gdGhpcy5zZXRSYXRlSGVscGVycyhhcnIpKVxyXG5cdFx0XHRcdC50aGVuKGFyciA9PlxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHRoaXMueU1hcC5hZGRQbGFjZW1hcmtzKGFycik7XHJcblx0XHRcdFx0XHRyZXR1cm4gYXJyO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnRoZW4oYXJyID0+IHNldE9yZGVyTnVtYmVycyhhcnIpKVxyXG5cdFx0XHRcdC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSlcclxuXHRcdCkpO1xyXG5cdH1cclxuXHJcblx0Y2hlY2tEaXN0YW5jZShjdXJMb2MsIGFycilcclxuXHR7XHJcblx0XHRyZXR1cm4gYXJyLm1hcChvYmogPT5cclxuXHRcdHtcclxuXHRcdFx0aWYgKG9iai5jb29yZGluYXRlcyAmJiBvYmouY29vcmRpbmF0ZXNbMF0gJiYgb2JqLmNvb3JkaW5hdGVzWzFdKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0b2JqWydkaXN0YW5jZSddID0gK3RoaXMuZ2V0RGlzdGFuY2UoY3VyTG9jWzBdLCBjdXJMb2NbMV0sIG9iai5jb29yZGluYXRlc1swXSwgb2JqLmNvb3JkaW5hdGVzWzFdKVxyXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgLnRvRml4ZWQoMCk7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhvYmpbJ2FkZHJlc3MnXSk7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhvYmpbJ2Rpc3RhbmNlJ10pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG9ialsnZGlzdGFuY2UnXSA9IDk5OTk5OTk7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhvYmopO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBvYmo7XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0Z2V0RGlzdGFuY2UobGF0MSwgbG9uZzEsIGxhdDIsIGxvbmcyKVxyXG5cdHtcclxuXHRcdC8vIFRoZSBFYXJ0aCByYWRpdXNcclxuXHRcdGxldCBSID0gNjM3Mjc5NTtcclxuXHRcdC8vIENvbnZlcnQgY29vcmRpbmF0ZXMgdG8gcmFkaWFuc1xyXG5cdFx0bGF0MSAqPSBNYXRoLlBJIC8gMTgwO1xyXG5cdFx0bGF0MiAqPSBNYXRoLlBJIC8gMTgwO1xyXG5cdFx0bG9uZzEgKj0gTWF0aC5QSSAvIDE4MDtcclxuXHRcdGxvbmcyICo9IE1hdGguUEkgLyAxODA7XHJcblx0XHQvLyBDYWxjdWxhdGUgY29zIGFuZCBzaW4gZm9yIGxhdCwgbG5nXHJcblx0XHRsZXQgY2wxID0gTWF0aC5jb3MobGF0MSk7XHJcblx0XHRsZXQgY2wyID0gTWF0aC5jb3MobGF0Mik7XHJcblx0XHRsZXQgc2wxID0gTWF0aC5zaW4obGF0MSk7XHJcblx0XHRsZXQgc2wyID0gTWF0aC5zaW4obGF0Mik7XHJcblx0XHRsZXQgZGVsdGEgPSBsb25nMiAtIGxvbmcxO1xyXG5cdFx0bGV0IGNkZWx0YSA9IE1hdGguY29zKGRlbHRhKTtcclxuXHRcdGxldCBzZGVsdGEgPSBNYXRoLnNpbihkZWx0YSk7XHJcblx0XHQvLyBMZW5ndGggY2FsY3VsYXRpb24gZm9yIHRoZSBiaWcgY2lyY2xlXHJcblx0XHRsZXQgeSA9IE1hdGguc3FydChNYXRoLnBvdyhjbDIgKiBzZGVsdGEsIDIpICsgTWF0aC5wb3coY2wxICogc2wyIC0gc2wxICogY2wyICogY2RlbHRhLCAyKSk7XHJcblx0XHRsZXQgeCA9IHNsMSAqIHNsMiArIGNsMSAqIGNsMiAqIGNkZWx0YTtcclxuXHRcdGxldCBhZCA9IE1hdGguYXRhbjIoeSwgeCk7XHJcblx0XHQvLyBSZXR1cm5zIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50cyAobWV0ZXJzKVxyXG5cdFx0cmV0dXJuIGFkICogUjtcclxuXHR9XHJcblxyXG5cdGZpbHRlckJ5RGlzdGFuY2UodGFyZ2V0RGlzdCwgYXJyKVxyXG5cdHtcclxuXHRcdHJldHVybiBhcnIuZmlsdGVyKG9iaiA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpZiAob2JqLmRpc3RhbmNlICYmIG9iai5kaXN0YW5jZSA8PSB0YXJnZXREaXN0KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuIG9iajtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIGFyciAtIHJlY2VpdmUgYW4gYXJyYXkgd2l0aCBhbGwgZGVwYXJ0bWVudHMgd2hpY2ggbmVlZCB0byBiZSBzb3J0ZWRcclxuXHQgKi9cclxuXHRmaWx0ZXJCeVJhdGUoYXJyKVxyXG5cdHtcclxuXHRcdGxldCBjdXIgPSB0aGlzLmlucHV0Q3VycmVuY3kgKyAnLScgKyB0aGlzLm91dHB1dEN1cnJlbmN5O1xyXG5cclxuXHRcdC8vIEZpbHRlciBkZXBhcnRtZW50cyB3aXRob3V0IHRhcmdldCBjdXJcclxuXHRcdGFyciA9IGFyci5maWx0ZXIob2JqID0+IG9iai5yYXRlc1tjdXJdID8gb2JqIDogZmFsc2UpO1xyXG5cclxuXHRcdC8vIFNvcnRcclxuXHRcdGlmICh0aGlzLmlucHV0Q3VycmVuY3kgPT09ICdieW4nKVxyXG5cdFx0e1xyXG5cdFx0XHRhcnIuc29ydCgoYSxiKSA9PiBhLnJhdGVzW2N1cl0gLSBiLnJhdGVzW2N1cl0pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHRhcnIuc29ydCgoYSxiKSA9PiBiLnJhdGVzW2N1cl0gLSBhLnJhdGVzW2N1cl0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBhcnI7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBhcnIgLSByZWNlaXZlIGFuIGFycmF5IHdpdGggYWxsIGRlcGFydG1lbnRzIHdoaWNoIG5lZWQgdG8gYmUgc29ydGVkXHJcblx0ICovXHJcblx0ZmlsdGVyQnlMaW1pdChhcnIpXHJcblx0e1xyXG5cdFx0bGV0IHJlc3VsdCA9IFtdO1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDw9IDQwOyBpKyspXHJcblx0XHR7XHJcblx0XHRcdGlmIChhcnJbaV0pXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChhcnJbaV0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHJcblx0c2V0UmF0ZUhlbHBlcnMoYXJyKVxyXG5cdHtcclxuXHRcdGxldCBjdXIgPSB0aGlzLmN1cnJlbnRDdXJyZW5jaWVzO1xyXG5cdFx0bGV0IGJlc3RSYXRlID0gYXJyWzBdLnJhdGVzW2N1cl07XHJcblxyXG5cdFx0cmV0dXJuIGFyci5tYXAob2JqID0+XHJcblx0XHR7XHJcblx0XHRcdGlmIChvYmoucmF0ZXNbY3VyXSA9PT0gYmVzdFJhdGUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRvYmoucmF0ZXMuaGVscGVyID0gJ9C70YPRh9GI0LjQuSDQutGD0YDRgSc7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bGV0IGhlbHBlciA9IG9iai5yYXRlc1tjdXJdIC0gYmVzdFJhdGU7XHJcblx0XHRcdFx0aWYgKGhlbHBlciA+PSAwKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG9iai5yYXRlcy5oZWxwZXIgPSAnKycgKyBoZWxwZXIudG9GaXhlZCgzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG9iai5yYXRlcy5oZWxwZXIgPSBoZWxwZXIudG9GaXhlZCgzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG9iajtcclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdFxyXG57XHJcblx0Y29uc3RydWN0b3IoZXZlbnRCdXMpXHJcblx0e1xyXG5cdFx0dGhpcy5ldmVudEJ1cyA9IGV2ZW50QnVzO1xyXG5cclxuXHRcdHRoaXMuY3VycmVuY3kgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZXhjaGFuZ2UtY3VycmVuY2llcycpO1xyXG5cclxuXHRcdHRoaXMuY3VycmVuY3kuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSAhPT0gJ3NlbGVjdC1pdGVtJykgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmNoYW5nZVZpZXcoW2V2ZW50LnRhcmdldC52YWx1ZSwgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuY2xhc3NOYW1lLCB0cnVlXSk7XHJcblx0XHR9KTtcclxuXHRcdC8vIEdldCBzdHlsZSBzaGVldFxyXG5cdFx0dGhpcy5zaGVldCA9IGRvY3VtZW50LnN0eWxlU2hlZXRzWzBdO1xyXG5cdFx0dGhpcy5ydWxlcyA9IHRoaXMuc2hlZXQucnVsZXM7XHJcblxyXG5cdFx0Ly8gRGVmYXVsdCB2aWV3c1xyXG5cdFx0dGhpcy5jaGFuZ2VWaWV3KFsnQllOJywgJ3NlbGVjdC1pbnB1dCcsIHRydWVdKTtcclxuXHRcdHRoaXMuY2hhbmdlVmlldyhbJ1VTRCcsICdzZWxlY3Qtb3V0cHV0JywgdHJ1ZV0pO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gdmFsdWUgLSByZWNlaXZlIGN1cnJlbmN5IGNvZGUgKEJZTiwgVVNEIGV0Yy4pXHJcblx0ICogQHBhcmFtIHBhcmVudCAtIHJlY2VpdmUgcGFyZW50IGNzcyBjbGFzc1xyXG5cdCAqIEBwYXJhbSBxdWVyeSAtIHRydWUgb3IgZmFsc2UgaXMgZXF1YWwgdG8gc2VuZCBuZXcgcmVxdWVzdCB0byBteWZpbiBvciBub3RcclxuXHQgKi9cclxuXHRjaGFuZ2VWaWV3KFt2YWx1ZSwgcGFyZW50LCBxdWVyeV0pXHJcblx0e1xyXG5cdFx0c3dpdGNoICh2YWx1ZSlcclxuXHRcdHtcclxuXHRcdFx0Y2FzZSAnQllOJzpcclxuXHRcdFx0XHR0aGlzLnNoZWV0Lmluc2VydFJ1bGUoJy4nICsgcGFyZW50ICsgJzpiZWZvcmUge2JhY2tncm91bmQ6IHVybCguLi9pbWcvZmxhZy9kNjUucG5nKSAxMCUgNjAlIC8gMTAlIG5vLXJlcGVhdDt9JywgdGhpcy5ydWxlcy5sZW5ndGgpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSAnVVNEJzpcclxuXHRcdFx0XHR0aGlzLnNoZWV0Lmluc2VydFJ1bGUoJy4nICsgcGFyZW50ICsgJzpiZWZvcmUge2JhY2tncm91bmQ6IHVybCguLi9pbWcvZmxhZy9kMTc2LnBuZykgMTAlIDYwJSAvIDEwJSBuby1yZXBlYXQ7fScsIHRoaXMucnVsZXMubGVuZ3RoKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgJ0VVUic6XHJcblx0XHRcdFx0dGhpcy5zaGVldC5pbnNlcnRSdWxlKCcuJyArIHBhcmVudCArICc6YmVmb3JlIHtiYWNrZ3JvdW5kOiB1cmwoLi4vaW1nL2ZsYWcvZDcyLnBuZykgMTAlIDYwJSAvIDEwJSBuby1yZXBlYXQ7fScsIHRoaXMucnVsZXMubGVuZ3RoKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgJ1JVUic6XHJcblx0XHRcdFx0dGhpcy5zaGVldC5pbnNlcnRSdWxlKCcuJyArIHBhcmVudCArICc6YmVmb3JlIHtiYWNrZ3JvdW5kOiB1cmwoLi4vaW1nL2ZsYWcvZDU2LnBuZykgMTAlIDYwJSAvIDEwJSBuby1yZXBlYXQ7fScsIHRoaXMucnVsZXMubGVuZ3RoKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdC8qY2FzZSAnUExOJzpcclxuXHRcdFx0XHR0aGlzLnNoZWV0Lmluc2VydFJ1bGUoJy4nICsgcGFyZW50ICsgJzpiZWZvcmUge2JhY2tncm91bmQ6IHVybCguLi9pbWcvZmxhZy9kNTMucG5nKSAxMCUgNjAlIC8gMTAlIG5vLXJlcGVhdDt9JywgdGhpcy5ydWxlcy5sZW5ndGgpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSAnVUFIJzpcclxuXHRcdFx0XHR0aGlzLnNoZWV0Lmluc2VydFJ1bGUoJy4nICsgcGFyZW50ICsgJzpiZWZvcmUge2JhY2tncm91bmQ6IHVybCguLi9pbWcvZmxhZy9kNjEucG5nKSAxMCUgNjAlIC8gMTAlIG5vLXJlcGVhdDt9JywgdGhpcy5ydWxlcy5sZW5ndGgpO1xyXG5cdFx0XHRcdGJyZWFrOyovXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2V0IG9ubHkgdmFsdWUgaGltc2VsZiB3aXRob3V0IGRlc2NyaXB0aW9uIGluIHNlbGVjdCBmaWVsZFxyXG5cdFx0bGV0IG9wdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHBhcmVudCArICcgLnNlbGVjdC1pdGVtIG9wdGlvbicpO1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKylcclxuXHRcdHtcclxuXHRcdFx0aWYgKG9wdGlvbnNbaV0uc2VsZWN0ZWQpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAob3B0aW9uc1tpXS52YWx1ZSA9PT0gJ1JVUicpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0b3B0aW9uc1tpXS5pbm5lckhUTUwgPSAnMTAwICcgKyBvcHRpb25zW2ldLnZhbHVlO1xyXG5cdFx0XHRcdFx0dGhpcy5zaGVldC5pbnNlcnRSdWxlKCcuJyArIHBhcmVudCArICcgc2VsZWN0IHtwYWRkaW5nOiA0LjUlIDMwLjUlO30nLCB0aGlzLnJ1bGVzLmxlbmd0aCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRvcHRpb25zW2ldLmlubmVySFRNTCA9IG9wdGlvbnNbaV0udmFsdWU7XHJcblx0XHRcdFx0XHR0aGlzLnNoZWV0Lmluc2VydFJ1bGUoJy4nICsgcGFyZW50ICsgJyBzZWxlY3Qge3BhZGRpbmc6IDQuNSUgMzkuNSU7fScsIHRoaXMucnVsZXMubGVuZ3RoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG9wdGlvbnNbaV0uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcblxyXG5cdFx0XHRcdC8vIFNlbmQgc2VsZWN0ZWQgdmFsdWUgdG8gZXZlbnRCdXNcclxuXHRcdFx0XHRpZiAocXVlcnkpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dGhpcy5ldmVudEJ1cy50cmlnZ2VyKCdzZWxlY3Q6dXBkYXRlJywgW29wdGlvbnNbaV0udmFsdWUsIHBhcmVudF0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzd2l0Y2ggKG9wdGlvbnNbaV0udmFsdWUpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0Y2FzZSAnQllOJzpcclxuXHRcdFx0XHRcdFx0b3B0aW9uc1tpXS5pbm5lckhUTUwgPSAn0JHQtdC70L7RgNGD0YHRgdC60LjQuSDRgNGD0LHQu9GMKEJZTiknO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRjYXNlICdVU0QnOlxyXG5cdFx0XHRcdFx0XHRvcHRpb25zW2ldLmlubmVySFRNTCA9ICfQlNC+0LvQu9Cw0YAg0KHQqNCQKFVTRCknO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRjYXNlICdFVVInOlxyXG5cdFx0XHRcdFx0XHRvcHRpb25zW2ldLmlubmVySFRNTCA9ICfQldCy0YDQvihFVVIpJztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0Y2FzZSAnUlVSJzpcclxuXHRcdFx0XHRcdFx0b3B0aW9uc1tpXS5pbm5lckhUTUwgPSAn0KDQvtGB0YHQuNC50YHQutC40Lkg0YDRg9Cx0LvRjChSVVIpJztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0LypjYXNlICdQTE4nOlxyXG5cdFx0XHRcdFx0XHRvcHRpb25zW2ldLmlubmVySFRNTCA9ICfQl9C70L7RgtGL0LkoUExOKSc7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdGNhc2UgJ1VBSCc6XHJcblx0XHRcdFx0XHRcdG9wdGlvbnNbaV0uaW5uZXJIVE1MID0gJ9CT0YDQuNCy0L3QsChVQUgpJztcclxuXHRcdFx0XHRcdFx0YnJlYWs7Ki9cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0b3B0aW9uc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIHlNYXBcclxue1xyXG5cdGNvbnN0cnVjdG9yKGV2ZW50QnVzKVxyXG5cdHtcclxuXHRcdHRoaXMuZXZlbnRCdXMgPSBldmVudEJ1cztcclxuXHRcdHRoaXMubXlNYXAgPSB7fTtcclxuXHJcblx0XHR0aGlzLm1hcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXAnKTtcclxuXHJcblx0XHR0aGlzLmdldEFQSSgpO1xyXG5cdFx0Ly9sb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoaXMgZnVuY3Rpb24gcmVjZWl2ZSBhcGkgc2NyaXB0IGZyb20geWFuZGV4XHJcblx0ICovXHJcblx0Z2V0QVBJKClcclxuXHR7XHJcblx0XHRsZXQgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcblx0XHRzY3JpcHQuc3JjID0gXCJodHRwczovL2FwaS1tYXBzLnlhbmRleC5ydS8yLjEvP2xhbmc9cnVfUlVcIjtcclxuXHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuXHJcblx0XHRzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9uZXJyb3IgPSAoKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoIXRoaXMuZXhlY3V0ZWQpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aGlzLmdldEN1cnJlbnRMb2NhdGlvbigpO1xyXG5cdFx0XHRcdHRoaXMuZXhlY3V0ZWQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogR2V0IGN1cnJlbnQgbG9jYXRpb24gYnkgYnJvd3NlciBnZW9sb2NhdGlvblxyXG5cdCAqL1xyXG5cdGdldEN1cnJlbnRMb2NhdGlvbigpXHJcblx0e1xyXG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIGJyb3dzZXIgaGFzIHN1cHBvcnQgZm9yIHRoZSBHZW9sb2NhdGlvbiBBUElcclxuXHRcdGlmICghbmF2aWdhdG9yLmdlb2xvY2F0aW9uKVxyXG5cdFx0e1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKCdUaGVyZSBpcyBzb21lIHByb2JsZW0gd2l0aCBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24nKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0bmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihwb3NpdGlvbiA9PlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKHBvc2l0aW9uLmNvb3JkcylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHQvLyBHZXQgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBjdXJyZW50IHBvc3NpdGlvbi5cclxuXHRcdFx0XHRcdGxldCBsYXQgPSBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XHJcblx0XHRcdFx0XHRsZXQgbG5nID0gcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcclxuXHJcblx0XHRcdFx0XHQvLyBDaGVjayBpZiBteU1hcCBhbHJlYWR5IGV4aXN0XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMubWFwQ2hlY2spXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3VycmVudExhdExuZyA9IFtsYXQsIGxuZ107XHJcblx0XHRcdFx0XHRcdHRoaXMuaW5pdE1hcCh0aGlzLmN1cnJlbnRMYXRMbmcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAodGhpcy5sb2NhdGlvbkRlc2NyaXB0aW9uKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHR0aGlzLmV2ZW50QnVzLnRyaWdnZXIoJ2xvY2F0aW9uOmNpdHknLCB0aGlzLmxvY2F0aW9uRGVzY3JpcHRpb24pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdTb21ldGhpbmcgZ29uZSB3cm9uZycpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpbml0TWFwKGNvb3JkaW5hdGVzKVxyXG5cdHtcclxuXHRcdHltYXBzLnJlYWR5KCgpID0+XHJcblx0XHR7XHJcblx0XHRcdHRoaXMubWFwQ2hlY2sgPSB0cnVlO1xyXG5cclxuXHRcdFx0dGhpcy5teU1hcCA9IG5ldyB5bWFwcy5NYXAodGhpcy5tYXAsIHtcclxuXHRcdFx0XHRjZW50ZXI6IGNvb3JkaW5hdGVzLFxyXG5cdFx0XHRcdHpvb206IDE1LFxyXG5cdFx0XHRcdHR5cGU6ICd5YW5kZXgjbWFwJyxcclxuXHRcdFx0XHRjb250cm9sczogWyd6b29tQ29udHJvbCcsICd0eXBlU2VsZWN0b3InXVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIEdldCBjdXJyZW50IGNpdHkgYnkgY29vcmRpbmF0ZXNcclxuXHRcdFx0eW1hcHMuZ2VvY29kZShjb29yZGluYXRlcylcclxuXHRcdFx0ICAgICAudGhlbihyZXMgPT4gcmVzLmdlb09iamVjdHMuZ2V0KDApLnByb3BlcnRpZXMuZ2V0QWxsKCkpXHJcblx0XHRcdCAgICAgLnRoZW4ocmVzID0+XHJcblx0XHRcdCAgICAge1xyXG5cdFx0XHQgICAgIFx0dGhpcy5sb2NhdGlvbkRlc2NyaXB0aW9uID0gcmVzLmRlc2NyaXB0aW9uO1xyXG5cdFx0XHQgICAgIFx0dGhpcy5ldmVudEJ1cy50cmlnZ2VyKCdsb2NhdGlvbjpjaXR5JywgcmVzLmRlc2NyaXB0aW9uKTtcclxuXHRcdFx0ICAgICB9KVxyXG5cdFx0XHQgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIGFyciAtIEFycmF5IHdpdGggZGVwYXJ0bWVudHMgb2JqZWN0c1xyXG5cdCAqIEByZXR1cm5zIFt7Kn0seyp9Li5dIGFycmF5IHdpdGggZGVwYXJ0bWVudHMgb2JqZWN0cywgd2hpY2ggY29udGFpbnMgbmV3IGtleSBbJ2Nvb3JkaW5hdGVzJ11cclxuXHQgKi9cclxuXHRhZGRDb29yZGluYXRlc1RvTGlzdChhcnIpXHJcblx0e1xyXG5cdFx0bGV0IGNoZWNrID0gKHN0cikgPT5cclxuXHRcdHtcclxuXHRcdFx0Ly8gU3BsaXQgYWRkcmVzcyB0byBhcnJheVxyXG5cdFx0XHRsZXQgYWRkcmVzc0FyciA9IHN0ci5zcGxpdCgnLCcpO1xyXG5cclxuXHRcdFx0Ly8gUmVtb3ZlIGVsZW1lbnRzIGZyb20gYXJyYXlcclxuXHRcdFx0bGV0IHJlbW92ZSA9IChrZXksIGFycikgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdGtleS5tYXAoa2V5U3RyID0+XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0YXJyID0gYXJyLmZpbHRlcihzdHIgPT4gc3RyLmluZGV4T2Yoa2V5U3RyKSA8IDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gYXJyO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Ly8gUmVtb3ZlIHRoaXMgZWxlbWVudHMgZnJvbSBhZGRyZXNzIGZpZWxkXHJcblx0XHRcdGxldCBlbGVtVG9SZW1vdmUgPSBbJ9GG0L7QutC+0LvRjCcsICfQotCmJywgJ9C60YDRi9C70L4nLCAn0L/RgNC+0LzRg9C30LXQuycsICfQtNC40YHQutCw0YPQvdGC0LXRgCddO1xyXG5cdFx0XHRhZGRyZXNzQXJyID0gcmVtb3ZlKGVsZW1Ub1JlbW92ZSwgYWRkcmVzc0Fycik7XHJcblxyXG5cclxuXHRcdFx0Ly8gUmVtb3ZlIHBhcmVudCBjaXR5IGlmIGFkZHJlc3MgY29udGFpbiBhbm90aGVyIHNldHRsZW1lbnRcclxuXHRcdFx0bGV0IGNoZWNrQ2l0eSA9IChrZXksIGFycikgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxldCBzdHIgPSBhcnIuam9pbignLCcpO1xyXG5cdFx0XHRcdGtleS5tYXAoa2V5U3RyID0+XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aWYgKHN0ci5pbmRleE9mKGtleVN0cikgPj0gMClcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0YXJyLnNwbGljZSgwLDEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gYXJyO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0bGV0IGNpdHkgPSBbJ9Cg0LDRgtC+0LwnLCAn0KnQvtC80YvRgdC70LjRhicsICfQodC10L3QuNGGJ107XHJcblx0XHRcdGFkZHJlc3NBcnIgPSBjaGVja0NpdHkoY2l0eSwgYWRkcmVzc0Fycik7XHJcblxyXG5cdFx0XHRyZXR1cm4gYWRkcmVzc0Fyci5qb2luKCcsJyk7XHJcblx0XHR9O1xyXG5cclxuXHJcblxyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT5cclxuXHRcdHtcclxuXHRcdFx0bGV0IGdldENvb3JkaW5hdGVzID0gKGkpID0+XHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoaSA8IGFyci5sZW5ndGgpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGV0IGFkZHJlc3M7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGFycltpXS5jaXR5ICYmIGFycltpXS5hZGRyZXNzKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRhZGRyZXNzID0gY2hlY2soYXJyW2ldLmNpdHkgKyAnLCAnICsgYXJyW2ldLmFkZHJlc3MpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRhZGRyZXNzID0gY2hlY2soYXJyW2ldLmFkZGl0aW9uYWwpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHltYXBzLmdlb2NvZGUoYWRkcmVzcylcclxuXHRcdFx0XHRcdCAgICAgLnRoZW4ocmVzID0+XHJcblx0XHRcdFx0XHQgICAgIHtcclxuXHRcdFx0XHRcdFx0ICAgICBhcnJbaV1bJ2Nvb3JkaW5hdGVzJ10gPSByZXMuZ2VvT2JqZWN0cy5nZXQoMCkuZ2VvbWV0cnkuZ2V0Q29vcmRpbmF0ZXMoKTtcclxuXHRcdFx0XHRcdFx0ICAgICAvL2NvbnNvbGUubG9nKGkgKyAnICcgKyBhcnJbaV1bJ2Nvb3JkaW5hdGVzJ10pO1xyXG5cdFx0XHRcdFx0XHQgICAgIGdldENvb3JkaW5hdGVzKGkgKyAxKTtcclxuXHRcdFx0XHRcdCAgICAgfSlcclxuXHRcdFx0XHRcdCAgICAgLmNhdGNoKGVyciA9PlxyXG5cdFx0XHRcdFx0ICAgICB7XHJcblx0XHRcdFx0XHRcdCAgICAgYXJyW2ldWydjb29yZGluYXRlcyddID0gWzAsMF07XHJcblx0XHRcdFx0XHRcdCAgICAgLy9jb25zb2xlLmxvZyhhcnJbaV0pO1xyXG5cdFx0XHRcdFx0XHQgICAgIC8vY29uc29sZS5lcnJvcihlcnIpO1xyXG5cdFx0XHRcdFx0XHQgICAgIGdldENvb3JkaW5hdGVzKGkgKyAxKTtcclxuXHRcdFx0XHRcdCAgICAgfSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnY29vcmRpbmF0ZXMgcmVjZWl2ZWQnKTtcclxuXHRcdFx0XHRcdC8vIFNldCBtYWluIGFycmF5IHdpdGggZGVwYXJ0bWVudHMgdG8gbG9jYWwgc3RvcmFnZVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ0FsbERhdGE6JyArIHRoaXMubG9jYXRpb25EZXNjcmlwdGlvbiwgSlNPTi5zdHJpbmdpZnkoYXJyLCBcIlwiLCA0KSk7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGFycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Ly8gR2V0IGNvb3JkaW5hdGVzIGZyb20gbG9jYWwgc3RvcmFnZSwgaWYgdGhleSBhcmUgYWxyZWFkeSBiZWVuIHJlY2VpdmVkXHJcblx0XHRcdGxldCBkYXRhU3RvcmFnZSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0FsbERhdGE6JyArIHRoaXMubG9jYXRpb25EZXNjcmlwdGlvbikpIHx8IHt9O1xyXG5cdFx0XHRpZiAoT2JqZWN0LmtleXMoZGF0YVN0b3JhZ2UpLmxlbmd0aCA+IDEpXHJcblx0XHRcdHtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKGRhdGFTdG9yYWdlKTtcclxuXHRcdFx0XHRhcnIgPSBhcnIubWFwKG9iaiA9PlxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGxldCBuZXdEZXBhcnRtZW50ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGRhdGFTdG9yYWdlLm1hcChzdG9yYWdlT2JqID0+XHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGlmIChvYmoudGl0bGUgPT09IHN0b3JhZ2VPYmoudGl0bGUpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRuZXdEZXBhcnRtZW50ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygndGVzdCcpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5jb29yZGluYXRlcyA9IHN0b3JhZ2VPYmouY29vcmRpbmF0ZXM7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdC8vIElmIG5ldyBkZXBhcnRtZW50IHdhcyBhZGRlZCB0byBsaXN0IHRoZW4gZ2V0IG5ldyBjb29yZGluYXRlc1xyXG5cdFx0XHRcdFx0aWYgKG5ld0RlcGFydG1lbnQpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGxldCBhZGRyZXNzO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKG9iai5jaXR5ICYmIG9iai5hZGRyZXNzKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0YWRkcmVzcyA9IGNoZWNrKG9iai5jaXR5ICsgJywgJyArIG9iai5hZGRyZXNzKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRhZGRyZXNzID0gY2hlY2sob2JqLmFkZGl0aW9uYWwpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHR5bWFwcy5nZW9jb2RlKGFkZHJlc3MpXHJcblx0XHRcdFx0XHRcdCAgICAgLnRoZW4ocmVzID0+XHJcblx0XHRcdFx0XHRcdCAgICAge1xyXG5cdFx0XHRcdFx0XHRcdCAgICAgb2JqWydjb29yZGluYXRlcyddID0gcmVzLmdlb09iamVjdHMuZ2V0KDApLmdlb21ldHJ5LmdldENvb3JkaW5hdGVzKCk7XHJcblx0XHRcdFx0XHRcdFx0ICAgICBjb25zb2xlLmxvZyhvYmpbJ2Nvb3JkaW5hdGVzJ10pO1xyXG5cdFx0XHRcdFx0XHQgICAgIH0pXHJcblx0XHRcdFx0XHRcdCAgICAgLmNhdGNoKGVyciA9PlxyXG5cdFx0XHRcdFx0XHQgICAgIHtcclxuXHRcdFx0XHRcdFx0XHQgICAgIG9ialsnY29vcmRpbmF0ZXMnXSA9IFswLDBdO1xyXG5cdFx0XHRcdFx0XHRcdCAgICAgY29uc29sZS5sb2cob2JqKTtcclxuXHRcdFx0XHRcdFx0XHQgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuXHRcdFx0XHRcdFx0ICAgICB9KTtcclxuXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdORVcgY29vcmRpbmF0ZXMgcmVjZWl2ZWQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIFNldCBtYWluIGFycmF5IHdpdGggZGVwYXJ0bWVudHMgdG8gbG9jYWwgc3RvcmFnZVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ0FsbERhdGE6JyArIHRoaXMubG9jYXRpb25EZXNjcmlwdGlvbiwgSlNPTi5zdHJpbmdpZnkoYXJyLCBcIlwiLCA0KSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gb2JqO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coYXJyKTtcclxuXHRcdFx0XHRyZXNvbHZlKGFycik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ2dldCBjb29yZGluYXRlcy4uLicpO1xyXG5cdFx0XHRcdGdldENvb3JkaW5hdGVzKDApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIGFyciByZWNlaXZlIGFuIGFycmF5IHdpdGggZmlsdGVyZWQgbGlzdCBvZiBkZXBhcnRtZW50c1xyXG5cdCAqL1xyXG5cdGFkZFBsYWNlbWFya3MoYXJyKVxyXG5cdHtcclxuXHRcdGxldCBkZXBhcnRtZW50c0NvbGxlY3Rpb24gPSBuZXcgeW1hcHMuR2VvT2JqZWN0Q29sbGVjdGlvbigpO1xyXG5cdFx0bGV0IHByZXNldENvbGxlY3Rpb24gPSBbJ2lzbGFuZHMjYmx1ZURvdEljb25XaXRoQ2FwdGlvbicsICdpc2xhbmRzI2RhcmtHcmVlbkRvdEljb25XaXRoQ2FwdGlvbicsICdpc2xhbmRzI3JlZERvdEljb25XaXRoQ2FwdGlvbicsICdpc2xhbmRzI3Zpb2xldERvdEljb25XaXRoQ2FwdGlvbicsICdpc2xhbmRzI2RhcmtPcmFuZ2VEb3RJY29uV2l0aENhcHRpb24nLCAnaXNsYW5kcyNibGFja0RvdEljb25XaXRoQ2FwdGlvbicsICdpc2xhbmRzI25pZ2h0RG90SWNvbldpdGhDYXB0aW9uJywgJ2lzbGFuZHMjeWVsbG93RG90SWNvbldpdGhDYXB0aW9uJywgJ2lzbGFuZHMjZGFya0JsdWVEb3RJY29uV2l0aENhcHRpb24nLCAnaXNsYW5kcyNncmVlbkRvdEljb25XaXRoQ2FwdGlvbicsICdpc2xhbmRzI3BpbmtEb3RJY29uV2l0aENhcHRpb24nLCAnaXNsYW5kcyNvcmFuZ2VEb3RJY29uV2l0aENhcHRpb24nLCAnaXNsYW5kcyNncmF5RG90SWNvbldpdGhDYXB0aW9uJywgJ2lzbGFuZHMjbGlnaHRCbHVlRG90SWNvbldpdGhDYXB0aW9uJywgJ2lzbGFuZHMjYnJvd25Eb3RJY29uV2l0aENhcHRpb24nLCAnaXNsYW5kcyNvbGl2ZURvdEljb25XaXRoQ2FwdGlvbiddO1xyXG5cclxuXHRcdGxldCBteUxvY2F0aW9uID0gbmV3IHltYXBzLlBsYWNlbWFyayh0aGlzLmN1cnJlbnRMYXRMbmcsIHtcclxuXHRcdFx0aWNvbkNhcHRpb246ICfQryDQt9C00LXRgdGMJyxcclxuXHRcdH0se1xyXG5cdFx0XHRwcmVzZXQ6ICdpc2xhbmRzI2dyYXlEb3RJY29uV2l0aENhcHRpb24nXHJcblx0XHR9KTtcclxuXHRcdGRlcGFydG1lbnRzQ29sbGVjdGlvbi5hZGQobXlMb2NhdGlvbik7XHJcblxyXG5cdFx0Ly8gSWYgY29vcmRpbmF0ZXMgb2YgZGlmZmVyZW50IHBsYXNlbWFyayBhcmUgc2FtZSwgdGhlbiBjaGFuZ2UgY29vcmRpbmF0ZXMgZm9yIG9uZSBvZiB0aGVtXHJcblx0XHRsZXQgY29weSA9IFtdO1xyXG5cdFx0YXJyLm1hcChvYmogPT4gb2JqLmNvb3JkaW5hdGVzID8gY29weS5wdXNoKG9iai5jb29yZGluYXRlcykgOiBvYmopO1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKVxyXG5cdFx0e1xyXG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGNvcHkubGVuZ3RoOyBqKyspXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoaSAhPT0gaiAmJiBhcnJbaV0uY29vcmRpbmF0ZXNbMF0gPT09IGNvcHlbal1bMF0gJiYgYXJyW2ldLmNvb3JkaW5hdGVzWzFdID09PSBjb3B5W2pdWzFdKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGFycltpXS5jb29yZGluYXRlc1swXSArPSAwLjAwMDI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGNvbnNvbGUubG9nKGFycik7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKylcclxuXHRcdHtcclxuXHRcdFx0bGV0IHByZXNldFZhbHVlO1xyXG5cdFx0XHRpZiAoIXByZXNldENvbGxlY3Rpb25baV0pXHJcblx0XHRcdHtcclxuXHRcdFx0XHRwcmVzZXRWYWx1ZSA9IHByZXNldENvbGxlY3Rpb25baSAtIHByZXNldENvbGxlY3Rpb24ubGVuZ3RoXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRwcmVzZXRWYWx1ZSA9IHByZXNldENvbGxlY3Rpb25baV07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBwbGFjZW1hcmsgPSBuZXcgeW1hcHMuUGxhY2VtYXJrKGFycltpXS5jb29yZGluYXRlcywge1xyXG5cdFx0XHRcdGljb25DYXB0aW9uOiBhcnJbaV0ubmFtZSxcclxuXHRcdFx0XHRiYWxsb29uQ29udGVudEhlYWRlcjogYXJyW2ldLm5hbWUsXHJcblx0XHRcdFx0YmFsbG9vbkNvbnRlbnRCb2R5OiBhcnJbaV0udGl0bGUsXHJcblx0XHRcdFx0YmFsbG9vbkNvbnRlbnRGb290ZXI6IGFycltpXS5hZGRyZXNzICsgJyAnICsgYXJyW2ldLmFkZGl0aW9uYWxcclxuXHRcdFx0fSx7XHJcblx0XHRcdFx0cHJlc2V0OiBwcmVzZXRWYWx1ZVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGRlcGFydG1lbnRzQ29sbGVjdGlvbi5hZGQocGxhY2VtYXJrKTtcclxuXHJcblx0XHRcdHBsYWNlbWFyay5ldmVudHMuYWRkKCdjbGljaycsIChlKSA9PlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bGV0IGNvb3JkID0gZS5nZXQoJ3RhcmdldCcpLmdlb21ldHJ5LmdldENvb3JkaW5hdGVzKCk7XHJcblx0XHRcdFx0dGhpcy5nZXRSb3V0ZSh0aGlzLmN1cnJlbnRMYXRMbmcsIGNvb3JkKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5teU1hcC5nZW9PYmplY3RzLmFkZChkZXBhcnRtZW50c0NvbGxlY3Rpb24pO1xyXG5cclxuXHRcdC8vZGVwYXJ0bWVudHNDb2xsZWN0aW9uLmV2ZW50cy5hZGQoJ2NsaWNrJywgKGUpID0+IGNvbnNvbGUubG9nKGUuZ2VvbWV0cnkuZ2V0Q29vcmRpbmF0ZXMoKSkpO1xyXG5cdH1cclxuXHJcblx0Z2V0Um91dGUoc3RhcnRDb29yZCwgZW5kQ29vcmQpXHJcblx0e1xyXG5cdFx0Ly8gU2V0IG11bHRpUm91dGUgcG9pbnRzLlxyXG5cdFx0bGV0IHBvaW50QSA9IHN0YXJ0Q29vcmQ7XHJcblx0XHRsZXQgcG9pbnRCID0gZW5kQ29vcmQ7XHJcblx0XHQvKipcclxuXHRcdCAqIENyZWF0ZSBtdWx0aVJvdXRlLlxyXG5cdFx0ICogQHNlZSBodHRwczovL2FwaS55YW5kZXgucnUvbWFwcy9kb2MvanNhcGkvMi4xL3JlZi9yZWZlcmVuY2UvbXVsdGlSb3V0ZXIuTXVsdGlSb3V0ZS54bWxcclxuXHRcdCAqL1xyXG5cdFx0bGV0IG11bHRpUm91dGUgPSBuZXcgeW1hcHMubXVsdGlSb3V0ZXIuTXVsdGlSb3V0ZSh7XHJcblx0XHRcdHJlZmVyZW5jZVBvaW50czogW1xyXG5cdFx0XHRcdHBvaW50QSxcclxuXHRcdFx0XHRwb2ludEJcclxuXHRcdFx0XSxcclxuXHRcdFx0cGFyYW1zOiB7XHJcblx0XHRcdFx0Ly8gUm91dGUgdHlwZSBwZWRlc3RyaWFuXHJcblx0XHRcdFx0cm91dGluZ01vZGU6ICdwZWRlc3RyaWFuJ1xyXG5cdFx0XHR9XHJcblx0XHR9LCB7XHJcblx0XHRcdC8vIFNldCB0aGUgYm9yZGVycyBvZiB0aGUgbWFwIHRvIHNlZSB0b3RhbCByb3V0ZVxyXG5cdFx0XHRib3VuZHNBdXRvQXBwbHk6IHRydWVcclxuXHRcdH0pO1xyXG5cclxuXHRcdGxldCBtdWx0aVJvdXRlQ29sbGVjdGlvbiA9IG5ldyB5bWFwcy5HZW9PYmplY3RDb2xsZWN0aW9uKCk7XHJcblx0XHRtdWx0aVJvdXRlQ29sbGVjdGlvbi5hZGQobXVsdGlSb3V0ZSk7XHJcblxyXG5cdFx0Ly8gQWRkIG11bHRpUm91dGUgdG8gbWFwXHJcblx0XHR0aGlzLm15TWFwLmdlb09iamVjdHMuYWRkKG11bHRpUm91dGVDb2xsZWN0aW9uKTtcclxuXHR9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBJbmRleFxyXG57XHJcblx0Y29uc3RydWN0b3IobGlzdCwgZXZlbnRCdXMpXHJcblx0e1xyXG5cdFx0dGhpcy5uYW1lID0gJ2luZGV4JztcclxuXHRcdHRoaXMubWF0Y2ggPSAnJztcclxuXHJcblx0XHR0aGlzLmxpc3QgPSBsaXN0O1xyXG5cdFx0dGhpcy5ldmVudEJ1cyA9IGV2ZW50QnVzO1xyXG5cclxuXHRcdHRoaXMuc2NoZWR1bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2NoZWR1bGUnKTtcclxuXHJcblx0XHQvLyBTdWJzY3JpYmUgdG8gY2l0eSBsb2NhdGlvbiBjaGFuZ2UgYW5kIHRoZW4gZ2V0IHRoZSBmaWx0ZXJlZCBkYXRhIGxpc3RcclxuXHRcdHRoaXMuZXZlbnRCdXMub24oJ2xvY2F0aW9uOmNpdHknLCAoY2l0eSkgPT5cclxuXHRcdHtcclxuXHRcdFx0dGhpcy5zcGlubmVyLnNwaW4odGhpcy5zY2hlZHVsZSk7XHJcblx0XHRcdHRoaXMuc2hvd0ZpbHRlcmVkTGlzdChjaXR5KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0b25FbnRlcigpXHJcblx0e1xyXG5cdFx0dGhpcy5tZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUgLm1lbnUtcXVvdGVzJyk7XHJcblx0XHR0aGlzLm1lbnUuY2xhc3NMaXN0LmFkZCgnbWVudS1zZWxlY3RlZCcpO1xyXG5cclxuXHRcdHRoaXMuc2NoZWR1bGUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XHJcblxyXG5cdFx0dGhpcy5mb290ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmb290ZXIgLnF1b3Rlcy1pdGVtJyk7XHJcblx0XHR0aGlzLmZvb3Rlci5jbGFzc0xpc3QuYWRkKCdxdW90ZXMtaXRlbS1zZWxlY3RlZCcpO1xyXG5cclxuXHRcdC8vIFN0YXJ0IHNwaW5uZXJcclxuXHRcdHRoaXMuc3Bpbm5lciA9IG5ldyBTcGlubmVyKCkuc3Bpbih0aGlzLnNjaGVkdWxlKTtcclxuXHJcblx0XHRpZiAodGhpcy5ub3RGaXJzdFF1ZXJ5KVxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLnNob3dGaWx0ZXJlZExpc3QodGhpcy5jaXR5TmFtZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBjaXR5IGlzIHN0cmluZyB3aGljaCByZWNlaXZlIGRhdGEgZnJvbSBjaGFpbjpcclxuXHQgKiBzZWxlY3QuanM6IHRyaWdnZXIgXCJzZWxlY3Q6dXBkYXRlXCIgLS0tPlxyXG5cdCAqIGxpc3QuanM6IGdldFNlbGVjdGVkQ3VycmVuY3kgLS0tPlxyXG5cdCAqIGxvY2F0aW9uLmpzOiBnZXRDdXJyZW50TG9jYXRpb24gLT4gdHJpZ2dlciBcImxvY2F0aW9uOmRhdGFcIiAtLS0+XHJcblx0ICogbGlzdC5qczogZ2V0TG9jYXRpb24gLT4gdHJpZ2dlciBcImxvY2F0aW9uOmNpdHlcIiAtLS0+XHJcblx0ICogaW5kZXguanM6IHNob3dGaWx0ZXJlZExpc3QgLS0tPlxyXG5cdCAqICogbGlzdC5qczogZ2V0TGlzdCAtLS0+XHJcblx0ICogKiAqIHJlcXVlc3QuanM6IGdldFJhdGVzIC0+IHJldHVybiBkYXRhIHRvIGdldExpc3QgLS0tPlxyXG5cdCAqICogbGlzdC5qczogZ2V0RmlsdGVyZWRMaXN0IC0tLT5cclxuXHQgKiBpbmRleC5qczogc2V0RmlsdGVyZWREYXRhXHJcblx0ICovXHJcblx0c2hvd0ZpbHRlcmVkTGlzdChjaXR5KVxyXG5cdHtcclxuXHRcdHRoaXMuY2l0eU5hbWUgPSBjaXR5O1xyXG5cclxuXHRcdHRoaXMubm90Rmlyc3RRdWVyeSA9IHRydWU7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIGRhdGEgLSBvYmplY3Qgd2l0aCBmaWx0ZXJlZCBkYXRhIHdoaWNoIHNob3VsZCBiZSBkaXNwbGF5ZWQgaW4gXCJzY2hlZHVsZVwiIGRpdlxyXG5cdFx0ICovXHJcblx0XHRsZXQgc2V0RmlsdGVyZWREYXRhID0gKGRhdGEpID0+XHJcblx0XHR7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoOyBpKyspXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShpKSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRpZiAoZGF0YVtpXS5yYXRlc1t0aGlzLmxpc3QuaW5wdXRDdXJyZW5jeSArICctJyArIHRoaXMubGlzdC5vdXRwdXRDdXJyZW5jeV0pXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGxldCBhZGRyZXNzID0gZGF0YVtpXS5hZGRyZXNzO1xyXG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5hZGRpdGlvbmFsKSBhZGRyZXNzICs9ICcgJyArIGRhdGFbaV0uYWRkaXRpb25hbDtcclxuXHJcblx0XHRcdFx0XHRcdHRoaXMuc2NoZWR1bGUuaW5uZXJIVE1MICs9IGBcclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYmFuay1yb3dcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0JHtkYXRhW2ldLm5hbWV9IDxzcGFuIGNsYXNzPVwiYWRkcmVzc1wiPnwgJHthZGRyZXNzfTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJyYXRlXCI+JHtkYXRhW2ldLnJhdGVzW3RoaXMubGlzdC5pbnB1dEN1cnJlbmN5ICsgJy0nICsgdGhpcy5saXN0Lm91dHB1dEN1cnJlbmN5XX08L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJkZXRhaWxzLXJvd1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQke2RhdGFbaV0uZGF0ZX06MDAgfCAke2RhdGFbaV0uY2l0eX1cclxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJyYXRlIGdyZWVuXCI+JHtkYXRhW2ldLnJhdGVzLmhlbHBlcn08L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0IFx0XHRcdGA7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdGlmICh0eXBlb2YgY2l0eSA9PT0gJ3N0cmluZycpXHJcblx0XHR7XHJcblx0XHRcdC8vIFJldHVybnMgcHJvbWlzZVxyXG5cdFx0XHR0aGlzLmxpc3QuZ2V0TGlzdChjaXR5KS50aGVuKGRhdGEgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRoaXMuc3Bpbm5lci5zdG9wKCk7XHJcblx0XHRcdFx0dGhpcy5zY2hlZHVsZS5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0XHQvLyBSZXNldCBzY2hlZHVsZVxyXG5cdFx0XHRcdHNldEZpbHRlcmVkRGF0YShkYXRhKVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG9uTGVhdmUoKVxyXG5cdHtcclxuXHRcdHRoaXMuZm9vdGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3F1b3Rlcy1pdGVtLXNlbGVjdGVkJyk7XHJcblx0XHR0aGlzLm1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnbWVudS1zZWxlY3RlZCcpO1xyXG5cclxuXHRcdHRoaXMuc2NoZWR1bGUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcblx0fVxyXG59OyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcFxyXG57XHJcblx0Y29uc3RydWN0b3IoeWFuZGV4TWFwLCBldmVudEJ1cylcclxuXHR7XHJcblx0XHR0aGlzLm5hbWUgPSAnbWFwJztcclxuXHRcdHRoaXMubWF0Y2ggPSAnbWFwJztcclxuXHJcblx0XHR0aGlzLnlNYXAgPSB5YW5kZXhNYXA7XHJcblx0XHR0aGlzLmV2ZW50QnVzID0gZXZlbnRCdXM7XHJcblxyXG5cdFx0dGhpcy5tYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFwJyk7XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdG9uRW50ZXIoKVxyXG5cdHtcclxuXHRcdHRoaXMuZm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9vdGVyIC5tYXAtaXRlbScpO1xyXG5cdFx0dGhpcy5mb290ZXIuY2xhc3NMaXN0LmFkZCgnbWFwLWl0ZW0tc2VsZWN0ZWQnKTtcclxuXHJcblx0XHR0aGlzLm1hcC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuXHJcblx0XHQvL3RoaXMueU1hcC5nZXRDdXJyZW50TG9jYXRpb24oKTtcclxuXHR9XHJcblxyXG5cdGRyYXdNYXAoKVxyXG5cdHtcclxuXHJcblx0fVxyXG5cclxuXHRvbkxlYXZlKClcclxuXHR7XHJcblx0XHR0aGlzLmZvb3Rlci5jbGFzc0xpc3QucmVtb3ZlKCdtYXAtaXRlbS1zZWxlY3RlZCcpO1xyXG5cdFx0dGhpcy5tYXAuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcblx0fVxyXG59OyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50QnVzXHJcbntcclxuXHRjb25zdHJ1Y3RvcigpXHJcblx0e1xyXG5cdFx0dGhpcy5saXN0ZW5lcnMgPSB7fTtcclxuXHR9XHJcblxyXG5cdG9uKG5hbWUsIGhhbmRsZXIpXHJcblx0e1xyXG5cdFx0dGhpcy5saXN0ZW5lcnNbbmFtZV0gPSB0aGlzLmxpc3RlbmVyc1tuYW1lXSB8fCBbXTtcclxuXHRcdHRoaXMubGlzdGVuZXJzW25hbWVdLnB1c2goaGFuZGxlcik7XHJcblx0fVxyXG5cclxuXHRvZmYobmFtZSwgaGFuZGxlcilcclxuXHR7XHJcblx0XHR0aGlzLmxpc3RlbmVyc1tuYW1lXSA9IHRoaXMubGlzdGVuZXJzW25hbWVdIHx8IFtdO1xyXG5cdFx0dGhpcy5saXN0ZW5lcnNbbmFtZV0gPSB0aGlzLmxpc3RlbmVyc1tuYW1lXS5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0gIT09IGhhbmRsZXIpO1xyXG5cdH1cclxuXHJcblx0b25jZShuYW1lLCBoYW5kbGVyKVxyXG5cdHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdHRoaXMub24obmFtZSwgZnVuY3Rpb24gZ2V0dGVyKGRhdGEpXHJcblx0XHR7XHJcblx0XHRcdGhhbmRsZXIoZGF0YSk7XHJcblx0XHRcdHNlbGYub2ZmKG5hbWUsIGdldHRlcik7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHRyaWdnZXIobmFtZSwgZGF0YSlcclxuXHR7XHJcblx0XHQodGhpcy5saXN0ZW5lcnNbbmFtZV0gfHwgW10pLm1hcChoYW5kbGVyID0+IGhhbmRsZXIoZGF0YSkpO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcXVlc3Rcclxue1xyXG5cdGNvbnN0cnVjdG9yKClcclxuXHR7XHJcblx0XHR0aGlzLmJhbmtOYW1lc0Z1bGwgPSBbJ9CQ0LHRgdC+0LvRjtGC0LHQsNC90LonLCAn0JDQu9GM0YTQsC3QkdCw0L3QuicsICfQkdCw0L3QuiDQkdC10LvQktCt0JEnLCAn0JHQsNC90Log0JLQotCRJywgJ9CR0LDQvdC6INCc0L7RgdC60LLQsC3QnNC40L3RgdC6JywgJ9CR0LDQvdC6INCg0LXRiNC10L3QuNC1JywgJ9CR0LXQu9Cw0LPRgNC+0L/RgNC+0LzQsdCw0L3QuicsICfQkdC10LvQsNGA0YPRgdCx0LDQvdC6JywgJ9CR0LXQu9Cz0LDQt9C/0YDQvtC80LHQsNC90LonLCAn0JHQtdC70LjQvdCy0LXRgdGC0LHQsNC90LonLCAn0JHQndCRLdCR0LDQvdC6JywgJ9CR0J/QoS3QodCx0LXRgNCx0LDQvdC6JywgJ9CR0KHQkSDQkdCw0L3QuicsICfQkdCi0JAg0JHQsNC90LonLCAn0JjQtNC10Y8g0JHQsNC90LonLCAn0JzQotCR0LDQvdC6JywgJ9Cf0LDRgNC40YLQtdGC0LHQsNC90LonLCAn0J/RgNC40L7RgNCx0LDQvdC6JywgJ9Ch0YLQsNGC0YPRgdCR0LDQvdC6JywgJ9Ci0LXRhdC90L7QsdCw0L3QuicsICfQotCaINCR0LDQvdC6JywgJ9Ck0YDQsNC90YHQsNCx0LDQvdC6JywgJ9Cm0LXQv9GC0LXRgCDQkdCw0L3QuiddO1xyXG5cclxuXHRcdHRoaXMuYmFua05hbWVzQ29tcGFyZSA9IFsn0LDQsdGB0L7Qu9GO0YInLCAn0LDQu9GM0YTQsCcsICfQsdC10LvQstGN0LEnLCAn0LLRgtCxJywgJ9C80L7RgdC60LLQsC3QvNC40L3RgdC6JywgJ9GA0LXRiNC10L3QuNC1JywgJ9Cx0LXQu9Cw0LPRgNC+0L/RgNC+0LwnLCAn0LHQtdC70LDRgNGD0YHQsdCw0L3QuicsICfQsdC10LvQs9Cw0LfQv9GA0L7QvCcsICfQsdC10LvQuNC90LLQtdGB0YInLCAn0LHQvdCxJywgJ9Cx0L/RgScsICfQsdGB0LEnLCAn0LHRgtCwJywgJ9C40LTQtdGPJywgJ9C80YLQsScsICfQv9Cw0YDQuNGC0LXRgicsICfQv9GA0LjQvtGAJywgJ9GB0YLQsNGC0YPRgScsICfRgtC10YXQvdC+JywgJ9GC0Log0LHQsNC90LonLCAn0YTRgNCw0L3RgdCwJywgJ9GG0LXQv9GC0LXRgCddO1xyXG5cclxuXHRcdHRoaXMuY2l0eU5hbWVzID0gWyfQnNC40L3RgdC6JywgJ9CR0LXRgNC10LfQuNC90L4nLCAn0JHQvtGA0LjRgdC+0LInLCAn0JLQuNC70LXQudC60LAnLCAn0JLQvtC70L7QttC40L0nLCAn0JTQt9C10YDQttC40L3RgdC6JywgJ9CW0L7QtNC40L3QvicsICfQl9Cw0YHQu9Cw0LLQu9GMJywgJ9CY0LLQtdC90LXRhicsICfQmtC70LXRhtC6JywgJ9Ca0L7Qv9GL0LvRjCcsICfQmtGA0YPQv9C60LgnLCAn0JvQvtCz0L7QudGB0LonLCAn0JvRjtCx0LDQvdGMJywgJ9Cc0LDRgNGM0LjQvdCwINCT0L7RgNC60LAnLCAn0JzQsNGH0YPQu9C40YnQuCcsICfQnNC+0LvQvtC00LXRh9C90L4nLCAn0JzRj9C00LXQu9GMJywgJ9Cd0LDRgNC+0YfRjCcsICfQndC10YHQstC40LYnLCAn0J/Qu9C10YnQtdC90LjRhtGLJywgJ9Cg0LDQtNC+0YjQutC+0LLQuNGH0LgnLCAn0KHQu9GD0YbQuicsICfQodC80LjQu9C+0LLQuNGH0LgnLCAn0KHQvNC+0LvQtdCy0LjRh9C4JywgJ9Ch0L7Qu9C40LPQvtGA0YHQuicsICfQodGC0LDRgNC+0LHQuNC9JywgJ9Ch0YLQsNGA0YvQtSDQlNC+0YDQvtCz0LgnLCAn0KHRgtC+0LvQsdGG0YsnLCAn0KPQt9C00LAnLCAn0KTQsNC90LjQv9C+0LvRjCcsICfQp9C10YDQstC10L3RjCcsICfQkdGA0LXRgdGCJywgJ9CR0LDRgNCw0L3QvtCy0LjRh9C4JywgJ9CR0LXQu9C+0L7Qt9GR0YDRgdC6JywgJ9CR0LXRgNC10LfQsCcsICfQktGL0YHQvtC60L7QtScsICfQk9Cw0L3RhtC10LLQuNGH0LgnLCAn0JTQsNCy0LjQtC3Qk9C+0YDQvtC00L7QuicsICfQlNGA0L7Qs9C40YfQuNC9JywgJ9CW0LDQsdC40L3QutCwJywgJ9CY0LLQsNC90L7QstC+JywgJ9CY0LLQsNGG0LXQstC40YfQuCcsICfQmtCw0LzQtdC90LXRhicsICfQmtC+0LHRgNC40L0nLCAn0JvRg9C90LjQvdC10YYnLCAn0JvRj9GF0L7QstC40YfQuCcsICfQnNCw0LvQvtGA0LjRgtCwJywgJ9Cc0LjQutCw0YjQtdCy0LjRh9C4JywgJ9Cf0LjQvdGB0LonLCAn0J/RgNGD0LbQsNC90YsnLCAn0KHRgtC+0LvQuNC9JywgJ9CS0LjRgtC10LHRgdC6JywgJ9CR0LDRgNCw0L3RjCcsICfQkdC10YjQtdC90LrQvtCy0LjRh9C4JywgJ9CR0L7RgNC+0LLRg9GF0LAnLCAn0JHRgNCw0YHQu9Cw0LInLCAn0JLQtdGA0YXQvdC10LTQstC40L3RgdC6JywgJ9CT0LvRg9Cx0L7QutC+0LUnLCAn0JPQvtGA0L7QtNC+0LonLCAn0JTQvtC60YjQuNGG0YsnLCAn0JTRg9Cx0YDQvtCy0L3QvicsICfQm9C10L/QtdC70YwnLCAn0JvQuNC+0LfQvdC+JywgJ9Cc0LjQvtGA0YsnLCAn0J3QvtCy0L7Qu9GD0LrQvtC80LvRjCcsICfQndC+0LLQvtC/0L7Qu9C+0YbQuicsICfQntGA0YjQsCcsICfQn9C+0LvQvtGG0LonLCAn0J/QvtGB0YLQsNCy0YsnLCAn0KDQvtGB0YHQvtC90YsnLCAn0KDRg9Cx0LAnLCAn0KHQtdC90L3QvicsICfQotC+0LvQvtGH0LjQvScsICfQo9GI0LDRh9C4JywgJ9Cn0LDRiNC90LjQutC4JywgJ9Co0LDRgNC60L7QstGJ0LjQvdCwJywgJ9Co0YPQvNC40LvQuNC90L4nLCAn0JPQvtC80LXQu9GMJywgJ9CR0YDQsNCz0LjQvScsICfQkdGD0LTQsC3QmtC+0YjQtdC70ZHQstC+JywgJ9CS0LXRgtC60LAnLCAn0JTQvtCx0YDRg9GIJywgJ9CV0LvRjNGB0LonLCAn0JbQuNGC0LrQvtCy0LjRh9C4JywgJ9CW0LvQvtCx0LjQvScsICfQmtCw0LvQuNC90LrQvtCy0LjRh9C4JywgJ9Ca0L7RgNC80LAnLCAn0JrQvtGB0YLRjtC60L7QstC60LAnLCAn0JvQtdC70YzRh9C40YbRiycsICfQm9C+0LXQsicsICfQm9GP0YHQutC+0LLQuNGH0LgnLCAn0JzQvtC30YvRgNGMJywgJ9Cd0LDRgNC+0LLQu9GPJywgJ9Ce0LrRgtGP0LHRgNGM0YHQutC40LknLCAn0J/QtdGC0YDQuNC60L7QsicsICfQoNC10YfQuNGG0LAnLCAn0KDQvtCz0LDRh9C10LInLCAn0KHQstC10YLQu9C+0LPQvtGA0YHQuicsICfQotGD0YDQvtCyJywgJ9Cl0L7QudC90LjQutC4JywgJ9Cn0LXRh9C10YDRgdC6JywgJ9CT0YDQvtC00L3QvicsICfQkdC10YDRkdC30L7QstC60LAnLCAn0JHQvtC70YzRiNCw0Y8g0JHQtdGA0LXRgdGC0L7QstC40YbQsCcsICfQkdC+0YDQvtCy0LjQutC4JywgJ9CS0L7Qu9C60L7QstGL0YHQuicsICfQktC+0YDQvtC90L7QstC+JywgJ9CU0Y/RgtC70L7QstC+JywgJ9CX0LXQu9GM0LLQsCcsICfQmNCy0YzQtScsICfQmtC+0YDQtdC70LjRh9C4JywgJ9Ca0YDQsNGB0L3QvtGB0LXQu9GM0YHQutC40LknLCAn0JvQuNC00LAnLCAn0JzQuNC90YfQuNC60LgnLCAn0JzQuNGAJywgJ9Cc0L7RgdGC0YsnLCAn0J3QvtCy0L7Qs9GA0YPQtNC+0LonLCAn0J7RgdGC0YDQvtCy0LXRhicsICfQntGI0LzRj9C90YsnLCAn0KDQvtGB0YHRjCcsICfQodCy0LjRgdC70L7Rh9GMJywgJ9Ch0LrQuNC00LXQu9GMJywgJ9Ch0LvQvtC90LjQvCcsICfQodC80L7RgNCz0L7QvdGMJywgJ9Cp0YPRh9C40L0nLCAn0JzQvtCz0LjQu9C10LInLCAn0JHQtdC70YvQvdC40YfQuCcsICfQkdC+0LHRgNGD0LnRgdC6JywgJ9CR0YvRhdC+0LInLCAn0JPQu9GD0YHQuicsICfQk9C+0YDQutC4JywgJ9Ca0LjRgNC+0LLRgdC6JywgJ9Ca0LvQuNC80L7QstC40YfQuCcsICfQmtC70LjRh9C10LInLCAn0JrQvtGB0YLRjtC60L7QstC40YfQuCcsICfQmtGA0LDRgdC90L7Qv9C+0LvRjNC1JywgJ9Ca0YDQuNGH0LXQsicsICfQmtGA0YPQs9C70L7QtScsICfQnNGB0YLQuNGB0LvQsNCy0LvRjCcsICfQntGB0LjQv9C+0LLQuNGH0LgnLCAn0KHQu9Cw0LLQs9C+0YDQvtC0JywgJ9Cl0L7RgtC40LzRgdC6JywgJ9Cn0LDRg9GB0YsnLCAn0KfQtdGA0LjQutC+0LInLCAn0KjQutC70L7QsiddO1xyXG5cclxuXHRcdHRoaXMuY2l0eUxpbmtzID0gWydtaW5zaycsICdiZXJlemlubycsICdib3Jpc292JywgJ3ZpbGV5a2EnLCAndm9sb3poaW4nLCAnZHplcnpoaW5zaycsICd6aG9kaW5vJywgJ3phc2xhdmwnLCAnaXZlbmV0cycsICdrbGV0c2snLCAna29weWwnLCAna3J1cGtpJywgJ2xvZ295c2snLCAnbHl1YmFuJywgJ21hcmluYV9nb3JrYScsICdtYWNodWxpc2hjaGknLCAnbW9sb2RlY2hubycsICdteWFkZWwnLCAnbmFyb2NoJywgJ25lc3ZpemgnLCAncGxlc2NoZW5pY3knLCAncmFkb3Noa292aWNoaScsICdzbHV0c2snLCAnc21pbG92aWNoaScsICdzbW9sZXZpY2hpJywgJ3NvbGlnb3JzaycsICdzdGFyb2JpbicsICdzdGFyeXllX2Rvcm9naScsICdzdG9sYmN5JywgJ3V6ZGEnLCAnZmFuaXBvbCcsICdjaGVydmVuJywgJ2JyZXN0JywgJ2JhcmFub3ZpY2hpJywgJ2JlbG9venlvcnNrJywgJ2JlcmV6YScsICd2eXNva295ZScsICdnYW5jZXZpY2hpJywgJ2RhdmlkLWdvcm9kb2snLCAnZHJvZ2ljaGluJywgJ3poYWJpbmthJywgJ2l2YW5vdm8nLCAnaXZhY2V2aWNoaScsICdrYW1lbmV0cycsICdrb2JyaW4nLCAnbHVuaW5lYycsICdseWFraG92aWNoaScsICdtYWxvcml0YScsICdtaWthc2hldmljaGknLCAncGluc2snLCAncHJ1emhhbnknLCAnc3RvbGluJywgJ3ZpdGVic2snLCAnYmFyYW4nLCAnYmVzaGVua292aWNoaScsICdib3JvdnVraGEnLCAnYnJhc2xhdicsICd2ZXJobmVkdmluc2snLCAnZ2x1Ym9rb2UnLCAnZ29yb2RvaycsICdkb2tzaGl0c3knLCAnZHVicm92bm8nLCAnbGVwZWwnLCAnbGlvem5vJywgJ21pb3J5JywgJ25vdm9sdWtvbWwnLCAnbm92b3BvbG90c2snLCAnb3JzaGEnLCAncG9sb3RzaycsICdwb3N0YXZ5JywgJ3Jvc3NvbnknLCAncnViYScsICdzZW5ubycsICd0b2xvY2hpbicsICd1c2hhY2hpJywgJ2NoYXNobmlraScsICdzaGFya292c2hjaGluYScsICdzaHVtaWxpbm8nLCAnZ29tZWwnLCAnYnJhZ2luJywgJ2J1ZGEta29zaGVseW92bycsICd2ZXRrYScsICdkb2JydXNoJywgJ3llbHNrJywgJ3poaXRrb3ZpY2hpJywgJ3pobG9iaW4nLCAna2FsaW5rb3ZpY2hpJywgJ2tvcm1hJywgJ2tvc3R5dWtvdmthJywgJ2xlbGNoaXRzeScsICdsb2V3JywgJ2xqYXNrb3ZpY2hpJywgJ21venlyJywgJ25hcm92bGEnLCAnb2t0eWFicnNraWknLCAncGV0cmlrb3YnLCAncmVjaGl0c2EnLCAncm9nYWNoZXYnLCAnc3ZldGxvZ29yc2snLCAndHVyb3YnLCAnaG9qbmlraScsICdjaGVjaGVyc2snLCAnZ3JvZG5vJywgJ2Jlcnlvem92a2EnLCAnYm9sc2hheWEtYmVyZXN0b3ZpY2EnLCAnYm9yb3Zpa2knLCAndm9sa292aXNrJywgJ3Zvcm9ub3ZvJywgJ2R5YXRsb3ZvJywgJ3plbHZhJywgJ2l2eWUnLCAna29yZWxpY2hpJywgJ2tyYXNub3NlbHNraXknLCAnbGlkYScsICdtaW5jaGlraScsICdtaXInLCAnbW9zdHknLCAnbm92b2dydWRvaycsICdvc3Ryb3ZlYycsICdvc2htaWFueScsICdyb3NzJywgJ3N2aXNsb2NoJywgJ3NraWRlbCcsICdzbG9uaW0nLCAnc21vcmdvbicsICdzaGNodWNoaW4nLCAnbW9naWxldicsICdiZWx5bmljaGknLCAnYm9icnVqc2snLCAnYnlob3YnLCAnZ2x1c2snLCAnZ29ya2knLCAna2lyb3ZzaycsICdrbGltb3ZpY2hpJywgJ2tsaWNoZXYnLCAna29zdHl1a292aWNoaScsICdrcmFzbm9wb2x5ZScsICdrcmljaGV2JywgJ2tydWdsb3llJywgJ21zdGlzbGF2bCcsICdvc2lwb3ZpY2hpJywgJ3NsYXZnb3JvZCcsICdob3RpbXNrJywgJ2NoYXVzeScsICdjaGVyaWtvdicsICdzaGtsb3YnXTtcclxuXHJcblx0XHR0aGlzLmRhdGEgPSB7fTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIGNpdHkgLSByZWNlaXZlIGNpdHkgbmFtZSAobWluc2ssIHNsYXZnb3JvZCBldGMuKVxyXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlLjxkYXRhPn0gLSByZXR1cm5zIHByb21pc2Ugd2l0aCBhbGwgZGVwYXJ0bWVudHMgYW5kIHJhdGVzXHJcblx0ICovXHJcblx0Z2V0UmF0ZXMoY2l0eSlcclxuXHR7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSBpbiB0aGlzLmNpdHlOYW1lcylcclxuXHRcdHtcclxuXHRcdFx0aWYgKGNpdHkuaW5kZXhPZih0aGlzLmNpdHlOYW1lc1tpXSkgPj0gMClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRoaXMuY2l0eU5hbWUgPSB0aGlzLmNpdHlOYW1lc1tpXTtcclxuXHRcdFx0XHR0aGlzLmNpdHlMaW5rID0gdGhpcy5jaXR5TGlua3NbaV07XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZXQgZGVmYXVsdCBjaXR5TGlua1xyXG5cdFx0aWYgKCF0aGlzLmNpdHlMaW5rKSB0aGlzLmNpdHlMaW5rID0gJ21pbnNrJztcclxuXHJcblx0XHQvLyBTb3VyY2Ugc2l0ZSB1cmxcclxuXHRcdGxldCB1cmwgPSAnaHR0cHM6Ly9teWZpbi5ieS9jdXJyZW5jeS8nICsgdGhpcy5jaXR5TGluaztcclxuXHJcblx0XHRyZXR1cm4gZmV0Y2goYGh0dHA6Ly9jb3JzLXByb3h5Lmh0bWxkcml2ZW4uY29tLz91cmw9JHt1cmx9YClcclxuXHRcdFx0LnRoZW4ocmVzcCA9PiByZXNwLmpzb24oKSlcclxuXHRcdFx0Ly8gR2V0IGFsbCBkZXBhcnRtZW50cyBhbmQgcmV0dXJuIGFycmF5LCBldmVyeSBlbGVtZW50IG9mIHRoaXMgYXJyYXkgY29udGFpbmBzIGFsbCBkZXBhcnRtZW50IGRhdGFcclxuXHRcdFx0LnRoZW4ocGFnZSA9PiBwYWdlLmJvZHkubWF0Y2goL1xcPHRkXFw+XFxzKlxcPGRpdiBjbGFzcz1cInR0bFwiXFw+KC58W1xcclxcbl0pKz9cXDxcXC90ZFxcPlxcPFxcL3RyXFw+L2lnbSkgfHwgW10pXHJcblx0XHRcdC8vIENvbnZlcnQgYXJyIHJlc3VsdCB0byBvYmplY3RcclxuXHRcdFx0LnRoZW4ocmVzID0+IHRoaXMuY3JlYXRlRGVwT2JqZWN0cyhyZXMpLnJlZHVjZSgocHJldlZhbCwgY3VyVmFsKSA9PiAocHJldlZhbFtjdXJWYWwudGl0bGVdID0gY3VyVmFsLCBwcmV2VmFsKSwge30pKVxyXG5cdFx0XHQuY2F0Y2gocmVqZWN0ID0+IGNvbnNvbGUuZXJyb3IocmVqZWN0KSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSByZXN1bHQgLSByZWNlaXZlIGFuIGFycmF5IHdpdGggYWxsIGRlcGFydG1lbnRzIGRhdGFcclxuXHQgKiByZXR1cm5zIGFycmF5IFt7ZGVwYXJ0bWVudCBkYXRhfSwge2RlcGFydG1lbnQgZGF0YX0uLi4uXVxyXG5cdCAqL1xyXG5cdGNyZWF0ZURlcE9iamVjdHMocmVzdWx0KVxyXG5cdHtcclxuXHRcdHJldHVybiByZXN1bHQubWFwKHN0ciA9PlxyXG5cdFx0e1xyXG5cdFx0XHQvLyBDcmVhdGUgdGVtcG9yYXJ5IGRpdlxyXG5cdFx0XHRsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdGRpdi5pbm5lckhUTUwgPSBzdHI7XHJcblxyXG5cdFx0XHRsZXQgbmFtZSA9IHRoaXMuc2VsZWN0KGRpdiwgJy50dGwnLCAnbmFtZScpIHx8ICcnOyAgICAgICAgICAgICAgICAgIC8vIEJhbmsgbmFtZVxyXG5cdFx0XHRsZXQgdGl0bGUgPSB0aGlzLnNlbGVjdChkaXYsICcudHRsJywgJ3RleHQnKSB8fCAnJzsgICAgICAgICAgICAgICAgIC8vIERlcGFydG1lbnQgbmFtZVxyXG5cdFx0XHRsZXQgbGluayA9IHRoaXMuc2VsZWN0KGRpdiwgJy50dGwgYScsICdocmVmJykgfHwgJyc7ICAgICAgICAgICAgICAgIC8vIFJlZmVyZW5jZSB0byBzaXRlXHJcblx0XHRcdGxldCB0ZWwgPSB0aGlzLnNlbGVjdChkaXYsICcudGVsJywgJ3RleHQnKSB8fCAnJzsgICAgICAgICAgICAgICAgICAgLy8gVGVsIG51bWJlclxyXG5cdFx0XHRsZXQgY2l0eSA9IHRoaXMuc2VsZWN0KGRpdiwgJy5hZGRyZXNzJywgJ2NpdHknKSB8fCAnJzsgICAgICAgICAgICAgIC8vIEFkZHJlc3MgY2l0eVxyXG5cdFx0XHRsZXQgYWRkcmVzcyA9IHRoaXMuc2VsZWN0KGRpdiwgJy5hZGRyZXNzJywgJ2FkZHJlc3MnKSB8fCAnJzsgICAgICAgIC8vIEFkZHJlc3Mgc3RyZWV0XHJcblx0XHRcdGxldCBhZGRpdGlvbmFsID0gdGhpcy5zZWxlY3QoZGl2LCAnLmFkZHJlc3MnLCAnYWRkaXRpb25hbCcpIHx8ICcnOyAgLy8gQWRkcmVzcyBhZGRpdGlvbmFsIGluZm9cclxuXHRcdFx0bGV0IGRhdGUgPSB0aGlzLnNlbGVjdChkaXYsICcuZGF0ZScsICd0ZXh0JykgfHwgJyc7ICAgICAgICAgICAgICAgICAvLyBMYXN0IHVwZGF0ZSB0aW1lXHJcblxyXG5cdFx0XHQvLyBGaW5kIGFsbCByYXRlcyhleGNlcHQgY29udmVyc2lvbikgYW5kIHJldHVybiBhcnJheSB3aXRoIGN1cnJlbmN5IG5hbWUgYW5kIGN1cnJlbnQgcmF0ZVxyXG5cdFx0XHRsZXQgYWxsUmF0ZXMgPSBkaXYuaW5uZXJIVE1MLm1hdGNoKC9cXDxzcGFuLis/XFw+KC4rPylcXDxcXC9zcGFuXFw+XFxzKlxcPGkgY2xhc3M9XCJjb252LWJ0blwiIGRhdGEtYz1cIiguKz8pXCIvZykgfHwgW107XHJcblxyXG5cdFx0XHQvLyBSZW1vdmUgdW5uZWNlc3NhcnkgZWxlbWVudHMgZnJvbSBhcnJheSAtPiByZXN1bHQgYXJyYXkgbG9va3MgbGlrZSBbMF0gPT09ICdjdXJyZW5jeSBuYW1lJywgWzFdID09PSAnY3VycmVudCByYXRlJ1xyXG5cdFx0XHRhbGxSYXRlcyA9IGFsbFJhdGVzLm1hcChzdHIgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxldCBhcnIgPSBzdHIubWF0Y2goL1xcPHNwYW4uKz9cXD4oLis/KVxcPFxcL3NwYW5cXD5cXHMqXFw8aSBjbGFzcz1cImNvbnYtYnRuXCIgZGF0YS1jPVwiKC4rPylcIi9pKSB8fCBbXTtcclxuXHJcblx0XHRcdFx0Ly8gUmVtb3ZlIHVubmVjZXNzYXJ5IGVsZW1lbnRcclxuXHRcdFx0XHRhcnIuc2hpZnQoKTtcclxuXHJcblx0XHRcdFx0Ly8gQ29udmVydCB0byBudW1iZXIgdHlwZVxyXG5cdFx0XHRcdGFyciA9IGFyci5tYXAoc3RyID0+IHtcclxuXHRcdFx0XHRcdGlmIChpc05hTigrc3RyKSkgcmV0dXJuIHN0cjtcclxuXHRcdFx0XHRcdHJldHVybiArc3RyO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gYXJyLnJldmVyc2UoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBPYmplY3Qgd2l0aCByYXRlc1xyXG5cdFx0XHRsZXQgcmF0ZXNSZXN1bHQgPSB7fTtcclxuXHJcblx0XHRcdC8vIEJ1eSByYXRlc1xyXG5cdFx0XHRyYXRlc1Jlc3VsdC5idXkgPSBhbGxSYXRlcy5maWx0ZXIoKGl0ZW0sIGkpID0+IHtcclxuXHRcdFx0XHRpZiAoaSAlIDIpIHJldHVybiBpdGVtO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdC8vIFNlbGwgcmF0ZXNcclxuXHRcdFx0cmF0ZXNSZXN1bHQuc2VsbCA9IGFsbFJhdGVzLmZpbHRlcigoaXRlbSwgaSkgPT4ge1xyXG5cdFx0XHRcdGlmIChpICUgMikgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdHJldHVybiBpdGVtO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIENvbnZlcnQgYnV5IGFuZCBzZWxsIHJhdGVzIGFycmF5cyB0byBvYmplY3RzXHJcblx0XHRcdGxldCByYXRlcyA9IHJhdGVzUmVzdWx0LmJ1eS5yZWR1Y2UoKG9iaiwgYXJyKSA9PiAob2JqWydieW4tJythcnJbMF1dID0gYXJyWzFdLCBvYmopLCB7fSk7XHJcblx0XHRcdHJhdGVzID0gcmF0ZXNSZXN1bHQuc2VsbC5yZWR1Y2UoKG9iaiwgYXJyKSA9PiAob2JqW2FyclswXSsnLWJ5biddID0gYXJyWzFdLCBvYmopLCByYXRlcyk7XHJcblxyXG5cdFx0XHRsZXQgYWxsQ29udmVyc2lvbnMgPSBkaXYuaW5uZXJIVE1MLm1hdGNoKC8oXFxkK1xcLlxcZCspXFw8aSBjbGFzcz1cImNvbnYtYnRuXCIgZGF0YS1jPVwiKC4rPylcIi9nKSB8fCBbXTtcclxuXHJcblx0XHRcdC8vIFJlbW92ZSB1bm5lY2Vzc2FyeSBlbGVtZW50cyBmcm9tIGFycmF5IC0+IHJlc3VsdCBhcnJheSBsb29rcyBsaWtlIFswXSA9PT0gJ2N1cnJlbmN5IG5hbWUnLCBbMV0gPT09ICdjdXJyZW50IHJhdGUnXHJcblx0XHRcdGFsbENvbnZlcnNpb25zID0gYWxsQ29udmVyc2lvbnMubWFwKHN0ciA9PlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bGV0IGFyciA9IHN0ci5tYXRjaCgvKFxcZCtcXC5cXGQrKVxcPGkgY2xhc3M9XCJjb252LWJ0blwiIGRhdGEtYz1cIiguKz8pXCIvaSkgfHwgW107XHJcblxyXG5cdFx0XHRcdC8vIFJlbW92ZSB1bm5lY2Vzc2FyeSBlbGVtZW50XHJcblx0XHRcdFx0YXJyLnNoaWZ0KCk7XHJcblxyXG5cdFx0XHRcdC8vIENvbnZlcnQgdG8gbnVtYmVyIHR5cGVcclxuXHRcdFx0XHRhcnIgPSBhcnIubWFwKHN0ciA9PiB7XHJcblx0XHRcdFx0XHRpZiAoaXNOYU4oK3N0cikpIHJldHVybiBzdHI7XHJcblx0XHRcdFx0XHRyZXR1cm4gK3N0cjtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIGFyci5yZXZlcnNlKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gQ29udmVyc2lvbiByYXRlc1xyXG5cdFx0XHRsZXQgY29udmVyc2lvbnNSZXN1bHQgPSB7fTtcclxuXHJcblx0XHRcdC8vIEJ1eSByYXRlc1xyXG5cdFx0XHRjb252ZXJzaW9uc1Jlc3VsdC5idXkgPSBhbGxDb252ZXJzaW9ucy5maWx0ZXIoKGl0ZW0sIGkpID0+IHtcclxuXHRcdFx0XHRpZiAoaSAlIDIpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRyZXR1cm4gaXRlbTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdC8vIFNlbGwgcmF0ZXNcclxuXHRcdFx0Y29udmVyc2lvbnNSZXN1bHQuc2VsbCA9IGFsbENvbnZlcnNpb25zLmZpbHRlcigoaXRlbSwgaSkgPT4ge1xyXG5cdFx0XHRcdGlmIChpICUgMikgcmV0dXJuIGl0ZW07XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIENvbnZlcnQgYnV5IGFuZCBzZWxsIHJhdGVzIGFycmF5cyB0byBvYmplY3RzXHJcblx0XHRcdHJhdGVzID0gY29udmVyc2lvbnNSZXN1bHQuYnV5LnJlZHVjZSgob2JqLCBhcnIpID0+IChvYmpbJ2V1ci11c2QnXSA9IGFyclsxXSwgb2JqKSwgcmF0ZXMpO1xyXG5cdFx0XHRyYXRlcyA9IGNvbnZlcnNpb25zUmVzdWx0LnNlbGwucmVkdWNlKChvYmosIGFycikgPT4gKG9ialsndXNkLWV1ciddID0gKygxMDAvYXJyWzFdLzEwMCkudG9GaXhlZCgzKSwgb2JqKSwgcmF0ZXMpO1xyXG5cclxuXHRcdFx0Ly8gQWRkIHNhbWUgY3VycmVuY3kgcmF0ZXNcclxuXHRcdFx0cmF0ZXNbJ2J5bi1ieW4nXSA9ICcxLjAwMCc7XHJcblx0XHRcdHJhdGVzWyd1c2QtdXNkJ10gPSAnMS4wMDAnO1xyXG5cdFx0XHRyYXRlc1snZXVyLWV1ciddID0gJzEuMDAwJztcclxuXHRcdFx0cmF0ZXNbJ3J1ci1ydXInXSA9ICcxLjAwMCc7XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdG5hbWUsXHJcblx0XHRcdFx0dGl0bGUsXHJcblx0XHRcdFx0bGluayxcclxuXHRcdFx0XHR0ZWwsXHJcblx0XHRcdFx0Y2l0eSxcclxuXHRcdFx0XHRhZGRyZXNzLFxyXG5cdFx0XHRcdGFkZGl0aW9uYWwsXHJcblx0XHRcdFx0ZGF0ZSxcclxuXHRcdFx0XHRyYXRlc1xyXG5cdFx0XHR9O1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBzb3VyY2UgLSBkaXYuaW5uZXJIVE1MIGVsZW1lbnQgd2l0aCBwYXJ0IG9mIHNvdXJjZSBwYWdlXHJcblx0ICogQHBhcmFtIGNzcyAtIGNzcyBzZWxlY3RvclxyXG5cdCAqIEBwYXJhbSB0eXBlIC0gdHlwZSBvZiB2YWx1ZSB0byByZXR1cm5cclxuXHQgKiBAcmV0dXJucyBzdHJpbmcgd2l0aCBhcHByb3ByaWF0ZSB2YWx1ZSwgZGVwZW5kcyBvbiB0aGUgdHlwZSBwYXJhbWV0ZXJcclxuXHQgKi9cclxuXHRzZWxlY3Qoc291cmNlLCBjc3MsIHR5cGUpXHJcblx0e1xyXG5cdFx0c3dpdGNoICh0eXBlKVxyXG5cdFx0e1xyXG5cdFx0XHRjYXNlICdocmVmJzpcclxuXHRcdFx0XHRyZXR1cm4gc291cmNlLnF1ZXJ5U2VsZWN0b3IoY3NzKS5ocmVmO1xyXG5cclxuXHRcdFx0Y2FzZSAnbmFtZSc6XHJcblx0XHRcdFx0bGV0IG5hbWUgPSBzb3VyY2UucXVlcnlTZWxlY3Rvcihjc3MpLmlubmVyVGV4dC50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYmFua05hbWVzQ29tcGFyZS5sZW5ndGg7IGkrKylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRpZiAobmFtZS5pbmRleE9mKHRoaXMuYmFua05hbWVzQ29tcGFyZVtpXSkgPj0gMClcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuYmFua05hbWVzRnVsbFtpXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIG5hbWU7XHJcblxyXG5cdFx0XHRjYXNlICdjaXR5JzpcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2l0eUxpbmtzLmxlbmd0aDsgaSsrKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmNpdHlMaW5rLmluZGV4T2YodGhpcy5jaXR5TGlua3NbaV0pID49IDApXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLmNpdHlOYW1lc1tpXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuY2l0eUxpbms7XHJcblxyXG5cdFx0XHRjYXNlICdhZGRyZXNzJzpcclxuXHRcdFx0Y2FzZSAnYWRkaXRpb25hbCc6XHJcblx0XHRcdFx0bGV0IGFkZHJlc3MgPSBzb3VyY2UucXVlcnlTZWxlY3Rvcihjc3MpLmlubmVyVGV4dC50cmltKCk7XHJcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdhZGRyZXNzJylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fJyk7XHJcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdzb3Vyc2U6ICcgKyBhZGRyZXNzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IGdldFBvcyA9IChzeW1ib2wsIHN0cikgPT5cclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsZXQgYXJyUG9zID0gW107XHJcblx0XHRcdFx0XHRsZXQgcG9zID0gc3RyLmluZGV4T2Yoc3ltYm9sKTtcclxuXHRcdFx0XHRcdHdoaWxlIChwb3MgIT09IC0xKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRhcnJQb3MucHVzaChwb3MpO1xyXG5cdFx0XHRcdFx0XHRwb3MgPSBzdHIuaW5kZXhPZihzeW1ib2wsIHBvcyArIDEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIGFyclBvcztcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRsZXQgYWRkU3BhY2UgPSAoYXJyLCBzdHIpID0+XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGV0IGNvdW50ID0gMDtcclxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRsZXQgZmlyc3RQYXJ0ID0gc3RyLnNsaWNlKDAsIGFycltpXSArIGNvdW50ICsgMSk7XHJcblx0XHRcdFx0XHRcdGxldCBzZWNvbmRQYXJ0ID0gJyAnICsgc3RyLnNsaWNlKGFycltpXSArIGNvdW50ICsgMSk7XHJcblx0XHRcdFx0XHRcdHN0ciA9IGZpcnN0UGFydCArIHNlY29uZFBhcnQ7XHJcblx0XHRcdFx0XHRcdGNvdW50Kys7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gc3RyO1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdC8vIEFkZCBzcGFjZSBhZnRlciAuXHJcblx0XHRcdFx0bGV0IGRvdFBvcyA9IGdldFBvcygnLicsIGFkZHJlc3MpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSBhZGRTcGFjZShkb3RQb3MsIGFkZHJlc3MpO1xyXG5cdFx0XHRcdC8vIEFkZCBzcGFjZSBhZnRlciAsXHJcblx0XHRcdFx0bGV0IGNvbW1hUG9zID0gZ2V0UG9zKCcsJywgYWRkcmVzcyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IGFkZFNwYWNlKGNvbW1hUG9zLCBhZGRyZXNzKTtcclxuXHRcdFx0XHQvLyBSZXBsYWNlIGRvdWJsZSBzcGFjZXNcclxuXHRcdFx0XHRhZGRyZXNzID0gYWRkcmVzcy5yZXBsYWNlKC9cXHNcXHMvZywnICcpO1xyXG5cclxuXHRcdFx0XHRsZXQgcmVwbGFjZSA9IChzdHIsIGEsIGIpID0+XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cmV0dXJuIHN0ci5yZXBsYWNlKGEsIGIpO1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdC8vIFJlcGxhY2VcclxuXHRcdFx0XHRhZGRyZXNzID0gcmVwbGFjZShhZGRyZXNzLCfQv9GALdGCJywn0L/RgCcpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSByZXBsYWNlKGFkZHJlc3MsJ9C/0YDQvtGB0L/QtdC60YInLCfQv9GAJyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHJlcGxhY2UoYWRkcmVzcywn0L/RgC3QutGCJywn0L/RgCcpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSByZXBsYWNlKGFkZHJlc3MsJ9C/0YAgJywn0L/RgC4gJyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHJlcGxhY2UoYWRkcmVzcywn0L/RgCwnLCfQv9GALiwnKTtcclxuXHJcblx0XHRcdFx0YWRkcmVzcyA9IHJlcGxhY2UoYWRkcmVzcywn0L8t0LTRjCcsJ9C/0LsnKTtcclxuXHRcdFx0XHRhZGRyZXNzID0gcmVwbGFjZShhZGRyZXNzLCfQv9C7ICcsJ9C/0LsuICcpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSByZXBsYWNlKGFkZHJlc3MsJ9C/0LssJywn0L/Quy4sJyk7XHJcblxyXG5cdFx0XHRcdGFkZHJlc3MgPSByZXBsYWNlKGFkZHJlc3MsJ9GC0YDQsNC60YInLCfRgtGAJyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHJlcGxhY2UoYWRkcmVzcywn0YLRgNCw0LrRgtCwJywn0YLRgCcpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSByZXBsYWNlKGFkZHJlc3MsJ9GC0YDQsCcsJ9GC0YAnKTtcclxuXHRcdFx0XHRhZGRyZXNzID0gcmVwbGFjZShhZGRyZXNzLCfRgtGALdGCJywn0YLRgCcpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSByZXBsYWNlKGFkZHJlc3MsJ9GC0YAgJywn0YLRgC4gJyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHJlcGxhY2UoYWRkcmVzcywn0YLRgCwnLCfRgtGALiwnKTtcclxuXHJcblx0XHRcdFx0YWRkcmVzcyA9IHJlcGxhY2UoYWRkcmVzcywnMtGD0LsnLCfRg9C7Jyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHJlcGxhY2UoYWRkcmVzcywnNNGD0LsnLCfRg9C7Jyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHJlcGxhY2UoYWRkcmVzcywn0YPQuy4g0J/RgC4nLCfQv9GALicpO1xyXG5cclxuXHRcdFx0XHRhZGRyZXNzID0gcmVwbGFjZShhZGRyZXNzLCfQsdGD0LvRjNCy0LDRgCcsJ9Cx0YPQuy4nKTtcclxuXHJcblx0XHRcdFx0YWRkcmVzcyA9IHJlcGxhY2UoYWRkcmVzcywn0L/QvtGB0LXQu9C+0LonLCfQv9C+0YEuJyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHJlcGxhY2UoYWRkcmVzcywn0LDQs9GA0L7Qs9C+0YDQvtC00L7QuicsJ9Cw0LMuJyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHJlcGxhY2UoYWRkcmVzcywn0LTQtdGA0LXQstC90Y8nLCfQtC4nKTtcclxuXHRcdFx0XHRhZGRyZXNzID0gcmVwbGFjZShhZGRyZXNzLCfQvy/QvicsJ9C0LicpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSByZXBsYWNlKGFkZHJlc3MsJ9Cp0L7QvNGL0YHQu9C40YbQutC40Lkg0YEv0YEnLCfQtC4g0KnQvtC80YvRgdC70LjRhtCwJyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHJlcGxhY2UoYWRkcmVzcywn0LLQvtC60LfQsNC7Jywn0LLQvtC6LicpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSByZXBsYWNlKGFkZHJlc3MsJ9C+0LHQuy4gLCcsJycpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSByZXBsYWNlKGFkZHJlc3MsJzIyMzA2MCcsJycpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSByZXBsYWNlKGFkZHJlc3MsJy0gJywnICcpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSByZXBsYWNlKGFkZHJlc3MsJ9C90LXQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4Jywn0J3QtdC30LDQstC40YHQuNC80L7RgdGC0LgnKTtcclxuXHRcdFx0XHRhZGRyZXNzID0gcmVwbGFjZShhZGRyZXNzLCfQu9C10L3QuNC90LAnLCfQm9C10L3QuNC90LAnKTtcclxuXHRcdFx0XHRhZGRyZXNzID0gcmVwbGFjZShhZGRyZXNzLCcuICwnLCcuLCcpO1xyXG5cclxuXHRcdFx0XHQvLyBTcGxpdCBhZGRyZXNzIHRvIGFycmF5XHJcblx0XHRcdFx0bGV0IGFkZHJlc3NBcnIgPSBhZGRyZXNzLnNwbGl0KCcgJyk7XHJcblxyXG5cdFx0XHRcdC8vIFJlbW92ZSBlbGVtZW50cyBmcm9tIGFycmF5XHJcblx0XHRcdFx0bGV0IHJlbW92ZSA9IChrZXkgLCBhcnIpID0+XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0a2V5Lm1hcChrZXlTdHIgPT5cclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0YXJyID0gYXJyLmZpbHRlcihzdHIgPT4gc3RyLmluZGV4T2Yoa2V5U3RyKSA8IDApO1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIGFycjtcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHQvLyBSZW1vdmUgdGhpcyBlbGVtZW50cyBmcm9tIGFkZHJlc3MgZmllbGRcclxuXHRcdFx0XHRsZXQgZWxlbVRvUmVtb3ZlID0gW3RoaXMuY2l0eU5hbWUsICfQsy4nLCAn0LMsJywgJ9C+0LHQu9Cw0YHRgtGMJywgJ9GALdC9JywgJ9GALdC+0L0nLCAn0YDQsNC50L7QvSddO1xyXG5cdFx0XHRcdGFkZHJlc3NBcnIgPSByZW1vdmUoZWxlbVRvUmVtb3ZlLCBhZGRyZXNzQXJyKTtcclxuXHJcblx0XHRcdFx0Ly8gU2V0IGNhcGl0YWxpemUgbGV0dGVyXHJcblx0XHRcdFx0bGV0IHNldENhcGl0YWxpemUgPSAoYXJyKSA9PlxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGlmIChhcnJbMl0gJiYgYXJyWzJdWzBdICYmIGlzTmFOKCthcnJbMl1bMF0pKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRsZXQgc3BsaXQgPSBhcnJbMl0uc3BsaXQoJycpO1xyXG5cdFx0XHRcdFx0XHRpZiAoc3BsaXRbMF0ubWF0Y2goL1vQsC3Rj10vaSkpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRzcGxpdFswXSA9IHNwbGl0WzBdLnRvVXBwZXJDYXNlKCk7XHJcblx0XHRcdFx0XHRcdFx0YXJyWzJdID0gc3BsaXQuam9pbignJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gYXJyO1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlID09PSAnYWRkcmVzcycpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0YWRkcmVzc0FyciA9IHNldENhcGl0YWxpemUoYWRkcmVzc0Fycik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRhZGRyZXNzID0gYWRkcmVzc0Fyci5qb2luKCcgJykudHJpbSgpO1xyXG5cclxuXHRcdFx0XHRhZGRyZXNzID0gcmVwbGFjZShhZGRyZXNzLCfQo9C7LicsJ9GD0LsuJyk7XHJcblxyXG5cdFx0XHRcdC8vIFRoaXMgY2hlY2sgbmVlZCBmb3IgY2FzZTogaWYgdGhlcmUgaXMgbm8gc2xpY2UgZXhlY3V0ZWQsIHRoZW4gYWRkaXRpb25hbCBpbmZvIHNob3VsZCBiZSBibGFua1xyXG5cdFx0XHRcdGxldCBjaGVjayA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRsZXQgc2xpY2VJbmZvID0gKHN0ciwgc2lnbikgPT5cclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRpZiAoc3RyLmluZGV4T2Yoc2lnbikgPj0gMClcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0aWYgKHR5cGUgPT09ICdhZGRyZXNzJylcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBzdHIuc2xpY2UoMCwgc3RyLmluZGV4T2Yoc2lnbikpLnRyaW0oKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmICh0eXBlID09PSAnYWRkaXRpb25hbCcgJiYgIWNoZWNrKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0Y2hlY2sgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBzdHIuc2xpY2Uoc3RyLmluZGV4T2Yoc2lnbikgLSAxKS50cmltKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBzdHI7XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0YWRkcmVzcyA9IHNsaWNlSW5mbyhhZGRyZXNzLCcoJyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHNsaWNlSW5mbyhhZGRyZXNzLCfCqycpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSBzbGljZUluZm8oYWRkcmVzcywn0KLQlCcpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSBzbGljZUluZm8oYWRkcmVzcywn0KbQo9CcJyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHNsaWNlSW5mbyhhZGRyZXNzLCfQotCmJyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHNsaWNlSW5mbyhhZGRyZXNzLCfQotCg0KYnKTtcclxuXHRcdFx0XHRhZGRyZXNzID0gc2xpY2VJbmZvKGFkZHJlc3MsJ9CS0KYnKTtcclxuXHRcdFx0XHRhZGRyZXNzID0gc2xpY2VJbmZvKGFkZHJlc3MsJ9CT0KMnKTtcclxuXHRcdFx0XHRhZGRyZXNzID0gc2xpY2VJbmZvKGFkZHJlc3MsJ9GB0LDQvdCw0YLQvtGA0LjQuScpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSBzbGljZUluZm8oYWRkcmVzcywn0KHQsNC90LDRgtC+0YDQuNC5Jyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHNsaWNlSW5mbyhhZGRyZXNzLCfQvtC60L7Qu9C+Jyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHNsaWNlSW5mbyhhZGRyZXNzLCfQv9Cw0LLQuNC70YzQvtC9Jyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHNsaWNlSW5mbyhhZGRyZXNzLCfQv9GA0LDQstC+0LUnKTtcclxuXHRcdFx0XHRhZGRyZXNzID0gc2xpY2VJbmZvKGFkZHJlc3MsJ9GB0YIuINC80LXRgtGA0L4nKTtcclxuXHRcdFx0XHRhZGRyZXNzID0gc2xpY2VJbmZvKGFkZHJlc3MsJ9C/0LXRgNC10YHQtdGH0LXQvdC40LUnKTtcclxuXHRcdFx0XHRhZGRyZXNzID0gc2xpY2VJbmZvKGFkZHJlc3MsJ9CQ0JfQoScpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSBzbGljZUluZm8oYWRkcmVzcywn0YPQvdC40LLQtdGA0YHQsNC8Jyk7XHJcblx0XHRcdFx0YWRkcmVzcyA9IHNsaWNlSW5mbyhhZGRyZXNzLCfQo9C90LjQstC10YDRgdCw0LwnKTtcclxuXHRcdFx0XHRhZGRyZXNzID0gc2xpY2VJbmZvKGFkZHJlc3MsJ9GB0YPQv9C10YDQvNCw0YDQutC10YInKTtcclxuXHRcdFx0XHRhZGRyZXNzID0gc2xpY2VJbmZvKGFkZHJlc3MsJ9Ch0YPQv9C10YDQvNCw0YDQutC10YInKTtcclxuXHRcdFx0XHRhZGRyZXNzID0gc2xpY2VJbmZvKGFkZHJlc3MsJ9Ce0YLQtNC10LvQtdC90LjQtScpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSBzbGljZUluZm8oYWRkcmVzcywn0JfQsNC/0LDQtNC90YvQuScpO1xyXG5cdFx0XHRcdGFkZHJlc3MgPSBzbGljZUluZm8oYWRkcmVzcywn0JrQvtC80LDRgNC+0LLRgdC60LjQuScpO1xyXG5cclxuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ2FkZHJlc3MnKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGlmIChhZGRyZXNzW2FkZHJlc3MubGVuZ3RoLTFdID09PSAnLCcpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGFkZHJlc3MgPSBhZGRyZXNzLnNsaWNlKDAsIGFkZHJlc3MubGVuZ3RoLTEpLnRyaW0oKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ2FkZHJlc3M6ICcgKyBhZGRyZXNzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAodHlwZSA9PT0gJ2FkZGl0aW9uYWwnKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGlmICghY2hlY2spXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGFkZHJlc3MgPSAnJztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ2FkZGl0aW9uYWw6ICcgKyBhZGRyZXNzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGFkZHJlc3M7XHJcblxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHJldHVybiBzb3VyY2UucXVlcnlTZWxlY3Rvcihjc3MpLmlubmVyVGV4dC50cmltKCk7XHJcblx0XHR9XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm91dGVyXHJcbntcclxuXHRjb25zdHJ1Y3Rvcihyb3V0ZXMsIGV2ZW50QnVzKVxyXG5cdHtcclxuXHRcdHRoaXMucm91dGVzID0gcm91dGVzIHx8IFtdO1xyXG5cdFx0dGhpcy5ldmVudEJ1cyA9IGV2ZW50QnVzO1xyXG5cdFx0dGhpcy5pbml0KCk7XHJcblx0fVxyXG5cclxuXHRpbml0KClcclxuXHR7XHJcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsICgpID0+IHRoaXMuaGFuZGxlVXJsKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSk7XHJcblx0XHR0aGlzLmhhbmRsZVVybCh3aW5kb3cubG9jYXRpb24uaGFzaCk7XHJcblx0fVxyXG5cclxuXHRmaW5kUHJldmlvdXNBY3RpdmVSb3V0ZSgpXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuY3VycmVudFJvdXRlO1xyXG5cdH1cclxuXHJcblx0ZmluZE5ld0FjdGl2ZVJvdXRlKHVybClcclxuXHR7XHJcblx0XHRsZXQgcm91dGUgPSB0aGlzLnJvdXRlcy5maW5kKChyb3V0ZUl0ZW0pID0+XHJcblx0XHR7XHJcblx0XHRcdGlmICh0eXBlb2Ygcm91dGVJdGVtLm1hdGNoID09PSAnc3RyaW5nJylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiB1cmwgPT09IHJvdXRlSXRlbS5tYXRjaDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0eXBlb2Ygcm91dGVJdGVtLm1hdGNoID09PSAnZnVuY3Rpb24nKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuIHJvdXRlSXRlbS5tYXRjaCh1cmwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHJvdXRlSXRlbS5tYXRjaCBpbnN0YW5jZW9mIFJlZ0V4cClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiB1cmwubWF0Y2gocm91dGVJdGVtLm1hdGNoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKCFyb3V0ZSlcclxuXHRcdHtcclxuXHRcdFx0cm91dGUgPSB0aGlzLnJvdXRlc1snMCddOyAvLyDQk9C70LDQstC90LDRjyDRgdGC0YDQsNC90LjRhtCwXHJcblx0XHR9XHJcblxyXG5cdFx0Ly9jb25zb2xlLmxvZyhgLS0tPiByb3V0ZXIgZmluZE5ld0FjdGl2ZVJvdXRlOiAke3VybH0gLS0gJHsocm91dGUgfHwge30pLm5hbWV9YCk7XHJcblx0XHRyZXR1cm4gcm91dGU7XHJcblx0fVxyXG5cclxuXHRoYW5kbGVVcmwodXJsKVxyXG5cdHtcclxuXHRcdHVybCA9IHVybC5zbGljZSgxKTtcclxuXHJcblx0XHRsZXQgcHJldmlvdXNSb3V0ZSA9IHRoaXMuZmluZFByZXZpb3VzQWN0aXZlUm91dGUoKTtcclxuXHRcdGxldCBuZXdSb3V0ZSA9IHRoaXMuZmluZE5ld0FjdGl2ZVJvdXRlKHVybCk7XHJcblxyXG5cdFx0UHJvbWlzZS5yZXNvbHZlKClcclxuXHRcdCAgICAgICAudGhlbigoKSA9PiBwcmV2aW91c1JvdXRlICYmIHByZXZpb3VzUm91dGUub25MZWF2ZSAmJiBwcmV2aW91c1JvdXRlLm9uTGVhdmUod2luZG93LmxvY2F0aW9uLmhhc2gsIHRoaXMuZXZlbnRCdXMpKVxyXG5cdFx0ICAgICAgIC50aGVuKCgpID0+IG5ld1JvdXRlICYmIG5ld1JvdXRlLm9uQmVmb3JlRW50ZXIgJiYgbmV3Um91dGUub25CZWZvcmVFbnRlcih3aW5kb3cubG9jYXRpb24uaGFzaCwgdGhpcy5ldmVudEJ1cykpXHJcblx0XHQgICAgICAgLnRoZW4oKCkgPT4gbmV3Um91dGUgJiYgbmV3Um91dGUub25FbnRlciAmJiBuZXdSb3V0ZS5vbkVudGVyKHdpbmRvdy5sb2NhdGlvbi5oYXNoLCB0aGlzLmV2ZW50QnVzKSlcclxuXHRcdCAgICAgICAudGhlbigoKSA9PiB7IHRoaXMuY3VycmVudFJvdXRlID0gbmV3Um91dGU7IH0pO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWxzXHJcbntcclxuXHRjb25zdHJ1Y3RvcigpXHJcblx0e1xyXG5cdFx0dGhpcy5jaGVja1JvdGF0ZSgpO1xyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgdGhpcy5jaGVja1JvdGF0ZS5iaW5kKHRoaXMpKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENoZWNrIGlmIHJvdGF0ZSBpcyBwb3J0cmFpdCBvciBsYW5kc2NhcGVcclxuXHQgKi9cclxuXHRjaGVja1JvdGF0ZSgpXHJcblx0e1xyXG5cdFx0bGV0IHcgPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHRcdGxldCBoID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cdFx0bGV0IGJnU2l6ZSA9IHc7XHJcblxyXG5cdFx0dyA8IGggPyB0aGlzLnVwZGF0ZVN0eWxlcyh3LCBoLCBiZ1NpemUpIDogdGhpcy51cGRhdGVTdHlsZXMoaCwgdywgYmdTaXplKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHdpZHRoIC0gc2NyZWVuIHdpZHRoXHJcblx0ICogQHBhcmFtIGhlaWd0aCAtIHNjcmVlbiBoZWlndGhcclxuXHQgKiBAcGFyYW0gYmdTaXplIC0gdGhlIHNpemUgb2YgYmFja2dyb3VuZCBpbWFnZSBzaG91bGQgZXF1YWwgdG8gc2NyZWVuIHdpZHRoXHJcblx0ICovXHJcblx0dXBkYXRlU3R5bGVzKHdpZHRoLCBoZWlndGgsIGJnU2l6ZSlcclxuXHR7XHJcblx0XHRsZXQgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuXHRcdGxldCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkZXInKTtcclxuXHJcblx0XHRib2R5LnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xyXG5cdFx0Ym9keS5zdHlsZS5oZWlnaHQgPSBoZWlndGggKyAncHgnO1xyXG5cclxuXHRcdGJvZHkuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBiZ1NpemUgKyAncHgnO1xyXG5cdFx0aGVhZGVyLnN0eWxlLmJhY2tncm91bmRTaXplID0gYmdTaXplICsgJ3B4JztcclxuXHR9XHJcbn0iXX0=
