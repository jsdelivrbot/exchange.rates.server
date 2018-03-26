export default class Index
{
	constructor(list, eventBus)
	{
		this.name = 'index';
		this.match = '';

		this.list = list;
		this.eventBus = eventBus;

		this.schedule = document.querySelector('.schedule');

		// Subscribe to city location change and then get the filtered data list
		this.eventBus.on('location:city', (city) =>
		{
			this.spinner.spin(this.schedule);
			this.showFilteredList(city);
		});
	}

	onEnter()
	{
		this.menu = document.querySelector('.menu .menu-quotes');
		this.menu.classList.add('menu-selected');

		this.schedule.classList.remove('hidden');

		this.footer = document.querySelector('footer .quotes-item');
		this.footer.classList.add('quotes-item-selected');

		// Start spinner
		this.spinner = new Spinner().spin(this.schedule);

		if (this.notFirstQuery)
		{
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
	showFilteredList(city)
	{
		this.cityName = city;

		this.notFirstQuery = true;

		/**
		 *
		 * @param data - object with filtered data which should be displayed in "schedule" div
		 */
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
		}
	}

	onLeave()
	{
		this.footer.classList.remove('quotes-item-selected');
		this.menu.classList.remove('menu-selected');

		this.schedule.classList.add('hidden');
	}
};