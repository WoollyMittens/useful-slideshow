/*
	Source:
	van Creij, Maurice (2014). "useful.slideshow.js: A simple slideshow", version 20140923, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// invoke strict mode
	"use strict";

	// private functions
	useful.Slideshow_Thumbnails_Menu = function (parent) {
		this.root = parent.parent;
		this.parent = parent;
		// build the menu options
		this.setup = function () {
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			// create the thumbnail controls
			cfg.outlets.pageMenu = document.createElement('menu');
			cfg.outlets.pageMenu.className = 'scroller';
			cfg.outlets.nextPage = document.createElement('button');
			cfg.outlets.nextPage.className = 'next';
			cfg.outlets.nextPageIcon = document.createElement('span');
			cfg.outlets.nextPageIcon.innerHTML = '&gt';
			cfg.outlets.prevPage = document.createElement('button');
			cfg.outlets.prevPage.className = 'previous';
			cfg.outlets.prevPageIcon = document.createElement('span');
			cfg.outlets.prevPageIcon.innerHTML = '&lt';
			cfg.outlets.nextPage.appendChild(cfg.outlets.nextPageIcon);
			cfg.outlets.pageMenu.appendChild(cfg.outlets.nextPage);
			cfg.outlets.prevPage.appendChild(cfg.outlets.prevPageIcon);
			cfg.outlets.pageMenu.appendChild(cfg.outlets.prevPage);
			cfg.outlets.slideNav.appendChild(cfg.outlets.pageMenu);
			// apply clicks to the thumbnail controls
			cfg.outlets.nextPage.onclick = this.next(cfg.outlets.nextSlide);
			cfg.outlets.prevPage.onclick = this.prev(cfg.outlets.prevSlide);
		};
		// show or hide the previous and next buttons
		this.update = function () {
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			// calculate the current position
			cfg.scrollPosition = (cfg.outlets.slideUl.style.marginLeft) ? parseInt(cfg.outlets.slideUl.style.marginLeft, 10) : 0;
			cfg.scrollDistance = cfg.outlets.slideDiv.offsetWidth;
			// calculate the minimum position
			cfg.scrollMin = 0;
			// calculate the maximum position
			var lastThumbnail = cfg.outlets.thumbnails[cfg.outlets.thumbnails.length - 1];
			cfg.scrollStep = lastThumbnail.offsetWidth;
			cfg.scrollMax = -1 * (lastThumbnail.offsetLeft + lastThumbnail.offsetWidth) + cfg.scrollDistance;
			// show or hide the prev button
			cfg.outlets.prevPage.className = cfg.outlets.prevPage.className.replace(/ disabled/gi, '');
			cfg.outlets.prevPage.className += (cfg.scrollPosition >= cfg.scrollMin) ? ' disabled' : '';
			// show or hide the next button
			cfg.outlets.nextPage.className = cfg.outlets.nextPage.className.replace(/ disabled/gi, '');
			cfg.outlets.nextPage.className += (cfg.scrollPosition <= cfg.scrollMax && cfg.scrollMax < 0) ? ' disabled' : '';
		};
		// show the next page of thumbnails
		this.next = function (element) {
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			var _this = this;
			return function (event) {
				// get the event properties
				event = event || window.event;
				var target = event.target || event.srcElement;
				// if the button is not disabled
				if (!target.className.match(/disabled/)) {
					// scroll one page's width of thumbnails
					var newPosition = cfg.scrollPosition - cfg.scrollDistance + cfg.scrollStep;
					// limit the scroll distance
					if (newPosition < cfg.scrollMax) {
						newPosition = cfg.scrollMax;
					}
					// transition to the new position
					useful.transitions.byRules(cfg.outlets.slideUl, {'marginLeft' : newPosition + 'px'});
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
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			var _this = this;
			return function (event) {
				// get the event properties
				event = event || window.event;
				var target = event.target || event.srcElement;
				// if the button is not disabled
				if (!target.className.match(/disabled/)) {
					// scroll one page's width of thumbnails
					var newPosition = cfg.scrollPosition + cfg.scrollDistance - cfg.scrollStep;
					// limit the scroll distance
					if (newPosition > 0) {
						newPosition = 0;
					}
					// transition to the new position
					if (cfg.navigation === 'thumbnails') {
						useful.transitions.byRules(cfg.outlets.slideUl, {'marginLeft' : newPosition + 'px'});
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
		exports = module.exports = useful.Slideshow_Thumbnails_Menu;
	}

})();
