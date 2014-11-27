/*
	Source:
	van Creij, Maurice (2014). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.polyfills = {

		// enabled the use of HTML5 elements in Internet Explorer
		html5 : function () {
			var a, b, elementsList;
			elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
			if (navigator.userAgent.match(/msie/gi)) {
				for (a = 0 , b = elementsList.length; a < b; a += 1) {
					document.createElement(elementsList[a]);
				}
			}
		},

		// allow array.indexOf in older browsers
		arrayIndexOf : function () {
			if (!Array.prototype.indexOf) {
				Array.prototype.indexOf = function (obj, start) {
					for (var i = (start || 0), j = this.length; i < j; i += 1) {
						if (this[i] === obj) { return i; }
					}
					return -1;
				};
			}
		},

		// allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
		querySelectorAll : function () {
			if (!document.querySelectorAll) {
				document.querySelectorAll = function (a) {
					var b = document, c = b.documentElement.firstChild, d = b.createElement("STYLE");
					return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
				};
			}
		},

		// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
		addEventListener : function () {
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
		},

		// allow console.log
		consoleLog : function () {
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
		},

		// allows Object.create (https://gist.github.com/rxgx/1597825)
		objectCreate : function () {
			if (typeof Object.create !== "function") {
				Object.create = function (original) {
					function Clone() {}
					Clone.prototype = original;
					return new Clone();
				};
			}
		},

		// allows String.trim (https://gist.github.com/eliperelman/1035982)
		stringTrim : function () {
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
		},

		// allows localStorage support
		localStorage : function () {
			if (!window.localStorage) {
				if (/MSIE 8|MSIE 7|MSIE 6/i.test(navigator.userAgent)){
					window.localStorage = {
						getItem: function(sKey) {
							if (!sKey || !this.hasOwnProperty(sKey)) {
								return null;
							}
							return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
						},
						key: function(nKeyId) {
							return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
						},
						setItem: function(sKey, sValue) {
							if (!sKey) {
								return;
							}
							document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
							this.length = document.cookie.match(/\=/g).length;
						},
						length: 0,
						removeItem: function(sKey) {
							if (!sKey || !this.hasOwnProperty(sKey)) {
								return;
							}
							document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
							this.length--;
						},
						hasOwnProperty: function(sKey) {
							return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
						}
					};
					window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
				} else {
				    Object.defineProperty(window, "localStorage", new(function() {
				        var aKeys = [],
				            oStorage = {};
				        Object.defineProperty(oStorage, "getItem", {
				            value: function(sKey) {
				                return sKey ? this[sKey] : null;
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "key", {
				            value: function(nKeyId) {
				                return aKeys[nKeyId];
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "setItem", {
				            value: function(sKey, sValue) {
				                if (!sKey) {
				                    return;
				                }
				                document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "length", {
				            get: function() {
				                return aKeys.length;
				            },
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "removeItem", {
				            value: function(sKey) {
				                if (!sKey) {
				                    return;
				                }
				                document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        this.get = function() {
				            var iThisIndx;
				            for (var sKey in oStorage) {
				                iThisIndx = aKeys.indexOf(sKey);
				                if (iThisIndx === -1) {
				                    oStorage.setItem(sKey, oStorage[sKey]);
				                } else {
				                    aKeys.splice(iThisIndx, 1);
				                }
				                delete oStorage[sKey];
				            }
				            for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
				                oStorage.removeItem(aKeys[0]);
				            }
				            for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
				                aCouple = aCouples[nIdx].split(/\s*=\s*/);
				                if (aCouple.length > 1) {
				                    oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
				                    aKeys.push(iKey);
				                }
				            }
				            return oStorage;
				        };
				        this.configurable = false;
				        this.enumerable = true;
				    })());
				}
			}
		}

	};

	// startup
	useful.polyfills.html5();
	useful.polyfills.arrayIndexOf();
	useful.polyfills.querySelectorAll();
	useful.polyfills.addEventListener();
	useful.polyfills.consoleLog();
	useful.polyfills.objectCreate();
	useful.polyfills.stringTrim();
	useful.polyfills.localStorage();

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.polyfills;
	}

})();

