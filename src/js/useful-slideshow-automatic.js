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
useful.Slideshow.prototype.Automatic = function (parent) {
	// properties
	"use strict";
	this.parent = parent;
	this.config = parent.config;
	// methods
	this.setup = function () {
		var parent = this.parent, config = this.config;
		var _this = this;
		// if a hover option exists
		if (config.hover && config.hover === 'pause') {
			// stop the slideshow on hover
			parent.element.onmouseover = function () {
				_this.stop();
			};
			// restart the slideshow after hover
			parent.element.onmouseout = function () {
				_this.start();
			};
		}
		// if an idle timer exists
		if (config.idle && config.idle >= 0) {
			// run the update at an interval
			this.start();
		}
	};
	this.start = function () {
		var parent = this.parent, config = this.config;
		// stop any previous timeout loop
		clearTimeout(config.idleTimeout);
		// start the timeout loop
		config.idleTimeout = setInterval(function () {
			// move to the next slide
			config.outlets.index = (config.outlets.index < config.outlets.figures.length - 1) ? config.outlets.index + 1 : 1;
			// redraw
			parent.update();
		}, config.idle);
	};
	this.stop = function () {
		var parent = this.parent, config = this.config;
		// stop the timeout loop
		clearTimeout(config.idleTimeout);
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow.Automatic;
}
