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
useful.Slideshow.prototype.Main = function (config, context) {

	// PROPERTIES

	"use strict";
	this.config = config;
	this.context = context;
	this.element = config.element;

	// METHODS

	this.init = function () {
		var _this = this;
		// use the fallback to gather the asset urls
		this.gather();
		// retry delay
		this.config.retry = null;
		// hide the component
		this.element.style.visibility = 'hidden';
		setTimeout(function () {
			// start the components
			_this.setup();
			setTimeout(function () {
				// start the redraw
				_this.update();
				// reveal the component
				_this.element.style.visibility = 'visible';
			}, 900);
		}, 100);
		// return the object
		return this;
	};
	// gather all the elements
	this.gather = function () {
		if (!this.config.outlets) {
			// create the element to hold all the interface pointers
			this.config.outlets = {};
			// get the assets from the fallback html
			this.config.thumbnails = [0];
			this.config.figures = [0];
			this.config.titles = [0];
			this.config.descriptions = [0];
			this.config.longdescs = [0];
			this.config.hyperlinks = [0];
			this.config.targets = [0];
			var link, images = this.element.getElementsByTagName('img');
			for (var a = 0; a < images.length; a += 1) {
				// create a list of thumbnail urls and full urls
				this.config.thumbnails[a] = images[a].src;
				this.config.titles[a] = images[a].getAttribute('title');
				this.config.descriptions[a] = images[a].getAttribute('alt');
				this.config.longdescs[a] = images[a].getAttribute('longdesc');
				this.config.figures[a] = (images[a].getAttribute('srcset')) ? images[a].getAttribute('srcset').split(' ')[0] : images[a].getAttribute('src');
				this.config.hyperlinks[a] = null;
				this.config.targets[a] = null;
				// if there is a link around the image
				link = images[a].parentNode;
				if (/a/i.test(link.nodeName)) {
					// if the link is to a larger version of the image
					if (/.gif|.jpg|.jpeg|.png|.svg/.test(link.getAttribute('href'))) {
						// update the figure
						this.config.figures[a] = link.getAttribute('href');
					// otherwise assume it is a link to a web page
					} else {
						// store the properties of the link
						this.config.hyperlinks[a] = link.getAttribute('href');
						this.config.targets[a] = link.getAttribute('target') || '_self';
					}
				}
			}
			// pick the initial active slide
			this.config.outlets.index = 1;
		}
	};
	// build the slideshow container
	this.setup = function () {
		// set the main captions class
		this.element.className += ' captions_' + this.config.captions;
		// set the main scaling class
		this.element.className += ' scaling_' + this.config.scaling;
		// clear the parent element
		this.element.innerHTML = '';
		// apply optional dimensions
		if (this.config.width) {
			this.element.style.width = this.config.width + this.config.widthUnit;
		}
		if (this.config.height) {
			this.element.style.height = this.config.height + this.config.heightUnit;
		}
		// apply the custom styles
		this.styling();
		// add the mousewheel events
		this.element.addEventListener('mousewheel', this.wheel(), false);
		this.element.addEventListener('DOMMouseScroll', this.wheel(), false);
		// add the touch events
		this.element.addEventListener('touchstart', this.touch.start(), false);
		this.element.addEventListener('touchmove', this.touch.move(), false);
		this.element.addEventListener('touchend', this.touch.end(), false);
		// start the sub components
		this.figures.setup();
		this.thumbnails.setup();
		this.automatic.setup();
	};
	// implement customised styles
	this.styling = function () {
		// create a custom stylesheet
		var style = document.createElement("style");
		if (/webkit/gi.test(navigator.UserAgent)) { style.appendChild(document.createTextNode("")); }
		document.body.appendChild(style);
		var sheet = style.sheet || style.styleSheet;
		// add the custom styles
		if (sheet.insertRule) {
			sheet.insertRule(".slideshow button {background-color : " + this.config.colorPassive + " !important;}", 0);
			sheet.insertRule(".slideshow button:hover {background-color : " + this.config.colorHover + " !important;}", 0);
			sheet.insertRule(".slideshow button.disabled {background-color : " + this.config.colorDisabled + " !important;}", 0);
			sheet.insertRule(".slideshow .thumbnails_active {background-color : " + this.config.colorPassive + " !important;}", 0);
			sheet.insertRule(".slideshow .thumbtacks_active {background-color : " + this.config.colorPassive + " !important;}", 0);
		} else {
			sheet.addRule(".slideshow button", "background-color : " + this.config.colorPassive + " !important;", 0);
			sheet.addRule(".slideshow button:hover", "background-color : " + this.config.colorHover + " !important;", 0);
			sheet.addRule(".slideshow button.disabled", "background-color : " + this.config.colorDisabled + " !important;", 0);
			sheet.addRule(".slideshow .thumbnails_active", "background-color : " + this.config.colorPassive + " !important;", 0);
			sheet.addRule(".slideshow .thumbtacks_active", "background-color : " + this.config.colorPassive + " !important;", 0);
		}
	};
	// updates the whole app
	this.update = function () {
		var _this = this;
		// if the slideshow has been disabled
		if (this.element.offsetHeight === 0) {
			// stop updating and try again later
			clearTimeout(this.config.retry);
			this.config.retry = setTimeout(function () {
				_this.update();
			}, 1000);
		// else
		} else {
			// update the figures
			this.figures.update();
			// update the slideshow
			this.thumbnails.update();
		}
	};
	// public API
	this.focus = function (index) {
		// set the active slide
		this.config.outlets.index = index;
		// redraw
		this.update();
	};

	this.pause = function () {
		// stop the automatic slideshow
		this.automatic.stop();
	};

	this.play = function () {
		// start the automatic slideshow
		this.automatic.start();
	};

	this.previous = function () {
		// show the previous slide
		this.figures.menu.prev();
	};

	this.next = function () {
		// show the next slide
		this.figures.menu.next();
	};
	// mouse wheel controls
	this.wheel = function () {
		var _this = this;
		return function (event) {
			// get the reading from the mouse wheel
			var distance = (window.event) ? window.event.wheelDelta / 120 : -event.detail / 3;
			// do not loop around
			if (distance < 0 && _this.config.outlets.index > 1) {
				// trigger a step
				_this.figures.menu.prev(_this.config.outlets.prevSlide);
			} else if (distance > 0 && _this.config.outlets.index < _this.config.outlets.figures.length - 1) {
				// trigger a step
				_this.figures.menu.next(_this.config.outlets.nextSlide);
			}
			// cancel the scrolling
			event.preventDefault();
		};
	};
	// touch screen controls
	this.touch = new this.context.Touch(this);
	// automatic idle slideshow
	this.automatic = new this.context.Automatic(this);
	// manages the figures
	this.figures = new this.context.Figures(this);
	// manages the thumbnails
	this.thumbnails = new this.context.Thumbnails(this);
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow.Main;
}
