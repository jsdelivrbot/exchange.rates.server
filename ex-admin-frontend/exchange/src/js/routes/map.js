export default class Map
{
	constructor(yandexMap, eventBus)
	{
		this.name = 'map';
		this.match = 'map';

		this.yMap = yandexMap;
		this.eventBus = eventBus;

		this.map = document.querySelector('.map');


	}

	onEnter()
	{
		this.footer = document.querySelector('footer .map-item');
		this.footer.classList.add('map-item-selected');

		this.map.classList.remove('hidden');

		//this.yMap.getCurrentLocation();
	}

	drawMap()
	{

	}

	onLeave()
	{
		this.footer.classList.remove('map-item-selected');
		this.map.classList.add('hidden');
	}
};