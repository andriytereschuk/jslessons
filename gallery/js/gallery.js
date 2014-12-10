;(function($) {

var options = {
	effect: 'slide',
	speed: 500
};

$.fn.gallery = function(aOptions) {
	var self = $(this);
	var gallery = {};
	var galleryWidth = $('.gallery').width();
	var currentSlide = 0,
			slideCount = 0;

	var init = function() {
		gallery.settings = $.extend(options, aOptions);

		// perform all DOM
		setup();
	}

	/* Perform all DOM */
	var setup = function() {
		// create img and thumbnail wrapper
		self.append('<div class="gallery-img-wrapper"><a class="gallery-arrows gallery-left"></a><a class="gallery-arrows gallery-right"></a>'+''
			+'<ul class="gallery-img"></ul></div><div class="thumbnail-img-wrapper"><ul class="thumbnail-img"></ul>'+''
			+'<a class="thumb-gallery thumb-left"></a><a class="thumb-gallery thumb-right"></a></div>');

		wrap = $('.gallery-img-wrapper');
		ulImg = $('.gallery-img');
		ulThumb = $('.thumbnail-img');

		// get img via AJAX
		$.ajax({
			type: 'GET',
			url: 'api/gallery.json',
			dataType: 'json',
			success: function(response) {
				slideCount  = response.images.length;
				for (var i = 0; i < slideCount; i++) {
					ulImg
						.append('<li><a target="_blank" href=' + response.images[i].url +
						 '><img data-id=img' + i + ' src=' + response.images[i].imageURL + '></a></li>');
					ulThumb
						.append('<li><img src=' + response.images[i].thumbnailURL + '></li>');
				}
				
				// set width for element
				ulImg.children('li').css('width', galleryWidth);

				getImageHeight();
				thumb();
				thumbArrows();
			}
		});
	}

	var getImageHeight = function() {
		$('img[data-id="img0"]').one('load', function() {
			var firstImageHeight = this.height;
			$('.gallery-img-wrapper').height(firstImageHeight);
			$(this).closest('li').addClass('active');

			if(gallery.settings.effect == 'slide') {
				slide();
			}
		});
	}

	var slide = function() {
		// click left
		$('.gallery-left').on({
			click: function(event) {
				event.preventDefault();
				// show right button
				$('.gallery-right').show();
				--currentSlide;
				if (!currentSlide) $(this).hide();
				slideChange();
			}
		});

		// click right
		$('.gallery-right').on({
			click: function(event) {
				event.preventDefault();
				// show right button
				$('.gallery-left').show();
				++currentSlide;
				if(currentSlide == slideCount - 1) $(this).hide();
				slideChange();
			}
		});
	}


	var slideChange = function () {
		// change active slide 
		ulImg.children('li')
			.removeClass('active')
			.eq(currentSlide)
			.addClass('active');

		// calc slide value
		var slideWidth = wrap.width();
		var slideValue  = -slideWidth * currentSlide;
		ulImg.css('transform','translate3d(' + slideValue + 'px, 0, 0)');

		// calc slider wrap
		var heightNextImage = $('img[data-id="img' + currentSlide + '"]').height();				
		wrap.height(heightNextImage);

		syncThumb();
	}

	var thumb = function() {
		ulThumb.children('li').first().addClass('active');

		// click thumb img
		ulThumb.children('li').on({
			click: function(event) {
				event.preventDefault();

				currentSlide = $(this).index();								
				if(currentSlide == slideCount - 1) {
					$('.gallery-right').hide();
					$('.gallery-left').show();
				}
				if(!currentSlide) {
					$('.gallery-left').hide();
					$('.gallery-right').show();
				};

				if(currentSlide > 0 && currentSlide < (slideCount-1)) {
					$('.gallery-left').show();
					$('.gallery-right').show();					
				}

				slideChange();
			}
		});		
	}

	var syncThumb = function() {
		ulThumb.children('li')
			.removeClass('active')
			.eq(currentSlide)
			.addClass('active');
	}

	var thumbArrows = function() {
		$('.thumb-left').on({
			click: function(event) {
				event.preventDefault();
				$('.gallery-left').click();
			}
		});

		$('.thumb-right').on({
			click: function(event) {
				event.preventDefault();
				$('.gallery-right').click();
			}
		});
	}	

	init();
	return this;
}

})(jQuery);