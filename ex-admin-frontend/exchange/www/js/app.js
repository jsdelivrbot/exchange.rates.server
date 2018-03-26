(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// Components
// import Select from './components/select';
// import List   from './components/list';
// import yMap   from './components/ymap';
// import Footer from './components/footer';
// import Burger from './components/burger';

// Routes

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

var _router = require('./utils/router');

var _router2 = _interopRequireDefault(_router);

var _eventBus = require('./utils/eventBus');

var _eventBus2 = _interopRequireDefault(_eventBus);

var _request = require('./utils/request');

var _request2 = _interopRequireDefault(_request);

var _utils = require('./utils/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Map   from './routes/map';

// Utils
var eventBus = new _eventBus2.default();
// const yandexMap = new yMap(eventBus);
var request = new _request2.default();
// const list      = new List(yandexMap, request, eventBus);
var index = new _index2.default(eventBus);
// const map       = new Map(yandexMap, eventBus);

//new Burger(eventBus);
//new Select(eventBus);
new _utils2.default();
//new Footer();
new _router2.default([index], eventBus);

},{"./routes/index":2,"./utils/eventBus":3,"./utils/request":4,"./utils/router":5,"./utils/utils":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Index = function () {
	function Index(eventBus) {
		_classCallCheck(this, Index);

		this.name = 'index';
		this.match = '';

		this.eventBus = eventBus;

		this.schedule = document.querySelector('.schedule');

		// Subscribe to city location change and then get the filtered data list
		/*this.eventBus.on('location:city', city =>
  {
  	this.spinner.spin(this.schedule);
  	this.showFilteredList(city);
  });*/
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
			/*this.spinner = new Spinner().spin(this.schedule);
   		if (this.notFirstQuery)
   {
   	this.showFilteredList(this.cityName);
   }*/
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
			/*this.cityName = city;
   		this.notFirstQuery = true;
   		/!**
    *
    * @param data - object with filtered data which should be displayed in "schedule" div
    *!/
   let setFilteredData = (data) =>
   {
   	for (let i = 0; i < Object.keys(data).length; i++)
   	{
   		if (data.hasOwnProperty(i))
   		{
   			if (data[i].rates[this.list.inputCurrency + '-' + this.list.outputCurrency])
   			{
   				let address = data[i].address;
   				if (data[i].additional) address += ' ' + data[i].additional;
   						this.schedule.innerHTML += `
   					<div class="row">
   						<div class="bank-row">
   							${data[i].name} <span class="address">| ${address}</span>
   							<span class="rate">${data[i].rates[this.list.inputCurrency + '-' + this.list.outputCurrency]}</span>
   						</div>
   						<div class="details-row">
   							${data[i].date}:00 | ${data[i].city}
   							<span class="rate green">${data[i].rates.helper}</span>
   						</div>
   					</div>
   	 			`;
   			}
   		}
   	}
   };
   		if (typeof city === 'string')
   {
   	// Returns promise
   	this.list.getList(city).then(data =>
   	{
   		this.spinner.stop();
   		this.schedule.innerHTML = '';
   		// Reset schedule
   		setFilteredData(data)
   	});
   }*/
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function () {
	function Request() {
		_classCallCheck(this, Request);

		this.departments = localStorage.getItem("departments") || this.getDepartments() || {};

		//localStorage.setItem("username", "John");
	}

	/**
  *
  */


	_createClass(Request, [{
		key: 'getDepartments',
		value: function getDepartments() {
			// Cors-anywhere server
			var corsUrl = 'https://nullso-cors-anywhere.herokuapp.com/';
			// Main server url
			var serverUrl = 'https://nullso.herokuapp.com/api/departments';

			var clientId = 'android';
			var clientSecret = 'qwe12FFGhgfh44SDDfgnmh6Hg54';

			return fetch(corsUrl + serverUrl, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Basic ' + btoa(clientId + ":" + clientSecret)
				}
			}).then(function (response) {
				return response.json();
			}).then(function (json) {
				return console.log(json);
			}).catch(function (error) {
				return console.log('Authorization failed : ' + error.message);
			});
		}
	}]);

	return Request;
}();

exports.default = Request;

},{}],5:[function(require,module,exports){
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
				route = this.routes['0']; // Index page
			}

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

},{}],6:[function(require,module,exports){
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

/*
var displayModeLandscape = false;
var width = 0;
var height = 0;
var setPortrait = function() {
	$('html').addClass('portrait').removeClass('landscape');
	displayModeLandscape = false;
};
var setLandscape = function() {
	$('html').addClass('landscape').removeClass('portrait');
	displayModeLandscape = true;
};

var currentOrientation = function() {
	width = screen.availWidth || $(window).width();
	height = screen.availHeight || $(window).height();
	if(height > width) {
		setPortrait();
	} else {
		setLandscape();
	}
};
$(window).on(‘orientationchange’, currentOrientation);
currentOrientation();*/


exports.default = Utils;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGNoYW5nZVxcc3JjXFxqc1xcYXBwLmpzIiwiZXhjaGFuZ2VcXHNyY1xcanNcXHJvdXRlc1xcaW5kZXguanMiLCJleGNoYW5nZVxcc3JjXFxqc1xcdXRpbHNcXGV2ZW50QnVzLmpzIiwiZXhjaGFuZ2VcXHNyY1xcanNcXHV0aWxzXFxyZXF1ZXN0LmpzIiwiZXhjaGFuZ2VcXHNyY1xcanNcXHV0aWxzXFxyb3V0ZXIuanMiLCJleGNoYW5nZVxcc3JjXFxqc1xcdXRpbHNcXHV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUNBOzs7O0FBSUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQU5BOztBQUVBO0FBTUEsSUFBTSxXQUFZLHdCQUFsQjtBQUNBO0FBQ0EsSUFBTSxVQUFZLHVCQUFsQjtBQUNBO0FBQ0EsSUFBTSxRQUFZLG9CQUFVLFFBQVYsQ0FBbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFXLENBQUMsS0FBRCxDQUFYLEVBQW9CLFFBQXBCOzs7Ozs7Ozs7Ozs7O0lDOUJxQixLO0FBRXBCLGdCQUFZLFFBQVosRUFDQTtBQUFBOztBQUNDLE9BQUssSUFBTCxHQUFZLE9BQVo7QUFDQSxPQUFLLEtBQUwsR0FBYSxFQUFiOztBQUVBLE9BQUssUUFBTCxHQUFnQixRQUFoQjs7QUFFQSxPQUFLLFFBQUwsR0FBZ0IsU0FBUyxhQUFULENBQXVCLFdBQXZCLENBQWhCOztBQUVBO0FBQ0E7Ozs7O0FBS0E7Ozs7NEJBR0Q7QUFDQyxRQUFLLElBQUwsR0FBWSxTQUFTLGFBQVQsQ0FBdUIsb0JBQXZCLENBQVo7QUFDQSxRQUFLLElBQUwsQ0FBVSxTQUFWLENBQW9CLEdBQXBCLENBQXdCLGVBQXhCOztBQUVBLFFBQUssUUFBTCxDQUFjLFNBQWQsQ0FBd0IsTUFBeEIs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QSxRQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLFNBQVMsSUFBN0I7O0FBRUEsUUFBSyxLQUFMLENBQVcsY0FBWCxHQUE0QixTQUFTLElBQXJDO0FBQ0EsVUFBTyxLQUFQLENBQWEsY0FBYixHQUE4QixTQUFTLElBQXZDO0FBQ0E7Ozs7OztBQUlGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkF2Q3FCLEsiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vLyBDb21wb25lbnRzXHJcbi8vIGltcG9ydCBTZWxlY3QgZnJvbSAnLi9jb21wb25lbnRzL3NlbGVjdCc7XHJcbi8vIGltcG9ydCBMaXN0ICAgZnJvbSAnLi9jb21wb25lbnRzL2xpc3QnO1xyXG4vLyBpbXBvcnQgeU1hcCAgIGZyb20gJy4vY29tcG9uZW50cy95bWFwJztcclxuLy8gaW1wb3J0IEZvb3RlciBmcm9tICcuL2NvbXBvbmVudHMvZm9vdGVyJztcclxuLy8gaW1wb3J0IEJ1cmdlciBmcm9tICcuL2NvbXBvbmVudHMvYnVyZ2VyJztcclxuXHJcbi8vIFJvdXRlc1xyXG5pbXBvcnQgSW5kZXggZnJvbSAnLi9yb3V0ZXMvaW5kZXgnO1xyXG4vLyBpbXBvcnQgTWFwICAgZnJvbSAnLi9yb3V0ZXMvbWFwJztcclxuXHJcbi8vIFV0aWxzXHJcbmltcG9ydCBSb3V0ZXIgICBmcm9tICcuL3V0aWxzL3JvdXRlcic7XHJcbmltcG9ydCBFdmVudEJ1cyBmcm9tICcuL3V0aWxzL2V2ZW50QnVzJztcclxuaW1wb3J0IFJlcXVlc3QgIGZyb20gJy4vdXRpbHMvcmVxdWVzdCc7XHJcbmltcG9ydCBVdGlscyAgICBmcm9tICcuL3V0aWxzL3V0aWxzJztcclxuXHJcbmNvbnN0IGV2ZW50QnVzICA9IG5ldyBFdmVudEJ1cygpO1xyXG4vLyBjb25zdCB5YW5kZXhNYXAgPSBuZXcgeU1hcChldmVudEJ1cyk7XHJcbmNvbnN0IHJlcXVlc3QgICA9IG5ldyBSZXF1ZXN0KCk7XHJcbi8vIGNvbnN0IGxpc3QgICAgICA9IG5ldyBMaXN0KHlhbmRleE1hcCwgcmVxdWVzdCwgZXZlbnRCdXMpO1xyXG5jb25zdCBpbmRleCAgICAgPSBuZXcgSW5kZXgoZXZlbnRCdXMpO1xyXG4vLyBjb25zdCBtYXAgICAgICAgPSBuZXcgTWFwKHlhbmRleE1hcCwgZXZlbnRCdXMpO1xyXG5cclxuLy9uZXcgQnVyZ2VyKGV2ZW50QnVzKTtcclxuLy9uZXcgU2VsZWN0KGV2ZW50QnVzKTtcclxubmV3IFV0aWxzKCk7XHJcbi8vbmV3IEZvb3RlcigpO1xyXG5uZXcgUm91dGVyKFtpbmRleF0sIGV2ZW50QnVzKTsiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBJbmRleFxyXG57XHJcblx0Y29uc3RydWN0b3IoZXZlbnRCdXMpXHJcblx0e1xyXG5cdFx0dGhpcy5uYW1lID0gJ2luZGV4JztcclxuXHRcdHRoaXMubWF0Y2ggPSAnJztcclxuXHJcblx0XHR0aGlzLmV2ZW50QnVzID0gZXZlbnRCdXM7XHJcblxyXG5cdFx0dGhpcy5zY2hlZHVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY2hlZHVsZScpO1xyXG5cclxuXHRcdC8vIFN1YnNjcmliZSB0byBjaXR5IGxvY2F0aW9uIGNoYW5nZSBhbmQgdGhlbiBnZXQgdGhlIGZpbHRlcmVkIGRhdGEgbGlzdFxyXG5cdFx0Lyp0aGlzLmV2ZW50QnVzLm9uKCdsb2NhdGlvbjpjaXR5JywgY2l0eSA9PlxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLnNwaW5uZXIuc3Bpbih0aGlzLnNjaGVkdWxlKTtcclxuXHRcdFx0dGhpcy5zaG93RmlsdGVyZWRMaXN0KGNpdHkpO1xyXG5cdFx0fSk7Ki9cclxuXHR9XHJcblxyXG5cdG9uRW50ZXIoKVxyXG5cdHtcclxuXHRcdHRoaXMubWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51IC5tZW51LXF1b3RlcycpO1xyXG5cdFx0dGhpcy5tZW51LmNsYXNzTGlzdC5hZGQoJ21lbnUtc2VsZWN0ZWQnKTtcclxuXHJcblx0XHR0aGlzLnNjaGVkdWxlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG5cclxuXHRcdHRoaXMuZm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9vdGVyIC5xdW90ZXMtaXRlbScpO1xyXG5cdFx0dGhpcy5mb290ZXIuY2xhc3NMaXN0LmFkZCgncXVvdGVzLWl0ZW0tc2VsZWN0ZWQnKTtcclxuXHJcblx0XHQvLyBTdGFydCBzcGlubmVyXHJcblx0XHQvKnRoaXMuc3Bpbm5lciA9IG5ldyBTcGlubmVyKCkuc3Bpbih0aGlzLnNjaGVkdWxlKTtcclxuXHJcblx0XHRpZiAodGhpcy5ub3RGaXJzdFF1ZXJ5KVxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLnNob3dGaWx0ZXJlZExpc3QodGhpcy5jaXR5TmFtZSk7XHJcblx0XHR9Ki9cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIGNpdHkgaXMgc3RyaW5nIHdoaWNoIHJlY2VpdmUgZGF0YSBmcm9tIGNoYWluOlxyXG5cdCAqIHNlbGVjdC5qczogdHJpZ2dlciBcInNlbGVjdDp1cGRhdGVcIiAtLS0+XHJcblx0ICogbGlzdC5qczogZ2V0U2VsZWN0ZWRDdXJyZW5jeSAtLS0+XHJcblx0ICogbG9jYXRpb24uanM6IGdldEN1cnJlbnRMb2NhdGlvbiAtPiB0cmlnZ2VyIFwibG9jYXRpb246ZGF0YVwiIC0tLT5cclxuXHQgKiBsaXN0LmpzOiBnZXRMb2NhdGlvbiAtPiB0cmlnZ2VyIFwibG9jYXRpb246Y2l0eVwiIC0tLT5cclxuXHQgKiBpbmRleC5qczogc2hvd0ZpbHRlcmVkTGlzdCAtLS0+XHJcblx0ICogKiBsaXN0LmpzOiBnZXRMaXN0IC0tLT5cclxuXHQgKiAqICogcmVxdWVzdC5qczogZ2V0UmF0ZXMgLT4gcmV0dXJuIGRhdGEgdG8gZ2V0TGlzdCAtLS0+XHJcblx0ICogKiBsaXN0LmpzOiBnZXRGaWx0ZXJlZExpc3QgLS0tPlxyXG5cdCAqIGluZGV4LmpzOiBzZXRGaWx0ZXJlZERhdGFcclxuXHQgKi9cclxuXHRzaG93RmlsdGVyZWRMaXN0KGNpdHkpXHJcblx0e1xyXG5cdFx0Lyp0aGlzLmNpdHlOYW1lID0gY2l0eTtcclxuXHJcblx0XHR0aGlzLm5vdEZpcnN0UXVlcnkgPSB0cnVlO1xyXG5cclxuXHRcdC8hKipcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0gZGF0YSAtIG9iamVjdCB3aXRoIGZpbHRlcmVkIGRhdGEgd2hpY2ggc2hvdWxkIGJlIGRpc3BsYXllZCBpbiBcInNjaGVkdWxlXCIgZGl2XHJcblx0XHQgKiEvXHJcblx0XHRsZXQgc2V0RmlsdGVyZWREYXRhID0gKGRhdGEpID0+XHJcblx0XHR7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoOyBpKyspXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShpKSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRpZiAoZGF0YVtpXS5yYXRlc1t0aGlzLmxpc3QuaW5wdXRDdXJyZW5jeSArICctJyArIHRoaXMubGlzdC5vdXRwdXRDdXJyZW5jeV0pXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGxldCBhZGRyZXNzID0gZGF0YVtpXS5hZGRyZXNzO1xyXG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5hZGRpdGlvbmFsKSBhZGRyZXNzICs9ICcgJyArIGRhdGFbaV0uYWRkaXRpb25hbDtcclxuXHJcblx0XHRcdFx0XHRcdHRoaXMuc2NoZWR1bGUuaW5uZXJIVE1MICs9IGBcclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYmFuay1yb3dcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0JHtkYXRhW2ldLm5hbWV9IDxzcGFuIGNsYXNzPVwiYWRkcmVzc1wiPnwgJHthZGRyZXNzfTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJyYXRlXCI+JHtkYXRhW2ldLnJhdGVzW3RoaXMubGlzdC5pbnB1dEN1cnJlbmN5ICsgJy0nICsgdGhpcy5saXN0Lm91dHB1dEN1cnJlbmN5XX08L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJkZXRhaWxzLXJvd1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQke2RhdGFbaV0uZGF0ZX06MDAgfCAke2RhdGFbaV0uY2l0eX1cclxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJyYXRlIGdyZWVuXCI+JHtkYXRhW2ldLnJhdGVzLmhlbHBlcn08L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0IFx0XHRcdGA7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdGlmICh0eXBlb2YgY2l0eSA9PT0gJ3N0cmluZycpXHJcblx0XHR7XHJcblx0XHRcdC8vIFJldHVybnMgcHJvbWlzZVxyXG5cdFx0XHR0aGlzLmxpc3QuZ2V0TGlzdChjaXR5KS50aGVuKGRhdGEgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRoaXMuc3Bpbm5lci5zdG9wKCk7XHJcblx0XHRcdFx0dGhpcy5zY2hlZHVsZS5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0XHQvLyBSZXNldCBzY2hlZHVsZVxyXG5cdFx0XHRcdHNldEZpbHRlcmVkRGF0YShkYXRhKVxyXG5cdFx0XHR9KTtcclxuXHRcdH0qL1xyXG5cdH1cclxuXHJcblx0b25MZWF2ZSgpXHJcblx0e1xyXG5cdFx0dGhpcy5mb290ZXIuY2xhc3NMaXN0LnJlbW92ZSgncXVvdGVzLWl0ZW0tc2VsZWN0ZWQnKTtcclxuXHRcdHRoaXMubWVudS5jbGFzc0xpc3QucmVtb3ZlKCdtZW51LXNlbGVjdGVkJyk7XHJcblxyXG5cdFx0dGhpcy5zY2hlZHVsZS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuXHR9XHJcbn07IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRCdXNcclxue1xyXG5cdGNvbnN0cnVjdG9yKClcclxuXHR7XHJcblx0XHR0aGlzLmxpc3RlbmVycyA9IHt9O1xyXG5cdH1cclxuXHJcblx0b24obmFtZSwgaGFuZGxlcilcclxuXHR7XHJcblx0XHR0aGlzLmxpc3RlbmVyc1tuYW1lXSA9IHRoaXMubGlzdGVuZXJzW25hbWVdIHx8IFtdO1xyXG5cdFx0dGhpcy5saXN0ZW5lcnNbbmFtZV0ucHVzaChoYW5kbGVyKTtcclxuXHR9XHJcblxyXG5cdG9mZihuYW1lLCBoYW5kbGVyKVxyXG5cdHtcclxuXHRcdHRoaXMubGlzdGVuZXJzW25hbWVdID0gdGhpcy5saXN0ZW5lcnNbbmFtZV0gfHwgW107XHJcblx0XHR0aGlzLmxpc3RlbmVyc1tuYW1lXSA9IHRoaXMubGlzdGVuZXJzW25hbWVdLmZpbHRlcihpdGVtID0+IGl0ZW0gIT09IGhhbmRsZXIpO1xyXG5cdH1cclxuXHJcblx0b25jZShuYW1lLCBoYW5kbGVyKVxyXG5cdHtcclxuXHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdHRoaXMub24obmFtZSwgZnVuY3Rpb24gZ2V0dGVyKGRhdGEpXHJcblx0XHR7XHJcblx0XHRcdGhhbmRsZXIoZGF0YSk7XHJcblx0XHRcdHNlbGYub2ZmKG5hbWUsIGdldHRlcik7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHRyaWdnZXIobmFtZSwgZGF0YSlcclxuXHR7XHJcblx0XHQodGhpcy5saXN0ZW5lcnNbbmFtZV0gfHwgW10pLm1hcChoYW5kbGVyID0+IGhhbmRsZXIoZGF0YSkpO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcXVlc3Rcclxue1xyXG5cdGNvbnN0cnVjdG9yKClcclxuXHR7XHJcblx0XHR0aGlzLmRlcGFydG1lbnRzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkZXBhcnRtZW50c1wiKSB8fCB0aGlzLmdldERlcGFydG1lbnRzKCkgfHwge307XHJcblxyXG5cdFx0Ly9sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInVzZXJuYW1lXCIsIFwiSm9oblwiKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICovXHJcblx0Z2V0RGVwYXJ0bWVudHMoKVxyXG5cdHtcclxuXHRcdC8vIENvcnMtYW55d2hlcmUgc2VydmVyXHJcblx0XHRsZXQgY29yc1VybCA9ICdodHRwczovL251bGxzby1jb3JzLWFueXdoZXJlLmhlcm9rdWFwcC5jb20vJztcclxuXHRcdC8vIE1haW4gc2VydmVyIHVybFxyXG5cdFx0bGV0IHNlcnZlclVybCA9ICdodHRwczovL251bGxzby5oZXJva3VhcHAuY29tL2FwaS9kZXBhcnRtZW50cyc7XHJcblxyXG5cdFx0bGV0IGNsaWVudElkICAgICA9ICdhbmRyb2lkJztcclxuXHRcdGxldCBjbGllbnRTZWNyZXQgPSAncXdlMTJGRkdoZ2ZoNDRTRERmZ25taDZIZzU0JztcclxuXHJcblx0XHRyZXR1cm4gZmV0Y2goY29yc1VybCArIHNlcnZlclVybCwge1xyXG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG5cdFx0ICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCYXNpYyAnICsgYnRvYShjbGllbnRJZCArIFwiOlwiICsgY2xpZW50U2VjcmV0KVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0XHQudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcblx0XHRcdC50aGVuKGpzb24gPT4gY29uc29sZS5sb2coanNvbikpXHJcblx0XHRcdC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmxvZygnQXV0aG9yaXphdGlvbiBmYWlsZWQgOiAnICsgZXJyb3IubWVzc2FnZSkpO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvdXRlclxyXG57XHJcblx0Y29uc3RydWN0b3Iocm91dGVzLCBldmVudEJ1cylcclxuXHR7XHJcblx0XHR0aGlzLnJvdXRlcyA9IHJvdXRlcyB8fCBbXTtcclxuXHRcdHRoaXMuZXZlbnRCdXMgPSBldmVudEJ1cztcclxuXHRcdHRoaXMuaW5pdCgpO1xyXG5cdH1cclxuXHJcblx0aW5pdCgpXHJcblx0e1xyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCAoKSA9PiB0aGlzLmhhbmRsZVVybCh3aW5kb3cubG9jYXRpb24uaGFzaCkpO1xyXG5cdFx0dGhpcy5oYW5kbGVVcmwod2luZG93LmxvY2F0aW9uLmhhc2gpO1xyXG5cdH1cclxuXHJcblx0ZmluZFByZXZpb3VzQWN0aXZlUm91dGUoKVxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLmN1cnJlbnRSb3V0ZTtcclxuXHR9XHJcblxyXG5cdGZpbmROZXdBY3RpdmVSb3V0ZSh1cmwpXHJcblx0e1xyXG5cdFx0bGV0IHJvdXRlID0gdGhpcy5yb3V0ZXMuZmluZCgocm91dGVJdGVtKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpZiAodHlwZW9mIHJvdXRlSXRlbS5tYXRjaCA9PT0gJ3N0cmluZycpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gdXJsID09PSByb3V0ZUl0ZW0ubWF0Y2g7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIHJvdXRlSXRlbS5tYXRjaCA9PT0gJ2Z1bmN0aW9uJylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiByb3V0ZUl0ZW0ubWF0Y2godXJsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChyb3V0ZUl0ZW0ubWF0Y2ggaW5zdGFuY2VvZiBSZWdFeHApXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gdXJsLm1hdGNoKHJvdXRlSXRlbS5tYXRjaCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmICghcm91dGUpXHJcblx0XHR7XHJcblx0XHRcdHJvdXRlID0gdGhpcy5yb3V0ZXNbJzAnXTsgLy8gSW5kZXggcGFnZVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiByb3V0ZTtcclxuXHR9XHJcblxyXG5cdGhhbmRsZVVybCh1cmwpXHJcblx0e1xyXG5cdFx0dXJsID0gdXJsLnNsaWNlKDEpO1xyXG5cclxuXHRcdGxldCBwcmV2aW91c1JvdXRlID0gdGhpcy5maW5kUHJldmlvdXNBY3RpdmVSb3V0ZSgpO1xyXG5cdFx0bGV0IG5ld1JvdXRlID0gdGhpcy5maW5kTmV3QWN0aXZlUm91dGUodXJsKTtcclxuXHJcblx0XHRQcm9taXNlLnJlc29sdmUoKVxyXG5cdFx0ICAgICAgIC50aGVuKCgpID0+IHByZXZpb3VzUm91dGUgJiYgcHJldmlvdXNSb3V0ZS5vbkxlYXZlICYmIHByZXZpb3VzUm91dGUub25MZWF2ZSh3aW5kb3cubG9jYXRpb24uaGFzaCwgdGhpcy5ldmVudEJ1cykpXHJcblx0XHQgICAgICAgLnRoZW4oKCkgPT4gbmV3Um91dGUgJiYgbmV3Um91dGUub25CZWZvcmVFbnRlciAmJiBuZXdSb3V0ZS5vbkJlZm9yZUVudGVyKHdpbmRvdy5sb2NhdGlvbi5oYXNoLCB0aGlzLmV2ZW50QnVzKSlcclxuXHRcdCAgICAgICAudGhlbigoKSA9PiBuZXdSb3V0ZSAmJiBuZXdSb3V0ZS5vbkVudGVyICYmIG5ld1JvdXRlLm9uRW50ZXIod2luZG93LmxvY2F0aW9uLmhhc2gsIHRoaXMuZXZlbnRCdXMpKVxyXG5cdFx0ICAgICAgIC50aGVuKCgpID0+IHsgdGhpcy5jdXJyZW50Um91dGUgPSBuZXdSb3V0ZTsgfSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXRpbHNcclxue1xyXG5cdGNvbnN0cnVjdG9yKClcclxuXHR7XHJcblx0XHR0aGlzLmNoZWNrUm90YXRlKCk7XHJcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCB0aGlzLmNoZWNrUm90YXRlLmJpbmQodGhpcykpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ2hlY2sgaWYgcm90YXRlIGlzIHBvcnRyYWl0IG9yIGxhbmRzY2FwZVxyXG5cdCAqL1xyXG5cdGNoZWNrUm90YXRlKClcclxuXHR7XHJcblx0XHRsZXQgdyA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5cdFx0bGV0IGggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblx0XHRsZXQgYmdTaXplID0gdztcclxuXHJcblx0XHR3IDwgaCA/IHRoaXMudXBkYXRlU3R5bGVzKHcsIGgsIGJnU2l6ZSkgOiB0aGlzLnVwZGF0ZVN0eWxlcyhoLCB3LCBiZ1NpemUpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQHBhcmFtIHdpZHRoIC0gc2NyZWVuIHdpZHRoXHJcblx0ICogQHBhcmFtIGhlaWd0aCAtIHNjcmVlbiBoZWlndGhcclxuXHQgKiBAcGFyYW0gYmdTaXplIC0gdGhlIHNpemUgb2YgYmFja2dyb3VuZCBpbWFnZSBzaG91bGQgZXF1YWwgdG8gc2NyZWVuIHdpZHRoXHJcblx0ICovXHJcblx0dXBkYXRlU3R5bGVzKHdpZHRoLCBoZWlndGgsIGJnU2l6ZSlcclxuXHR7XHJcblx0XHRsZXQgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuXHRcdGxldCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkZXInKTtcclxuXHJcblx0XHRib2R5LnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xyXG5cdFx0Ym9keS5zdHlsZS5oZWlnaHQgPSBoZWlndGggKyAncHgnO1xyXG5cclxuXHRcdGJvZHkuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBiZ1NpemUgKyAncHgnO1xyXG5cdFx0aGVhZGVyLnN0eWxlLmJhY2tncm91bmRTaXplID0gYmdTaXplICsgJ3B4JztcclxuXHR9XHJcbn1cclxuXHJcblxyXG4vKlxyXG52YXIgZGlzcGxheU1vZGVMYW5kc2NhcGUgPSBmYWxzZTtcclxudmFyIHdpZHRoID0gMDtcclxudmFyIGhlaWdodCA9IDA7XHJcbnZhciBzZXRQb3J0cmFpdCA9IGZ1bmN0aW9uKCkge1xyXG5cdCQoJ2h0bWwnKS5hZGRDbGFzcygncG9ydHJhaXQnKS5yZW1vdmVDbGFzcygnbGFuZHNjYXBlJyk7XHJcblx0ZGlzcGxheU1vZGVMYW5kc2NhcGUgPSBmYWxzZTtcclxufTtcclxudmFyIHNldExhbmRzY2FwZSA9IGZ1bmN0aW9uKCkge1xyXG5cdCQoJ2h0bWwnKS5hZGRDbGFzcygnbGFuZHNjYXBlJykucmVtb3ZlQ2xhc3MoJ3BvcnRyYWl0Jyk7XHJcblx0ZGlzcGxheU1vZGVMYW5kc2NhcGUgPSB0cnVlO1xyXG59O1xyXG5cclxudmFyIGN1cnJlbnRPcmllbnRhdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG5cdHdpZHRoID0gc2NyZWVuLmF2YWlsV2lkdGggfHwgJCh3aW5kb3cpLndpZHRoKCk7XHJcblx0aGVpZ2h0ID0gc2NyZWVuLmF2YWlsSGVpZ2h0IHx8ICQod2luZG93KS5oZWlnaHQoKTtcclxuXHRpZihoZWlnaHQgPiB3aWR0aCkge1xyXG5cdFx0c2V0UG9ydHJhaXQoKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c2V0TGFuZHNjYXBlKCk7XHJcblx0fVxyXG59O1xyXG4kKHdpbmRvdykub24o4oCYb3JpZW50YXRpb25jaGFuZ2XigJksIGN1cnJlbnRPcmllbnRhdGlvbik7XHJcbmN1cnJlbnRPcmllbnRhdGlvbigpOyovXHJcbiJdfQ==