/*
	Source:
	van Creij, Maurice (2014). "useful.transitions.js: A library of useful functions to ease working with CSS3 transitions.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.transitions = {

		// applies functionality to node that conform to a given CSS rule, or returns them
		select : function (input, parent) {
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
		},

		// checks the compatibility of CSS3 transitions for this browser
		compatibility : function () {
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
		},

		// performs a transition between two classnames
		byClass : function (element, removedClass, addedClass, endEventHandler, jQueryDuration, jQueryEasing) {
			var replaceThis, replaceWith, endEventName, endEventFunction;
			// validate the input
			endEventHandler = endEventHandler || function () {};
			endEventName = this.compatibility();
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
		},

		// adds the relevant browser prefix to a style property
		prefix : function (property) {
			// pick the prefix that goes with the browser
			return (navigator.userAgent.match(/webkit/gi)) ? 'webkit' + property.substr(0, 1).toUpperCase() + property.substr(1):
				(navigator.userAgent.match(/firefox/gi)) ? 'Moz' + property.substr(0, 1).toUpperCase() + property.substr(1):
				(navigator.userAgent.match(/microsoft/gi)) ? 'ms' + property.substr(0, 1).toUpperCase() + property.substr(1):
				(navigator.userAgent.match(/opera/gi)) ? 'O' + property.substr(0, 1).toUpperCase() + property.substr(1):
				property;
		},

		// applies a list of rules
		byRules : function (element, rules, endEventHandler) {
			var rule, endEventName, endEventFunction;
			// validate the input
			rules.transitionProperty = rules.transitionProperty || 'all';
			rules.transitionDuration = rules.transitionDuration || '300ms';
			rules.transitionTimingFunction = rules.transitionTimingFunction || 'ease';
			endEventHandler = endEventHandler || function () {};
			endEventName = this.compatibility();
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
						element.style[this.compatibility(rule)] = rules[rule];
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
						element.style[this.compatibility(rule)] = rules[rule];
						// implement the value
						element.style[rule] = rules[rule];
					}
				}
				// call the onComplete handler
				endEventHandler();
			}
		}

	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.transitions;
	}

})();

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
useful.Slideshow.prototype.Automatic = function (parent) {
	// properties
	"use strict";
	this.root = parent;
	this.parent = parent;
	// methods
	this.setup = function () {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		var _this = this;
		// if a hover option exists
		if (cfg.hover && cfg.hover === 'pause') {
			// stop the slideshow on hover
			root.obj.onmouseover = function () {
				_this.stop();
			};
			// restart the slideshow after hover
			root.obj.onmouseout = function () {
				_this.start();
			};
		}
		// if an idle timer exists
		if (cfg.idle && cfg.idle >= 0) {
			// run the update at an interval
			this.start();
		}
	};
	this.start = function () {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// stop any previous timeout loop
		clearTimeout(cfg.idleTimeout);
		// start the timeout loop
		cfg.idleTimeout = setInterval(function () {
			// move to the next slide
			cfg.outlets.index = (cfg.outlets.index < cfg.outlets.figures.length - 1) ? cfg.outlets.index + 1 : 1;
			// redraw
			root.update();
		}, cfg.idle);
	};
	this.stop = function () {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// stop the timeout loop
		clearTimeout(cfg.idleTimeout);
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow.Automatic;
}

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
useful.Slideshow.prototype.FiguresMenu = function (parent) {
	// properties
	"use strict";
	this.root = parent.parent;
	this.parent = parent;
	// build the menu options
	this.setup = function () {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// create the slide controls
		cfg.outlets.slideMenu = document.createElement('menu');
		cfg.outlets.slideMenu.className = 'pager';
		cfg.outlets.nextSlide = document.createElement('button');
		cfg.outlets.nextSlide.className = 'next';
		cfg.outlets.nextSlideIcon = document.createElement('span');
		cfg.outlets.nextSlideIcon.innerHTML = '&gt';
		cfg.outlets.prevSlide = document.createElement('button');
		cfg.outlets.prevSlide.className = 'previous';
		cfg.outlets.prevSlideIcon = document.createElement('span');
		cfg.outlets.prevSlideIcon.innerHTML = '&lt';
		cfg.outlets.nextSlide.appendChild(cfg.outlets.nextSlideIcon);
		cfg.outlets.slideMenu.appendChild(cfg.outlets.nextSlide);
		cfg.outlets.prevSlide.appendChild(cfg.outlets.prevSlideIcon);
		cfg.outlets.slideMenu.appendChild(cfg.outlets.prevSlide);
		root.obj.appendChild(cfg.outlets.slideMenu);
		// force the height of the menu if desired
		if (cfg.divide) {
			cfg.outlets.slideMenu.style.height = cfg.divide;
		}
		// apply clicks to the slide controls
		cfg.outlets.nextSlide.addEventListener('click', this.onNext(cfg.outlets.nextSlide), false);
		cfg.outlets.prevSlide.addEventListener('click', this.onPrev(cfg.outlets.prevSlide), false);
	};
	// show or hide the previous and next buttons
	this.update = function () {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// hide the previous button if the index is near the left terminus
		if (cfg.outlets.prevSlide) {
			cfg.outlets.prevSlide.className = cfg.outlets.prevSlide.className.replace(/ disabled/gi, '');
			cfg.outlets.prevSlide.className += (cfg.outlets.index > 1) ? '' : ' disabled';
		}
		// hide the next button if the index is new the right terminus
		if (cfg.outlets.nextSlide) {
			cfg.outlets.nextSlide.className = cfg.outlets.nextSlide.className.replace(/ disabled/gi, '');
			cfg.outlets.nextSlide.className += (cfg.outlets.index < cfg.outlets.figures.length - 1) ? '' : ' disabled';
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
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// if the element is not disabled
		if (!element.className.match(/disabled/)) {
			// increase the index
			cfg.outlets.index = (cfg.outlets.index < cfg.outlets.figures.length - 1) ? cfg.outlets.index + 1 : 1;
			// redraw
			root.update();
		}
		// cancel the click
		element.blur();
	};
	// activate the previous slide
	this.onPrev = function (element) {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		var _this = this;
		return function (event) {
			_this.prev(element);
			event.preventDefault();
		};
	};
	this.prev = function (element) {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// if the element is not disabled
		if (!element.className.match(/disabled/)) {
			// increase the index
			cfg.outlets.index = (cfg.outlets.index > 1) ? cfg.outlets.index - 1 : cfg.outlets.figures.length - 1;
			// redraw
			root.update();
		}
		// cancel the click
		element.blur();
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow.FiguresMenu;
}

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
useful.Slideshow.prototype.ThumbnailsMenu = function (parent) {
	// properties
	"use strict";
	this.root = parent.parent;
	this.parent = parent;
	// build the menu options
	this.setup = function () {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// create the thumbnail controls
		cfg.outlets.pageMenu = document.createElement('menu');
		cfg.outlets.pageMenu.className = 'scroller';
		cfg.outlets.nextPage = document.createElement('button');
		cfg.outlets.nextPage.className = 'next';
		cfg.outlets.nextPageIcon = document.createElement('span');
		cfg.outlets.nextPageIcon.innerHTML = '&gt';
		cfg.outlets.prevPage = document.createElement('button');
		cfg.outlets.prevPage.className = 'previous';
		cfg.outlets.prevPageIcon = document.createElement('span');
		cfg.outlets.prevPageIcon.innerHTML = '&lt';
		cfg.outlets.nextPage.appendChild(cfg.outlets.nextPageIcon);
		cfg.outlets.pageMenu.appendChild(cfg.outlets.nextPage);
		cfg.outlets.prevPage.appendChild(cfg.outlets.prevPageIcon);
		cfg.outlets.pageMenu.appendChild(cfg.outlets.prevPage);
		cfg.outlets.slideNav.appendChild(cfg.outlets.pageMenu);
		// apply clicks to the thumbnail controls
		cfg.outlets.nextPage.onclick = this.next(cfg.outlets.nextSlide);
		cfg.outlets.prevPage.onclick = this.prev(cfg.outlets.prevSlide);
	};
	// show or hide the previous and next buttons
	this.update = function () {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		// calculate the current position
		cfg.scrollPosition = (cfg.outlets.slideUl.style.marginLeft) ? parseInt(cfg.outlets.slideUl.style.marginLeft, 10) : 0;
		cfg.scrollDistance = cfg.outlets.slideDiv.offsetWidth;
		// calculate the minimum position
		cfg.scrollMin = 0;
		// calculate the maximum position
		var lastThumbnail = cfg.outlets.thumbnails[cfg.outlets.thumbnails.length - 1];
		cfg.scrollStep = lastThumbnail.offsetWidth;
		cfg.scrollMax = -1 * (lastThumbnail.offsetLeft + lastThumbnail.offsetWidth) + cfg.scrollDistance;
		// show or hide the prev button
		cfg.outlets.prevPage.className = cfg.outlets.prevPage.className.replace(/ disabled/gi, '');
		cfg.outlets.prevPage.className += (cfg.scrollPosition >= cfg.scrollMin) ? ' disabled' : '';
		// show or hide the next button
		cfg.outlets.nextPage.className = cfg.outlets.nextPage.className.replace(/ disabled/gi, '');
		cfg.outlets.nextPage.className += (cfg.scrollPosition <= cfg.scrollMax && cfg.scrollMax < 0) ? ' disabled' : '';
	};
	// show the next page of thumbnails
	this.next = function (element) {
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		var _this = this;
		return function (event) {
			// get the event properties
			event = event || window.event;
			var target = event.target || event.srcElement;
			// if the button is not disabled
			if (!target.className.match(/disabled/)) {
				// scroll one page's width of thumbnails
				var newPosition = cfg.scrollPosition - cfg.scrollDistance + cfg.scrollStep;
				// limit the scroll distance
				if (newPosition < cfg.scrollMax) {
					newPosition = cfg.scrollMax;
				}
				// transition to the new position
				useful.transitions.byRules(cfg.outlets.slideUl, {'marginLeft' : newPosition + 'px'});
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
		var parent = this.parent, root = this.root, cfg = this.root.cfg;
		var _this = this;
		return function (event) {
			// get the event properties
			event = event || window.event;
			var target = event.target || event.srcElement;
			// if the button is not disabled
			if (!target.className.match(/disabled/)) {
				// scroll one page's width of thumbnails
				var newPosition = cfg.scrollPosition + cfg.scrollDistance - cfg.scrollStep;
				// limit the scroll distance
				if (newPosition > 0) {
					newPosition = 0;
				}
				// transition to the new position
				if (cfg.navigation === 'thumbnails') {
					useful.transitions.byRules(cfg.outlets.slideUl, {'marginLeft' : newPosition + 'px'});
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

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow.ThumbnailsMenu;
}

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
useful.Slideshow.prototype.Touch = function (parent) {
	// properties
	"use strict";
	this.root = parent;
	this.parent = parent;
	this.x = null;
	this.y = null;
	// methods
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
	exports = module.exports = useful.Slideshow.Touch;
}

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
useful.Slideshow.prototype.init = function (cfg) {
	// properties
	"use strict";
	this.cfg = cfg;
	this.obj = cfg.element;
	// methods
	this.start = function () {
		var _this = this;
		// use the fallback to gather the asset urls
		if (!this.cfg.outlets) {
			// create the object to hold all the interface pointers
			this.cfg.outlets = {};
			// get the assets from the fallback html
			this.cfg.thumbnails = [0];
			this.cfg.figures = [0];
			this.cfg.titles = [0];
			this.cfg.descriptions = [0];
			this.cfg.longdescs = [0];
			var allLinks = this.obj.getElementsByTagName('a');
			var allImages = this.obj.getElementsByTagName('img');
			this.cfg.hasLinks = (allLinks.length === allImages.length);
			for (var a = 0; a < allImages.length; a += 1) {
				// create a list of thumbnail urls and full urls
				this.cfg.thumbnails.push(allImages[a].src);
				this.cfg.titles.push(allImages[a].getAttribute('title'));
				this.cfg.descriptions.push(allImages[a].getAttribute('alt'));
				this.cfg.longdescs.push(allImages[a].getAttribute('longdesc'));
				this.cfg.figures[this.cfg.figures.length] = (this.cfg.hasLinks) ? allLinks[a].href : allImages[a].src;
			}
			// pick the initial active slide
			this.cfg.outlets.index = 1;
		}
		// retry delay
		this.cfg.retry = null;
		// hide the component
		this.obj.style.visibility = 'hidden';
		setTimeout(function () {
			// start the components
			_this.setup();
			setTimeout(function () {
				// start the redraw
				_this.update();
				// reveal the component
				_this.obj.style.visibility = 'visible';
			}, 900);
		}, 100);
		// disable the start function so it can't be started twice
		this.init = function () {};
	};
	// build the slideshow container
	this.setup = function () {
		// set the main captions class
		this.obj.className += ' captions_' + this.cfg.captions;
		// set the main scaling class
		this.obj.className += ' scaling_' + this.cfg.scaling;
		// clear the parent element
		this.obj.innerHTML = '';
		// apply optional dimensions
		if (this.cfg.width) {
			this.obj.style.width = this.cfg.width + this.cfg.widthUnit;
		}
		if (this.cfg.height) {
			this.obj.style.height = this.cfg.height + this.cfg.heightUnit;
		}
		// apply the custom styles
		this.styling();
		// add the mousewheel events
		this.obj.addEventListener('mousewheel', this.wheel(), false);
		this.obj.addEventListener('DOMMouseScroll', this.wheel(), false);
		// add the touch events
		this.obj.addEventListener('touchstart', this.touch.start(), false);
		this.obj.addEventListener('touchmove', this.touch.move(), false);
		this.obj.addEventListener('touchend', this.touch.end(), false);
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
			sheet.insertRule(".slideshow button {background-color : " + this.cfg.colorPassive + " !important;}", 0);
			sheet.insertRule(".slideshow button:hover {background-color : " + this.cfg.colorHover + " !important;}", 0);
			sheet.insertRule(".slideshow button.disabled {background-color : " + this.cfg.colorDisabled + " !important;}", 0);
			sheet.insertRule(".slideshow .thumbnails_active {background-color : " + this.cfg.colorPassive + " !important;}", 0);
			sheet.insertRule(".slideshow .thumbtacks_active {background-color : " + this.cfg.colorPassive + " !important;}", 0);
		} else {
			sheet.addRule(".slideshow button", "background-color : " + this.cfg.colorPassive + " !important;", 0);
			sheet.addRule(".slideshow button:hover", "background-color : " + this.cfg.colorHover + " !important;", 0);
			sheet.addRule(".slideshow button.disabled", "background-color : " + this.cfg.colorDisabled + " !important;", 0);
			sheet.addRule(".slideshow .thumbnails_active", "background-color : " + this.cfg.colorPassive + " !important;", 0);
			sheet.addRule(".slideshow .thumbtacks_active", "background-color : " + this.cfg.colorPassive + " !important;", 0);
		}
	};
	// updates the whole app
	this.update = function () {
		var _this = this;
		// if the slideshow has been disabled
		if (this.obj.offsetHeight === 0) {
			// stop updating and try again later
			clearTimeout(this.cfg.retry);
			this.cfg.retry = setTimeout(function () {
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
		this.cfg.outlets.index = index;
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
			if (distance < 0 && _this.cfg.outlets.index > 1) {
				// trigger a step
				_this.figures.menu.prev(_this.cfg.outlets.prevSlide);
			} else if (distance > 0 && _this.cfg.outlets.index < _this.cfg.outlets.figures.length - 1) {
				// trigger a step
				_this.figures.menu.next(_this.cfg.outlets.nextSlide);
			}
			// cancel the scrolling
			event.preventDefault();
		};
	};
	// touch screen controls
	this.touch = new this.Touch(this);
	// automatic idle slideshow
	this.automatic = new this.Automatic(this);
	// manages the figures
	this.figures = new this.Figures(this);
	// manages the thumbnails
	this.thumbnails = new this.Thumbnails(this);
	// go
	this.start();
	return this;
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow;
}
