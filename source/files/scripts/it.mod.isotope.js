IT.register(function() {
	
	'use strict';
	
	var $isotope = $('.isotope').imagesLoaded(function() {
		
		$('.isotope_item').animate({ opacity: '1' });
		
		$isotope.isotope({
			itemSelector: '.isotope_item',
			//columnWidth: $isotope.find('.isotope_sizer')[0],
			columnWidth: 140,
			isLayoutInstant: false,
			transitionDuration: '.5s'
		});
		
	});
	
}); // IT
