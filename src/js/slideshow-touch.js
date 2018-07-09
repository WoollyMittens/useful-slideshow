// extend the class
Slideshow.prototype.Touch = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;
	this.x = null;
	this.y = null;

	// METHODS

	this.start = function () {
		var parent = this.parent, config = this.config;
		var _this = this;
		return function (event) {
			// store the touch positions
			_this.x = event.touches[0].pageX;
			_this.y = event.touches[0].pageY;
			_this.sensitivity = parent.obj.offsetWidth * 0.6;
			// cancel the automatic slideshow
			parent.automatic.stop();
		};
	};

	this.move = function () {
		var parent = this.parent, config = this.config;
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
					if (xDistance < -1 * sensitivity && config.outlets.index < config.outlets.figures.length - 1) {
						// trigger the movement
						parent.figures.menu.next(config.outlets.nextSlide);
						// reset the positions
						_this.x = 0;
						_this.y = 0;
					} else if (xDistance > sensitivity && config.outlets.index > 1) {
						// trigger the movement
						parent.figures.menu.prev(config.outlets.prevSlide);
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
		var parent = this.parent, config = this.config;
		var _this = this;
		return function () {
			// clear the positions
			_this.x = null;
			_this.y = null;
			// restart the automatic slideshow
			if (config.hover && config.hover === 'pause') {
				parent.automatic.start();
			}
		};
	};
};
