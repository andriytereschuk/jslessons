(function($) {

	// default options
	var options = {
		arrows: true,
		thumb: false,
		effect: 'slide',
		speed: 1000
	};

	$.fn.gallery = function(aOptions) {
		var self = $(this);
		self.addClass('gallery-wrap');

		var settings = $.extend(options, aOptions);
		var speed = settings.speed;

		var setup = function() {
			self.append('<div class="gallery-img-wrapper" />');
			wrapImg = $('.gallery-img-wrapper');

			$.ajax({
				type: 'GET',
				url: 'api/gallery.json',
				dataType: 'json',
				success: function(aResponse) {
					response = aResponse;
					slideCount  = aResponse.images.length;
					// load last(left),1-st(current) and 2-nd(right) images

					wrapImg
						.append('<a target="_blank" class="left-img" href=' + response.images[slideCount-1].url +
						 ' data-id=' + (slideCount - 1) + '><img src=' + response.images[slideCount-1].imageURL + '></a>')
						.append('<a target="_blank" class="current-img" href=' + response.images[0].url +
						 ' data-id=' + 0 + '><img src=' +response.images[0].imageURL+ '></a>')
						.append('<a target="_blank" class="right-img" href=' + response.images[1].url +
						 ' data-id=' + 1 + '><img src=' + response.images[1].imageURL + '></a>');

					// set wrap height
					$('.current-img img').one('load', function() {
						wrapImg.height(this.height);
					});

					// append arrows
					if(settings.arrows) {
						self.append('<div class="gallery-arrows"><a class="gallery-left" /><a class="gallery-right" /></div>');
						arrowActions();							
					}

					// append thumbnails
					if(settings.thumb) {
						self.append('<div class="thumbnail-img-wrapper"><div class="thumbnail-transform"></div></div>');
						wrapThumb = $('.thumbnail-transform');
						tumbAppending();
					}
				}
			});			
		}

		var tumbAppending = function() {
			for (var i = 0; i < slideCount; i++) {
				wrapThumb.append('<div class="thumb"><img src='+ response.images[i].thumbnailURL +' width=""></div>');
				if(i==slideCount-1) return setThumbWidth();
			}
		}

		var setThumbWidth = function() {
			// set wrapThumb width
			var wrapThumbHeight = wrapThumb.height();
			var wrapThumbWidth = 0;
			var tumbPadding = 10;
			$('.thumb img').each(function(index) {
				$(this).one('load', function() {
			    var tempWidth = this.width;
			    var tempHeight = this.height;
			    var calcWidth = this.width * wrapThumbHeight / this.height;
			    $(this).attr('width',calcWidth);
			    wrapThumbWidth = wrapThumbWidth + calcWidth + tumbPadding;
			    wrapThumb.css('width',wrapThumbWidth+'px');
			    var bool = wrapThumb.children('.thumb').last().children('img').attr('width');			
			    if(bool != 0) {
			    	console.log('loaded');
			    }
				});
			});
		}

		var arrowActions = function(event) {
			$('.gallery-left').bind('click', chengeLeft);
			$('.gallery-right').bind('click', chengeRight);
		}

		var chengeRight = function() {
			$(this).unbind('click');
			var rightEl = $('.right-img'),
					rightElHeight = rightEl.children('img').height();
				wrapImg.height(rightElHeight);
/*					wrapImg.animate({
				'height' : rightElHeight + 'px'
			},speed);*/
			$('.current-img').animate({
				'left' : '-100%'
			},speed,function(){
				$(this)
					.removeClass('current-img')
					.addClass('left-img')
					.prev('a')
					.removeClass('left-img')
					.css('left','');
			});
			$('.right-img').animate({
				'left' : 0
			},speed,function(){
				$(this)
					.removeClass('right-img')
					.addClass('current-img');

				var	idRight = rightEl.attr('data-id');
				++idRight;
				console.log(idRight, slideCount);
				// if slideCount ==3 - > do another action
				if (idRight == slideCount) {
					console.log('change');
					var firstEl = wrapImg.children('a').first();
					firstEl.remove();
					var newRightEl = '<a target="_blank" class="right-img" href=' + response.images[0].url +
					 ' data-id=' + 0 + '><img src=' + response.images[0].imageURL + '></a>';
					wrapImg.append(newRightEl);
					//wrapImg.append(firstEl.clone().addClass('right-img'));
				}

				else {
					var newRightEl = '<a target="_blank" class="right-img" href=' + response.images[idRight].url +
					 ' data-id=' + idRight + '><img src=' + response.images[idRight].imageURL + '></a>';
					wrapImg.append(newRightEl);
					wrapImg.children('a').first().remove(); 
				}

				$('.gallery-right').bind('click', chengeRight);
			});
		}

		var chengeLeft = function() {
			$(this).unbind('click');
			var leftEl = $('.left-img'),
					leftElHeight = leftEl.children('img').height();
				wrapImg.height(leftElHeight);
/*					wrapImg.animate({
				'height' : leftElHeight + 'px'
			},speed);*/
			$('.current-img').animate({
				'left' : '100%'
			},speed,function(){
				$(this)
					.removeClass('current-img')
					.addClass('right-img')
					.next('a')
					.removeClass('right-img')
					.css('left','');
			});
			$('.left-img').animate({
				'left' : 0
			},speed,function(){
				$(this)
					.removeClass('left-img')
					.addClass('current-img');

				var	idLeft = leftEl.attr('data-id');
				--idLeft;
				console.log(idLeft, slideCount);
				// if slideCount ==3 - > do another action
				if (idLeft == -1) {
					console.log('change');
					var newLeftEl = '<a target="_blank" class="left-img" href=' + response.images[slideCount-1].url +
					 ' data-id=' + (slideCount-1) + '><img src=' + response.images[slideCount-1].imageURL + '></a>';
					wrapImg.prepend(newLeftEl);
					wrapImg.children('a').last().remove(); 
					//wrapImg.prepend(lastEl.clone().addClass('left-img'));
				}
				
				else {
					var newLeftEl = '<a target="_blank" class="left-img" href=' + response.images[idLeft].url +
					 ' data-id=' + idLeft + '><img src=' + response.images[idLeft].imageURL + '></a>';
					wrapImg.prepend(newLeftEl);
					wrapImg.children('a').last().remove(); 
				}

				$('.gallery-left').bind('click', chengeLeft);
			});			
		}

		setup();
		return this;		
	}
})(jQuery);