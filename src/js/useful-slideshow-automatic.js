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
	useful.Slideshow_Automatic = function (parent) {
		this.root = parent;
		this.parent = parent;
		this.setup = function () {
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			var _this = this;
			// if a hover option exists
			if (cfg.hover && cfg.hover === 'pause') {
				// stop the slideshow on hover
				root.obj.onmouseover = function () {
					_this.stop();
				};
				// restart the slideshow after hover
				root.obj.onmouseout = function () {
					_this.start();
				};
			}
			// if an idle timer exists
			if (cfg.idle && cfg.idle >= 0) {
				// run the update at an interval
				this.start();
			}
		};
		this.start = function () {
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			// stop any previous timeout loop
			clearTimeout(cfg.idleTimeout);
			// start the timeout loop
			cfg.idleTimeout = setInterval(function () {
				// move to the next slide
				cfg.outlets.index = (cfg.outlets.index < cfg.outlets.figures.length - 1) ? cfg.outlets.index + 1 : 1;
				// redraw
				root.update();
			}, cfg.idle);
		};
		this.stop = function () {
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			// stop the timeout loop
			clearTimeout(cfg.idleTimeout);
		};
	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.Slideshow_Automatic;
	}

})();
