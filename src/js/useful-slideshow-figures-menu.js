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
useful.Slideshow.prototype.FiguresMenu = function (parent) {

	// PROPERTIES

	"use strict";
	this.parent = parent;
	this.config = parent.config;
	// build the menu options
	this.setup = function () {
		var parent = this.parent, config = this.config;
		// create the slide controls
		config.outlets.slideMenu = document.createElement('menu');
		config.outlets.slideMenu.className = 'pager';
		config.outlets.nextSlide = document.createElement('button');
		config.outlets.nextSlide.className = 'next';
		config.outlets.nextSlideIcon = document.createElement('span');
		config.outlets.nextSlideIcon.innerHTML = '&gt';
		config.outlets.prevSlide = document.createElement('button');
		config.outlets.prevSlide.className = 'previous';
		config.outlets.prevSlideIcon = document.createElement('span');
		config.outlets.prevSlideIcon.innerHTML = '&lt';
		config.outlets.nextSlide.appendChild(config.outlets.nextSlideIcon);
		config.outlets.slideMenu.appendChild(config.outlets.nextSlide);
		config.outlets.prevSlide.appendChild(config.outlets.prevSlideIcon);
		config.outlets.slideMenu.appendChild(config.outlets.prevSlide);
		parent.parent.element.appendChild(config.outlets.slideMenu);
		// force the height of the menu if desired
		if (config.divide) {
			config.outlets.slideMenu.style.height = config.divide;
		}
		// apply clicks to the slide controls
		config.outlets.nextSlide.addEventListener('click', this.onNext(config.outlets.nextSlide), false);
		config.outlets.prevSlide.addEventListener('click', this.onPrev(config.outlets.prevSlide), false);
	};
	// show or hide the previous and next buttons
	this.update = function () {
		var parent = this.parent, config = this.config;
		// hide the previous button if the index is near the left terminus
		if (config.outlets.prevSlide) {
			config.outlets.prevSlide.className = config.outlets.prevSlide.className.replace(/ disabled/gi, '');
			config.outlets.prevSlide.className += (config.outlets.index > 0) ? '' : ' disabled';
		}
		// hide the next button if the index is new the right terminus
		if (config.outlets.nextSlide) {
			config.outlets.nextSlide.className = config.outlets.nextSlide.className.replace(/ disabled/gi, '');
			config.outlets.nextSlide.className += (config.outlets.index < config.outlets.figures.length - 1) ? '' : ' disabled';
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
		var parent = this.parent, config = this.config;
		// if the element is not disabled
		if (!element.className.match(/disabled/)) {
			// increase the index
			config.outlets.index = (config.outlets.index < config.outlets.figures.length - 1) ? config.outlets.index + 1 : 0;
			// redraw
			parent.parent.update();
		}
		// cancel the click
		element.blur();
	};
	// activate the previous slide
	this.onPrev = function (element) {
		var parent = this.parent, config = this.config;
		var _this = this;
		return function (event) {
			_this.prev(element);
			event.preventDefault();
		};
	};

	this.prev = function (element) {
		var parent = this.parent, config = this.config;
		// if the element is not disabled
		if (!element.className.match(/disabled/)) {
			// increase the index
			config.outlets.index = (config.outlets.index > 0) ? config.outlets.index - 1 : config.outlets.figures.length - 1;
			// redraw
			parent.parent.update();
		}
		// cancel the click
		element.blur();
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow.FiguresMenu;
}
