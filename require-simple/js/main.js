require(['jquery','message'], function($, aMesssage) {
	$(window).on({
		click: function(e) {
			alert(aMesssage);
		}
	})
})