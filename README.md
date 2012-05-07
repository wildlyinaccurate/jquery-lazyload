jQuery Lazy Loader
===============

jQuery Lazy Loader is a small jQuery plugin that aims to simplify the process of lazy-loading vertical content.

## Basic Usage

The lazy loader works on the assumption that your content would otherwise be paginated. The default settings assume that the initially loaded content is page 1, and that extra content will be loaded on a per-page basis.

With that in mind, the lazy loader can be used by specifying just the `src` option. When the user scrolls 80% of the way down the container, the plugin will make an Ajax (GET) call to `src` with `page = 2`. The results of the Ajax call will then be appended to the container. The `page` variable is automatically incremented after each call.

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

**autoLoad - bool, default=true**

Whether or not to automatically load the next set of content. Set this to `false` if you want to trigger the `load` method yourself (see *Methods* section below).

**scrollThreshold - float, default=0.8**

How far down the container the user has to scroll before the next set of content is loaded. A value of `0.5` will load the content when the user has scrolled halfway down the container, whereas a value of `1` will load the content when they scroll to the bottom of the container.

**page - int, default=1**

The current page - change this if your initial content is more than one "page" worth. In other words, this should be set to `items of initally loaded content / items per page`.

**debug - bool, default=false**

Setting the `debug` option to `true` will enable some console logging.

## Advanced Options

**Note:** All of the options below are functions that are called from the plugin's scope. What this means is that within these functions, `this` is an instance of `$.lazyloader`.

**loadStart - function()**

Called just before the next set of content is loaded.

**loadSuccess - function(data, textStatus, jqXHR)**

Loads the content after a successful Ajax request. This is a [jQuery Ajax Event](http://docs.jquery.com/Ajax_Events)

**noResults - function()**

Called by `loadSuccess` when the result is empty. By default it will disable the lazy loader.

**loadError - function(jqXHR, textStatus, errorThrown)**

Called when the Ajax call fails. This is a [jQuery Ajax Event](http://docs.jquery.com/Ajax_Events)

**loadComplete - function(jqXHR, textStatus)**

Called when the Ajax call finishes, regardless of whether it was successful or not. This is a [jQuery Ajax Event](http://docs.jquery.com/Ajax_Events)

**loadHandler - function()**

This function is called when `scrollThreshold` is reached, and should handle all of the content loading. If the default behaviour doesn't fit your needs, you can specify your own `loadHandler` function. Note that if a new `loadHandler` is specified, the default `loadSuccess`, `noResults`, `loadError` and `loadComplete` will not be called.

## Methods

To use the methods below, assign the return value of `$.lazyload` to a local variable, e.g.

```javascript
var lazyloader = $('#container').lazyload({
    src: '/ajax-articles'
});

lazyloader.disable();
```

**load**

Loads the next set of content, regardless of the current scroll position. This could be bound to the click event of a button. Also see the `autoLoad` option.

**disable**

Prevents the `load` method from firing.

**enable**

Allows the `load` method to fire again.

**destroy**

Removes all circular references inside the `lazyloader` object, allowing Javascript's garbage collection to remove it from memory.