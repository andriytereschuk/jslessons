'use strict';

(function($) {
  // default options
  var options = {
    animationName: 'slide',
    arrows: true,
    autoShowDelay: 0,
    duration: 600,
    startImageIndex: 0,
    thumbsPosition: 'bottom',

    onLoad: function(){}
  };

  var animating = false,
      curImageIndex = -1,
      curThumbsPos = 0,
      data,
      imageLoadCount = 0,
      images = [],
      maxImageHeight = 0,
      maxImageWidth = 0,
      maxThumbHeight = 0,
      minThumbsPos,
      thumbs = [],
      tmrAutoShow;

  var self,
      $btnImageNext,
      $btnImagePrev,
      $btnThumbsNext,
      $btnThumbsPrev,
      $imagesWrapper,
      $thumbsContainer,
      $thumbsWrapper;

  $.fn.atGallery = function(aData, aOptions) {
    self = this;

    data = aData;
    $.extend(options, aOptions);

    self.addClass('at-gallery');

    $imagesWrapper = $('<div>', {class: 'images-wrapper'}).appendTo(self);

    if(options.arrows) {
      $btnImageNext = $('<div>', {class: 'btn-image-next'})
        .appendTo($imagesWrapper)
        .click(function() {
          show(curImageIndex + 1);
        });
      $btnImagePrev = $('<div>', {class: 'btn-image-prev'})
        .appendTo($imagesWrapper)
        .click(function() {
          show(curImageIndex - 1);
        });
    }

    $thumbsWrapper = $('<div>', {class: 'thumbnails-wrapper'});
    $thumbsContainer = $('<div>', {class: 'thumbnails-container'}).appendTo($thumbsWrapper);
    $btnThumbsNext = $('<div>', {class: 'btn-thumbs-next'})
      .appendTo($thumbsWrapper)
      .click(function() {
         thumbsMove(1);
      });

    $btnThumbsPrev = $('<div>', {class: 'btn-thumbs-prev'})
      .appendTo($thumbsWrapper)
      .click(function() {
         thumbsMove(-1);
      });

    switch(options.thumbsPosition) {
    case 'bottom':
    case 'right':
      self.append($thumbsWrapper);
      break;
    case 'top':
    case 'left':
      self.prepend($thumbsWrapper);
      break;
    default:
      throw new Error('Unknown value of thumbsPosition: ' + options.thumbsPosition);
    }

    switch(options.thumbsPosition) {
    case 'bottom':
    case 'top':
      self.addClass('rows');
      break;
    case 'left':
    case 'right':
      self.addClass('cols');
      break;
    }

    imagesDataProcess();

    return self;
  }

  function autoShowStart() {
    if (!tmrAutoShow) {
      tmrAutoShow = setInterval(function() {
        show(curImageIndex + 1);
      }, options.autoShowDelay);
    }
  }

  function autoShowStop() {
    clearInterval(tmrAutoShow);
    tmrAutoShow = null;
  }

  function imagesDataProcess() {
    for (var i = 0, c = data.length; i < c; i++) {
      var lImageData = data[i];

      images.push(
        $('<a>', {class: 'image'})
          .append(
            $('<img>', {src: lImageData.imageURL})
              .data('index', i)
              .load(function() {
                onImageLoad(this);
              })
          )
          .appendTo($imagesWrapper)
      );

      thumbs.push(
        $('<div>', {class: 'thumb'})
          .click(function() {
            show($(this).data('index'));
          })
          .data('index', i)
          .append(
            $('<img>', {src: lImageData.thumbnailURL}).load(function() {
              onImageLoad(this, true);
            })
          )
          .appendTo($thumbsContainer)
      );
    }
  }

  function onImageLoad(aImage, aIsThumb) {
    if (aIsThumb) {
      maxThumbHeight = Math.max(maxThumbHeight, aImage.clientHeight);
    } else {
      maxImageWidth = Math.max(maxImageWidth, aImage.clientWidth);
      maxImageHeight = Math.max(maxImageHeight, aImage.clientHeight);

      var $lImage = $(aImage);
      $lImage.addClass('loaded');
      images[$lImage.data('index')].css('display', 'none');
    }

    imageLoadCount++;
    if (imageLoadCount == data.length * 2) {
      onLoad();
    }
  }

  function onLoad() {
    $imagesWrapper.css({
      height: maxImageHeight + 'px',
      width: maxImageWidth + 'px'
    });

    switch(options.thumbsPosition) {
    case 'bottom':
    case 'top':
      $thumbsContainer.css('height', maxThumbHeight + 'px');
      $thumbsWrapper.css('width', maxImageWidth + 'px');
      minThumbsPos = maxImageWidth - $thumbsContainer.width();
      break;
    case 'left':
    case 'right':
      $thumbsWrapper.css('height', maxImageHeight + 'px');
      minThumbsPos = maxImageHeight - $thumbsContainer.height();
    }

    show(options.startImageIndex);

    self.hover(autoShowStop, autoShowStart);

    if (options.autoShowDelay) {
      autoShowStart();
    }

    options.onLoad();
  }

  function show(aImageIndex) {
    if (animating) {
      return;
    }

    if (curImageIndex == -1) {
      images[aImageIndex].css('display', 'block');
      thumbs[aImageIndex].addClass('active');
      curImageIndex = aImageIndex;
      return;
    }

    var lDirection = aImageIndex > curImageIndex ? 1 : -1;

    if (aImageIndex < 0) {
      aImageIndex = data.length - 1;
    } else
    if (aImageIndex == data.length) {
      aImageIndex = 0;
    }

    thumbs[curImageIndex].removeClass('active');
    thumbs[aImageIndex].addClass('active');

    switch(options.animationName) {
    case 'slide':
      slide(aImageIndex, lDirection);
      break;
    case 'fade':
      fade(aImageIndex);
      break;
    default:
      throw new Error('Unknown value of animationName: ' + options.animationName);
    }

    curImageIndex = aImageIndex;
    thumbPositionCheck();
  }

  function thumbPositionCheck() {
    var $thumb = thumbs[curImageIndex],
        lOffsetPos,
        lThumbDimension,
        lVisibleAreaDimension;

    switch(options.thumbsPosition) {
    case 'bottom'  :
    case 'top':
      lOffsetPos = $thumb.offset().left - $thumbsContainer.offset().left;
      lThumbDimension = $thumb.width();
      lVisibleAreaDimension = maxImageWidth;
      break;
    case 'left':
    case 'right':
      lOffsetPos = $thumb.offset().top - $thumbsContainer.offset().top;
      lThumbDimension = $thumb.height();
      lVisibleAreaDimension = maxImageHeight;
      break;
    }

    if (lOffsetPos < -curThumbsPos) {
      curThumbsPos = -lOffsetPos;
    } else
    if (lOffsetPos + lThumbDimension > -curThumbsPos + lVisibleAreaDimension) {
      curThumbsPos = -(lOffsetPos + lThumbDimension - lVisibleAreaDimension);
    } else {
      return;
    }

    thumbsMove();
  }

  function thumbsMove(aDirection) {
    var lAnimateProp,
        lVisibleAreaDimension;

    switch(options.thumbsPosition) {
    case 'bottom'  :
    case 'top':
      lVisibleAreaDimension = maxImageWidth;
      lAnimateProp = 'left';
      break;
    case 'left':
    case 'right':
      lVisibleAreaDimension = maxImageHeight;
      lAnimateProp = 'top';
      break;
    }

    if (aDirection) {
      curThumbsPos = curThumbsPos - aDirection * lVisibleAreaDimension;
    }
    curThumbsPos = Math.max(Math.min(curThumbsPos, 0), minThumbsPos);

    var lAnimateParams = {};
    lAnimateParams[lAnimateProp] = curThumbsPos + 'px';
    $thumbsContainer.animate(lAnimateParams, options.duration);
  }

  /* animations */

  function fade(aImageIndex) {
    var $lOldImage = images[curImageIndex],
        $lNewImage = images[aImageIndex];

    animating = true;
    $lOldImage
      .css({
        left: 0,
        top: 0,
        zIndex: 1
      })
      .animate({opacity: 0}, options.duration, function() {
        $lOldImage.css('display', 'none');
        animating = false;
      })

    $lNewImage
      .css({
        display: 'block',
        opacity: 0,
        left: 0,
        top: 0,
        zIndex: 2
      })
      .animate({opacity: 1}, options.duration);
  }

  function slide(aImageIndex, aDirection) {
    var $lOldImage = images[curImageIndex],
        $lNewImage = images[aImageIndex];

    animating = true;
    $lOldImage
      .css('left', 0)
      .animate({left: -aDirection * 100  + '%'}, options.duration, function() {
        $lOldImage.css('display', 'none');
        animating = false;
      })

    $lNewImage
      .css({
        display: 'block',
        left: aDirection * 100 + '%'
      })
      .animate({left: 0}, options.duration);
  }

})(jQuery);