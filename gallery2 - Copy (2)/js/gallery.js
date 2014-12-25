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
						wrapImg.append('<div class="gallery-arrows"><a class="gallery-left" /><a class="gallery-right" /></div>');
						arrowActions();							
					}

					// append thumbnails
					if(settings.thumb) {
						self.append('<div class="thumbnail-img-wrapper"><div class="thumbnail-transform"></div></div>');
						wrapThumbWrap = $('.thumbnail-img-wrapper');
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
			// set 1-st thumb active class
			wrapThumb.children('.thumb').first().addClass('active');
			// set wrapThumb width
			var wrapThumbHeight = wrapThumb.height();
			var wrapThumbWidth = 0;
			var tumbPadding = 10;
			thumbArr = [];
			$('.thumb img').each(function(index) {
				$(this).one('load', function() {
			    var tempWidth = this.width;
			    var tempHeight = this.height;
			    var calcWidth = this.width * wrapThumbHeight / this.height;
			    $(this).attr('width',calcWidth);
			    wrapThumbWidth = wrapThumbWidth + calcWidth + tumbPadding;
			    thumbArr.push(wrapThumbWidth);
			    wrapThumb.css('width',wrapThumbWidth+'px');
			    if(thumbArr.length == slideCount) {
			    	console.log("loaded");
			    	return thumbImagesLoaded();
			    }
				});
			});
		}


		var thumbImagesLoaded = function() {
			thumbSectionNew = 1;
			leftThumbSection = [0];
			widthThumb = wrapThumbWrap.width();
			for(var i = 0; i < slideCount; i++) {
				if(thumbArr[i] > widthThumb*thumbSectionNew) {
				++thumbSectionNew;
				leftThumbSection.push(i);
				}				
			}
			console.log(leftThumbSection);
			if(thumbArr[thumbArr.length-1] > wrapThumbWrap.width())
			{
				console.log("need thumb arrows");
				wrapThumbWrap.append('<div class="thumb-arrows"><a class="thumb-left thumb-hide-arrow" /><a class="thumb-right" /></div>');
				thumbArrowActions();
			}

			thumbClick();
		}

		var arrowActions = function() {
			$('.gallery-left').bind('click', chengeLeft);
			$('.gallery-right').bind('click', chengeRight);
		}

		var chengeRight = function() {
			$(this).unbind('click');

			// sync with thumb
			thumbRight();

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

			// sync thumb
			thumbLeft();

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

		var thumbArrowActions = function() {
			$('.thumb-left').bind('click', thumbLeft);
			$('.thumb-right').bind('click', thumbRight);
			currentThumb = 0;
			widthThumb = wrapThumbWrap.width();
			thumbSection = 1;
			leftThumbSection = [0];
		}

		var thumbRight = function() {
			$(this).unbind('click');
			++currentThumb;
			if(currentThumb == slideCount) {
				currentThumb = 0;
				leftThumbSection = [0];
				thumbSection = 1;
				wrapThumb.animate({
						'left' : '0px'
					}, 200, function() {
						wrapThumb.children('.thumb')
							.removeClass('active')
							.eq(currentThumb)
							.addClass('active');
						$('.thumb-left').addClass('thumb-hide-arrow');
						$('.thumb-right')
							.removeClass('thumb-hide-arrow')
							.bind('click', thumbRight);
					});
			}
			else {
				$('.thumb-left').removeClass('thumb-hide-arrow');
				if( thumbArr[currentThumb] > widthThumb*thumbSection) {
						++thumbSection;
						leftThumbSection.push(currentThumb);
						wrapThumb.animate({
							'left' : -thumbArr[currentThumb-1] + 'px'
						}, 200, function() {
							wrapThumb.children('.thumb')
								.removeClass('active')
								.eq(currentThumb)
								.addClass('active');
							if(currentThumb == slideCount-1) {
								$('.thumb-right').addClass('thumb-hide-arrow');
							}
							$('.thumb-right').bind('click', thumbRight);	
						});
				}

				else {
					wrapThumb.children('.thumb')
						.removeClass('active')
						.eq(currentThumb)
						.addClass('active');
					if(currentThumb == slideCount-1) {
						$('.thumb-right').addClass('thumb-hide-arrow');
					}
					$('.thumb-right').bind('click', thumbRight);					
				}
			}			
		}

		var thumbLeft = function() {
			$(this).unbind('click');
			--currentThumb;
			$('.right-left').removeClass('thumb-hide-arrow');
			if((thumbArr[currentThumb] < widthThumb*(thumbSection-1)) && (thumbSection>1)) {
					--thumbSection;
					$('.thumb-right').removeClass('thumb-hide-arrow');
					currentThumb = leftThumbSection[leftThumbSection.length-2];
					if (currentThumb == 0) {
						$('.thumb-left').addClass('thumb-hide-arrow');
						wrapThumb.animate({
							'left' : 0
						}, 200, function() {
							leftThumbSection.pop();
							wrapThumb.children('.thumb')
								.removeClass('active')
								.eq(currentThumb)
								.addClass('active');
								$('.thumb-left').bind('click', thumbLeft);
						});
					}

					else {
						wrapThumb.animate({
							'left' : -thumbArr[currentThumb-1] + 'px'
						}, 200, function() {
							leftThumbSection.pop();
							wrapThumb.children('.thumb')
								.removeClass('active')
								.eq(currentThumb)
								.addClass('active');
								$('.thumb-left').bind('click', thumbLeft);
						});
					}
			}

			else {
				wrapThumb.children('.thumb')
					.removeClass('active')
					.eq(currentThumb)
					.addClass('active');
				if(currentThumb == 0) {
					$('.thumb-left').addClass('thumb-hide-arrow');
				}
				$('.thumb-left').bind('click', thumbLeft);				
			}
		}

		var thumbClick = function() {
				wrapThumb.children('.thumb').on('click', function(){
					var cur = $(this).index();
					console.log(cur);
				});
		}

		setup();
		return this;		
	}
})(jQuery);