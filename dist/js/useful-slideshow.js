/*
	Source:
	van Creij, Maurice (2014). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function() {

  // Invoke strict mode
  "use strict";

  // Create a private object for this library
  useful.polyfills = {

    // enabled the use of HTML5 elements in Internet Explorer
    html5: function() {
      var a, b, elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
      if (navigator.userAgent.match(/msie/gi)) {
        for (a = 0, b = elementsList.length; a < b; a += 1) {
          document.createElement(elementsList[a]);
        }
      }
    },

    // allow array.indexOf in older browsers
    arrayIndexOf: function() {
      if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
          for (var i = (start || 0), j = this.length; i < j; i += 1) {
            if (this[i] === obj) {
              return i;
            }
          }
          return -1;
        };
      }
    },

    // allow array.isArray in older browsers
    arrayIsArray: function() {
      if (!Array.isArray) {
        Array.isArray = function(arg) {
          return Object.prototype.toString.call(arg) === '[object Array]';
        };
      }
    },

    // allow array.map in older browsers (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
    arrayMap: function() {

      // Production steps of ECMA-262, Edition 5, 15.4.4.19
      // Reference: http://es5.github.io/#x15.4.4.19
      if (!Array.prototype.map) {

        Array.prototype.map = function(callback, thisArg) {

          var T, A, k;

          if (this == null) {
            throw new TypeError(' this is null or not defined');
          }

          // 1. Let O be the result of calling ToObject passing the |this|
          //    value as the argument.
          var O = Object(this);

          // 2. Let lenValue be the result of calling the Get internal
          //    method of O with the argument "length".
          // 3. Let len be ToUint32(lenValue).
          var len = O.length >>> 0;

          // 4. If IsCallable(callback) is false, throw a TypeError exception.
          // See: http://es5.github.com/#x9.11
          if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
          }

          // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 1) {
            T = thisArg;
          }

          // 6. Let A be a new array created as if by the expression new Array(len)
          //    where Array is the standard built-in constructor with that name and
          //    len is the value of len.
          A = new Array(len);

          // 7. Let k be 0
          k = 0;

          // 8. Repeat, while k < len
          while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

              // i. Let kValue be the result of calling the Get internal
              //    method of O with argument Pk.
              kValue = O[k];

              // ii. Let mappedValue be the result of calling the Call internal
              //     method of callback with T as the this value and argument
              //     list containing kValue, k, and O.
              mappedValue = callback.call(T, kValue, k, O);

              // iii. Call the DefineOwnProperty internal method of A with arguments
              // Pk, Property Descriptor
              // { Value: mappedValue,
              //   Writable: true,
              //   Enumerable: true,
              //   Configurable: true },
              // and false.

              // In browsers that support Object.defineProperty, use the following:
              // Object.defineProperty(A, k, {
              //   value: mappedValue,
              //   writable: true,
              //   enumerable: true,
              //   configurable: true
              // });

              // For best browser support, use the following:
              A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
          }

          // 9. return A
          return A;
        };
      }

    },

    // allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
    querySelectorAll: function() {
      if (!document.querySelectorAll) {
        document.querySelectorAll = function(a) {
          var b = document,
            c = b.documentElement.firstChild,
            d = b.createElement("STYLE");
          return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
        };
      }
    },

    // allow addEventListener (https://gist.github.com/jonathantneal/3748027)
    addEventListener: function() {
      !window.addEventListener && (function(WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
        WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function(type, listener) {
          var target = this;
          registry.unshift([target, type, listener, function(event) {
            event.currentTarget = target;
            event.preventDefault = function() {
              event.returnValue = false;
            };
            event.stopPropagation = function() {
              event.cancelBubble = true;
            };
            event.target = event.srcElement || target;
            listener.call(target, event);
          }]);
          this.attachEvent("on" + type, registry[0][3]);
        };
        WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function(type, listener) {
          for (var index = 0, register; register = registry[index]; ++index) {
            if (register[0] == this && register[1] == type && register[2] == listener) {
              return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
            }
          }
        };
        WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function(eventObject) {
          return this.fireEvent("on" + eventObject.type, eventObject);
        };
      })(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
    },

    // allow console.log
    consoleLog: function() {
      var overrideTest = new RegExp('console-log', 'i');
      if (!window.console || overrideTest.test(document.querySelectorAll('html')[0].className)) {
        window.console = {};
        window.console.log = function() {
          // if the reporting panel doesn't exist
          var a, b, messages = '',
            reportPanel = document.getElementById('reportPanel');
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
    objectCreate: function() {
      if (typeof Object.create !== "function") {
        Object.create = function(original) {
          function Clone() {}
          Clone.prototype = original;
          return new Clone();
        };
      }
    },

    // allows String.trim (https://gist.github.com/eliperelman/1035982)
    stringTrim: function() {
      if (!String.prototype.trim) {
        String.prototype.trim = function() {
          return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
        };
      }
      if (!String.prototype.ltrim) {
        String.prototype.ltrim = function() {
          return this.replace(/^\s+/, '');
        };
      }
      if (!String.prototype.rtrim) {
        String.prototype.rtrim = function() {
          return this.replace(/\s+$/, '');
        };
      }
      if (!String.prototype.fulltrim) {
        String.prototype.fulltrim = function() {
          return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
        };
      }
    },

    // allows localStorage support
    localStorage: function() {
      if (!window.localStorage) {
        if (/MSIE 8|MSIE 7|MSIE 6/i.test(navigator.userAgent)) {
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
    },

    // allows bind support
    functionBind: function() {
      // Credit to Douglas Crockford for this bind method
      if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
          if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
          }
          var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
              return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
          fNOP.prototype = this.prototype;
          fBound.prototype = new fNOP();
          return fBound;
        };
      }
    }

  };

  // startup
  useful.polyfills.html5();
  useful.polyfills.arrayIndexOf();
  useful.polyfills.arrayIsArray();
  useful.polyfills.arrayMap();
  useful.polyfills.querySelectorAll();
  useful.polyfills.addEventListener();
  useful.polyfills.consoleLog();
  useful.polyfills.objectCreate();
  useful.polyfills.stringTrim();
  useful.polyfills.localStorage();
  useful.polyfills.functionBind();

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

	// PROPERTIES

	"use strict";
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

	// PROPERTIES

	"use strict";
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
useful.Slideshow.prototype.Main = function (config, context) {

	// PROPERTIES

	"use strict";
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
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow.Main;
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

	// PROPERTIES

	"use strict";
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
				useful.transitions.byRules(config.outlets.slideUl, {'marginLeft' : newPosition + 'px'});
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
					useful.transitions.byRules(config.outlets.slideUl, {'marginLeft' : newPosition + 'px'});
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

	// PROPERTIES
	
	"use strict";
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
useful.Slideshow.prototype.init = function (config) {

	// PROPERTIES
	
	"use strict";

	// METHODS
	
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

	// START

	return (config.elements) ? this.each(config) : this.only(config);

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Slideshow;
}
