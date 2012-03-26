# polarclock.js

Simple HTML5 canvas experiment using JavaScript. See [example](http://msavela.github.com/polarclock.js).

## Usage

### HTML head
```HTML
<script type="text/javascript" src="polarclock.js"></script>
```

### JavaScript
```javascript
window.onload = function()
{
	new PolarClock(document.getElementById("clock")).start();
}
```