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

	// PROPERTIES

	"use strict";
	this.parent = parent;
	this.config = parent.config;
	this.context = parent.context;
	// build the figures
	this.setup = function () {
		var parent = this.parent, config = this.config;
		var newFigure, newLink, newImage, newCaptionText, newCaption, attachment;
		// for all figures in the context
		config.outlets.figures = [0];
		for (var a = 1; a < config.figures.length; a += 1) {
			// create a new slide
			newFigure = document.createElement('figure');
			newFigure.className = (a === 1) ? ' ' + config.transition + '_current' : ' ' + config.transition + '_next';
			attachment = newFigure;
			// add the link around the slide
			if (config.hyperlinks[a]) {
				newLink = document.createElement('a');
				newLink.setAttribute('href', config.hyperlinks[a]);
				newLink.setAttribute('target', config.targets[a] || '_self');
				newFigure.appendChild(newLink);
				attachment = newLink;
			}
			// add the image to the slide
			newImage = document.createElement('img');
			newImage.src = config.thumbnails[a];	// * start out with the thumbnails instead of the full images
			newImage.setAttribute('alt', '');
			attachment.appendChild(newImage);
			// set the event handlers
			this.onImageLoad(newImage);
			this.onImageClick(a, newImage);
			// create the caption if there is content for it
			newCaptionText = '';
			newCaptionText += (config.titles && config.titles[a]) ? '<strong>' + config.titles[a] + '</strong> ' : '';
			newCaptionText += (config.descriptions && config.descriptions[a]) ? config.descriptions[a] : '';
			if (newCaptionText !== '') {
				newCaption = document.createElement('figcaption');
				newCaption.innerHTML = newCaptionText;
				newFigure.appendChild(newCaption);
			}
			// force the height of the slide if desired
			newFigure.style.height = (config.navigation === 'thumbtacks') ? '100%' : config.divide;
			// implement the transition speed
			if (config.speed) {
				newFigure.style.msTransitionDuration = config.speed / 1000 + 's';
				newFigure.style.OTransitionDuration = config.speed / 1000 + 's';
				newFigure.style.WebkitTransitionDuration = config.speed / 1000 + 's';
				newFigure.style.MozTransitionDuration = config.speed / 1000 + 's';
				newFigure.style.transitionDuration = config.speed / 1000 + 's';
			}
			// implement the transition timing
			if (config.ease) {
				newFigure.style.msTransitionTimingFunction = config.ease;
				newFigure.style.OTransitionTimingFunction = config.ease;
				newFigure.style.WebkitTransitionTimingFunction = config.ease;
				newFigure.style.MozTransitionTimingFunction = config.ease;
				newFigure.style.transitionTimingFunction = config.ease;
			}
			// insert the new elements
			parent.element.appendChild(newFigure);
			// store the dom pointers to the images
			config.outlets.figures[a] = newFigure;
		}
		// start the menu
		this.menu.setup();
	};
	// handlers for the interaction events
	this.onImageLoad = function (image) {
		var parent = this.parent, config = this.config;
		var _this = this;
		image.onload = function () {
			_this.update();
		};
	};

	this.onImageClick = function (index, image) {
		var parent = this.parent, config = this.config;
		// if there was a longdesc
		if (config.longdescs[index]) {
			// change the slide into a link
			image.style.cursor = 'pointer';
			image.onclick = function () {
				document.location.href = config.longdescs[index];
			};
		}
	};
	// show the correct slide
	this.update = function () {
		var parent = this.parent, config = this.config;
		// for all the figures
		for (var a = 1, b = config.outlets.figures.length; a < b; a += 1) {
			// get the target figure
			var targetFigure = config.outlets.figures[a];
			var targetImage = targetFigure.getElementsByTagName('img')[0];
			var oldClassName = config.transition + '_' + targetFigure.className.split('_')[1];
			// if the ratio hasn't been determined yet
			if (!targetImage.className.match(/ratio/gi)) {
				// determine the aspect ratio of the image
				targetImage.className = (targetImage.offsetWidth > targetImage.offsetHeight) ? 'ratio_landscape' : 'ratio_portrait';
			}
			// if the image is narrower than the figure and the scaling is set to fill or the image is wider than the figure and the scaling is set to fit
			if (
				(config.scaling === 'fill' && (targetImage.offsetWidth < targetFigure.offsetWidth || targetImage.offsetHeight < targetFigure.offsetHeight)) ||
				(config.scaling === 'fit' && (targetImage.offsetWidth > targetFigure.offsetWidth || targetImage.offsetHeight > targetFigure.offsetHeight))
			) {
				// flip the aspect ratio
				if (targetImage.className.match(/ratio/gi)) {
					targetImage.className = (targetImage.className === 'ratio_landscape') ? 'ratio_portrait' : 'ratio_landscape';
				}
			}
			// if the figure is before the index
			var newClassName;
			if (a < config.outlets.index) {
				// change the class name according to its position
				newClassName = config.transition + '_previous';
			// the figure is after the index
			} else if (a > config.outlets.index) {
				// change the class name according to its position
				newClassName = config.transition + '_next';
			// else if the figure is the index
			} else {
				// change the class name according to its position
				newClassName = config.transition + '_current';
			}
			// if the slide is near the active one
			if (Math.abs(a - config.outlets.index) < config.preload) {
				// if the slide is not using the full figure url
				if (targetImage.src !== config.figures[a]) {
					// change it's thumbnail url to the figure url
					targetImage.src = config.figures[a];
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
	this.menu = new this.context.FiguresMenu(this);
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow.Figures;
}
