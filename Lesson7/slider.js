(function($) {
  function Slider(aDomElement, aOptions) {
    var self = this,
        currentValue = 0,
        handle,
        maxLeft,
        startX,
        startPositionX;

    function _constructor() {
      _init();
    }

    function _init() {
      aDomElement.addClass('at-slider');
      handleBuild();

      maxLeft = aDomElement.width() - handle.width();
    }

    function handleBuild() {
      handle = $('<div>', {class: 'handle'});
      aDomElement.append(handle);

      handle.bind('mousedown', handle_mouseDown);
    }

    //events
    function handle_mouseDown(aEvent) {
      startX = aEvent.pageX;
      startPositionX = parseInt(handle.css('left'));

      $(document).bind('mousemove', handle_mouseMove);
      $(document).bind('mouseup', handle_mouseUp);
    }

    function handle_mouseMove(aEvent) {
      var lLeft = startPositionX + (aEvent.pageX - startX);
      handle.css('left', Math.min(Math.max(lLeft, 0), maxLeft) + 'px');

      currentValue = (lLeft * (aOptions.max -  aOptions.min) / maxLeft + aOptions.min).toFixed(3);
      aOptions.onMove(currentValue);
    }

    function handle_mouseUp(aEvent) {
      $(document).unbind('mousemove', handle_mouseMove);
       $(document).unbind('mouseup', handle_mouseUp);
      aOptions.onChange(currentValue);
    }

    _constructor();
    return self;
  }

  var options = {
    min: 0,
    max: 100,
    onChange: function(){},
    onMove: function(){}
  };

  $.fn.slider = function(aOptions) {
    if (this.length > 1) {
      throw new Error('Slider say: I can not work with more than one element');
    }

    $.extend(options, aOptions);

    return this.each(function(aIndex, aElement) {
      new Slider($(aElement), options);
    });
  }
})(jQuery);