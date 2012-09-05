jQuery Lazy Loader
===============

jQuery Lazy Loader is a small jQuery plugin that aims to simplify the process of lazy-loading vertical content. To see the plugin in action, see [http://magicrainbowadventure.com](http://magicrainbowadventure.com)

## Basic Usage

The lazy loader works on the assumption that your content would otherwise be paginated. The default settings assume that the initially loaded content is page 1, and that extra content will be loaded on a per-page basis.

With that in mind, the lazy loader can be used with its default settings by specifying just the `src` option. When the user scrolls 80% of the way down the container, the plugin will make an Ajax (GET) call to `src?page=2`. The results of the Ajax call will then be appended to the container. The `page` variable is automatically incremented after each call.

```html
<section id="container">
    <article></article>
    <article></article>
</section>

var lazyloader = $('#container').lazyload({
    src: '/ajax-articles'
});
```

## Basic Options

The options below can be passed into the `$.lazyload` constructor, or set dynamically through the `settings` property, e.g.

```javascript
var lazyloader = $('#container').lazyload({
    src: '/ajax-articles'
});

lazyloader.settings.autoLoad = false;
```

**autoLoad - bool, default=true**

Whether or not to automatically load the next set of content. Set this to `false` if you want to trigger the `load` method yourself (see *Methods* section below).

**scrollThreshold - float, default=0.8**

How far down the container the user has to scroll before the next set of content is loaded. A value of `0.5` will load the content when the user has scrolled halfway down the container, whereas a value of `1` will load the content when they scroll to the bottom of the container.

**page - int, default=1**

The current page - change this if your initial content is more than one "page" worth. In other words, this should be set to `items of initally loaded content / items per page`.

**debug - bool, default=false**

Setting the `debug` option to `true` will enable some console logging.

## Advanced Options

**Note:** Function options marked with an asterisk \* are called from the plugin's scope. What this means is that within these functions, `this` is an instance of `$.lazyloader`. Other function options are called from the `$.lazyloader.settings` scope; you can access the `lazyloader` instance from this scope with `this.lazyloader`.

**loadStart - function()**

```javascript
lazyloader.settings.loadStart = function() {
	$('body').addClass('loading');
};
```

Called just before the next set of content is loaded.

**\*loadSuccess - function(data, textStatus, jqXHR)**

Loads the content after a successful Ajax request. If your `src` returns something other than HTML, this is where you would process it. This is a [jQuery Ajax Event](http://docs.jquery.com/Ajax_Events)

```javascript
lazyloader.settings.loadSuccess = function(data, textStatus, jqXHR) {
	if (data.noResults) {
		// Call the noResults method
		this.settings.noResults();
	}

	for (x in data) {
		// Do something with the data
	}
};
```

**noResults - function()**

Called by `loadSuccess` when the result is empty. By default it will disable the lazy loader.

```javascript
lazyloader.settings.noResults = function() {
	this.lazyloader.disable();
};
```

**\*loadError - function(jqXHR, textStatus, errorThrown)**

Called when the Ajax call fails. This is a [jQuery Ajax Event](http://docs.jquery.com/Ajax_Events)

```javascript
lazyloader.settings.loadError = function() {
	// Error handling goes here
};
```

**\*loadComplete - function(jqXHR, textStatus)**

Called when the Ajax call finishes, regardless of whether it was successful or not. This is a [jQuery Ajax Event](http://docs.jquery.com/Ajax_Events)

```javascript
lazyloader.settings.loadComplete = function() {
	$('body').removeClass('loading');
};
```

**loadHandler - function()**

Called when `scrollThreshold` is reached, or when `$.lazyload.load` is called. This function is where you can completely override the default lazy-load behaviour to retrieve, process, and insert content into the page. Note that if you provide a custom `loadHandler`, the `loadSuccess`, `noResults`, `loadError` and `loadComplete` options are not required.

```javascript
lazyloader.settings.loadHandler = function() {
	$.ajax({
		type: 'POST',
		url: 'http://example.com/more-content-plz',
		data {
			i_want: 'some content'
		},
		success: function(data) {
			// Do something with data
		},
	});
};
```

## Methods

To use the methods below, assign the return value of `$.lazyload` to a local variable, e.g.

```javascript
var lazyloader = $('#container').lazyload({
	src: '/ajax-articles'
});

lazyloader.disable();
```

**load()**

Loads the next set of content, regardless of the current scroll position. This could be bound to the click event of a button. Also see the `autoLoad` option.

**disable()**

Prevents the `load` method from firing.

**enable()**

Allows the `load` method to fire again.

**destroy()**

Removes all circular references inside the `lazyloader` object, allowing Javascript's garbage collection to remove it from memory.
