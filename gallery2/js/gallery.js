(function($) {

	// default options
	var options = {
		arrows: false,
		effect: 'slide',
		speed: 1000
	};

	$.fn.gallery = function(aOptions) {
		var self = $(this);
		self.addClass('gallery-wrap');

		var arrImg = [];

		var settings = $.extend(options, aOptions);
		var speed = settings.speed;

		var setup = function() {
			self.append('<div class="gallery-img-wrapper" /><div class="thumbnail-img-wrapper" /><div class="gallery-arrows" />');
			wrapImg = $('.gallery-img-wrapper'),
			wrapThumb = $('.thumbnail-img-wrapper'),
			arrowsImg = $('.gallery-arrows');

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
						 ' data-id=' + 0 + '><img src=' + response.images[0].imageURL + '></a>')
						.append('<a target="_blank" class="right-img" href=' + response.images[1].url +
						 ' data-id=' + 1 + '><img src=' + response.images[1].imageURL + '></a>');

					// set wrap height
					$('.current-img img').one('load', function() {
						wrapImg.height(this.height);
					});

					// append arrows
					if(settings.arrows) {
						arrowsImg
							.append('<a class="gallery-left" />')
							.append('<a class="gallery-right" />');
						arrowActions();							
					}
				}
			});			
		}


		var arrowActions = function() {
			// click left
			$('.gallery-left').on({
				click: function(event) {
					event.preventDefault();
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
						console.log(idRight, slideCount-1);
						if (idRight == (slideCount-1) || slideCount ==3) {
							console.log('change');
							var firstEl = wrapImg.children('a').first();
							wrapImg.append(firstEl.clone().addClass('right-img'));
							firstEl.remove();
						}

						else {
							var newRightEl = '<a target="_blank" class="right-img" href=' + response.images[idRight].url +
							 ' data-id=' + idRight + '><img src=' + response.images[idRight].imageURL + '></a>';
							wrapImg.append(newRightEl);
							wrapImg.children('a').first().remove(); 
						}
					});
				}
			});

			// right left
			$('.gallery-right').on({
				click: function(event) {
					event.preventDefault();
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
						console.log(idLeft, slideCount-1);
						if (idLeft == 0 || slideCount ==3) {
							console.log('change');
							var lastEl = wrapImg.children('a').last();
							wrapImg.prepend(lastEl.clone().addClass('left-img'));
							lastEl.remove();
						}
						
						else {
							var newLeftEl = '<a target="_blank" class="left-img" href=' + response.images[idLeft].url +
							 ' data-id=' + idLeft + '><img src=' + response.images[idLeft].imageURL + '></a>';
							wrapImg.append(newLeftEl);
							wrapImg.children('a').last().remove(); 
						}
					});
				}
			});						
		}



		setup();
		return this;		
	}
})(jQuery);