/* jshint -W083, unused: vars */

IT.register(function() {
	
	'use strict';
	
	/**
	 * @see http://paulirish.github.io/infinite-scroll/test/
	 * @see http://isotope.metafizzy.co/v1/demos/infinite-scroll.html
	 * @see http://blog.lingohub.com/developers/2013/09/endless-pages-scrolling-masonry/
	 */
	
	$(function() {
		
		//var FQDN = 'http://registerguard.com/csp/cms/sites/rg/demos/home/page.csp?callback=?';
		
		// Cache isotope DOM element:
		var $isotope = $('#isotope')
			// Instantiate isotope:
			.isotope({ // http://isotope.metafizzy.co/
				itemSelector:       '.isotope_item', // http://isotope.metafizzy.co/options.html#itemselector
				transitionDuration: '.5s',           // http://isotope.metafizzy.co/options.html#transitionduration
				layoutMode:         'fitRows'        // http://isotope.metafizzy.co/options.html#layoutmode
			});
		
		// Parse JSON data:
		var _parse = function(json) {
			
			// Hoist, declare & initialize:
			var html = '';
			
			// Iterate over json results:
			$.each(json.results, function(i, item) {
				
				// Create string of HTML:
				html += _render(item); // Just a string.
				
			});
			
			// Send HTML string back to caller:
			return html;
			
		}; // _parse()
		
		// Template for JSON response:
		var _render = function(data) {
			
			// Simple format, class name used for isotope functionality:
			return '<div class="isotope_item"><p>' + data.title + '</p></div>';
			
		}; // _render
		
		var _infinite = function() {
			
			// Might as well insert this using JS as I don't want google indexing:
			var $next = $('<a />', {
				id: 'infscr-next',
				//href: 'http://registerguard.com/csp/cms/sites/rg/demos/home/page.csp?page=2',
				href: 'pages/page2.json',
				text: 'Next page?'
			});
			
			// Setup infinitescroll:
			$isotope
				
				// REQUIRED!
				// Insert after isotope container:
				.after($next)
				
				// Instantiate infinitescroll:
				.infinitescroll({ // http://www.infinite-scroll.com/
					
					path: function(index) {
						// Use this for local testing:
						return 'pages/page' + index + '.json'; // https://github.com/paulirish/infinite-scroll/pull/171
						// Can be JSONP API endpoint:
						//return FQDN + '&page=' + index;
					},
					navSelector: $next,
					nextSelector: $next,
					itemSelector: '#isotope .isotope_item', // Selector for all items you'll retrieve.
					//debug: true, // Enable debug messaging (to console.log).
					dataType: 'json',
					appendCallback: false, // Needed if `json` data type.
					loading: { // Undocumented. HTML ID: `#infscr-loading`.
						msgText: 'Wait',
						finishedMsg: 'End',
						img: 'images/loader2.gif',
						speed: 0 // https://github.com/paulirish/infinite-scroll/issues/455#issuecomment-54584558
					}
				},
				// Infinitescroll callback function:
				function(json, opts) {
					
					// https://github.com/paulirish/infinite-scroll#loading-json-data
					// Do something with JSON data, create DOM elements, etc. ...
					
					// Cache json elements:
					var $newElements = $(_parse(json));
					
					// Pause the infinitescroll during load:
					$isotope.infinitescroll('pause');
					
					// Instantiate imagesloaded for ajaxed elements:
					$newElements.imagesLoaded(function() {
						
						$isotope
							.append($newElements) // Needed?
							// http://isotope.metafizzy.co/methods.html#appended
							// Add and lay out newly appended elements:
							.isotope('appended', $newElements);
							// Use this only if I find problems when cross-browser testing:
							// https://github.com/metafizzy/isotope/issues/76
							//.isotope('layout'); // http://isotope.metafizzy.co/methods.html
						
					});
					
				});
			
			// Listen for isotope's layoutcomplete callback.
			// http://isotope.metafizzy.co/events.html#layoutcomplete
			$isotope.isotope('on', 'layoutComplete', function(isoInstance, laidOutItems) {
				
				// What just happened?
				//console.log('Isotope layout completed on', laidOutItems.length, 'items');
				
				// Un-pause infinite scroll (we're assuming it's been paused):
				$isotope.infinitescroll('resume');
				
			}); // FINISH!!!!! :)
			
		}; // _infinite
		
		// Get initial JSON data:
		var _init = function() {
			
			// The initial loading div:
			var $loading = $(this);
			
			// Load page 1 content ...
			// Use for local testing:
			$.getJSON('pages/page1.json')
			// Can be JSONP API endpoint:
			//$.getJSON(FQDN, {
			//	page: 1,
			//	format: 'json' // Pass whatever here.
			//})
				.done(function(json) {
					
					// Cache json elements:
					var $newElements = $(_parse(json));
					
					//console.log($newElements);
					
					// Instantiate imagesloaded for ajaxed elements:
					$newElements.imagesLoaded(function() {
						
						// Fade out the initial loading div:
						$loading.fadeOut('slow', function() {
							
							// Add new isotope elements to DOM:
							$isotope
								.append($newElements)
								.isotope('appended', $newElements);
							
							_infinite(); // Setup infinitescroll.
							
						});
						
					});
					
				}); // $.getJSON().done()
			
		};
		
		// START!!!!! :)
		$('<div />', { id: 'isotope-loading' }) // Let people know there's stuff coming.
			.insertBefore($isotope) // Put it at the top.
			.fadeIn('slow', _init); // Show it and start program.
		
	});
	
}); // IT
