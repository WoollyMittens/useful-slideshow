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
useful.Slideshow.prototype.Figures = function (parent) {
	// properties
	"use strict";
	this.root = parent;
	this.parent = parent;
	// build the figures
	this.setup = function () {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// for all figures in the context
		cfg.outlets.figures = [0];
		for (var a = 1; a < cfg.figures.length; a += 1) {
			// create a new slide
			var newFigure = document.createElement('figure');
			newFigure.className = (a === 1) ? ' ' + cfg.transition + '_current' : ' ' + cfg.transition + '_next';
			var newImage = document.createElement('img');
			newImage.src = cfg.thumbnails[a];	// * start out with the thumbnails instead of the full images
			newImage.setAttribute('alt', '');
			newFigure.appendChild(newImage);
			// set the event handlers
			this.onImageLoad(newImage);
			this.onImageClick(a, newImage);
			// create the caption if there is content for it
			var newCaptionText = '';
			newCaptionText += (cfg.titles && cfg.titles[a]) ? '<strong>' + cfg.titles[a] + '</strong> ' : '';
			newCaptionText += (cfg.descriptions && cfg.descriptions[a]) ? cfg.descriptions[a] : '';
			if (newCaptionText !== '') {
				var newCaption = document.createElement('figcaption');
				newCaption.innerHTML = newCaptionText;
				newFigure.appendChild(newCaption);
			}
			// force the height of the slide if desired
			newFigure.style.height = (cfg.navigation === 'thumbtacks') ? '100%' : cfg.divide;
			// implement the transition speed
			if (cfg.speed) {
				newFigure.style.msTransitionDuration = cfg.speed / 1000 + 's';
				newFigure.style.OTransitionDuration = cfg.speed / 1000 + 's';
				newFigure.style.WebkitTransitionDuration = cfg.speed / 1000 + 's';
				newFigure.style.MozTransitionDuration = cfg.speed / 1000 + 's';
				newFigure.style.transitionDuration = cfg.speed / 1000 + 's';
			}
			// implement the transition timing
			if (cfg.ease) {
				newFigure.style.msTransitionTimingFunction = cfg.ease;
				newFigure.style.OTransitionTimingFunction = cfg.ease;
				newFigure.style.WebkitTransitionTimingFunction = cfg.ease;
				newFigure.style.MozTransitionTimingFunction = cfg.ease;
				newFigure.style.transitionTimingFunction = cfg.ease;
			}
			// insert the new elements
			root.obj.appendChild(newFigure);
			// store the dom pointers to the images
			cfg.outlets.figures[a] = newFigure;
		}
		// start the menu
		this.menu.setup();
	};
	// handlers for the interaction events
	this.onImageLoad = function (image) {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		var _this = this;
		image.onload = function () {
			_this.update();
		};
	};
	this.onImageClick = function (index, image) {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// if there was a longdesc
		if (cfg.longdescs[index]) {
			// change the slide into a link
			image.style.cursor = 'pointer';
			image.onclick = function () {
				document.location.href = cfg.longdescs[index];
			};
		}
	};
	// show the correct slide
	this.update = function () {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// for all the figures
		for (var a = 1, b = cfg.outlets.figures.length; a < b; a += 1) {
			// get the target figure
			var targetFigure = cfg.outlets.figures[a];
			var targetImage = targetFigure.getElementsByTagName('img')[0];
			var oldClassName = cfg.transition + '_' + targetFigure.className.split('_')[1];
			// if the ratio hasn't been determined yet
			if (!targetImage.className.match(/ratio/gi)) {
				// determine the aspect ratio of the image
				targetImage.className = (targetImage.offsetWidth > targetImage.offsetHeight) ? 'ratio_landscape' : 'ratio_portrait';
			}
			// if the image is narrower than the figure and the scaling is set to fill or the image is wider than the figure and the scaling is set to fit
			if (
				(cfg.scaling === 'fill' && (targetImage.offsetWidth < targetFigure.offsetWidth || targetImage.offsetHeight < targetFigure.offsetHeight)) ||
				(cfg.scaling === 'fit' && (targetImage.offsetWidth > targetFigure.offsetWidth || targetImage.offsetHeight > targetFigure.offsetHeight))
			) {
				// flip the aspect ratio
				if (targetImage.className.match(/ratio/gi)) {
					targetImage.className = (targetImage.className === 'ratio_landscape') ? 'ratio_portrait' : 'ratio_landscape';
				}
			}
			// if the figure is before the index
			var newClassName;
			if (a < cfg.outlets.index) {
				// change the class name according to its position
				newClassName = cfg.transition + '_previous';
			// the figure is after the index
			} else if (a > cfg.outlets.index) {
				// change the class name according to its position
				newClassName = cfg.transition + '_next';
			// else if the figure is the index
			} else {
				// change the class name according to its position
				newClassName = cfg.transition + '_current';
			}
			// if the slide is near the active one
			if (Math.abs(a - cfg.outlets.index) < cfg.preload) {
				// if the slide is not using the full figure url
				if (targetImage.src !== cfg.figures[a]) {
					// change it's thumbnail url to the figure url
					targetImage.src = cfg.figures[a];
				}
			}
			// vertically center the slide
			targetImage.style.marginTop = Math.round(targetImage.offsetHeight / -2) + 'px';
			targetImage.style.marginLeft = Math.round(targetImage.offsetWidth / -2) + 'px';
			// perform the transition
			useful.transitions.byClass(targetFigure, oldClassName, newClassName);
		}
		// update the menu as well
		this.menu.update();
	};
	// manages the slide controls
	this.menu = new this.parent.FiguresMenu(this);
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow.Figures;
}
