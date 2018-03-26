export default class Footer
{
	constructor()
	{
		this.footer = document.querySelector('footer');


		this.footer.addEventListener('click', event => this.updateHash(event));
	}

	updateHash(event)
	{
		console.log(event.target.classList);
		if (event.target.classList[0].indexOf('map') >= 0)
		{
			window.location.hash = 'map';
		}
		else if (event.target.classList[0].indexOf('banks') >= 0)
		{
			window.location.hash = 'banks';
		}
		else
		{
			window.location.hash = '';
		}
	}
}