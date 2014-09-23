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
	useful.Slideshow_Figures_Menu = function (parent) {
		this.root = parent.parent;
		this.parent = parent;
		// build the menu options
		this.setup = function () {
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			// create the slide controls
			cfg.outlets.slideMenu = document.createElement('menu');
			cfg.outlets.slideMenu.className = 'pager';
			cfg.outlets.nextSlide = document.createElement('button');
			cfg.outlets.nextSlide.className = 'next';
			cfg.outlets.nextSlideIcon = document.createElement('span');
			cfg.outlets.nextSlideIcon.innerHTML = '&gt';
			cfg.outlets.prevSlide = document.createElement('button');
			cfg.outlets.prevSlide.className = 'previous';
			cfg.outlets.prevSlideIcon = document.createElement('span');
			cfg.outlets.prevSlideIcon.innerHTML = '&lt';
			cfg.outlets.nextSlide.appendChild(cfg.outlets.nextSlideIcon);
			cfg.outlets.slideMenu.appendChild(cfg.outlets.nextSlide);
			cfg.outlets.prevSlide.appendChild(cfg.outlets.prevSlideIcon);
			cfg.outlets.slideMenu.appendChild(cfg.outlets.prevSlide);
			root.obj.appendChild(cfg.outlets.slideMenu);
			// force the height of the menu if desired
			if (cfg.divide) {
				cfg.outlets.slideMenu.style.height = cfg.divide;
			}
			// apply clicks to the slide controls
			cfg.outlets.nextSlide.addEventListener('click', this.onNext(cfg.outlets.nextSlide), false);
			cfg.outlets.prevSlide.addEventListener('click', this.onPrev(cfg.outlets.prevSlide), false);
		};
		// show or hide the previous and next buttons
		this.update = function () {
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			// hide the previous button if the index is near the left terminus
			if (cfg.outlets.prevSlide) {
				cfg.outlets.prevSlide.className = cfg.outlets.prevSlide.className.replace(/ disabled/gi, '');
				cfg.outlets.prevSlide.className += (cfg.outlets.index > 1) ? '' : ' disabled';
			}
			// hide the next button if the index is new the right terminus
			if (cfg.outlets.nextSlide) {
				cfg.outlets.nextSlide.className = cfg.outlets.nextSlide.className.replace(/ disabled/gi, '');
				cfg.outlets.nextSlide.className += (cfg.outlets.index < cfg.outlets.figures.length - 1) ? '' : ' disabled';
			}
		};
		// activate the next slide
		this.onNext = function (element) {
			var _this = this;
			return function (event) {
				_this.next(element);
				event.preventDefault();
			};
		};
		this.next = function (element) {
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			// if the element is not disabled
			if (!element.className.match(/disabled/)) {
				// increase the index
				cfg.outlets.index = (cfg.outlets.index < cfg.outlets.figures.length - 1) ? cfg.outlets.index + 1 : 1;
				// redraw
				root.update();
			}
			// cancel the click
			element.blur();
		};
		// activate the previous slide
		this.onPrev = function (element) {
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			var _this = this;
			return function (event) {
				_this.prev(element);
				event.preventDefault();
			};
		};
		this.prev = function (element) {
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			// if the element is not disabled
			if (!element.className.match(/disabled/)) {
				// increase the index
				cfg.outlets.index = (cfg.outlets.index > 1) ? cfg.outlets.index - 1 : cfg.outlets.figures.length - 1;
				// redraw
				root.update();
			}
			// cancel the click
			element.blur();
		};
	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.Slideshow_Figures_Menu;
	}

})();
