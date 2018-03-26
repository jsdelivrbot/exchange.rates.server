export default class Select
{
	constructor(eventBus)
	{
		this.eventBus = eventBus;

		this.currency = document.querySelector('.exchange-currencies');

		this.currency.addEventListener('change', (event) =>
		{
			if (event.target.className !== 'select-item') return;
			this.changeView([event.target.value, event.target.parentNode.className, true]);
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
	changeView([value, parent, query])
	{
		switch (value)
		{
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
		let options = document.querySelectorAll('.' + parent + ' .select-item option');

		for (let i = 0; i < options.length; i++)
		{
			if (options[i].selected)
			{
				if (options[i].value === 'RUR')
				{
					options[i].innerHTML = '100 ' + options[i].value;
					this.sheet.insertRule('.' + parent + ' select {padding: 4.5% 30.5%;}', this.rules.length);
				}
				else
				{
					options[i].innerHTML = options[i].value;
					this.sheet.insertRule('.' + parent + ' select {padding: 4.5% 39.5%;}', this.rules.length);
				}

				options[i].classList.add('hidden');

				// Send selected value to eventBus
				if (query)
				{
					this.eventBus.trigger('select:update', [options[i].value, parent]);
				}
			}
			else
			{
				switch (options[i].value)
				{
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
}