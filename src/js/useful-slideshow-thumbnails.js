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
useful.Slideshow.prototype.Thumbnails = function (parent) {

	// PROPERTIES
	
	"use strict";
	this.parent = parent;
	this.config = parent.config;
	this.context = parent.context;
	// build the thumbnail list
	this.setup = function () {
		var parent = this.parent, config = this.config;
		// create the navigation bar
		config.outlets.slideNav = document.createElement('nav');
		config.outlets.slideNav.className = 'navigation_' + config.navigation;
		config.outlets.slideDiv = document.createElement('div');
		config.outlets.slideUl = document.createElement('ul');
		// force the height of the nav if desired
		if (config.navigation !== 'thumbtacks') {
			if (config.divide !== '100%') {
				config.outlets.slideNav.style.height = (100 - parseInt(config.divide, 10) - parseInt(config.margin, 10)) + '%';
			} else {
				config.outlets.slideNav.style.visibility = 'hidden';
			}
		}
		if (config.margin) {
			config.pixelMargin = parseInt(parent.element.offsetWidth * parseInt(config.margin, 10) / 100, 10);
		}
		// for all thumbnails in the context
		config.outlets.thumbnails = [0];
		for (var a = 1, b = config.thumbnails.length; a < b; a += 1) {
			// create a new thumbnail
			var newLi = document.createElement('li');
			var newA = document.createElement('a');
			newA.className = (a === 1) ? config.navigation + '_active' : config.navigation + '_passive';
			var newImage = document.createElement('img');
			newImage.alt = '';
			newImage.src = config.thumbnails[a];
			newA.appendChild(newImage);
			newLi.appendChild(newA);
			// assign the event handler
			newA.addEventListener('click', this.onSetActive(newA), false);
			// insert the new elements
			config.outlets.slideUl.appendChild(newLi);
			// store the dom pointers to the images
			config.outlets.thumbnails[a] = newA;
		}
		// insert the navigation bar
		config.outlets.slideDiv.appendChild(config.outlets.slideUl);
		config.outlets.slideNav.appendChild(config.outlets.slideDiv);
		parent.element.appendChild(config.outlets.slideNav);
		// start the menu
		this.menu.setup();
	};
	// redraw/recentre the thumbnails according to the context
	this.update = function () {
		var parent = this.parent, config = this.config;
		// update the thumbnails menu
		this.menu.update();
		/// highlight the icons
		this.hightlightIcons();
		// it there's thumbnails
		if (config.navigation === 'thumbnails') {
			// centre the icons
			this.centreIcons();
			// centre the slider
			this.centreSlider();
		}
	};
	// highlight active icon
	this.hightlightIcons = function () {
		var parent = this.parent, config = this.config;
		// for all thumbnails
		for (var a = 1, b = config.thumbnails.length; a < b; a += 1) {
			// highlight the active slide
			config.outlets.thumbnails[a].className = (config.outlets.index === a) ? config.navigation + '_active' : config.navigation + '_passive';
		}
	};
	// centre the icons in containers
	this.centreIcons = function () {
		var parent = this.parent, config = this.config;
		var imageObject, imageWidth, imageHeight, rowHeight;
		// measure the available space
		rowHeight = config.outlets.slideNav.offsetHeight;
		// for all thumbnails
		for (var a = 1, b = config.thumbnails.length; a < b; a += 1) {
			// centre the image in its surroundings
			config.outlets.thumbnails[a].style.width =  rowHeight + 'px';
			imageObject = config.outlets.thumbnails[a].getElementsByTagName('img')[0];
			imageWidth = imageObject.offsetWidth;
			imageHeight = imageObject.offsetHeight;
			if (imageWidth > imageHeight) {
				imageWidth = imageWidth / imageHeight * rowHeight;
				imageHeight = rowHeight;
			} else {
				imageHeight = imageHeight /  imageWidth * rowHeight;
				imageWidth = rowHeight;
			}
			imageObject.style.width = Math.round(imageWidth) + 'px';
			imageObject.style.height = Math.round(imageHeight) + 'px';
			imageObject.style.left = '50%';
			imageObject.style.top = '50%';
			imageObject.style.marginLeft = Math.round(-imageWidth / 2) + 'px';
			imageObject.style.marginTop = Math.round(-imageHeight / 2) + 'px';
		}
	};
	// centre the container around the active one
	this.centreSlider = function () {
		var parent = this.parent, config = this.config;
		// scroll the slider enough to center the active slide
		var activeThumbnail = config.outlets.thumbnails[config.outlets.index];
		var activePosition = activeThumbnail.offsetLeft;
		var activeWidth = activeThumbnail.offsetWidth;
		var scrollDistance = config.outlets.slideDiv.offsetWidth;
		var centeredPosition = -activePosition + scrollDistance / 2 - activeWidth / 2;
		centeredPosition = (centeredPosition > 0) ? 0 : centeredPosition;
		centeredPosition = (centeredPosition < config.scrollMax && config.scrollMax < 0) ? config.scrollMax : centeredPosition;
		// transition to the new position
		useful.transitions.byRules(
			config.outlets.slideUl,
			{'marginLeft' : centeredPosition + 'px'}
		);
	};
	// activate a corresponding figure
	this.onSetActive = function (element) {
		var parent = this.parent, config = this.config;
		var _this = this;
		return function (event) {
			_this.setActive(element);
			// cancel the click
			event.preventDefault();
		};
	};
	
	this.setActive = function (element) {
		var parent = this.parent, config = this.config;
		// count which thumbnail this is
		for (var a = 1, b = config.outlets.thumbnails.length; a < b; a += 1) {
			if (config.outlets.thumbnails[a] === element) {
				// change the index to this slide
				config.outlets.index = a;
				// redraw all
				parent.update();
			}
		}
	};
	// manages the thumbnail controls
	this.menu = new this.context.ThumbnailsMenu(this);
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow.Thumbnails;
}
