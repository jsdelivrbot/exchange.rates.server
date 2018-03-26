export default class Utils
{
	constructor()
	{
		this.checkRotate();
		window.addEventListener('orientationchange', this.checkRotate.bind(this));
	}

	/**
	 * Check if rotate is portrait or landscape
	 */
	checkRotate()
	{
		let w = window.innerWidth;
		let h = window.innerHeight;
		let bgSize = w;

		w < h ? this.updateStyles(w, h, bgSize) : this.updateStyles(h, w, bgSize);
	}

	/**
	 * @param width - screen width
	 * @param heigth - screen heigth
	 * @param bgSize - the size of background image should equal to screen width
	 */
	updateStyles(width, heigth, bgSize)
	{
		let body = document.querySelector('body');
		let header = document.querySelector('header');

		body.style.width = width + 'px';
		body.style.height = heigth + 'px';

		body.style.backgroundSize = bgSize + 'px';
		header.style.backgroundSize = bgSize + 'px';
	}
}


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
