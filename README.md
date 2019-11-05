# slideshow.js: Animated Slideshow

This slideshow uses CSS3 transitions for smooth animations, especially on mobile devices. Using CSS3, makes it easy to customise the effect. Internet Explorer (\<10) doesn't support CSS3 transitions, but the animations are emulated using the same stylesheet rules.

Try the <a href="http://www.woollymittens.nl/default.php?url=useful-slideshow">demo</a>.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="css/slideshow.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="lib/transitions.js"></script>
<script src="js/slideshow.js"></script>
```

Or use [Require.js](https://requirejs.org/).

```js
requirejs([
	'lib/transitions.js',
	'js/slideshow.js'
], function(transitions, Slideshow) {
	...
});
```

Or import into an MVC framework.

```js
var transitions = require('lib/transitions.js');
var Slideshow = require('js/slideshow.js');
```

### Using vanilla JavaScript

```javascript
// create a new instance of the script
var slideshow = new Slideshow({
	'element' : document.getElementById('id'),
	'width' : 100,
	'widthUnit' : '%',
	'height' : 512,
	'heightUnit' : 'px',
	'divide' : '80%',
	'margin' : '0%',
	'preload' : 2,
	'idle' : 4000,
	'speed' : 300,
	'colorPassive' : '#ff6a00',
	'colorActive' : '#d45800',
	'colorHover' : '#ff9800',
	'colorDisabled' : '#7f7f7f',
	'hover' : 'pause',
	'scaling' : 'fill',
	'captions' : 'hover',
	'navigation' : 'thumbnails',
	'transition' : 'wipe',
	'ease' : 'ease-in-out'
});
// start the instance
```

**id : {string}** - The ID attribute of an element somewhere in the document.

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

**colorPassive : {color}** - A color name, hex or rgba value  used for the passive state of the buttons.

**colorActive : {color}** - A color name, hex or rgba value  used for the active state of the buttons.

**colorHover : {color}** - A color name, hex or rgba value  used for the hover state of the buttons.

**colorDisabled : {color}** - A color name, hex or rgba value  used for the disabled state of the buttons.

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

## How to control the script

### Focus

```javascript
slideshow.focus(index);
```

Highlights and centres a specific thumbnail.

**index : {integer}** - The index of the slide to show.

### Previous

```javascript
slideshow.previous();
```

Shows the previous slide.

### Next

```javascript
slideshow.next();
```

Shows the next slide

### Pause

```javascript
slideshow.pause();
```

Stops the automatic slideshow.

### Play

```javascript
slideshow.play();
```

Starts the automatic slideshow.

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp dist` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8500/.
+ `gulp php` - Serves the project on a temporary php server at http://localhost:8500/.

## License

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens) and at [WoollyMittens.nl](https://www.woollymittens.nl/).
