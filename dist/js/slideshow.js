/*
	Source:
	van Creij, Maurice (2018). "slideshow.js: A simple slideshow", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var Slideshow = function (config) {

	this.only = function (config) {
		// start an instance of the script
		return new this.Main(config, this);
	};

	this.each = function (config) {
		var _config, _context = this, instances = [];
		// for all element
		for (var a = 0, b = config.elements.length; a < b; a += 1) {
			// clone the configuration
			_config = Object.create(config);
			// insert the current element
			_config.element = config.elements[a];
			// start a new instance of the object
			instances[a] = new this.Main(_config, _context);
		}
		// return the instances
		return instances;
	};

	return (config.elements) ? this.each(config) : this.only(config);

};

// return as a require.js module
if (typeof define != 'undefined') define([], function () { return Slideshow });
if (typeof module != 'undefined') module.exports = Slideshow;

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

// extend the class
Slideshow.prototype.FiguresMenu = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;
	// build the menu options
	this.setup = function () {
		var parent = this.parent, config = this.config;
		// create the slide controls
		config.outlets.slideMenu = document.createElement('menu');
		config.outlets.slideMenu.className = 'pager';
		config.outlets.nextSlide = document.createElement('button');
		config.outlets.nextSlide.className = 'next';
		config.outlets.nextSlideIcon = document.createElement('span');
		config.outlets.nextSlideIcon.innerHTML = '&gt';
		config.outlets.prevSlide = document.createElement('button');
		config.outlets.prevSlide.className = 'previous';
		config.outlets.prevSlideIcon = document.createElement('span');
		config.outlets.prevSlideIcon.innerHTML = '&lt';
		config.outlets.nextSlide.appendChild(config.outlets.nextSlideIcon);
		config.outlets.slideMenu.appendChild(config.outlets.nextSlide);
		config.outlets.prevSlide.appendChild(config.outlets.prevSlideIcon);
		config.outlets.slideMenu.appendChild(config.outlets.prevSlide);
		parent.parent.element.appendChild(config.outlets.slideMenu);
		// force the height of the menu if desired
		if (config.divide) {
			config.outlets.slideMenu.style.height = config.divide;
		}
		// apply clicks to the slide controls
		config.outlets.nextSlide.addEventListener('click', this.onNext(config.outlets.nextSlide), false);
		config.outlets.prevSlide.addEventListener('click', this.onPrev(config.outlets.prevSlide), false);
	};
	// show or hide the previous and next buttons
	this.update = function () {
		var parent = this.parent, config = this.config;
		// hide the previous button if the index is near the left terminus
		if (config.outlets.prevSlide) {
			config.outlets.prevSlide.className = config.outlets.prevSlide.className.replace(/ disabled/gi, '');
			config.outlets.prevSlide.className += (config.outlets.index > 0) ? '' : ' disabled';
		}
		// hide the next button if the index is new the right terminus
		if (config.outlets.nextSlide) {
			config.outlets.nextSlide.className = config.outlets.nextSlide.className.replace(/ disabled/gi, '');
			config.outlets.nextSlide.className += (config.outlets.index < config.outlets.figures.length - 1) ? '' : ' disabled';
		}
	};
	// activate the next slide
	this.onNext = function (element) {
		var _this = this;
		return function (event) {
			_this.next(element);
			event.preventDefault();
		};
	};

	this.next = function (element) {
		var parent = this.parent, config = this.config;
		// if the element is not disabled
		if (!element.className.match(/disabled/)) {
			// increase the index
			config.outlets.index = (config.outlets.index < config.outlets.figures.length - 1) ? config.outlets.index + 1 : 0;
			// redraw
			parent.parent.update();
		}
		// cancel the click
		element.blur();
	};
	// activate the previous slide
	this.onPrev = function (element) {
		var parent = this.parent, config = this.config;
		var _this = this;
		return function (event) {
			_this.prev(element);
			event.preventDefault();
		};
	};

	this.prev = function (element) {
		var parent = this.parent, config = this.config;
		// if the element is not disabled
		if (!element.className.match(/disabled/)) {
			// increase the index
			config.outlets.index = (config.outlets.index > 0) ? config.outlets.index - 1 : config.outlets.figures.length - 1;
			// redraw
			parent.parent.update();
		}
		// cancel the click
		element.blur();
	};
};

// extend the class
Slideshow.prototype.Figures = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;
	this.context = parent.context;
	// build the figures
	this.setup = function () {
		var parent = this.parent, config = this.config;
		var newFigure, newLink, newImage, newCaptionText, newCaption, attachment;
		// for all figures in the context
		config.outlets.figures = [];
		for (var a = 0; a < config.figures.length; a += 1) {
			// create a new slide
			newFigure = document.createElement('figure');
			newFigure.className = (a === 0) ? ' ' + config.transition + '_current' : ' ' + config.transition + '_next';
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
		for (var a = 0, b = config.outlets.figures.length; a < b; a += 1) {
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
				if (targetImage.getAttribute('src') !== config.figures[a]) {
					// change it's thumbnail url to the figure url
					targetImage.src = config.figures[a];
				}
			}
			// vertically center the slide
			targetImage.style.marginTop = Math.round(targetImage.offsetHeight / -2) + 'px';
			targetImage.style.marginLeft = Math.round(targetImage.offsetWidth / -2) + 'px';
			// perform the transition
			transitions.byClass(targetFigure, oldClassName, newClassName);
		}
		// update the menu as well
		this.menu.update();
	};
	// manages the slide controls
	this.menu = new this.context.FiguresMenu(this);
};

// extend the class
Slideshow.prototype.Main = function (config, context) {

	// PROPERTIES

	this.config = config;
	this.context = context;
	this.element = config.element;

	// METHODS

	this.init = function () {
		var _this = this;
		// use the fallback to gather the asset urls
		this.gather();
		// retry delay
		this.config.retry = null;
		// hide the component
		this.element.style.visibility = 'hidden';
		setTimeout(function () {
			// start the components
			_this.setup();
			setTimeout(function () {
				// start the redraw
				_this.update();
				// reveal the component
				_this.element.style.visibility = 'visible';
			}, 900);
		}, 100);
		// return the object
		return this;
	};
	// gather all the elements
	this.gather = function () {
		if (!this.config.outlets) {
			// create the element to hold all the interface pointers
			this.config.outlets = {};
			// get the assets from the fallback html
			this.config.thumbnails = [];
			this.config.figures = [];
			this.config.titles = [];
			this.config.descriptions = [];
			this.config.longdescs = [];
			this.config.hyperlinks = [];
			this.config.targets = [];
			var link, images = this.element.getElementsByTagName('img');
			for (var a = 0; a < images.length; a += 1) {
				// create a list of thumbnail urls and full urls
				this.config.thumbnails[a] = images[a].getAttribute('src');
				this.config.titles[a] = images[a].getAttribute('title');
				this.config.descriptions[a] = images[a].getAttribute('alt');
				this.config.longdescs[a] = images[a].getAttribute('longdesc');
				this.config.figures[a] = (images[a].getAttribute('srcset')) ? images[a].getAttribute('srcset').split(' ')[0] : images[a].getAttribute('src');
				this.config.hyperlinks[a] = null;
				this.config.targets[a] = null;
				// if there is a link around the image
				link = images[a].parentNode;
				if (/a/i.test(link.nodeName)) {
					// if the link is to a larger version of the image
					if (/.gif|.jpg|.jpeg|.png|.svg/.test(link.getAttribute('href'))) {
						// update the figure
						this.config.figures[a] = link.getAttribute('href');
					// otherwise assume it is a link to a web page
					} else {
						// store the properties of the link
						this.config.hyperlinks[a] = link.getAttribute('href');
						this.config.targets[a] = link.getAttribute('target') || '_self';
					}
				}
			}
			// pick the initial active slide
			this.config.outlets.index = 0;
		}
	};
	// build the slideshow container
	this.setup = function () {
		// set the main captions class
		this.element.className += ' captions_' + this.config.captions;
		// set the main scaling class
		this.element.className += ' scaling_' + this.config.scaling;
		// clear the parent element
		this.element.innerHTML = '';
		// apply optional dimensions
		if (this.config.width) {
			this.element.style.width = this.config.width + this.config.widthUnit;
		}
		if (this.config.height) {
			this.element.style.height = this.config.height + this.config.heightUnit;
		}
		// apply the custom styles
		this.styling();
		// add the mousewheel events
		this.element.addEventListener('mousewheel', this.wheel(), false);
		this.element.addEventListener('DOMMouseScroll', this.wheel(), false);
		// add the touch events
		this.element.addEventListener('touchstart', this.touch.start(), false);
		this.element.addEventListener('touchmove', this.touch.move(), false);
		this.element.addEventListener('touchend', this.touch.end(), false);
		// start the sub components
		this.figures.setup();
		this.thumbnails.setup();
		this.automatic.setup();
	};
	// implement customised styles
	this.styling = function () {
		// create a custom stylesheet
		var style = document.createElement("style");
		if (/webkit/gi.test(navigator.UserAgent)) { style.appendChild(document.createTextNode("")); }
		document.body.appendChild(style);
		var sheet = style.sheet || style.styleSheet;
		// add the custom styles
		if (sheet.insertRule) {
			sheet.insertRule(".slideshow button {background-color : " + this.config.colorPassive + " !important;}", 0);
			sheet.insertRule(".slideshow button:hover {background-color : " + this.config.colorHover + " !important;}", 0);
			sheet.insertRule(".slideshow button.disabled {background-color : " + this.config.colorDisabled + " !important;}", 0);
			sheet.insertRule(".slideshow .thumbnails_active {background-color : " + this.config.colorPassive + " !important;}", 0);
			sheet.insertRule(".slideshow .thumbtacks_active {background-color : " + this.config.colorPassive + " !important;}", 0);
		} else {
			sheet.addRule(".slideshow button", "background-color : " + this.config.colorPassive + " !important;", 0);
			sheet.addRule(".slideshow button:hover", "background-color : " + this.config.colorHover + " !important;", 0);
			sheet.addRule(".slideshow button.disabled", "background-color : " + this.config.colorDisabled + " !important;", 0);
			sheet.addRule(".slideshow .thumbnails_active", "background-color : " + this.config.colorPassive + " !important;", 0);
			sheet.addRule(".slideshow .thumbtacks_active", "background-color : " + this.config.colorPassive + " !important;", 0);
		}
	};
	// updates the whole app
	this.update = function () {
		var _this = this;
		// if the slideshow has been disabled
		if (this.element.offsetHeight === 0) {
			// stop updating and try again later
			clearTimeout(this.config.retry);
			this.config.retry = setTimeout(function () {
				_this.update();
			}, 1000);
		// else
		} else {
			// update the figures
			this.figures.update();
			// update the slideshow
			this.thumbnails.update();
		}
	};
	// public API
	this.focus = function (index) {
		// set the active slide
		this.config.outlets.index = index;
		// redraw
		this.update();
	};

	this.pause = function () {
		// stop the automatic slideshow
		this.automatic.stop();
	};

	this.play = function () {
		// start the automatic slideshow
		this.automatic.start();
	};

	this.previous = function () {
		// show the previous slide
		this.figures.menu.prev();
	};

	this.next = function () {
		// show the next slide
		this.figures.menu.next();
	};
	// mouse wheel controls
	this.wheel = function () {
		var _this = this;
		return function (event) {
			// get the reading from the mouse wheel
			var distance = (window.event) ? window.event.wheelDelta / 120 : -event.detail / 3;
			// do not loop around
			if (distance < 0 && _this.config.outlets.index > 1) {
				// trigger a step
				_this.figures.menu.prev(_this.config.outlets.prevSlide);
			} else if (distance > 0 && _this.config.outlets.index < _this.config.outlets.figures.length - 1) {
				// trigger a step
				_this.figures.menu.next(_this.config.outlets.nextSlide);
			}
			// cancel the scrolling
			event.preventDefault();
		};
	};
	// touch screen controls
	this.touch = new this.context.Touch(this);
	// automatic idle slideshow
	this.automatic = new this.context.Automatic(this);
	// manages the figures
	this.figures = new this.context.Figures(this);
	// manages the thumbnails
	this.thumbnails = new this.context.Thumbnails(this);
	// startup
	this.init();
};

// extend the class
Slideshow.prototype.ThumbnailsMenu = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;
	// build the menu options
	this.setup = function () {
		var parent = this.parent, config = this.parent.parent.config;
		// create the thumbnail controls
		config.outlets.pageMenu = document.createElement('menu');
		config.outlets.pageMenu.className = 'scroller';
		config.outlets.nextPage = document.createElement('button');
		config.outlets.nextPage.className = 'next';
		config.outlets.nextPageIcon = document.createElement('span');
		config.outlets.nextPageIcon.innerHTML = '&gt';
		config.outlets.prevPage = document.createElement('button');
		config.outlets.prevPage.className = 'previous';
		config.outlets.prevPageIcon = document.createElement('span');
		config.outlets.prevPageIcon.innerHTML = '&lt';
		config.outlets.nextPage.appendChild(config.outlets.nextPageIcon);
		config.outlets.pageMenu.appendChild(config.outlets.nextPage);
		config.outlets.prevPage.appendChild(config.outlets.prevPageIcon);
		config.outlets.pageMenu.appendChild(config.outlets.prevPage);
		config.outlets.slideNav.appendChild(config.outlets.pageMenu);
		// apply clicks to the thumbnail controls
		config.outlets.nextPage.onclick = this.next(config.outlets.nextSlide);
		config.outlets.prevPage.onclick = this.prev(config.outlets.prevSlide);
	};
	// show or hide the previous and next buttons
	this.update = function () {
		var parent = this.parent, config = this.parent.parent.config;
		// calculate the current position
		config.scrollPosition = (config.outlets.slideUl.style.marginLeft) ? parseInt(config.outlets.slideUl.style.marginLeft, 10) : 0;
		config.scrollDistance = config.outlets.slideDiv.offsetWidth;
		// calculate the minimum position
		config.scrollMin = 0;
		// calculate the maximum position
		var lastThumbnail = config.outlets.thumbnails[config.outlets.thumbnails.length - 1];
		config.scrollStep = lastThumbnail.offsetWidth;
		config.scrollMax = -1 * (lastThumbnail.offsetLeft + lastThumbnail.offsetWidth) + config.scrollDistance;
		// show or hide the prev button
		config.outlets.prevPage.className = config.outlets.prevPage.className.replace(/ disabled/gi, '');
		config.outlets.prevPage.className += (config.scrollPosition >= config.scrollMin) ? ' disabled' : '';
		// show or hide the next button
		config.outlets.nextPage.className = config.outlets.nextPage.className.replace(/ disabled/gi, '');
		config.outlets.nextPage.className += (config.scrollPosition <= config.scrollMax && config.scrollMax < 0) ? ' disabled' : '';
	};
	// show the next page of thumbnails
	this.next = function (element) {
		var parent = this.parent, config = this.parent.parent.config;
		var _this = this;
		return function (event) {
			// get the event properties
			event = event || window.event;
			var target = event.target || event.srcElement;
			// if the button is not disabled
			if (!target.className.match(/disabled/)) {
				// scroll one page's width of thumbnails
				var newPosition = config.scrollPosition - config.scrollDistance + config.scrollStep;
				// limit the scroll distance
				if (newPosition < config.scrollMax) {
					newPosition = config.scrollMax;
				}
				// transition to the new position
				transitions.byRules(config.outlets.slideUl, {'marginLeft' : newPosition + 'px'});
				// redraw the menu buttons
				_this.update();
			}
			// cancel the click
			target.blur();
			event.preventDefault();
		};
	};
	// show the previous page of thumbnails
	this.prev = function (element) {
		var parent = this.parent, config = this.parent.parent.config;
		var _this = this;
		return function (event) {
			// get the event properties
			event = event || window.event;
			var target = event.target || event.srcElement;
			// if the button is not disabled
			if (!target.className.match(/disabled/)) {
				// scroll one page's width of thumbnails
				var newPosition = config.scrollPosition + config.scrollDistance - config.scrollStep;
				// limit the scroll distance
				if (newPosition > 0) {
					newPosition = 0;
				}
				// transition to the new position
				if (config.navigation === 'thumbnails') {
					transitions.byRules(config.outlets.slideUl, {'marginLeft' : newPosition + 'px'});
				}
				// redraw the menu buttons
				_this.update();
			}
			// cancel the click
			target.blur();
			event.preventDefault();
		};
	};
};

// extend the class
Slideshow.prototype.Thumbnails = function (parent) {

	// PROPERTIES

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
		config.outlets.thumbnails = [];
		for (var a = 0, b = config.thumbnails.length; a < b; a += 1) {
			// create a new thumbnail
			var newLi = document.createElement('li');
			var newA = document.createElement('a');
			newA.className = (a === 0) ? config.navigation + '_active' : config.navigation + '_passive';
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
		for (var a = 0, b = config.thumbnails.length; a < b; a += 1) {
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
		for (var a = 0, b = config.thumbnails.length; a < b; a += 1) {
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
			imageObject.style.transform = 'translate(-50%, -50%)';
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
		transitions.byRules(
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
		for (var a = 0, b = config.outlets.thumbnails.length; a < b; a += 1) {
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
