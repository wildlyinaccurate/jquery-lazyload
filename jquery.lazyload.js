(function($) {

    $.extend($.fn, {

        lazyload: function(options) {

            // Nothing selected; return nothing
            if ( ! this.length) {
                if (options && options.debug && window.console) {
                    console.warn("lazyload: Nothing selected, can't lazy load.");
                }

                return;
            }

            var scrollspy = new $.scrollspy(this[0]);
            var lazyloader = new $.lazyloader(options, scrollspy);

            if (lazyloader.settings.autoLoad) {
                $(scrollspy.scrollElement).scroll(function(event) {
                    var scrollPosition = scrollspy.getPosition();
                    var relativePosition = scrollPosition.scrollBottom / scrollPosition.referenceHeight;

                    if (relativePosition >= lazyloader.settings.scrollThreshold) {
                        lazyloader.load();
                    }
                });
            }

            return lazyloader;

        }

    });

    $.scrollspy = function(scrollElement) {

        this.scrollElement = scrollElement;
        this.referenceElement = scrollElement;

        if (scrollElement.scrollHeight <= $(scrollElement).innerHeight()) {
            // The element does not scroll; Detect scrolling on document instead
            this.scrollElement = document;
            this.getPosition = this.getPositionFromDocument;
        } else {
            this.getPosition = this.getPositionFromOverflow;
        }

    };

    // Find the current scroll position relative to the document
    $.scrollspy.prototype.getPositionFromDocument = function() {
        return {
            scrollBottom: $(this.scrollElement).scrollTop() - $(this.referenceElement).position().top + $(window).height(),
            referenceHeight: $(this.referenceElement).outerHeight()
        };
    };

    // Find the current scroll position relative to an overflow: scroll object
    $.scrollspy.prototype.getPositionFromOverflow = function() {
        return {
            scrollBottom: $(this.scrollElement).scrollTop() + $(this.scrollElement).height(),
            referenceHeight: this.scrollElement.scrollHeight
        };
    };

    $.lazyloader = function(options, scrollspy) {
        this.disabled = false;
        this.loading = false;
        this.scrollspy = scrollspy;
        this.settings = $.extend(true, {}, $.lazyloader.defaults, options);

        // Allows the lazyloader instance to be accessed from this.settings
        this.settings.lazyloader = this;
    };

    $.extend($.lazyloader, {

        defaults: {
            debug: false,
            page: 1,
            scrollThreshold: 0.8,
            autoLoad: true,

            loadError: function(jqXHR, textStatus, errorThrown) {
                if (this.debug && window.console) {
                    console.warn('lazyload: Error occurred while loading content: ' + textStatus);
                }
            },

            loadSuccess: function(data, textStatus, jqXHR) {
                if ($.trim(data) === '') {
                    this.settings.noResults();

                    return;
                }

                $(data).appendTo(this.scrollspy.referenceElement);
            },

            loadStart: function() {},

            loadComplete: function(jqXHR, textStatus) {},

            loadHandler: function() {
                if ( ! this.src) {
                    if (this.debug && window.console) {
                        console.error("lazyload: Tried to run loadHandler but no src was specified.");
                    }

                    return;
                }

                var url = this.src;
                url += ((url.indexOf('?') === -1) ? '?' : '&') + 'page=' + this.page;

                $.ajax({
                    context: this.lazyloader,
                    type: 'GET',
                    url: url,
                    error: this.loadError,
                    success: this.loadSuccess,
                    complete: this.lazyloader.loadComplete
                });
            },

            noResults: function() {
                if (this.debug && window.console) {
                    console.info('lazyload: No results available, disabling lazy loading.');
                }

                this.page--;
                this.lazyloader.disable();
            }

        },

        prototype: {

            load: function() {
                if (this.loading === false && this.disabled === false) {
                    // We don't want to make the same request more than once!
                    this.settings.loadStart();
                    this.settings.page++;
                    this.loading = true;
                    this.settings.loadHandler();
                }
            },

            loadComplete: function() {
                this.loading = false;
                this.settings.loadComplete();
            },

            disable: function() {
                this.disabled = true;
            },

            enable : function() {
                this.disabled = false;
            },

            // this.settings.lazyloader is a circular reference that Javascript's
            // garbage collector won't pick up. We can easily free up memory
            // by breaking this reference.
            destroy: function() {
                this.disabled = null;
                this.scrollspy = null;
                this.settings = null;
            }

        }

    });

}(jQuery));