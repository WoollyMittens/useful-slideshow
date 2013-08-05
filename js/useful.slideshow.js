/*
	Source:
	van Creij, Maurice (2012). "useful.slideshow.js: A simple slideshow", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Prerequisites:
	<script src="./js/useful.js"></script>
	<!--[if IE]>
		<script src="./js/html5.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
	<![endif]-->
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	var slideshow = {};
	slideshow = {
		start : function (view, model) {
			// use the fallback to gather the asset urls
			if (!model.outlets) {
				// create the object to hold all the interface pointers
				model.outlets = {};
				// get the assets from the fallback html
				model.thumbnails = [0];
				model.figures = [0];
				model.titles = [0];
				model.descriptions = [0];
				model.longdescs = [0];
				var allLinks = view.getElementsByTagName('a');
				var allImages = view.getElementsByTagName('img');
				model.hasLinks = (allLinks.length === allImages.length);
				for (var a = 0; a < allImages.length; a += 1) {
					// create a list of thumbnail urls and full urls
					model.thumbnails.push(allImages[a].src);
					model.titles.push(allImages[a].getAttribute('title'));
					model.descriptions.push(allImages[a].getAttribute('alt'));
					model.longdescs.push(allImages[a].getAttribute('longdesc'));
					model.figures[model.figures.length] = (model.hasLinks) ? allLinks[a].href : allImages[a].src;
				}
				// pick the initial active slide
				model.outlets.index = 1;
				// store the parent view
				model.outlets.parent = view;
			}
			// retry delay
			model.retry = null;
			// hide the component
			model.outlets.parent.style.visibility = 'hidden';
			setTimeout(function () {
				// start the components
				slideshow.setup(model);
				setTimeout(function () {
					// start the redraw
					slideshow.update(model);
					// reveal the component
					model.outlets.parent.style.visibility = 'visible';
				}, 900);
			}, 100);
		},
		// build the slideshow container
		setup : function (model) {
			// shortcut pointers
			var sip = model.outlets.parent;
			// set the main captions class
			sip.className += ' captions_' + model.captions;
			// set the main scaling class
			sip.className += ' scaling_' + model.scaling;
			// clear the parent element
			sip.innerHTML = '';
			// apply optional dimensions
			if (model.width) {
				sip.style.width = model.width + model.widthUnit;
			}
			if (model.height) {
				sip.style.height = model.height + model.heightUnit;
			}
			// add the mousewheel events
			if (sip.addEventListener) {
				sip.addEventListener('mousewheel', function (event) {
					slideshow.wheel(event, model);
				}, false);
			} else {
				sip.attachEvent('onmousewheel', function (event) {
					slideshow.wheel(event, model);
				});
			}
			if (sip.addEventListener) {
				sip.addEventListener('DOMMouseScroll', function (event) {
					slideshow.wheel(event, model);
				}, false);
			}
			// add the touch events
			sip.ontouchstart = function (event) {
				slideshow.touch.start(event, model);
			};
			sip.ontouchmove = function (event) {
				slideshow.touch.move(event, model);
			};
			sip.ontouchend = function (event) {
				slideshow.touch.end(event, model);
			};
			// start the sub components
			slideshow.figures.setup(model);
			slideshow.thumbnails.setup(model);
			slideshow.automatic.setup(model);
		},
		// updates the whole app
		update : function (model) {
			// if the slideshow has been disabled
			if (model.outlets.parent.offsetHeight === 0) {
				// stop updating and try again later
				clearTimeout(model.retry);
				model.retry = setTimeout(function () {
					slideshow.update(model);
				}, 1000);
			// else
			} else {
				// update the figures
				slideshow.figures.update(model);
				// update the slideshow
				slideshow.thumbnails.update(model);
			}
		},
		// mouse wheel controls
		wheel : function (event, model) {
			// get the reading from the mouse wheel
			var distance = (window.event) ? window.event.wheelDelta / 120 : -event.detail / 3;
			// do not loop around
			if (distance < 0 && model.outlets.index > 1) {
				// trigger a step
				slideshow.figures.menu.prev(
					{'target' : model.outlets.prevSlide},
					model.outlets.prevSlide,
					model
				);
			} else if (distance > 0 && model.outlets.index < model.outlets.figures.length - 1) {
				// trigger a step
				slideshow.figures.menu.next(
					{'target' : model.outlets.nextSlide},
					model.outlets.nextSlide,
					model
				);
			}
			// cancel the scrolling
			useful.events.cancel(event);
		},
		// touch screen controls
		touch : {
			x : null,
			y : null,
			start : function (event, model) {
				// store the touch positions
				slideshow.touch.x = event.touches[0].pageX;
				slideshow.touch.y = event.touches[0].pageY;
				slideshow.touch.sensitivity = model.outlets.parent.offsetWidth * 0.6;
				// cancel the automatic slideshow
				slideshow.automatic.stop(model);
			},
			move : function (event, model) {
				// if there is a touch in progress
				if (slideshow.touch.x) {
					// measure the distance
					var xDistance = event.touches[0].pageX - slideshow.touch.x;
					var yDistance = event.touches[0].pageY - slideshow.touch.y;
					var sensitivity = slideshow.touch.sensitivity;
					// if there is no vertical gesture
					if (Math.abs(yDistance) < sensitivity) {
						// if the horizontal gesture distance is over a certain amount
						if (xDistance < -1 * sensitivity && model.outlets.index < model.outlets.figures.length - 1) {
							// trigger the movement
							slideshow.figures.menu.next(
								{'target' : model.outlets.nextSlide},
								model.outlets.nextSlide,
								model
							);
							// reset the positions
							slideshow.touch.x = 0;
							slideshow.touch.y = 0;
						} else if (xDistance > sensitivity && model.outlets.index > 1) {
							// trigger the movement
							slideshow.figures.menu.prev(
								{'target' : model.outlets.prevSlide},
								model.outlets.prevSlide,
								model
							);
							// reset the positions
							slideshow.touch.x = 0;
							slideshow.touch.y = 0;
						}
						// cancel the default
						useful.events.cancel(event);
					}
				}
			},
			end : function (event, model) {
				// clear the positions
				slideshow.touch.x = null;
				slideshow.touch.y = null;
				// restart the automatic slideshow
				if (model.hover && model.hover === 'pause') {
					slideshow.automatic.start(model);
				}
			}
		},
		// automatic idle slideshow
		automatic : {
			setup : function (model) {
				// shortcut pointers
				var sip = model.outlets.parent;
				var uga = slideshow.automatic;
				// if a hover option exists
				if (model.hover && model.hover === 'pause') {
					// stop the slideshow on hover
					sip.onmouseover = function () {
						uga.stop(model);
					};
					// restart the slideshow after hover
					sip.onmouseout = function () {
						uga.start(model);
					};
				}
				// if an idle timer exists
				if (model.idle && model.idle >= 0) {
					// run the update at an interval
					uga.start(model);
				}
			},
			start : function (model) {
				// stop any previous timeout loop
				clearTimeout(model.idleTimeout);
				// start the timeout loop
				model.idleTimeout = setInterval(function () {
					// move to the next slide
					model.outlets.index = (model.outlets.index < model.outlets.figures.length - 1) ? model.outlets.index + 1 : 1;
					// redraw
					slideshow.update(model);
				}, model.idle);
			},
			stop : function (model) {
				// stop the timeout loop
				clearTimeout(model.idleTimeout);
			}
		},
		// manages the figures
		figures : {
			// build the figures
			setup : function (model) {
				// for all figures in the model
				model.outlets.figures = [0];
				for (var a = 1; a < model.figures.length; a += 1) {
					// create a new slide
					var newFigure = document.createElement('figure');
					newFigure.className = (a === 1) ? ' ' + model.transition + '_current' : ' ' + model.transition + '_next';
					var newImage = document.createElement('img');
					newImage.src = model.thumbnails[a];	// * start out with the thumbnails instead of the full images
					newImage.setAttribute('alt', '');
					newFigure.appendChild(newImage);
					// set the event handlers
					slideshow.figures.events.imageLoad(newImage, model);
					slideshow.figures.events.imageClick(a, newImage, model);
					// create the caption if there is content for it
					var newCaptionText = '';
					newCaptionText += (model.titles && model.titles[a]) ? '<strong>' + model.titles[a] + '</strong> ' : '';
					newCaptionText += (model.descriptions && model.descriptions[a]) ? model.descriptions[a] : '';
					if (newCaptionText !== '') {
						var newCaption = document.createElement('figcaption');
						newCaption.innerHTML = newCaptionText;
						newFigure.appendChild(newCaption);
					}
					// force the height of the slide if desired
					newFigure.style.height = (model.navigation === 'thumbtacks') ? '100%' : model.divide;
					// implement the transition speed
					if (model.speed) {
						newFigure.style.msTransitionDuration = model.speed / 1000 + 's';
						newFigure.style.OTransitionDuration = model.speed / 1000 + 's';
						newFigure.style.WebkitTransitionDuration = model.speed / 1000 + 's';
						newFigure.style.MozTransitionDuration = model.speed / 1000 + 's';
						newFigure.style.transitionDuration = model.speed / 1000 + 's';
					}
					// implement the transition timing
					if (model.ease) {
						newFigure.style.msTransitionTimingFunction = model.ease;
						newFigure.style.OTransitionTimingFunction = model.ease;
						newFigure.style.WebkitTransitionTimingFunction = model.ease;
						newFigure.style.MozTransitionTimingFunction = model.ease;
						newFigure.style.transitionTimingFunction = model.ease;
					}
					// insert the new elements
					model.outlets.parent.appendChild(newFigure);
					// store the dom pointers to the images
					model.outlets.figures[a] = newFigure;
				}
				// start the menu
				slideshow.figures.menu.setup(model);
			},
			// handlers for the interaction events
			events : {
				imageLoad : function (image, model) {
					image.onload = function () {
						slideshow.figures.update(model);
					};
				},
				imageClick : function (index, image, model) {
					// if there was a longdesc
					if (model.longdescs[index]) {
						// change the slide into a link
						image.style.cursor = 'pointer';
						image.onclick = function () {
							document.location.href = model.longdescs[index];
						};
					}
				}
			},
			// show the correct slide
			update : function (model) {
				// for all the figures
				for (var a = 1, b = model.outlets.figures.length; a < b; a += 1) {
					// get the target figure
					var targetFigure = model.outlets.figures[a];
					var targetImage = targetFigure.getElementsByTagName('img')[0];
					var oldClassName = model.transition + '_' + targetFigure.className.split('_')[1];
					// if the ratio hasn't been determined yet
					if (!targetImage.className.match(/ratio/gi)) {
						// determine the aspect ratio of the image
						targetImage.className = (targetImage.offsetWidth > targetImage.offsetHeight) ? 'ratio_landscape' : 'ratio_portrait';
					}
					// if the image is narrower than the figure and the scaling is set to fill or the image is wider than the figure and the scaling is set to fit
					if (
						(model.scaling === 'fill' && (targetImage.offsetWidth < targetFigure.offsetWidth || targetImage.offsetHeight < targetFigure.offsetHeight)) ||
						(model.scaling === 'fit' && (targetImage.offsetWidth > targetFigure.offsetWidth || targetImage.offsetHeight > targetFigure.offsetHeight))
					) {
						// flip the aspect ratio
						if (targetImage.className.match(/ratio/gi)) {
							targetImage.className = (targetImage.className === 'ratio_landscape') ? 'ratio_portrait' : 'ratio_landscape';
						}
					}
					// if the figure is before the index
					var newClassName;
					if (a < model.outlets.index) {
						// change the class name according to its position
						newClassName = model.transition + '_previous';
					// the figure is after the index
					} else if (a > model.outlets.index) {
						// change the class name according to its position
						newClassName = model.transition + '_next';
					// else if the figure is the index
					} else {
						// change the class name according to its position
						newClassName = model.transition + '_current';
					}
					// if the slide is near the active one
					if (Math.abs(a - model.outlets.index) < model.preload) {
						// if the slide is not using the full figure url
						if (targetImage.src !== model.figures[a]) {
							// change it's thumbnail url to the figure url
							targetImage.src = model.figures[a];
						}
					}
					// vertically center the slide
					targetImage.style.marginTop = Math.round(targetImage.offsetHeight / -2) + 'px';
					targetImage.style.marginLeft = Math.round(targetImage.offsetWidth / -2) + 'px';
					// perform the transition
					useful.css.setClass(targetFigure, oldClassName, newClassName);
				}
				// update the menu as well
				slideshow.figures.menu.update(model);
			},
			// manages the slide controls
			menu : {
				// build the menu options
				setup : function (model) {
					// create the slide controls
					model.outlets.slideMenu = document.createElement('menu');
					model.outlets.slideMenu.className = 'pager';
					model.outlets.nextSlide = document.createElement('button');
					model.outlets.nextSlide.className = 'next';
					model.outlets.nextSlideIcon = document.createElement('span');
					model.outlets.nextSlideIcon.innerHTML = '&gt';
					model.outlets.prevSlide = document.createElement('button');
					model.outlets.prevSlide.className = 'previous';
					model.outlets.prevSlideIcon = document.createElement('span');
					model.outlets.prevSlideIcon.innerHTML = '&lt';
					model.outlets.nextSlide.appendChild(model.outlets.nextSlideIcon);
					model.outlets.slideMenu.appendChild(model.outlets.nextSlide);
					model.outlets.prevSlide.appendChild(model.outlets.prevSlideIcon);
					model.outlets.slideMenu.appendChild(model.outlets.prevSlide);
					model.outlets.parent.appendChild(model.outlets.slideMenu);
					// force the height of the menu if desired
					if (model.divide) {
						model.outlets.slideMenu.style.height = model.divide;
					}
					// apply clicks to the slide controls
					model.outlets.nextSlide.onclick = function (event) {
						slideshow.figures.menu.next(event, model.outlets.nextSlide, model);
					};
					model.outlets.prevSlide.onclick = function (event) {
						slideshow.figures.menu.prev(event, model.outlets.prevSlide, model);
					};
				},
				// show or hide the previous and next buttons
				update : function (model) {
					// hide the previous button if the index is near the left terminus
					if (model.outlets.prevSlide) {
						model.outlets.prevSlide.className = model.outlets.prevSlide.className.replace(/ disabled/gi, '');
						model.outlets.prevSlide.className += (model.outlets.index > 1) ? '' : ' disabled';
					}
					// hide the next button if the index is new the right terminus
					if (model.outlets.nextSlide) {
						model.outlets.nextSlide.className = model.outlets.nextSlide.className.replace(/ disabled/gi, '');
						model.outlets.nextSlide.className += (model.outlets.index < model.outlets.figures.length - 1) ? '' : ' disabled';
					}
				},
				// activate the next slide
				next : function (event, element, model) {
					// get the event properties
					event = event || window.event;
					var target = event.target || event.srcElement;
					if (!target.className.match(/disabled/)) {
						// increase the index
						model.outlets.index = (model.outlets.index < model.outlets.figures.length - 1) ? model.outlets.index + 1 : 1;
						// redraw
						slideshow.update(model);
					}
					// cancel the click
					target.blur();
					useful.events.cancel(event);
				},
				// activate the previous slide
				prev : function (event, element, model) {
					// get the event properties
					event = event || window.event;
					var target = event.target || event.srcElement;
					if (!target.className.match(/disabled/)) {
						// increase the index
						model.outlets.index = (model.outlets.index > 1) ? model.outlets.index - 1 : model.outlets.figures.length - 1;
						// redraw
						slideshow.update(model);
					}
					// cancel the click
					target.blur();
					useful.events.cancel(event);
				}
			}
		},
		// manages the thumbnails
		thumbnails : {
			// build the thumbnail list
			setup : function (model) {
				// create the navigation bar
				model.outlets.slideNav = document.createElement('nav');
				model.outlets.slideNav.className = 'navigation_' + model.navigation;
				model.outlets.slideDiv = document.createElement('div');
				model.outlets.slideUl = document.createElement('ul');
				// force the height of the nav if desired
				if (model.divide !== '100%' && model.navigation !== 'thumbtacks') {
					model.outlets.slideNav.style.height = (100 - parseInt(model.divide, 10) - parseInt(model.margin, 10)) + '%';
				}
				if (model.margin) {
					model.pixelMargin = parseInt(model.outlets.parent.offsetWidth * parseInt(model.margin, 10) / 100, 10);
				}
				// for all thumbnails in the model
				model.outlets.thumbnails = [0];
				for (var a = 1, b = model.thumbnails.length; a < b; a += 1) {
					// create a new thumbnail
					var newLi = document.createElement('li');
					var newA = document.createElement('a');
					newA.className = (a === 1) ? model.navigation + '_active' : model.navigation + '_passive';
					var newImage = document.createElement('img');
					newImage.alt = '';
					newImage.src = model.thumbnails[a];
					newA.appendChild(newImage);
					newLi.appendChild(newA);
					// insert the new elements
					model.outlets.slideUl.appendChild(newLi);
					// store the dom pointers to the images
					model.outlets.thumbnails[a] = newA;
				}
				// insert the navigation bar
				model.outlets.slideDiv.appendChild(model.outlets.slideUl);
				model.outlets.slideNav.appendChild(model.outlets.slideDiv);
				model.outlets.parent.appendChild(model.outlets.slideNav);
				// for all thumbnails in the model
				for (a = 1 , b = model.thumbnails.length; a < b; a += 1) {
					// assign the event handler
					slideshow.thumbnails.events.thumbnailClick(model.outlets.thumbnails[a], model);
				}
				// start the menu
				slideshow.thumbnails.menu.setup(model);
			},
			// event handlers
			events : {
				thumbnailClick : function (element, model) {
					element.onclick = function (event) {
						slideshow.thumbnails.set(event, element, model);
					};
				}
			},
			// redraw/recentre the thumbnails according to the model
			update : function (model) {
				// update the thumbnails menu
				slideshow.thumbnails.menu.update(model);
				/// highlight the icons
				slideshow.thumbnails.hightlightIcons(model);
				// it there's thumbnails
				if (model.navigation === 'thumbnails') {
					// centre the icons
					slideshow.thumbnails.centreIcons(model);
					// centre the slider
					slideshow.thumbnails.centreSlider(model);
				}
			},
			// highlight active icon
			hightlightIcons : function (model) {
				// for all thumbnails
				for (var a = 1, b = model.thumbnails.length; a < b; a += 1) {
					// highlight the active slide
					model.outlets.thumbnails[a].className = (model.outlets.index === a) ? model.navigation + '_active' : model.navigation + '_passive';
					model.outlets.thumbnails[a].style.borderColor = (model.outlets.index === a) ? model.highlight : 'Transparent';
					model.outlets.thumbnails[a].style.backgroundColor = (model.outlets.index === a) ? model.highlight : 'Transparent';
				}
			},
			// centre the icons in containers
			centreIcons : function (model) {
				var imageObject, imageWidth, imageHeight, rowHeight;
				// measure the available space
				rowHeight = model.outlets.slideNav.offsetHeight;
				// for all thumbnails
				for (var a = 1, b = model.thumbnails.length; a < b; a += 1) {
					// centre the image in its surroundings
					model.outlets.thumbnails[a].style.width =  rowHeight + 'px';
					imageObject = model.outlets.thumbnails[a].getElementsByTagName('img')[0];
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
			},
			// centre the container around the active one
			centreSlider : function (model) {
				// scroll the slider enough to center the active slide
				var activeThumbnail = model.outlets.thumbnails[model.outlets.index];
				var activePosition = activeThumbnail.offsetLeft;
				var activeWidth = activeThumbnail.offsetWidth;
				var scrollDistance = model.outlets.slideDiv.offsetWidth;
				var centeredPosition = -activePosition + scrollDistance / 2 - activeWidth / 2;
				centeredPosition = (centeredPosition > 0) ? 0 : centeredPosition;
				centeredPosition = (centeredPosition < model.scrollMax && model.scrollMax < 0) ? model.scrollMax : centeredPosition;
				// transition to the new position
				useful.css.setRules(
					model.outlets.slideUl,
					{'marginLeft' : centeredPosition + 'px'}
				);
			},
			// activate a corresponding figure
			set : function (event, element, model) {
				// get the event properties
				event = event || window.event;
				// count which thumbnail this is
				for (var a = 1, b = model.outlets.thumbnails.length; a < b; a += 1) {
					if (model.outlets.thumbnails[a] === element) {
						// change the index to this slide
						model.outlets.index = a;
						// redraw all
						slideshow.update(model);
					}
				}
				// cancel the click
				useful.events.cancel(event);
			},
			// manages the thumbnail controls
			menu : {
				// build the menu options
				setup : function (model) {
					// create the thumbnail controls
					model.outlets.pageMenu = document.createElement('menu');
					model.outlets.pageMenu.className = 'scroller';
					model.outlets.nextPage = document.createElement('button');
					model.outlets.nextPage.className = 'next';
					model.outlets.nextPageIcon = document.createElement('span');
					model.outlets.nextPageIcon.innerHTML = '&gt';
					model.outlets.prevPage = document.createElement('button');
					model.outlets.prevPage.className = 'previous';
					model.outlets.prevPageIcon = document.createElement('span');
					model.outlets.prevPageIcon.innerHTML = '&lt';
					model.outlets.nextPage.appendChild(model.outlets.nextPageIcon);
					model.outlets.pageMenu.appendChild(model.outlets.nextPage);
					model.outlets.prevPage.appendChild(model.outlets.prevPageIcon);
					model.outlets.pageMenu.appendChild(model.outlets.prevPage);
					model.outlets.slideNav.appendChild(model.outlets.pageMenu);
					// apply clicks to the thumbnail controls
					model.outlets.nextPage.onclick = function (event) {
						slideshow.thumbnails.menu.next(event, model.outlets.nextSlide, model);
					};
					model.outlets.prevPage.onclick = function (event) {
						slideshow.thumbnails.menu.prev(event, model.outlets.prevSlide, model);
					};
				},
				// show or hide the previous and next buttons
				update : function (model) {
					// calculate the current position
					model.scrollPosition = (model.outlets.slideUl.style.marginLeft) ? parseInt(model.outlets.slideUl.style.marginLeft, 10) : 0;
					model.scrollDistance = model.outlets.slideDiv.offsetWidth;
					// calculate the minimum position
					model.scrollMin = 0;
					// calculate the maximum position
					var lastThumbnail = model.outlets.thumbnails[model.outlets.thumbnails.length - 1];
					model.scrollStep = lastThumbnail.offsetWidth;
					model.scrollMax = -1 * (lastThumbnail.offsetLeft + lastThumbnail.offsetWidth) + model.scrollDistance;
					// show or hide the prev button
					model.outlets.prevPage.className = model.outlets.prevPage.className.replace(/ disabled/gi, '');
					model.outlets.prevPage.className += (model.scrollPosition >= model.scrollMin) ? ' disabled' : '';
					// show or hide the next button
					model.outlets.nextPage.className = model.outlets.nextPage.className.replace(/ disabled/gi, '');
					model.outlets.nextPage.className += (model.scrollPosition <= model.scrollMax && model.scrollMax < 0) ? ' disabled' : '';
				},
				// show the next page of thumbnails
				next : function (event, element, model) {
					// get the event properties
					event = event || window.event;
					var target = event.target || event.srcElement;
					// if the button is not disabled
					if (!target.className.match(/disabled/)) {
						// scroll one page's width of thumbnails
						var newPosition = model.scrollPosition - model.scrollDistance + model.scrollStep;
						// limit the scroll distance
						if (newPosition < model.scrollMax) {
							newPosition = model.scrollMax;
						}
						// transition to the new position
						useful.css.setRules(model.outlets.slideUl, {'marginLeft' : newPosition + 'px'});
						// redraw the menu buttons
						slideshow.thumbnails.menu.update(model);
					}
					// cancel the click
					target.blur();
					useful.events.cancel(event);
				},
				// show the previous page of thumbnails
				prev : function (event, element, model) {
					// get the event properties
					event = event || window.event;
					var target = event.target || event.srcElement;
					// if the button is not disabled
					if (!target.className.match(/disabled/)) {
						// scroll one page's width of thumbnails
						var newPosition = model.scrollPosition + model.scrollDistance - model.scrollStep;
						// limit the scroll distance
						if (newPosition > 0) {
							newPosition = 0;
						}
						// transition to the new position
						if (model.navigation === 'thumbnails') {
							useful.css.setRules(model.outlets.slideUl, {'marginLeft' : newPosition + 'px'});
						}
						// redraw the menu buttons
						slideshow.thumbnails.menu.update(model);
					}
					// cancel the click
					target.blur();
					useful.events.cancel(event);
				}
			}
		}
	};

	// public functions
	useful.events = useful.events || {};
	useful.events.add = function (element, eventName, eventHandler) {
		// exceptions
		eventName = (navigator.userAgent.match(/Firefox/i) && eventName.match(/mousewheel/i)) ? 'DOMMouseScroll' : eventName;
		// prefered method
		if ('addEventListener' in element) {
			element.addEventListener(eventName, eventHandler, false);
		}
		// alternative method
		else if ('attachEvent' in element) {
			element.attachEvent('on' + eventName, function (event) { eventHandler(event); });
		}
		// desperate method
		else {
			element['on' + eventName] = eventHandler;
		}
	};
	useful.events.cancel = function (event) {
		if (event) {
			if (event.preventDefault) { event.preventDefault(); }
			else if (event.preventManipulation) { event.preventManipulation(); }
			else { event.returnValue = false; }
		}
	};

	useful.models = useful.models || {};
	useful.models.clone = function (model) {
		var clonedModel, ClonedModel;
		// if the method exists
		if (typeof(Object.create) !== 'undefined') {
			clonedModel = Object.create(model);
		}
		// else use a fall back
		else {
			ClonedModel = function () {};
			ClonedModel.prototype = model;
			clonedModel = new ClonedModel();
		}
		// return the clone
		return clonedModel;
	};
	useful.models.trim = function (string) {
		return string.replace(/^\s+|\s+$/g, '');
	};

	useful.css = useful.css || {};
	useful.css.select = function (input, parent) {
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
			for (a = 0 , b = elements.length; a < b; a += 1) {
				// run the handler and pass a unique copy of the data (in case it's a model)
				input.handler(elements[a], useful.models.clone(input.data));
			}
		// else assume the function was called for a list of elements
		} else {
			// return the selected elements
			return elements;
		}
	};
	useful.css.prefix = function (property) {
		// pick the prefix that goes with the browser
		return (navigator.userAgent.match(/webkit/gi)) ? 'webkit' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/firefox/gi)) ? 'Moz' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/microsoft/gi)) ? 'ms' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/opera/gi)) ? 'O' + property.substr(0, 1).toUpperCase() + property.substr(1):
			property;
	};
	useful.css.compatibility = function () {
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
	useful.css.setClass = function (element, removedClass, addedClass, endEventHandler, jQueryDuration, jQueryEasing) {
		var replaceThis, replaceWith, endEventName, endEventFunction;
		// validate the input
		endEventHandler = endEventHandler || function () {};
		endEventName = useful.css.compatibility();
		// turn the classnames into regular expressions
		replaceThis = new RegExp(useful.models.trim(removedClass).replace(/ {2,}/g, ' ').split(' ').join('|'), 'g');
		replaceWith = new RegExp(addedClass, 'g');
		// if CSS3 transitions are available
		if (typeof endEventName !== 'undefined') {
			// set the onComplete handler and immediately remove it afterwards
			element.addEventListener(endEventName, endEventFunction = function () {
				endEventHandler();
				element.removeEventListener(endEventName, endEventFunction, true);
			}, true);
			// replace the class name
			element.className = useful.models.trim(element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ');
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
			element.className = useful.models.trim(element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ');
			// and call the onComplete handler
			endEventHandler();
		}
	};
	useful.css.setRules = function (element, rules, endEventHandler) {
		var rule, endEventName, endEventFunction;
		// validate the input
		rules.transitionProperty = rules.transitionProperty || 'all';
		rules.transitionDuration = rules.transitionDuration || '300ms';
		rules.transitionTimingFunction = rules.transitionTimingFunction || 'ease';
		endEventHandler = endEventHandler || function () {};
		endEventName = useful.css.compatibility();
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
					element.style[useful.css.compatibility(rule)] = rules[rule];
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
					element.style[useful.css.compatibility(rule)] = rules[rule];
					// implement the value
					element.style[rule] = rules[rule];
				}
			}
			// call the onComplete handler
			endEventHandler();
		}
	};

	useful.slideshow = {};
	useful.slideshow.start = slideshow.start;

}(window.useful = window.useful || {}));
