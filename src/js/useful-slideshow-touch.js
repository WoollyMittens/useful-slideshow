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
	useful.Slideshow_Touch = function (parent) {
		this.root = parent;
		this.parent = parent;
		// touch screen controls
		this.x = null;
		this.y = null;
		this.start = function () {
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			var _this = this;
			return function (event) {
				// store the touch positions
				_this.x = event.touches[0].pageX;
				_this.y = event.touches[0].pageY;
				_this.sensitivity = root.obj.offsetWidth * 0.6;
				// cancel the automatic slideshow
				root.automatic.stop();
			};
		};
		this.move = function () {
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			var _this = this;
			return function (event) {
				// if there is a touch in progress
				if (_this.x) {
					// measure the distance
					var xDistance = event.touches[0].pageX - _this.x;
					var yDistance = event.touches[0].pageY - _this.y;
					var sensitivity = _this.sensitivity;
					// if there is no vertical gesture
					if (Math.abs(yDistance) < sensitivity) {
						// if the horizontal gesture distance is over a certain amount
						if (xDistance < -1 * sensitivity && cfg.outlets.index < cfg.outlets.figures.length - 1) {
							// trigger the movement
							root.figures.menu.next(cfg.outlets.nextSlide);
							// reset the positions
							_this.x = 0;
							_this.y = 0;
						} else if (xDistance > sensitivity && cfg.outlets.index > 1) {
							// trigger the movement
							root.figures.menu.prev(cfg.outlets.prevSlide);
							// reset the positions
							_this.x = 0;
							_this.y = 0;
						}
						// cancel the default
						event.preventDefault();
					}
				}
			};
		};
		this.end = function () {
			var parent = this.parent, root = this.root, cfg = this.root.cfg;
			var _this = this;
			return function () {
				// clear the positions
				_this.x = null;
				_this.y = null;
				// restart the automatic slideshow
				if (cfg.hover && cfg.hover === 'pause') {
					root.automatic.start();
				}
			};
		};
	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.Slideshow_Touch;
	}

})();
