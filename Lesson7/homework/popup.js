(function($) {

// Listner for open buttons
$('a[data-popup-id]').click(function(e) {
    e.preventDefault();
    var popapLocation = $(this).attr('data-popup-id');
    $('#'+popapLocation).popup();
});
  
var options = {};
 
// Plugin
$.fn.popup = function(aOptions) {
  $.extend(options, aOptions);
  
  $this = $(this);
  $('body').addClass('hidden');
  $this
    .wrap('<div class="jq-popup-wrap">')
    .append('<div class="jq-popup-close">')
    .show();
};
  
// Close Popup
$('.jq-popup').click(function(e) { 
	e.stopPropagation(); 
});
  
$('body').delegate('.jq-popup-wrap', 'click', function(){
    closePopup();
});

  
$('.jq-popup').delegate('.jq-popup-close', 'click', function() {
  closePopup();
});

function closePopup() {
  $('.jq-popup')
    .hide()
    .unwrap('<div class="jq-popup-wrap">')
    .children('.jq-popup-close')
    .remove();
  $('body').removeClass("hidden");	
}

})(jQuery);