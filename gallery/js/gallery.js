;(function($) {

var options = {
	effect: 'slide',
	speed: 500
};

$.fn.gallery = function(aOptions) {
	var self = $(this);
	var gallery = {};
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();	

	/* Initializes namespace settings to be used throughout plugin */
	var init = function() {
		gallery.settings = $.extend(options, aOptions);

		// perform all DOM / CSS modifications
		setup();
	}

	/* Perform all DOM / CSS modifications*/
	var setup = function() {
		// create img and thumbnail wrapper
		self.append('<div class="gallery-img-wrapper"><a class="gallery-arrows gallery-left"></a><a class="gallery-arrows gallery-right"></a><ul class="gallery-img"></ul></div><div class="thumbnail-img-wrapper"><ul class="thumbnail-img"></ul></div>');

		// get img via AJAX
		$.ajax({
			type: 'GET',
			url: 'api/gallery.json',
			crossDomain: true,
			dataType: 'json',
			success: function(response) {
				for (var i = 0; i < response.images.length; i++) {
					$('.gallery-img')
						.append('<li><a target="_blank" href=' + response.images[i].url +
						 '><img data-id=img' +i+ ' src=' + response.images[i].imageURL + '></a></li>');
					$('.thumbnail-img')
						.append('<li><img src=' + response.images[i].thumbnailURL + '></li>');
				}
				
				// set width for element
				$('.gallery-img > li').css('width',windowWidth);

				getImageHeight();
			}
		});
	}

	var getImageHeight = function() {
		$('img[data-id="img0"]').one('load', function() {
			var firstImageHeight = this.height;
			$('.gallery-img-wrapper').height(firstImageHeight);

			if(gallery.settings.effect == 'slide') {
				slide();
			}
		});
	}

	var slide = function() {
		$('.gallery-arrows').on({
			click: function(event) {
				event.preventDefault();
				var value  = -windowWidth;
				var heightNextImage = $('img[data-id="img1"]').height();
				$('.gallery-img').css('transform','translate3d(' + value + 'px, 0, 0)');
				$('.gallery-img-wrapper').height(heightNextImage);
			}
		});
	}

	init();
	return this;
}

})(jQuery);