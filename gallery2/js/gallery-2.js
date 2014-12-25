(function($) {

  // default options
  var options = {
    arrows: true,
    thumb: false,
    effect: 'slide',
    speed: 600,
    api: 'api/gallery.json'
  };

  $.fn.gallery = function(aOptions) {
    var self = $(this);
    self.addClass('gallery-wrap');

    var settings = $.extend(options, aOptions);
    var speed = settings.speed;
    var width = self.width();

    // -------------------------------------------------------

    setup = function() {
      self.append('<div class="gallery-img-wrapper" />');
      $wrapImg = $('.gallery-img-wrapper');

      $.ajax({
        type: 'GET',
        url: settings.api,
        dataType: 'json',
        success: function(aResponse) {
          response = aResponse;
          itemsCount  = aResponse.images.length;

          $wrapImg
            .append('<div class="gallery-slide next-slide" data-id=""></div>')
            .append('<div class="gallery-slide current-slide" data-id='+ 0 +'><a target="_blank" href='+ response.images[0].url +'><img src='+ response.images[0].imageURL +'></a></div>');
          var $currentSlide = $('.current-slide');

          // set wrap height
          setWrapHeight($currentSlide.find('img'));

          // add arrows
          if(settings.arrows) {
            $wrapImg.append('<div class="gallery-arrows"><a class="gallery-left" /><a class="gallery-right" /></div>');
            
            $leftArr = $('.gallery-left');
            $rightArr = $('.gallery-right');

            arrowActions();             
          }

          // add thumbnails
          if(settings.thumb) {
            self.append('<div class="thumbnail-img-wrapper"><div class="thumbnail-transform"></div></div>');
            
            $thumbImgWrap = $('.thumbnail-img-wrapper');
            $wrapThumb = $('.thumbnail-transform');

            thumbAdd();
          }         
        }
      });     
    }

    // -------------------------------------------------------

    setWrapHeight = function(aImg) {
      aImg.one("load", function() {
        var calcHeight;
        if(this.width > width) {
          calcHeight = width * this.height / this.width;
        }

        else {
          calcHeight = this.height;
        }
        
        $wrapImg.animate({
          'height' : calcHeight
        },speed);
      });
    }

    // -------------------------------------------------------

    arrowActions = function() {
      $rightArr.on('click', function(){
        $currentSlide = $('.current-slide');
        nextId = $currentSlide.attr('data-id');
        changeRight(nextId);
      });
      $leftArr.on('click', function(){
        $currentSlide = $('.current-slide');
        nextId = $currentSlide.attr('data-id');
        changeLeft(nextId);
      });
    }

    // -------------------------------------------------------

    changeRight = function(nextId) {
      var $nextSlide = $('.next-slide');
      if(nextId == itemsCount-1) {
        nextId = 0;
      }

      else {
        ++nextId;
      }

      // sync with thumb
      thumbRight(nextId);
      $wrapThumb.children('.thumb').eq(nextId).addClass('act-slide');

      // prepare next slide
      $('.next-slide')
        .css({
          'left' : '100%',
          'opacity' : 1,
          'zIndex' : 1,
          'display' : 'block'
        })
        .attr('data-id',nextId)
        .append('<a target="_blank" href='+ response.images[nextId].url +'><img src='+ response.images[nextId].imageURL +'></a>');
      
      // set wrap height  
      setWrapHeight($nextSlide.find('img'));

      // change (animate) slide

      $('.current-slide').animate({
        'left' : '-100%'
      },speed,function(){
        $(this)
          .css({
            'left' : 0,
            'opacity' : 0,
            'zIndex' : 0,
            'display' : 'none'
          });
        $(this)
        .attr('data-id','')
        .find('a').remove();
        $(this).removeClass('current-slide').addClass('next-slide');;
      });

      $('.next-slide').animate({
        'left' : 0
      },speed,function(){
        $(this).removeClass('next-slide').addClass('current-slide');
      });
    }

    // -------------------------------------------------------

    changeLeft = function(nextId) {

      var $nextSlide = $('.next-slide');
      if(nextId == 0) {
        nextId = itemsCount-1;
      }

      else {
        --nextId;
      }

      // sync with thumb
      thumbLeft(nextId);

      // prepare next slide
      $('.next-slide')
        .css({
          'left' : '-100%',
          'opacity' : 1,
          'zIndex' : 1,
          'display' : 'block'
        })
        .attr('data-id',nextId)
        .append('<a target="_blank" href='+ response.images[nextId].url +'><img src='+ response.images[nextId].imageURL +'></a>');
      
      // set wrap height  
      setWrapHeight($nextSlide.find('img'));

      // change (animate) slide

      $('.current-slide').animate({
        'left' : '100%'
      },speed,function(){
        $(this)
          .css({
            'left' : 0,
            'opacity' : 0,
            'zIndex' : 0,
            'display' : 'none'
          });
        $(this)
        .attr('data-id','')
        .find('a').remove();
        $(this).removeClass('current-slide').addClass('next-slide');;
      });

      $('.next-slide').animate({
        'left' : 0
      },speed,function(){
        $(this).removeClass('next-slide').addClass('current-slide');
      });
    }

    // -------------------------------------------------------

    thumbAdd = function() {
      for (var i = 0; i < itemsCount; i++) {
        $wrapThumb.append('<div class="thumb"><img src='+ response.images[i].thumbnailURL +'></div>');
      }
      return setThumbWidth();   
    }

    // -------------------------------------------------------

    setThumbWidth = function() {
      // set 1-st thumb active class
      $wrapThumb.children('.thumb').first().addClass('act-slide active');

      // set wrapThumb width
      var wrapThumbHeight = $wrapThumb.height();
      var wrapThumbWidth = 0;
      var tumbPadding = 10;
      thumbArr = [];

      $('.thumb img').each(function(index) {
        $(this).one('load', function() {
          var calcWidth = this.width * wrapThumbHeight / this.height;
          wrapThumbWidth = wrapThumbWidth + calcWidth + tumbPadding;
          thumbArr.push(wrapThumbWidth);
          $wrapThumb.css('width',wrapThumbWidth+'px');
          if(thumbArr.length == itemsCount) {
            console.log("thumbnails loaded");
            return lastSectionItem();
          }
        });
      });
    }

    // --------------------------------------------------------

    lastSectionItem = function() {
      thumbImgWrapWidth = $thumbImgWrap.width();
      if(thumbArr[thumbArr.length-1] > thumbImgWrapWidth)
      {
        thumbSection = 1;
        lastItemArr = [0];

        for(var i = 0; i < itemsCount; i++) {
          if(thumbArr[i] >= thumbImgWrapWidth*thumbSection) {
            ++thumbSection;
            lastItemArr.push(i);
          }       
        }

        console.log("need thumb arrows");
        $thumbImgWrap.append('<div class="thumb-arrows"><a class="thumb-left thumb-hide-arrow" /><a class="thumb-right" /></div>');
        
        thumbArrowActions();
        thumbActions();
      }
    }

    // -------------------------------------------------------

    thumbArrowActions = function() {
      $('.thumb-left').on('click', function(){
        currentThumb = $wrapThumb.children('.active').index();
        --currentThumb;
        thumbLeft(currentThumb);        
      });
      $('.thumb-right').on('click', function(){
        currentThumb = $wrapThumb.children('.active').index();
        ++currentThumb;
        thumbRight(currentThumb);
      });
    }


    // -------------------------------------------------------

    thumbRight = function(currentThumb) {
      console.log(currentThumb);
      if(currentThumb != itemsCount && currentThumb != 0) {
        // show left arrow
        $('.thumb-left').removeClass('thumb-hide-arrow');

        // check end of section
        var checkEndSection = false;
        for (var i = 1; i < lastItemArr.length; i++) {
          console.log(lastItemArr[i], currentThumb);
          if(lastItemArr[i] > currentThumb) {
            currentThumb = lastItemArr[i];
            break;
          }
        }

        console.log(currentThumb);

        $wrapThumb.animate({
          'left' : -thumbArr[currentThumb-1] + 'px'
        }, 200, function() {
          $wrapThumb.children('.thumb')
            .removeClass('active')
            .eq(currentThumb)
            .addClass('active');
        });

        if(currentThumb == itemsCount-1) {
          $('.thumb-right').addClass('thumb-hide-arrow');
        }
      }

      else {
          currentThumb = 0;
          
          $wrapThumb.animate({
            'left' : 0
          }, 200, function() {
            $wrapThumb.children('.thumb')
              .removeClass('active')
              .eq(currentThumb)
              .addClass('active');
          });
          $('.thumb-left').addClass('thumb-hide-arrow');
          $('.thumb-right').removeClass('thumb-hide-arrow');
      }
    }

    // -------------------------------------------------------

    thumbLeft = function(currentThumb) {
      if(currentThumb != -1) {
        if(currentThumb < lastItemArr[1]) {
          $wrapThumb.animate({
            'left' : 0
          }, 200, function() {
            $wrapThumb.children('.thumb')
              .removeClass('active')
              .eq(currentThumb)
              .addClass('active');
          });

          if(currentThumb == 0) $('.thumb-left').addClass('thumb-hide-arrow');
        }
        else {
        // show right arrow
        $('.thumb-right').removeClass('thumb-hide-arrow');
          $wrapThumb.animate({
            'left' : -thumbArr[currentThumb-1] + 'px'
          }, 200, function() {
            $wrapThumb.children('.thumb')
              .removeClass('active')
              .eq(currentThumb)
              .addClass('active');
          });
        }
      }

      else {
          currentThumb = itemsCount-1;
          
          $wrapThumb.animate({
            'left' : -thumbArr[currentThumb-1] + 'px'
          }, 200, function() {
            $wrapThumb.children('.thumb')
              .removeClass('active')
              .eq(currentThumb)
              .addClass('active');
          });
          $('.thumb-right').addClass('thumb-hide-arrow');
          $('.thumb-left').removeClass('thumb-hide-arrow');
      }
    }

    // ----------------------------------

    // -------------------------------------------------------

    thumbActions = function() {
      $wrapThumb.find('.thumb').on('click', function(){
        currentThumb = $(this).index();
        changeRight(currentThumb-1);
      });
    }   


    setup();
    return this;    
  }
})(jQuery);