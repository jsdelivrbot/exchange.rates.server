const libs = process.cwd() + '/libs/';
const config = require(libs + 'config');

/**
 * @param str - receive an string with part of source page
 * @param type - type of data which we want to handle
 * returns string with associated data
 */
let select = (str, type, cityLink) => {
	switch (type) {
		case 'bankName':
			let bankName = str.match(/\<a href=".+?\<\/a\>/i) && str.match(/\<a href=".+?\<\/a\>/i)[ 0 ] || '';
			if (bankName) {
				bankName = bankName.match(/"\>.+?\<\/a\>/i) && bankName.match(/"\>.+?\<\/a\>/i)[ 0 ] || '';
			}
			if (bankName && typeof bankName === 'string') {
				bankName = bankName.slice(2, -4).trim().toLowerCase();
			}

			let bankNamesCompare = config.get('bankNamesCompare') || [];
			let bankNames = config.get('bankNames') || [];

			for (let i = 0; i < bankNamesCompare.length; i++) {
				if (bankName.indexOf(bankNamesCompare[ i ]) >= 0) {
					return bankNames[ i ];
				}
			}

			return bankName;

		case 'title':
			let title = str.match(/\<a href=".+?\<\/a\>/i) && str.match(/\<a href=".+?\<\/a\>/i)[ 0 ] || '';
			if (title) {
				title = title.match(/"\>.+?\<\/a\>/i) && title.match(/"\>.+?\<\/a\>/i)[ 0 ] || '';
			}

			if (title && typeof title === 'string') {
				title = title.slice(2, -4).trim();
			}
			return title;

		case 'link':
			let link = str.match(/href=".+?"/i) && str.match(/href=".+?"/i)[ 0 ] || '';
			if (link) {
				link = link.slice(6, -1);
			}
			return link;

		case 'phone':
			let phone = str.match(/tel".+?\<\/div\>/i) && str.match(/tel".+?\<\/div\>/i)[ 0 ] || '';
			if (phone && typeof phone === 'string') {
				phone = phone.slice(5, -6).trim();
			}
			return phone;

		case 'city':
			let cityLinks = config.get('cityLinks') || [];
			let cityNames = config.get('cityNames') || [];

			let city = cityLink || 'minsk';

			for (let i = 0; i < cityLinks.length; i++) {
				if (city.indexOf(cityLinks[ i ]) >= 0) {
					return cityNames[ i ];
				}
			}
			return city;

		case 'address':
		case 'additional':
			// Template for custom page(usd, eur etc.)
			let address = str.match(/address"\>\<a.+?\>(.+?)\<\/a\>\<\/div\>/i) && str.match(/address"\>\<a.+?\>(.+?)\<\/a\>\<\/div\>/i)[ 0 ] || str.match(/address"\>\<a.+?\>([^w]+?)\<\/a\>\<\/div\>/i) && str.match(/address"\>\<a.+?\>([^w]+?)\<\/a\>\<\/div\>/i)[ 0 ] || '';
			address = address.match(/;"\>.+?\<\/a\>/i) && address.match(/;"\>.+?\<\/a\>/i)[ 0 ] || '';

			if (address && typeof address === 'string') {
				address = address.slice(3, -4).trim();
			}

			let getPos = (symbol, str) => {
				let arrPos = [];
				let pos = str.indexOf(symbol);
				while (pos !== -1) {
					arrPos.push(pos);
					pos = str.indexOf(symbol, pos + 1);
				}
				return arrPos;
			};

			let addSpace = (arr, str) => {
				let count = 0;
				for (let i = 0; i < arr.length; i++) {
					let firstPart = str.slice(0, arr[ i ] + count + 1);
					let secondPart = ' ' + str.slice(arr[ i ] + count + 1);
					str = firstPart + secondPart;
					count++;
				}
				return str;
			};

			// Add space after .
			let dotPos = getPos('.', address);
			address = addSpace(dotPos, address);
			// Add space after ,
			let commaPos = getPos(',', address);
			address = addSpace(commaPos, address);
			// Replace double spaces
			address = address.replace(/\s\s/g, ' ');

			// Split address to array
			let addressArr = address.split(' ');

			// Remove elements from array
			let remove = (key, arr) => {
				key.map(keyStr => {
					arr = arr.filter(str => str.indexOf(keyStr) < 0);
				});

				return arr;
			};

			// Remove this elements from address field
			let elemToRemove = [ this.cityName, 'г.', 'г,', 'Минская', 'область', 'Минский', 'р-н', 'р-он', 'район' ];
			addressArr = remove(elemToRemove, addressArr);

			// Set capitalize letter
			let setCapitalize = (arr) => {
				if (arr[ 2 ] && arr[ 2 ][ 0 ] && isNaN(+arr[ 2 ][ 0 ])) {
					let split = arr[ 2 ].split('');
					if (split[ 0 ].match(/[а-я]/i)) {
						split[ 0 ] = split[ 0 ].toUpperCase();
						arr[ 2 ] = split.join('');
					}
				}

				return arr;
			};

			if (type === 'address') {
				addressArr = setCapitalize(addressArr);
			}

			address = addressArr.join(' ').trim();

			let replace = (str, a, b) => str.replace(a, b);
			// Replace
			let sourceText = config.get('sourceText') || [];
			let targetText = config.get('targetText') || [];
			sourceText.map((src, i) => address = replace(address, src, targetText[ i ]).trim());

			// This check need for case: if there is no slice executed, then additional info should be blank
			let check = false;

			let sliceInfo = (str, sign) => {
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

			let sliceText = config.get('sliceText') || [];

			sliceText.map(src => address = sliceInfo(address, src));

			if (type === 'address') {
				if (address[ address.length - 1 ] === ',') {
					address = address.slice(0, address.length - 1).trim();
				}
			} else if (type === 'additional') {
				if (!check) {
					address = '';
				}
			}
			return address;

		case 'date':
			let date = str.match(/date".+?\<\/div\>/i) && str.match(/date".+?\<\/div\>/i)[ 0 ] || str.match(/date"[^w]+?\<\/div\>/i) && str.match(/date"[^w]+?\<\/div\>/i)[ 0 ] || '';
			if (date && typeof date === 'string') {
				date = date.slice(6, -6).trim();
			}
			return date;

		default:
			return null;
	}
};

module.exports = select;
