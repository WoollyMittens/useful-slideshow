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
useful.Slideshow.prototype.init = function (config) {
	// properties
	"use strict";
	// methods
	this.only = function (config) {
		// start an instance of the script
		return new this.Main(config, this).init();
	};
	this.each = function (config) {
		var _config, _context = this, instances = [];
		// for all element
		for (var a = 0, b = config.elements.length; a < b; a += 1) {
			// clone the configuration
			_config = Object.create(config);
			// insert the current element
			_config.element = config.elements[a];
			// delete the list of elements from the clone
			delete _config.elements;
			delete _config.constructor;
			// start a new instance of the object
			instances[a] = new config.constructor(_config, _context).init();
		}
		// return the instances
		return instances;
	};
	// return a single or multiple instances of the script
	return (config.elements) ? this.each(config) : this.only(config);
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow;
}
