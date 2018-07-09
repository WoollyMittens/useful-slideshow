// extend the class
Slideshow.prototype.Automatic = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

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
			config.outlets.index = (config.outlets.index < config.outlets.figures.length - 1) ? config.outlets.index + 1 : 0;
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
