/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Miguel De Anda
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * PlusView 2013-12-19 (December 19, 2013)
 *
 * PlusView is a jQuery plugin that tries to replicate the Google (tm) play
 * store screenshot viewer. It's meant to be simple to setup with a very simple
 * html structure expected.
 */
(function($){
	/*
	 * options:
	 * height - the height to grow to when shown
	 * show - change the jquery method to use to show the view
	 * hide - change the jquery method to use to hide the view
	 * showItem - index of item to show upon initialization
	 * duration - when in large view, automatically go to next item
	 * 		after the given duration
	 * wrap - makes next/prev wrap around forever
	 * scrollIntoView - scrolls main element into view when switching to
	 * 		large view
	 */
	$.fn.plusview = function(options) {
		return this.each(function(index, el) {
			var settings = $.extend({}, {
				height: 300,
				show: 'slideDown',
				hide: 'slideUp',
				showItem: null,
				duration: null,
				wrap: false,
				scrollIntoView: true,
				buttonHeight: 50,
				onChange: function() {}
			}, options);
			settings.el = $(el);
			settings.renderFunc = null;

			var gs = new PlusView(settings);
			gs.init();
			if (typeof settings.showItem == 'number') {
				gs.showItem(settings.showItem);
			}
		});
	};

	function PlusView(settings) {
		this.settings = settings;

		var self = this;

		//set default render function
		if (settings.renderFunc == null) {
			this.settings.renderFunc = function() {
				self.defaultRenderFunc.apply(self, arguments);
			}
		}

		this.largeView = null;
		this.normalView = null;
		this.contentArea = null;
		this.leftArrow = null;
		this.rightArrow = null;

		this.current = null;
		this.playlist = [];
		this.timer = null;
	}
	PlusView.prototype.init = function() {
		var self = this;
		var index = 0;
		$('a[data-type="image"]', this.settings.el).click(function() {
			return self.linkClicked($(this));
		}).each(function(index, el) {
			var id = index++;
			$(el).attr('data-plusview-id', id);
			self.playlist.push($(el));
		});

		this.normalView = $('ul', this.settings.el);
	};
	PlusView.prototype.defaultRenderFunc = function(targetEl, srcEl) {
		var img = $('<img/>').attr('src', srcEl.attr('href'))
			.css({
				'max-width': '100%',
				//'max-height': '100%',
				// TODO: modified
				'max-height': this.settings.height
			});
		targetEl.empty().append(img);
	};
	PlusView.prototype.linkClicked = function(el) {
		this.showItem(el);
		if (this.settings.scrollIntoView) {
			var offset = this.settings.el.offset();
			$('html, body').animate({
				scrollTop: offset.top-10,
				scrollLeft: offset.left
			}, 1000);
		}
		return false;
	};
	PlusView.prototype.showItem = function(el) {
		if (typeof el == 'number') {
			el = this.playlist[el];
		}
		clearTimeout(this.timer);
		if (this.settings.duration) {
			var self = this;
			this.timer = setTimeout(function() {
				self.showNext();
			}, this.settings.duration);
		}
		this.current = parseInt(el.attr('data-plusview-id'), 10);
		this.normalView[this.settings.hide]();
		this.showLargeView();
		this.settings.renderFunc(this.contentArea, el);
		if (this.settings.onChange!=null) {
			this.settings.onChange(el);
		}
	};
	/* general catchall to hide pop */
	PlusView.prototype.showNormalView = function() {
		clearTimeout(this.timer);
		this.normalView[this.settings.show]();
		this.largeView[this.settings.hide]();
	};
	PlusView.prototype.showLargeView = function() {
		if (!this.largeView) {
			//prepare on first call
			var self = this;
			var borderHeight = 1;
			this.largeView = $('<div class="PlusView-largeBg"></div>')
				// TODO: modified
				// .click(function() {
				// 	self.showNormalView();
				// })
				.appendTo(this.settings.el)
				.hide();

			var btnPaddingTop = (this.settings.height - this.settings.buttonHeight) / 2;
			// var btnHeight = this.settings.height - btnPaddingTop - borderHeight * 2;
			// TODO: modified
			var btnHeight = this.settings.height - borderHeight * 2;
			this.rightArrow = $('<a class="PlusView-button PlusView-rightArrow"></a>')
				.attr('href', '#')
				.css('height', btnHeight)
				.css('padding-top', btnPaddingTop)
				.html('<span></span>')
				.click(function() {
					self.showNext();
					return false;
				})
				.appendTo(this.largeView);
			this.leftArrow = $('<a class="PlusView-button PlusView-leftArrow"></a>')
				.attr('href', '#')
				.css('height', btnHeight)
				.css('padding-top', btnPaddingTop)
				.html('<span></span>')
				.click(function() {
					self.showPrev();
					return false;
				})
				.appendTo(this.largeView);
			this.contentArea = $('<div class="PlusView-contentArea"></div>')
				.css('height', this.settings.height)
				.appendTo(this.largeView);
		}
		this.largeView[this.settings.show]();
	};
	PlusView.prototype.showNext = function() {
		if (this.current < this.playlist.length - 1 || this.settings.wrap) {
			if (this.current >= this.playlist.length - 1)
				this.current = -1;
			this.showItem(this.playlist[this.current+1]);
		} else {
			this.showNormalView();
		}
	};
	PlusView.prototype.showPrev = function() {
		if (this.current > 0 || this.settings.wrap) {
			if (this.current <= 0)
				this.current = this.playlist.length;
			this.showItem(this.playlist[this.current-1]);
		} else {
			this.showNormalView();
		}
	};



}(jQuery));
