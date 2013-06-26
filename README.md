# useful.slideshow.js: Animated Slideshow

This slideshow uses CSS3 transitions for smooth animations, especially on mobile devices. Using CSS3, makes it easy to customise the effect. Internet Explorer (<10) doesn't support CSS3 transitions, but the animations are emulated using the same stylesheet rules.

## How to use the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/slideshow.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/useful.js"></script>
```

To enable the use of HTML5 tags in Internet Explorer 8 and lower, include *html5.js*. To provide an alternative for *document.querySelectorAll* in Internet Explorer 8 and lower, include *jQuery*. To enable CSS3 transition animations in Internet Explorer 9 and lower, include *jQuery UI* as well.

```html
<!--[if lte IE 9]>
	<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
<![endif]-->
```

### Using vanilla JavaScript

This is the safest way of starting the script, but allows for only one target element at a time.

```javascript
var parent = documentGetElementById('id');
useful.slideshow.start(parent, {
	'width' : 100,
	'widthUnit' : '%',
	'height' : 512,
	'heightUnit' : 'px',
	'divide' : '80%',
	'margin' : '2%',
	'preload' : 2,
	'idle' : 4000,
	'speed' : 300,
	'highlight' : 'Grey',
	'hover' : 'pause',				// pause | ignore
	'scaling' : 'fill', 			// none | fit | fill
	'captions' : 'show', 			// show | hide | hover
	'navigation' : 'thumbnails', 	// thumbnails | thumbtacks
	'transition' : 'wipe', 			// wipe | fade
	'ease' : 'ease-in-out' 			// linear | ease | ease-in | ease-out | ease-in-out | cubic-bezier(n,n,n,n)
});
```

**id : {string}** - The ID attribute of an element somewhere in the document.

**parent : {DOM node}** - The DOM element around which the functionality is centred.

**width : {integer}** - The width of the slideshow.

**widthUnit : {string}**
+ *px* - The width would be applied in pixels.
+ *%* - The width would be applied as a percentage of the available space.
+ *em* - The width would be applied relative to the text size.

**height : {integer}** - The width of the slideshow.

**heightUnit : {string}**
+ *px* - The height would be applied in pixels.
+ *%* - The height would be applied as a percentage of the available space. The parent element needs to have a defined height.
+ *em* - The height would be applied relative to the text size.

**divide : {percentage}** - The percentage of the height devoted to the slides. The rest is reserved for the thumbnails.

**margin : {percentage}** - The space separating the slides and the thumbnails.

**preload : {integer}** - The amount of full sized images to preload before they come into view.

**idle : {integer}** - The time to wait before the slideshow start cycling through the slides automatically. A negative value disables auto-play.

**speed : {integer}** - The transition time between slides in milliseconds.

**highlight : {color}** - A color name, hex or rgba value  used to highlight the active thumbnail.

**hover : {string}**
+ *pause* - Pauses the slideshow upon interaction.
+ *ignore* - Ignores interaction.

**scaling : {string}**
+ *none* - Use the images in the dimensions they come in.
+ *fit* - Fit the complete image, leaving black space.
+ *fill* - Fill the complete slide with the image, leaving no black space, but cropping the image.

**captions : {string}**
+ *show* - Always shows the caption, based on the title and alt attributes.
+ *hide* - Never show the caption.
+ *hover* - Show the caption during interaction.

**navigation : {string}**
+ *thumbnails* - Uses thumbnails of the images for navigating the slides.
+ *thumbtacks* - Shows a small bar of icons as navigation, allowing more space for the slides.

**transition : {string}**
+ *wipe* - Makes slides slide in from the sides.
+ *fade* - Crossfades between slides.

**ease : {string}** - Valid easing methods include: *linear*, *ease*, *ease-in*, *ease-out*, *ease-in-out*, *cubic-bezier(n,n,n,n)*

### Using document.querySelectorAll

This method allows CSS Rules to be used to apply the script to one or more nodes at the same time.

```javascript
useful.css.select({
	rule : 'div.slideshow',
	handler : useful.slideshow.start,
	data : {
		'width' : 100,
		'widthUnit' : '%',
		'height' : 512,
		'heightUnit' : 'px',
		'divide' : '80%',
		'margin' : '2%',
		'preload' : 2,
		'idle' : 4000,
		'speed' : 300,
		'highlight' : 'Grey',
		'hover' : 'pause',
		'scaling' : 'fill',
		'captions' : 'show',
		'navigation' : 'thumbnails',
		'transition' : 'wipe',
		'ease' : 'ease-in-out'
	}
});
```

**rule : {string}** - The CSS Rule for the intended target(s) of the script.

**handler : {function}** - The public function that starts the script.

**data : {object}** - Name-value pairs with configuration data.

### Using jQuery

This method is similar to the previous one, but uses jQuery for processing the CSS rule.

```javascript
$('div.slideshow').each(function (index, element) {
	useful.slideshow.start(element, {
		'width' : 100,
		'widthUnit' : '%',
		'height' : 512,
		'heightUnit' : 'px',
		'divide' : '80%',
		'margin' : '2%',
		'preload' : 2,
		'idle' : 4000,
		'speed' : 300,
		'highlight' : 'Grey',
		'hover' : 'pause',
		'scaling' : 'fill',
		'captions' : 'show',
		'navigation' : 'thumbnails',
		'transition' : 'wipe',
		'ease' : 'ease-in-out'
	});
});
```

## License
This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
