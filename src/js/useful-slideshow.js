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
	useful.Slideshow = function (obj, cfg) {
		this.obj = obj;
		this.cfg = cfg;
		this.start = function () {
			var _this = this;
			// use the fallback to gather the asset urls
			if (!this.cfg.outlets) {
				// create the object to hold all the interface pointers
				this.cfg.outlets = {};
				// get the assets from the fallback html
				this.cfg.thumbnails = [0];
				this.cfg.figures = [0];
				this.cfg.titles = [0];
				this.cfg.descriptions = [0];
				this.cfg.longdescs = [0];
				var allLinks = this.obj.getElementsByTagName('a');
				var allImages = this.obj.getElementsByTagName('img');
				this.cfg.hasLinks = (allLinks.length === allImages.length);
				for (var a = 0; a < allImages.length; a += 1) {
					// create a list of thumbnail urls and full urls
					this.cfg.thumbnails.push(allImages[a].src);
					this.cfg.titles.push(allImages[a].getAttribute('title'));
					this.cfg.descriptions.push(allImages[a].getAttribute('alt'));
					this.cfg.longdescs.push(allImages[a].getAttribute('longdesc'));
					this.cfg.figures[this.cfg.figures.length] = (this.cfg.hasLinks) ? allLinks[a].href : allImages[a].src;
				}
				// pick the initial active slide
				this.cfg.outlets.index = 1;
			}
			// retry delay
			this.cfg.retry = null;
			// hide the component
			this.obj.style.visibility = 'hidden';
			setTimeout(function () {
				// start the components
				_this.setup();
				setTimeout(function () {
					// start the redraw
					_this.update();
					// reveal the component
					_this.obj.style.visibility = 'visible';
				}, 900);
			}, 100);
			// disable the start function so it can't be started twice
			this.start = function () {};
		};
		// build the slideshow container
		this.setup = function () {
			// set the main captions class
			this.obj.className += ' captions_' + this.cfg.captions;
			// set the main scaling class
			this.obj.className += ' scaling_' + this.cfg.scaling;
			// clear the parent element
			this.obj.innerHTML = '';
			// apply optional dimensions
			if (this.cfg.width) {
				this.obj.style.width = this.cfg.width + this.cfg.widthUnit;
			}
			if (this.cfg.height) {
				this.obj.style.height = this.cfg.height + this.cfg.heightUnit;
			}
			// apply the custom styles
			this.styling();
			// add the mousewheel events
			this.obj.addEventListener('mousewheel', this.wheel(), false);
			this.obj.addEventListener('DOMMouseScroll', this.wheel(), false);
			// add the touch events
			this.obj.addEventListener('touchstart', this.touch.start(), false);
			this.obj.addEventListener('touchmove', this.touch.move(), false);
			this.obj.addEventListener('touchend', this.touch.end(), false);
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
				sheet.insertRule(".slideshow button {background-color : " + this.cfg.colorPassive + " !important;}", 0);
				sheet.insertRule(".slideshow button:hover {background-color : " + this.cfg.colorHover + " !important;}", 0);
				sheet.insertRule(".slideshow button.disabled {background-color : " + this.cfg.colorDisabled + " !important;}", 0);
				sheet.insertRule(".slideshow .thumbnails_active {background-color : " + this.cfg.colorPassive + " !important;}", 0);
				sheet.insertRule(".slideshow .thumbtacks_active {background-color : " + this.cfg.colorPassive + " !important;}", 0);
			} else {
				sheet.addRule(".slideshow button", "background-color : " + this.cfg.colorPassive + " !important;", 0);
				sheet.addRule(".slideshow button:hover", "background-color : " + this.cfg.colorHover + " !important;", 0);
				sheet.addRule(".slideshow button.disabled", "background-color : " + this.cfg.colorDisabled + " !important;", 0);
				sheet.addRule(".slideshow .thumbnails_active", "background-color : " + this.cfg.colorPassive + " !important;", 0);
				sheet.addRule(".slideshow .thumbtacks_active", "background-color : " + this.cfg.colorPassive + " !important;", 0);
			}
		};
		// updates the whole app
		this.update = function () {
			var _this = this;
			// if the slideshow has been disabled
			if (this.obj.offsetHeight === 0) {
				// stop updating and try again later
				clearTimeout(this.cfg.retry);
				this.cfg.retry = setTimeout(function () {
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
			this.cfg.outlets.index = index;
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
				if (distance < 0 && _this.cfg.outlets.index > 1) {
					// trigger a step
					_this.figures.menu.prev(_this.cfg.outlets.prevSlide);
				} else if (distance > 0 && _this.cfg.outlets.index < _this.cfg.outlets.figures.length - 1) {
					// trigger a step
					_this.figures.menu.next(_this.cfg.outlets.nextSlide);
				}
				// cancel the scrolling
				event.preventDefault();
			};
		};
		// touch screen controls
		this.touch = new useful.Slideshow_Touch(this);
		// automatic idle slideshow
		this.automatic = new useful.Slideshow_Automatic(this);
		// manages the figures
		this.figures = new useful.Slideshow_Figures(this);
		// manages the thumbnails
		this.thumbnails = new useful.Slideshow_Thumbnails(this);
		// go
		this.start();
	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.Slideshow;
	}

})();
