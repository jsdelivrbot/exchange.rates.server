export default class Burger
{
	constructor(eventBus)
	{
		this.eventBus = eventBus;

		this.distance = document.querySelector('#distance');
		this.distance.addEventListener('change', (event) => this.eventBus.trigger('distance:value', event.target.value));
	}
}