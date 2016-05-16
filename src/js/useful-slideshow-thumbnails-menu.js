/*
	Source:
	van Creij, Maurice (2014). "useful.slideshow.js: A simple slideshow", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the constructor if needed
var useful = useful || {};
useful.Slideshow = useful.Slideshow || function () {};

// extend the constructor
useful.Slideshow.prototype.ThumbnailsMenu = function (parent) {

	// PROPERTIES

	"use strict";
	this.parent = parent;
	this.config = parent.config;
	// build the menu options
	this.setup = function () {
		var parent = this.parent, config = this.parent.parent.config;
		// create the thumbnail controls
		config.outlets.pageMenu = document.createElement('menu');
		config.outlets.pageMenu.className = 'scroller';
		config.outlets.nextPage = document.createElement('button');
		config.outlets.nextPage.className = 'next';
		config.outlets.nextPageIcon = document.createElement('span');
		config.outlets.nextPageIcon.innerHTML = '&gt';
		config.outlets.prevPage = document.createElement('button');
		config.outlets.prevPage.className = 'previous';
		config.outlets.prevPageIcon = document.createElement('span');
		config.outlets.prevPageIcon.innerHTML = '&lt';
		config.outlets.nextPage.appendChild(config.outlets.nextPageIcon);
		config.outlets.pageMenu.appendChild(config.outlets.nextPage);
		config.outlets.prevPage.appendChild(config.outlets.prevPageIcon);
		config.outlets.pageMenu.appendChild(config.outlets.prevPage);
		config.outlets.slideNav.appendChild(config.outlets.pageMenu);
		// apply clicks to the thumbnail controls
		config.outlets.nextPage.onclick = this.next(config.outlets.nextSlide);
		config.outlets.prevPage.onclick = this.prev(config.outlets.prevSlide);
	};
	// show or hide the previous and next buttons
	this.update = function () {
		var parent = this.parent, config = this.parent.parent.config;
		// calculate the current position
		config.scrollPosition = (config.outlets.slideUl.style.marginLeft) ? parseInt(config.outlets.slideUl.style.marginLeft, 10) : 0;
		config.scrollDistance = config.outlets.slideDiv.offsetWidth;
		// calculate the minimum position
		config.scrollMin = 0;
		// calculate the maximum position
		var lastThumbnail = config.outlets.thumbnails[config.outlets.thumbnails.length - 1];
		config.scrollStep = lastThumbnail.offsetWidth;
		config.scrollMax = -1 * (lastThumbnail.offsetLeft + lastThumbnail.offsetWidth) + config.scrollDistance;
		// show or hide the prev button
		config.outlets.prevPage.className = config.outlets.prevPage.className.replace(/ disabled/gi, '');
		config.outlets.prevPage.className += (config.scrollPosition >= config.scrollMin) ? ' disabled' : '';
		// show or hide the next button
		config.outlets.nextPage.className = config.outlets.nextPage.className.replace(/ disabled/gi, '');
		config.outlets.nextPage.className += (config.scrollPosition <= config.scrollMax && config.scrollMax < 0) ? ' disabled' : '';
	};
	// show the next page of thumbnails
	this.next = function (element) {
		var parent = this.parent, config = this.parent.parent.config;
		var _this = this;
		return function (event) {
			// get the event properties
			event = event || window.event;
			var target = event.target || event.srcElement;
			// if the button is not disabled
			if (!target.className.match(/disabled/)) {
				// scroll one page's width of thumbnails
				var newPosition = config.scrollPosition - config.scrollDistance + config.scrollStep;
				// limit the scroll distance
				if (newPosition < config.scrollMax) {
					newPosition = config.scrollMax;
				}
				// transition to the new position
				useful.transitions.byRules(config.outlets.slideUl, {'marginLeft' : newPosition + 'px'});
				// redraw the menu buttons
				_this.update();
			}
			// cancel the click
			target.blur();
			event.preventDefault();
		};
	};
	// show the previous page of thumbnails
	this.prev = function (element) {
		var parent = this.parent, config = this.parent.parent.config;
		var _this = this;
		return function (event) {
			// get the event properties
			event = event || window.event;
			var target = event.target || event.srcElement;
			// if the button is not disabled
			if (!target.className.match(/disabled/)) {
				// scroll one page's width of thumbnails
				var newPosition = config.scrollPosition + config.scrollDistance - config.scrollStep;
				// limit the scroll distance
				if (newPosition > 0) {
					newPosition = 0;
				}
				// transition to the new position
				if (config.navigation === 'thumbnails') {
					useful.transitions.byRules(config.outlets.slideUl, {'marginLeft' : newPosition + 'px'});
				}
				// redraw the menu buttons
				_this.update();
			}
			// cancel the click
			target.blur();
			event.preventDefault();
		};
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow.ThumbnailsMenu;
}
