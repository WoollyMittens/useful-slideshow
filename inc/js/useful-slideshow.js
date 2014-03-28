/*
	Source:
	van Creij, Maurice (2012). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var polyfills = polyfills || {};

	// enabled the use of HTML5 elements in Internet Explorer
	polyfills.html5 = function () {
		var a, b, elementsList;
		elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
		if (navigator.userAgent.match(/msie/gi)) {
			for (a = 0 , b = elementsList.length; a < b; a += 1) {
				document.createElement(elementsList[a]);
			}
		}
	};

	// allow array.indexOf in older browsers
	polyfills.arrayIndexOf = function () {
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (obj, start) {
				for (var i = (start || 0), j = this.length; i < j; i += 1) {
					if (this[i] === obj) { return i; }
				}
				return -1;
			};
		}
	};

	// allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
	polyfills.querySelectorAll = function () {
		if (!document.querySelectorAll) {
			document.querySelectorAll = function (a) {
				var b = document, c = b.documentElement.firstChild, d = b.createElement("STYLE");
				return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
			};
		}
	};

	// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
	polyfills.addEventListener = function () {
		!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
			WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
				var target = this;
				registry.unshift([target, type, listener, function (event) {
					event.currentTarget = target;
					event.preventDefault = function () { event.returnValue = false; };
					event.stopPropagation = function () { event.cancelBubble = true; };
					event.target = event.srcElement || target;
					listener.call(target, event);
				}]);
				this.attachEvent("on" + type, registry[0][3]);
			};
			WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
				for (var index = 0, register; register = registry[index]; ++index) {
					if (register[0] == this && register[1] == type && register[2] == listener) {
						return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
					}
				}
			};
			WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
				return this.fireEvent("on" + eventObject.type, eventObject);
			};
		})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
	};

	// allow console.log
	polyfills.consoleLog = function () {
		var overrideTest = new RegExp('console-log', 'i');
		if (!window.console || overrideTest.test(document.querySelectorAll('html')[0].className)) {
			window.console = {};
			window.console.log = function () {
				// if the reporting panel doesn't exist
				var a, b, messages = '', reportPanel = document.getElementById('reportPanel');
				if (!reportPanel) {
					// create the panel
					reportPanel = document.createElement('DIV');
					reportPanel.id = 'reportPanel';
					reportPanel.style.background = '#fff none';
					reportPanel.style.border = 'solid 1px #000';
					reportPanel.style.color = '#000';
					reportPanel.style.fontSize = '12px';
					reportPanel.style.padding = '10px';
					reportPanel.style.position = (navigator.userAgent.indexOf('MSIE 6') > -1) ? 'absolute' : 'fixed';
					reportPanel.style.right = '10px';
					reportPanel.style.bottom = '10px';
					reportPanel.style.width = '180px';
					reportPanel.style.height = '320px';
					reportPanel.style.overflow = 'auto';
					reportPanel.style.zIndex = '100000';
					reportPanel.innerHTML = '&nbsp;';
					// store a copy of this node in the move buffer
					document.body.appendChild(reportPanel);
				}
				// truncate the queue
				var reportString = (reportPanel.innerHTML.length < 1000) ? reportPanel.innerHTML : reportPanel.innerHTML.substring(0, 800);
				// process the arguments
				for (a = 0, b = arguments.length; a < b; a += 1) {
					messages += arguments[a] + '<br/>';
				}
				// add a break after the message
				messages += '<hr/>';
				// output the queue to the panel
				reportPanel.innerHTML = messages + reportString;
			};
		}
	};

	// allows Object.create (https://gist.github.com/rxgx/1597825)
	polyfills.objectCreate = function () {
		if (typeof Object.create !== "function") {
			Object.create = function (original) {
				function Clone() {}
				Clone.prototype = original;
				return new Clone();
			};
		}
	};

	// allows String.trim (https://gist.github.com/eliperelman/1035982)
	polyfills.stringTrim = function () {
		if (!String.prototype.trim) {
			String.prototype.trim = function () { return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, ''); };
		}
		if (!String.prototype.ltrim) {
			String.prototype.ltrim = function () { return this.replace(/^\s+/, ''); };
		}
		if (!String.prototype.rtrim) {
			String.prototype.rtrim = function () { return this.replace(/\s+$/, ''); };
		}
		if (!String.prototype.fulltrim) {
			String.prototype.fulltrim = function () { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
		}
	};

	// for immediate use
	polyfills.html5();
	polyfills.arrayIndexOf();
	polyfills.querySelectorAll();
	polyfills.addEventListener();
	polyfills.consoleLog();
	polyfills.objectCreate();
	polyfills.stringTrim();

}(window.useful = window.useful || {}));

/*
	Source:
	van Creij, Maurice (2012). "useful.transitions.js: A library of useful functions to ease working with CSS3 transitions.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Fallbacks:
	<!--[if IE]>
		<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
	<![endif]-->
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var transitions = transitions || {};

	// applies functionality to node that conform to a given CSS rule, or returns them
	transitions.select = function (input, parent) {
		var a, b, elements;
		// validate the input
		parent = parent || document;
		input = (typeof input === 'string') ? {'rule' : input, 'parent' : parent} : input;
		input.parent = input.parent || document;
		input.data = input.data || {};
		// use querySelectorAll to select elements, or defer to jQuery
		elements = (typeof(document.querySelectorAll) !== 'undefined') ?
			input.parent.querySelectorAll(input.rule) :
			(typeof(jQuery) !== 'undefined') ? jQuery(input.parent).find(input.rule).get() : [];
		// if there was a handler
		if (typeof(input.handler) !== 'undefined') {
			// for each element
			for (a = 0, b = elements.length; a < b; a += 1) {
				// run the handler and pass a unique copy of the data (in case it's a model)
				input.handler(elements[a], input.data.create());
			}
		// else assume the function was called for a list of elements
		} else {
			// return the selected elements
			return elements;
		}
	};

	// checks the compatibility of CSS3 transitions for this browser
	transitions.compatibility = function () {
		var eventName, newDiv, empty;
		// create a test div
		newDiv = document.createElement('div');
		// use various tests for transition support
		if (typeof(newDiv.style.MozTransition) !== 'undefined') { eventName = 'transitionend'; }
		try { document.createEvent('OTransitionEvent'); eventName = 'oTransitionEnd'; } catch (e) { empty = null; }
		try { document.createEvent('WebKitTransitionEvent'); eventName = 'webkitTransitionEnd'; } catch (e) { empty = null; }
		try { document.createEvent('transitionEvent'); eventName = 'transitionend'; } catch (e) { empty = null; }
		// remove the test div
		newDiv = empty;
		// pass back working event name
		return eventName;
	};

	// performs a transition between two classnames
	transitions.byClass = function (element, removedClass, addedClass, endEventHandler, jQueryDuration, jQueryEasing) {
		var replaceThis, replaceWith, endEventName, endEventFunction;
		// validate the input
		endEventHandler = endEventHandler || function () {};
		endEventName = transitions.compatibility();
		// turn the classnames into regular expressions
		replaceThis = new RegExp(removedClass.trim().replace(/ {2,}/g, ' ').split(' ').join('|'), 'g');
		replaceWith = new RegExp(addedClass, 'g');
		// if CSS3 transitions are available
		if (typeof endEventName !== 'undefined') {
			// set the onComplete handler and immediately remove it afterwards
			element.addEventListener(endEventName, endEventFunction = function () {
				endEventHandler();
				element.removeEventListener(endEventName, endEventFunction, true);
			}, true);
			// replace the class name
			element.className = (element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ').trim();
		// else if jQuery UI is available
		} else if (typeof jQuery !== 'undefined' && typeof jQuery.ui !== 'undefined') {
			// retrieve any extra information for jQuery
			jQueryDuration = jQueryDuration || 500;
			jQueryEasing = jQueryEasing || 'swing';
			// use switchClass from jQuery UI to approximate CSS3 transitions
			jQuery(element).switchClass(removedClass.replace(replaceWith, ''), addedClass, jQueryDuration, jQueryEasing, endEventHandler);
		// if all else fails
		} else {
			// just replace the class name
			element.className = (element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ').trim();
			// and call the onComplete handler
			endEventHandler();
		}
	};

	// adds the relevant browser prefix to a style property
	transitions.prefix = function (property) {
		// pick the prefix that goes with the browser
		return (navigator.userAgent.match(/webkit/gi)) ? 'webkit' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/firefox/gi)) ? 'Moz' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/microsoft/gi)) ? 'ms' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/opera/gi)) ? 'O' + property.substr(0, 1).toUpperCase() + property.substr(1):
			property;
	};

	// applies a list of rules
	transitions.byRules = function (element, rules, endEventHandler) {
		var rule, endEventName, endEventFunction;
		// validate the input
		rules.transitionProperty = rules.transitionProperty || 'all';
		rules.transitionDuration = rules.transitionDuration || '300ms';
		rules.transitionTimingFunction = rules.transitionTimingFunction || 'ease';
		endEventHandler = endEventHandler || function () {};
		endEventName = transitions.compatibility();
		// if CSS3 transitions are available
		if (typeof endEventName !== 'undefined') {
			// set the onComplete handler and immediately remove it afterwards
			element.addEventListener(endEventName, endEventFunction = function () {
				endEventHandler();
				element.removeEventListener(endEventName, endEventFunction, true);
			}, true);
			// for all rules
			for (rule in rules) {
				if (rules.hasOwnProperty(rule)) {
					// implement the prefixed value
					element.style[transitions.compatibility(rule)] = rules[rule];
					// implement the value
					element.style[rule] = rules[rule];
				}
			}
		// else if jQuery is available
		} else if (typeof jQuery !== 'undefined') {
			var jQueryEasing, jQueryDuration;
			// pick the equivalent jQuery animation function
			jQueryEasing = (rules.transitionTimingFunction.match(/ease/gi)) ? 'swing' : 'linear';
			jQueryDuration = parseInt(rules.transitionDuration.replace(/s/g, '000').replace(/ms/g, ''), 10);
			// remove rules that will make Internet Explorer complain
			delete rules.transitionProperty;
			delete rules.transitionDuration;
			delete rules.transitionTimingFunction;
			// use animate from jQuery
			jQuery(element).animate(
				rules,
				jQueryDuration,
				jQueryEasing,
				endEventHandler
			);
		// else
		} else {
			// for all rules
			for (rule in rules) {
				if (rules.hasOwnProperty(rule)) {
					// implement the prefixed value
					element.style[transitions.compatibility(rule)] = rules[rule];
					// implement the value
					element.style[rule] = rules[rule];
				}
			}
			// call the onComplete handler
			endEventHandler();
		}
	};

	// public functions
	useful.transitions = useful.transitions || {};
	useful.transitions.select = transitions.select;
	useful.transitions.byClass = transitions.byClass;
	useful.transitions.byRules = transitions.byRules;

}(window.useful = window.useful || {}));

/*
	Source:
	van Creij, Maurice (2012). "useful.context.js: A simple slideshow", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Prerequisites:
	<!--[if IE]>
		<script src="./js/html5.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
	<![endif]-->

	To do:
	+ Switch to useful.interactions for gestures.
	+ Switch to useful.thumbnails instead of duplicate functionality.
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	useful.Slideshow = function (obj, cfg) {
		this.obj = obj;
		this.cfg = cfg;
		this.start = function () {
			var context = this;
			// use the fallback to gather the asset urls
			if (!context.cfg.outlets) {
				// create the object to hold all the interface pointers
				context.cfg.outlets = {};
				// get the assets from the fallback html
				context.cfg.thumbnails = [0];
				context.cfg.figures = [0];
				context.cfg.titles = [0];
				context.cfg.descriptions = [0];
				context.cfg.longdescs = [0];
				var allLinks = context.obj.getElementsByTagName('a');
				var allImages = context.obj.getElementsByTagName('img');
				context.cfg.hasLinks = (allLinks.length === allImages.length);
				for (var a = 0; a < allImages.length; a += 1) {
					// create a list of thumbnail urls and full urls
					context.cfg.thumbnails.push(allImages[a].src);
					context.cfg.titles.push(allImages[a].getAttribute('title'));
					context.cfg.descriptions.push(allImages[a].getAttribute('alt'));
					context.cfg.longdescs.push(allImages[a].getAttribute('longdesc'));
					context.cfg.figures[context.cfg.figures.length] = (context.cfg.hasLinks) ? allLinks[a].href : allImages[a].src;
				}
				// pick the initial active slide
				context.cfg.outlets.index = 1;
			}
			// retry delay
			context.cfg.retry = null;
			// hide the component
			context.obj.style.visibility = 'hidden';
			setTimeout(function () {
				// start the components
				context.setup(context);
				setTimeout(function () {
					// start the redraw
					context.update(context);
					// reveal the component
					context.obj.style.visibility = 'visible';
				}, 900);
			}, 100);
			// disable the start function so it can't be started twice
			this.start = function () {};
		};
		// build the slideshow container
		this.setup = function (context) {
			// set the main captions class
			context.obj.className += ' captions_' + context.cfg.captions;
			// set the main scaling class
			context.obj.className += ' scaling_' + context.cfg.scaling;
			// clear the parent element
			context.obj.innerHTML = '';
			// apply optional dimensions
			if (context.cfg.width) {
				context.obj.style.width = context.cfg.width + context.cfg.widthUnit;
			}
			if (context.cfg.height) {
				context.obj.style.height = context.cfg.height + context.cfg.heightUnit;
			}
			// apply the custom styles
			context.styling(context);
			// add the mousewheel events
			context.obj.addEventListener('mousewheel', context.wheel(context), false);
			context.obj.addEventListener('DOMMouseScroll', context.wheel(context), false);
			// add the touch events
			context.obj.addEventListener('touchstart', context.touch.start(context), false);
			context.obj.addEventListener('touchmove', context.touch.move(context), false);
			context.obj.addEventListener('touchend', context.touch.end(context), false);
			// start the sub components
			context.figures.setup(context);
			context.thumbnails.setup(context);
			context.automatic.setup(context);
		};
		// implement customised styles
		this.styling = function (context) {
			// create a custom stylesheet
			var style = document.createElement("style");
			if (/webkit/gi.test(navigator.UserAgent)) { style.appendChild(document.createTextNode("")); }
			document.body.appendChild(style);
			var sheet = style.sheet || style.styleSheet;
			// add the custom styles
			if (sheet.insertRule) {
				sheet.insertRule(".slideshow button {background-color : " + context.cfg.colorPassive + " !important;}", 0);
				sheet.insertRule(".slideshow button:hover {background-color : " + context.cfg.colorHover + " !important;}", 0);
				sheet.insertRule(".slideshow button.disabled {background-color : " + context.cfg.colorDisabled + " !important;}", 0);
				sheet.insertRule(".slideshow .thumbnails_active {background-color : " + context.cfg.colorPassive + " !important;}", 0);
				sheet.insertRule(".slideshow .thumbtacks_active {background-color : " + context.cfg.colorPassive + " !important;}", 0);
			} else {
				sheet.addRule(".slideshow button", "background-color : " + context.cfg.colorPassive + " !important;", 0);
				sheet.addRule(".slideshow button:hover", "background-color : " + context.cfg.colorHover + " !important;", 0);
				sheet.addRule(".slideshow button.disabled", "background-color : " + context.cfg.colorDisabled + " !important;", 0);
				sheet.addRule(".slideshow .thumbnails_active", "background-color : " + context.cfg.colorPassive + " !important;", 0);
				sheet.addRule(".slideshow .thumbtacks_active", "background-color : " + context.cfg.colorPassive + " !important;", 0);
			}
		};
		// updates the whole app
		this.update = function (context) {
			// if the slideshow has been disabled
			if (context.obj.offsetHeight === 0) {
				// stop updating and try again later
				clearTimeout(context.cfg.retry);
				context.cfg.retry = setTimeout(function () {
					context.update(context);
				}, 1000);
			// else
			} else {
				// update the figures
				context.figures.update(context);
				// update the slideshow
				context.thumbnails.update(context);
			}
		};
		// public API
		this.focus = function (index) {
			// set the active slide
			this.cfg.outlets.index = index;
			// redraw
			this.update(this);
		};
		this.pause = function () {
			// stop the automatic slideshow
			this.automatic.stop(this);
		};
		this.play = function () {
			// start the automatic slideshow
			this.automatic.start(this);
		};
		this.previous = function () {
			// show the previous slide
			this.figures.menu.prev(this);
		};
		this.next = function () {
			// show the next slide
			this.figures.menu.next(this);
		};
		// mouse wheel controls
		this.wheel = function (context) {
			return function (event) {
				// get the reading from the mouse wheel
				var distance = (window.event) ? window.event.wheelDelta / 120 : -event.detail / 3;
				// do not loop around
				if (distance < 0 && context.cfg.outlets.index > 1) {
					// trigger a step
					context.figures.menu.prev(context.cfg.outlets.prevSlide, context);
				} else if (distance > 0 && context.cfg.outlets.index < context.cfg.outlets.figures.length - 1) {
					// trigger a step
					context.figures.menu.next(context.cfg.outlets.nextSlide, context);
				}
				// cancel the scrolling
				event.preventDefault();
			};
		};
		// touch screen controls
		this.touch = {};
		this.touch.x = null;
		this.touch.y = null;
		this.touch.start = function (context) {
			return function (event) {
				// store the touch positions
				context.touch.x = event.touches[0].pageX;
				context.touch.y = event.touches[0].pageY;
				context.touch.sensitivity = context.obj.offsetWidth * 0.6;
				// cancel the automatic slideshow
				context.automatic.stop(context);
			};
		};
		this.touch.move = function (context) {
			return function (event) {
				// if there is a touch in progress
				if (context.touch.x) {
					// measure the distance
					var xDistance = event.touches[0].pageX - context.touch.x;
					var yDistance = event.touches[0].pageY - context.touch.y;
					var sensitivity = context.touch.sensitivity;
					// if there is no vertical gesture
					if (Math.abs(yDistance) < sensitivity) {
						// if the horizontal gesture distance is over a certain amount
						if (xDistance < -1 * sensitivity && context.cfg.outlets.index < context.cfg.outlets.figures.length - 1) {
							// trigger the movement
							context.figures.menu.next(context.cfg.outlets.nextSlide, context);
							// reset the positions
							context.touch.x = 0;
							context.touch.y = 0;
						} else if (xDistance > sensitivity && context.cfg.outlets.index > 1) {
							// trigger the movement
							context.figures.menu.prev(context.cfg.outlets.prevSlide, context);
							// reset the positions
							context.touch.x = 0;
							context.touch.y = 0;
						}
						// cancel the default
						event.preventDefault();
					}
				}
			};
		};
		this.touch.end = function (context) {
			return function () {
				// clear the positions
				context.touch.x = null;
				context.touch.y = null;
				// restart the automatic slideshow
				if (context.cfg.hover && context.cfg.hover === 'pause') {
					context.automatic.start(context);
				}
			};
		};
		// automatic idle slideshow
		this.automatic = {};
		this.automatic.setup = function (context) {
			// if a hover option exists
			if (context.cfg.hover && context.cfg.hover === 'pause') {
				// stop the slideshow on hover
				context.obj.onmouseover = function () {
					context.automatic.stop(context);
				};
				// restart the slideshow after hover
				context.obj.onmouseout = function () {
					context.automatic.start(context);
				};
			}
			// if an idle timer exists
			if (context.cfg.idle && context.cfg.idle >= 0) {
				// run the update at an interval
				context.automatic.start(context);
			}
		};
		this.automatic.start = function (context) {
			// stop any previous timeout loop
			clearTimeout(context.cfg.idleTimeout);
			// start the timeout loop
			context.cfg.idleTimeout = setInterval(function () {
				// move to the next slide
				context.cfg.outlets.index = (context.cfg.outlets.index < context.cfg.outlets.figures.length - 1) ? context.cfg.outlets.index + 1 : 1;
				// redraw
				context.update(context);
			}, context.cfg.idle);
		};
		this.automatic.stop = function (context) {
			// stop the timeout loop
			clearTimeout(context.cfg.idleTimeout);
		};
		// manages the figures
		this.figures = {};
		// build the figures
		this.figures.setup = function (context) {
			// for all figures in the context
			context.cfg.outlets.figures = [0];
			for (var a = 1; a < context.cfg.figures.length; a += 1) {
				// create a new slide
				var newFigure = document.createElement('figure');
				newFigure.className = (a === 1) ? ' ' + context.cfg.transition + '_current' : ' ' + context.cfg.transition + '_next';
				var newImage = document.createElement('img');
				newImage.src = context.cfg.thumbnails[a];	// * start out with the thumbnails instead of the full images
				newImage.setAttribute('alt', '');
				newFigure.appendChild(newImage);
				// set the event handlers
				context.figures.onImageLoad(newImage, context);
				context.figures.onImageClick(a, newImage, context);
				// create the caption if there is content for it
				var newCaptionText = '';
				newCaptionText += (context.cfg.titles && context.cfg.titles[a]) ? '<strong>' + context.cfg.titles[a] + '</strong> ' : '';
				newCaptionText += (context.cfg.descriptions && context.cfg.descriptions[a]) ? context.cfg.descriptions[a] : '';
				if (newCaptionText !== '') {
					var newCaption = document.createElement('figcaption');
					newCaption.innerHTML = newCaptionText;
					newFigure.appendChild(newCaption);
				}
				// force the height of the slide if desired
				newFigure.style.height = (context.cfg.navigation === 'thumbtacks') ? '100%' : context.cfg.divide;
				// implement the transition speed
				if (context.cfg.speed) {
					newFigure.style.msTransitionDuration = context.cfg.speed / 1000 + 's';
					newFigure.style.OTransitionDuration = context.cfg.speed / 1000 + 's';
					newFigure.style.WebkitTransitionDuration = context.cfg.speed / 1000 + 's';
					newFigure.style.MozTransitionDuration = context.cfg.speed / 1000 + 's';
					newFigure.style.transitionDuration = context.cfg.speed / 1000 + 's';
				}
				// implement the transition timing
				if (context.cfg.ease) {
					newFigure.style.msTransitionTimingFunction = context.cfg.ease;
					newFigure.style.OTransitionTimingFunction = context.cfg.ease;
					newFigure.style.WebkitTransitionTimingFunction = context.cfg.ease;
					newFigure.style.MozTransitionTimingFunction = context.cfg.ease;
					newFigure.style.transitionTimingFunction = context.cfg.ease;
				}
				// insert the new elements
				context.obj.appendChild(newFigure);
				// store the dom pointers to the images
				context.cfg.outlets.figures[a] = newFigure;
			}
			// start the menu
			context.figures.menu.setup(context);
		};
		// handlers for the interaction events
		this.figures.onImageLoad = function (image, context) {
			image.onload = function () {
				context.figures.update(context);
			};
		};
		this.figures.onImageClick = function (index, image, context) {
			// if there was a longdesc
			if (context.cfg.longdescs[index]) {
				// change the slide into a link
				image.style.cursor = 'pointer';
				image.onclick = function () {
					document.location.href = context.cfg.longdescs[index];
				};
			}
		};
		// show the correct slide
		this.figures.update = function (context) {
			// for all the figures
			for (var a = 1, b = context.cfg.outlets.figures.length; a < b; a += 1) {
				// get the target figure
				var targetFigure = context.cfg.outlets.figures[a];
				var targetImage = targetFigure.getElementsByTagName('img')[0];
				var oldClassName = context.cfg.transition + '_' + targetFigure.className.split('_')[1];
				// if the ratio hasn't been determined yet
				if (!targetImage.className.match(/ratio/gi)) {
					// determine the aspect ratio of the image
					targetImage.className = (targetImage.offsetWidth > targetImage.offsetHeight) ? 'ratio_landscape' : 'ratio_portrait';
				}
				// if the image is narrower than the figure and the scaling is set to fill or the image is wider than the figure and the scaling is set to fit
				if (
					(context.cfg.scaling === 'fill' && (targetImage.offsetWidth < targetFigure.offsetWidth || targetImage.offsetHeight < targetFigure.offsetHeight)) ||
					(context.cfg.scaling === 'fit' && (targetImage.offsetWidth > targetFigure.offsetWidth || targetImage.offsetHeight > targetFigure.offsetHeight))
				) {
					// flip the aspect ratio
					if (targetImage.className.match(/ratio/gi)) {
						targetImage.className = (targetImage.className === 'ratio_landscape') ? 'ratio_portrait' : 'ratio_landscape';
					}
				}
				// if the figure is before the index
				var newClassName;
				if (a < context.cfg.outlets.index) {
					// change the class name according to its position
					newClassName = context.cfg.transition + '_previous';
				// the figure is after the index
				} else if (a > context.cfg.outlets.index) {
					// change the class name according to its position
					newClassName = context.cfg.transition + '_next';
				// else if the figure is the index
				} else {
					// change the class name according to its position
					newClassName = context.cfg.transition + '_current';
				}
				// if the slide is near the active one
				if (Math.abs(a - context.cfg.outlets.index) < context.cfg.preload) {
					// if the slide is not using the full figure url
					if (targetImage.src !== context.cfg.figures[a]) {
						// change it's thumbnail url to the figure url
						targetImage.src = context.cfg.figures[a];
					}
				}
				// vertically center the slide
				targetImage.style.marginTop = Math.round(targetImage.offsetHeight / -2) + 'px';
				targetImage.style.marginLeft = Math.round(targetImage.offsetWidth / -2) + 'px';
				// perform the transition
				useful.transitions.byClass(targetFigure, oldClassName, newClassName);
			}
			// update the menu as well
			context.figures.menu.update(context);
		};
		// manages the slide controls
		this.figures.menu = {};
		// build the menu options
		this.figures.menu.setup = function (context) {
			// create the slide controls
			context.cfg.outlets.slideMenu = document.createElement('menu');
			context.cfg.outlets.slideMenu.className = 'pager';
			context.cfg.outlets.nextSlide = document.createElement('button');
			context.cfg.outlets.nextSlide.className = 'next';
			context.cfg.outlets.nextSlideIcon = document.createElement('span');
			context.cfg.outlets.nextSlideIcon.innerHTML = '&gt';
			context.cfg.outlets.prevSlide = document.createElement('button');
			context.cfg.outlets.prevSlide.className = 'previous';
			context.cfg.outlets.prevSlideIcon = document.createElement('span');
			context.cfg.outlets.prevSlideIcon.innerHTML = '&lt';
			context.cfg.outlets.nextSlide.appendChild(context.cfg.outlets.nextSlideIcon);
			context.cfg.outlets.slideMenu.appendChild(context.cfg.outlets.nextSlide);
			context.cfg.outlets.prevSlide.appendChild(context.cfg.outlets.prevSlideIcon);
			context.cfg.outlets.slideMenu.appendChild(context.cfg.outlets.prevSlide);
			context.obj.appendChild(context.cfg.outlets.slideMenu);
			// force the height of the menu if desired
			if (context.cfg.divide) {
				context.cfg.outlets.slideMenu.style.height = context.cfg.divide;
			}
			// apply clicks to the slide controls
			context.cfg.outlets.nextSlide.addEventListener('click', context.figures.menu.onNext(context.cfg.outlets.nextSlide, context), false);
			context.cfg.outlets.prevSlide.addEventListener('click', context.figures.menu.onNext(context.cfg.outlets.prevSlide, context), false);
		};
		// show or hide the previous and next buttons
		this.figures.menu.update = function (context) {
			// hide the previous button if the index is near the left terminus
			if (context.cfg.outlets.prevSlide) {
				context.cfg.outlets.prevSlide.className = context.cfg.outlets.prevSlide.className.replace(/ disabled/gi, '');
				context.cfg.outlets.prevSlide.className += (context.cfg.outlets.index > 1) ? '' : ' disabled';
			}
			// hide the next button if the index is new the right terminus
			if (context.cfg.outlets.nextSlide) {
				context.cfg.outlets.nextSlide.className = context.cfg.outlets.nextSlide.className.replace(/ disabled/gi, '');
				context.cfg.outlets.nextSlide.className += (context.cfg.outlets.index < context.cfg.outlets.figures.length - 1) ? '' : ' disabled';
			}
		};
		// activate the next slide
		this.figures.menu.onNext = function (element, context) {
			return function (event) {
				context.figures.menu.next(element, context);
				event.preventDefault();
			};
		};
		this.figures.menu.next = function (element, context) {
			// if the element is not disabled
			if (!element.className.match(/disabled/)) {
				// increase the index
				context.cfg.outlets.index = (context.cfg.outlets.index < context.cfg.outlets.figures.length - 1) ? context.cfg.outlets.index + 1 : 1;
				// redraw
				context.update(context);
			}
			// cancel the click
			element.blur();
		};
		// activate the previous slide
		this.figures.menu.onPrev = function (element, context) {
			return function (event) {
				context.figures.menu.prev(element, context);
				event.preventDefault();
			};
		};
		this.figures.menu.prev = function (element, context) {
			// if the element is not disabled
			if (!element.className.match(/disabled/)) {
				// increase the index
				context.cfg.outlets.index = (context.cfg.outlets.index > 1) ? context.cfg.outlets.index - 1 : context.cfg.outlets.figures.length - 1;
				// redraw
				context.update(context);
			}
			// cancel the click
			element.blur();
		};
		// manages the thumbnails
		this.thumbnails = {};
		// build the thumbnail list
		this.thumbnails.setup = function (context) {
			// create the navigation bar
			context.cfg.outlets.slideNav = document.createElement('nav');
			context.cfg.outlets.slideNav.className = 'navigation_' + context.cfg.navigation;
			context.cfg.outlets.slideDiv = document.createElement('div');
			context.cfg.outlets.slideUl = document.createElement('ul');
			// force the height of the nav if desired
			if (context.cfg.navigation !== 'thumbtacks') {
				if (context.cfg.divide !== '100%') {
					context.cfg.outlets.slideNav.style.height = (100 - parseInt(context.cfg.divide, 10) - parseInt(context.cfg.margin, 10)) + '%';
				} else {
					context.cfg.outlets.slideNav.style.visibility = 'hidden';
				}
			}
			if (context.cfg.margin) {
				context.cfg.pixelMargin = parseInt(context.obj.offsetWidth * parseInt(context.cfg.margin, 10) / 100, 10);
			}
			// for all thumbnails in the context
			context.cfg.outlets.thumbnails = [0];
			for (var a = 1, b = context.cfg.thumbnails.length; a < b; a += 1) {
				// create a new thumbnail
				var newLi = document.createElement('li');
				var newA = document.createElement('a');
				newA.className = (a === 1) ? context.cfg.navigation + '_active' : context.cfg.navigation + '_passive';
				var newImage = document.createElement('img');
				newImage.alt = '';
				newImage.src = context.cfg.thumbnails[a];
				newA.appendChild(newImage);
				newLi.appendChild(newA);
				// assign the event handler
				newA.addEventListener('click', context.thumbnails.onSetActive(newA, context), false);
				// insert the new elements
				context.cfg.outlets.slideUl.appendChild(newLi);
				// store the dom pointers to the images
				context.cfg.outlets.thumbnails[a] = newA;
			}
			// insert the navigation bar
			context.cfg.outlets.slideDiv.appendChild(context.cfg.outlets.slideUl);
			context.cfg.outlets.slideNav.appendChild(context.cfg.outlets.slideDiv);
			context.obj.appendChild(context.cfg.outlets.slideNav);
			// start the menu
			context.thumbnails.menu.setup(context);
		};
		// redraw/recentre the thumbnails according to the context
		this.thumbnails.update = function (context) {
			// update the thumbnails menu
			context.thumbnails.menu.update(context);
			/// highlight the icons
			context.thumbnails.hightlightIcons(context);
			// it there's thumbnails
			if (context.cfg.navigation === 'thumbnails') {
				// centre the icons
				context.thumbnails.centreIcons(context);
				// centre the slider
				context.thumbnails.centreSlider(context);
			}
		};
		// highlight active icon
		this.thumbnails.hightlightIcons = function (context) {
			// for all thumbnails
			for (var a = 1, b = context.cfg.thumbnails.length; a < b; a += 1) {
				// highlight the active slide
				context.cfg.outlets.thumbnails[a].className = (context.cfg.outlets.index === a) ? context.cfg.navigation + '_active' : context.cfg.navigation + '_passive';
			}
		};
		// centre the icons in containers
		this.thumbnails.centreIcons = function (context) {
			var imageObject, imageWidth, imageHeight, rowHeight;
			// measure the available space
			rowHeight = context.cfg.outlets.slideNav.offsetHeight;
			// for all thumbnails
			for (var a = 1, b = context.cfg.thumbnails.length; a < b; a += 1) {
				// centre the image in its surroundings
				context.cfg.outlets.thumbnails[a].style.width =  rowHeight + 'px';
				imageObject = context.cfg.outlets.thumbnails[a].getElementsByTagName('img')[0];
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
		this.thumbnails.centreSlider = function (context) {
			// scroll the slider enough to center the active slide
			var activeThumbnail = context.cfg.outlets.thumbnails[context.cfg.outlets.index];
			var activePosition = activeThumbnail.offsetLeft;
			var activeWidth = activeThumbnail.offsetWidth;
			var scrollDistance = context.cfg.outlets.slideDiv.offsetWidth;
			var centeredPosition = -activePosition + scrollDistance / 2 - activeWidth / 2;
			centeredPosition = (centeredPosition > 0) ? 0 : centeredPosition;
			centeredPosition = (centeredPosition < context.cfg.scrollMax && context.cfg.scrollMax < 0) ? context.cfg.scrollMax : centeredPosition;
			// transition to the new position
			useful.transitions.byRules(
				context.cfg.outlets.slideUl,
				{'marginLeft' : centeredPosition + 'px'}
			);
		};
		// activate a corresponding figure
		this.thumbnails.onSetActive = function (element, context) {
			return function (event) {
				context.thumbnails.setActive(element, context);
				// cancel the click
				event.preventDefault();
			};
		};
		this.thumbnails.setActive = function (element, context) {
			// count which thumbnail this is
			for (var a = 1, b = context.cfg.outlets.thumbnails.length; a < b; a += 1) {
				if (context.cfg.outlets.thumbnails[a] === element) {
					// change the index to this slide
					context.cfg.outlets.index = a;
					// redraw all
					context.update(context);
				}
			}
		};
		// manages the thumbnail controls
		this.thumbnails.menu = {};
		// build the menu options
		this.thumbnails.menu.setup = function (context) {
			// create the thumbnail controls
			context.cfg.outlets.pageMenu = document.createElement('menu');
			context.cfg.outlets.pageMenu.className = 'scroller';
			context.cfg.outlets.nextPage = document.createElement('button');
			context.cfg.outlets.nextPage.className = 'next';
			context.cfg.outlets.nextPageIcon = document.createElement('span');
			context.cfg.outlets.nextPageIcon.innerHTML = '&gt';
			context.cfg.outlets.prevPage = document.createElement('button');
			context.cfg.outlets.prevPage.className = 'previous';
			context.cfg.outlets.prevPageIcon = document.createElement('span');
			context.cfg.outlets.prevPageIcon.innerHTML = '&lt';
			context.cfg.outlets.nextPage.appendChild(context.cfg.outlets.nextPageIcon);
			context.cfg.outlets.pageMenu.appendChild(context.cfg.outlets.nextPage);
			context.cfg.outlets.prevPage.appendChild(context.cfg.outlets.prevPageIcon);
			context.cfg.outlets.pageMenu.appendChild(context.cfg.outlets.prevPage);
			context.cfg.outlets.slideNav.appendChild(context.cfg.outlets.pageMenu);
			// apply clicks to the thumbnail controls
			context.cfg.outlets.nextPage.onclick = context.thumbnails.menu.next(context.cfg.outlets.nextSlide, context);
			context.cfg.outlets.prevPage.onclick = context.thumbnails.menu.prev(context.cfg.outlets.prevSlide, context);
		};
		// show or hide the previous and next buttons
		this.thumbnails.menu.update = function (context) {
			// calculate the current position
			context.cfg.scrollPosition = (context.cfg.outlets.slideUl.style.marginLeft) ? parseInt(context.cfg.outlets.slideUl.style.marginLeft, 10) : 0;
			context.cfg.scrollDistance = context.cfg.outlets.slideDiv.offsetWidth;
			// calculate the minimum position
			context.cfg.scrollMin = 0;
			// calculate the maximum position
			var lastThumbnail = context.cfg.outlets.thumbnails[context.cfg.outlets.thumbnails.length - 1];
			context.cfg.scrollStep = lastThumbnail.offsetWidth;
			context.cfg.scrollMax = -1 * (lastThumbnail.offsetLeft + lastThumbnail.offsetWidth) + context.cfg.scrollDistance;
			// show or hide the prev button
			context.cfg.outlets.prevPage.className = context.cfg.outlets.prevPage.className.replace(/ disabled/gi, '');
			context.cfg.outlets.prevPage.className += (context.cfg.scrollPosition >= context.cfg.scrollMin) ? ' disabled' : '';
			// show or hide the next button
			context.cfg.outlets.nextPage.className = context.cfg.outlets.nextPage.className.replace(/ disabled/gi, '');
			context.cfg.outlets.nextPage.className += (context.cfg.scrollPosition <= context.cfg.scrollMax && context.cfg.scrollMax < 0) ? ' disabled' : '';
		};
		// show the next page of thumbnails
		this.thumbnails.menu.next = function (element, context) {
			return function (event) {
				// get the event properties
				event = event || window.event;
				var target = event.target || event.srcElement;
				// if the button is not disabled
				if (!target.className.match(/disabled/)) {
					// scroll one page's width of thumbnails
					var newPosition = context.cfg.scrollPosition - context.cfg.scrollDistance + context.cfg.scrollStep;
					// limit the scroll distance
					if (newPosition < context.cfg.scrollMax) {
						newPosition = context.cfg.scrollMax;
					}
					// transition to the new position
					useful.transitions.byRules(context.cfg.outlets.slideUl, {'marginLeft' : newPosition + 'px'});
					// redraw the menu buttons
					context.thumbnails.menu.update(context);
				}
				// cancel the click
				target.blur();
				event.preventDefault();
			};
		};
		// show the previous page of thumbnails
		this.thumbnails.menu.prev = function (element, context) {
			return function (event) {
				// get the event properties
				event = event || window.event;
				var target = event.target || event.srcElement;
				// if the button is not disabled
				if (!target.className.match(/disabled/)) {
					// scroll one page's width of thumbnails
					var newPosition = context.cfg.scrollPosition + context.cfg.scrollDistance - context.cfg.scrollStep;
					// limit the scroll distance
					if (newPosition > 0) {
						newPosition = 0;
					}
					// transition to the new position
					if (context.cfg.navigation === 'thumbnails') {
						useful.transitions.byRules(context.cfg.outlets.slideUl, {'marginLeft' : newPosition + 'px'});
					}
					// redraw the menu buttons
					context.thumbnails.menu.update(context);
				}
				// cancel the click
				target.blur();
				event.preventDefault();
			};
		};
		// go
		this.start();
	};

}(window.useful = window.useful || {}));
