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
	// properties
	"use strict";
	this.root = parent;
	this.parent = parent;
	// build the thumbnail list
	this.setup = function () {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// create the navigation bar
		cfg.outlets.slideNav = document.createElement('nav');
		cfg.outlets.slideNav.className = 'navigation_' + cfg.navigation;
		cfg.outlets.slideDiv = document.createElement('div');
		cfg.outlets.slideUl = document.createElement('ul');
		// force the height of the nav if desired
		if (cfg.navigation !== 'thumbtacks') {
			if (cfg.divide !== '100%') {
				cfg.outlets.slideNav.style.height = (100 - parseInt(cfg.divide, 10) - parseInt(cfg.margin, 10)) + '%';
			} else {
				cfg.outlets.slideNav.style.visibility = 'hidden';
			}
		}
		if (cfg.margin) {
			cfg.pixelMargin = parseInt(root.obj.offsetWidth * parseInt(cfg.margin, 10) / 100, 10);
		}
		// for all thumbnails in the context
		cfg.outlets.thumbnails = [0];
		for (var a = 1, b = cfg.thumbnails.length; a < b; a += 1) {
			// create a new thumbnail
			var newLi = document.createElement('li');
			var newA = document.createElement('a');
			newA.className = (a === 1) ? cfg.navigation + '_active' : cfg.navigation + '_passive';
			var newImage = document.createElement('img');
			newImage.alt = '';
			newImage.src = cfg.thumbnails[a];
			newA.appendChild(newImage);
			newLi.appendChild(newA);
			// assign the event handler
			newA.addEventListener('click', this.onSetActive(newA), false);
			// insert the new elements
			cfg.outlets.slideUl.appendChild(newLi);
			// store the dom pointers to the images
			cfg.outlets.thumbnails[a] = newA;
		}
		// insert the navigation bar
		cfg.outlets.slideDiv.appendChild(cfg.outlets.slideUl);
		cfg.outlets.slideNav.appendChild(cfg.outlets.slideDiv);
		root.obj.appendChild(cfg.outlets.slideNav);
		// start the menu
		this.menu.setup();
	};
	// redraw/recentre the thumbnails according to the context
	this.update = function () {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// update the thumbnails menu
		this.menu.update();
		/// highlight the icons
		this.hightlightIcons();
		// it there's thumbnails
		if (cfg.navigation === 'thumbnails') {
			// centre the icons
			this.centreIcons();
			// centre the slider
			this.centreSlider();
		}
	};
	// highlight active icon
	this.hightlightIcons = function () {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// for all thumbnails
		for (var a = 1, b = cfg.thumbnails.length; a < b; a += 1) {
			// highlight the active slide
			cfg.outlets.thumbnails[a].className = (cfg.outlets.index === a) ? cfg.navigation + '_active' : cfg.navigation + '_passive';
		}
	};
	// centre the icons in containers
	this.centreIcons = function () {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		var imageObject, imageWidth, imageHeight, rowHeight;
		// measure the available space
		rowHeight = cfg.outlets.slideNav.offsetHeight;
		// for all thumbnails
		for (var a = 1, b = cfg.thumbnails.length; a < b; a += 1) {
			// centre the image in its surroundings
			cfg.outlets.thumbnails[a].style.width =  rowHeight + 'px';
			imageObject = cfg.outlets.thumbnails[a].getElementsByTagName('img')[0];
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
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// scroll the slider enough to center the active slide
		var activeThumbnail = cfg.outlets.thumbnails[cfg.outlets.index];
		var activePosition = activeThumbnail.offsetLeft;
		var activeWidth = activeThumbnail.offsetWidth;
		var scrollDistance = cfg.outlets.slideDiv.offsetWidth;
		var centeredPosition = -activePosition + scrollDistance / 2 - activeWidth / 2;
		centeredPosition = (centeredPosition > 0) ? 0 : centeredPosition;
		centeredPosition = (centeredPosition < cfg.scrollMax && cfg.scrollMax < 0) ? cfg.scrollMax : centeredPosition;
		// transition to the new position
		useful.transitions.byRules(
			cfg.outlets.slideUl,
			{'marginLeft' : centeredPosition + 'px'}
		);
	};
	// activate a corresponding figure
	this.onSetActive = function (element) {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		var _this = this;
		return function (event) {
			_this.setActive(element);
			// cancel the click
			event.preventDefault();
		};
	};
	this.setActive = function (element) {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// count which thumbnail this is
		for (var a = 1, b = cfg.outlets.thumbnails.length; a < b; a += 1) {
			if (cfg.outlets.thumbnails[a] === element) {
				// change the index to this slide
				cfg.outlets.index = a;
				// redraw all
				root.update();
			}
		}
	};
	// manages the thumbnail controls
	this.menu = new this.parent.ThumbnailsMenu(this);
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow.Thumbnails;
}
