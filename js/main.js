/*jshint expr:true */

function debouncer(func, timeout) {
	var timeoutID;
	timeout = timeout || 200;
	return function() {
		var scope = this,
			args = arguments;
		clearTimeout(timeoutID);
		timeoutID = setTimeout(function() {
			func.apply(scope, Array.prototype.slice.call(args));
		}, timeout);
	};
}

jQuery(function($) {
	function exist(o) {
		d = ($(o).length>0) ? true : false;
		return d;
	}

	function fixEl(el) {
		var pos = $(el).position(), b = $('body');
		function init() {
			b.scrollTop() >= pos.top ? b.addClass('fixed') : b.removeClass('fixed');
		}
		$(window).on('scroll', function() {
			init();
		});
		init();
	}

	function goToTarget(target) {
		var v = $('html, body'), o = $(target).offset().top, buffer = $('.c-topbar').height();
		v.animate({
			scrollTop: o - buffer + 2
		}, {
			duration: 1500,
			easing: 'easeOutCubic'
		});
	}

	function isScrolledIntoView(elem) {
		var e = elem, 
			w = $(window),
			docViewTop = w.scrollTop(),
			docViewBottom = docViewTop + w.height(),
			elemTop = e.offset().top,
			elemBottom = elemTop + e.height();
		return docViewBottom >= elemTop;
	}

	function window_smaller_than(n) {
		var d = ($(window).width() < n) ? true : false;
		return d;
	}

	var L = {
		accordion: function() {
			var o = $('.js-accordion'), i = $('.c-accordion__item'), l = $('.c-accordion__lead'), h = '.c-accordion__holder', open = 'is-open';
			
			i.eq(0).addClass('is-open');

			l.on('click', function() {
				_t = $(this);

				if ( $(this).parent().hasClass(open) ) {
					_t.next(h).slideUp(300, function() {
						_t.parent().removeClass(open);
					});
				} else {
					if (o.find('.'+open).length>0) {
						o.find('.'+open).find(h).slideUp(300, function() {
							o.find('.'+open).removeClass(open);
							_t.parent().addClass(open);
							_t.next(h).slideDown();
						});
					} else {
							_t.parent().addClass(open);
							_t.next(h).slideDown();
					}
				}
			});
		},
		counting: function(el) {
			var el = $(el);
			
			function count(o) {
				o.prop('Counter', 0).animate({
					Counter: o.text()
					}, {
						duration: 4000,
						easing: 'swing',
						step: function (now) {
							o.text(Math.ceil(now));
						}
					});
			}

			function init(obj) {
				if (isScrolledIntoView(obj) === true) {
					if (obj.data('counted') != 1) {
						obj.data('counted', 1);
						count(obj);
					}
				}
			}

			$(window).on('scroll', function() {
				el.each(function() {
					init( $(this) );
				});
			});
		},
		modernizrSupport: function() {
			var m = Modernizr.addTest('svgasimg', document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'));
			
			function replaceSvgImg() {
				var i = document.getElementsByTagName("img"),
					j, y;
				for (j = i.length; j--;) {
					y = i[j].src;
					if (y.match(/svg$/)) {
						i[j].src = y.slice(0, -3) + 'png';
					}
				}
			}

			m.svgasimg ? true : replaceSvgImg();
			
		},
		init: function() {
			exist('.js-accordion') && L.accordion();
			exist('.js-count') && L.counting('.js-count');
			L.modernizrSupport();
		}
	};

	var Map = function() {
	
		function initMap() {
			var c = $('#map');
			var lat = c.attr('data-lat');
			var lng = c.attr('data-lng');
		
			var mapStyle =[ { "stylers": [ { "saturation": -100 }, { "lightness": 20 } ] } ];
			
			var myOptions = {
				center: new google.maps.LatLng(lat,lng),
				disableDefaultUI: true,
				draggable: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scrollwheel: false,
				styles: mapStyle,
				zoom: 18
			}
			
			map = new google.maps.Map(document.getElementById("map"), myOptions);
			
			var updateCenter = function(){ $.data( map, 'center', map.getCenter() ); };

			google.maps.event.addListener( map, 'dragend', updateCenter );
			google.maps.event.addListener( map, 'zoom_changed', updateCenter );
			//google.maps.event.addListenerOnce( map, 'idle', function(){ $container.addClass( 'is-loaded' ); });

			function setCenter() {
				map.setCenter( new google.maps.LatLng(lat,lng) );
				
				if ($('.c-contact').length>0) {
					map.panBy(500, 260);
				} else {
					map.panBy(120, -60);
				}
			}
			
			setTimeout(setCenter, 1);

			google.maps.event.addDomListener(window, 'resize', function() {
               setTimeout(setCenter, 1);
            });
		}
		
		function setMarkers(locations) {
		
			var bounds = new google.maps.LatLngBounds();
			
			// for (var i = 0; i < locations.length; i++) {
			
			//var location = locations[i];
			
			var position = new google.maps.LatLng(50.375657,18.804776);
			
			var marker = new google.maps.Marker({
				position: position,
				map: map
				// icon: location[2],
			});
		
			//marker.set('id', i+1);
			
			bounds.extend(position);
			
			// }//end for
			
			//zmniejszamy przybliżenie
			var minDistance = 0.00098;
			var sumA = bounds.getNorthEast().lng() - bounds.getSouthWest().lng();
			var sumB = bounds.getNorthEast().lat() - bounds.getSouthWest().lat();
			
			if ((sumA < minDistance && sumA > -minDistance) && (sumB < minDistance && sumB > -minDistance)) {
				var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + minDistance, bounds.getNorthEast().lng() + minDistance);
				var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - minDistance, bounds.getNorthEast().lng() - minDistance);
				bounds.extend(extendPoint1);
				bounds.extend(extendPoint2);
			}
			
			//przesuwamy wszytko trochę w lewo
			var extendPoint0 = new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getSouthWest().lng() + 0.004 );
			bounds.extend(extendPoint0);
			
			//center map to markers
			map.fitBounds(bounds);
		
		}
   
		$.getScript('https://www.google.com/jsapi', function()
		{
		    google.load('maps', '3',
	    	{
				callback: function() {
					$('.c-map__loading').removeClass('u-blink');
					initMap();							
				}
			});
		});
	}

	var N = {
		goTo: function() {
			var o = $('.js-goto');
			o.on('click', function(e) {
				e.preventDefault();
				goToTarget($(this).attr('href'));
			});
		},
		mobileNav: function() {
			function shTrigger() {
				var t = $('.c-nav-trigger'),
					n = $('.c-nav-primary'),
					status = false;

				function init() {
					n.removeClass('u-posy').addClass('is-mobile u-shadow--down');
					status = true;
				}
				t.on('click', function(e) {
					e.preventDefault();
					$(this).toggleClass('is-active');
					n.slideToggle();
				});
				$(window).resize(debouncer(function(e) {
					if (window_smaller_than(1025)) {
						if (status === false) {
							init();
						}
					} else {
						if (status === true) {
							t.removeClass('is-active');
							n.addClass('u-posy').removeClass('is-mobile u-shadow--down').attr('style', '');
							status = false;
						}
					}
				}));
				if (window_smaller_than(1025)) {
					init();
				}
			}
			shTrigger();
		},
		navSelect: function() {
			var mainNav = $('.c-nav-secondary'),
				status = false;

			function init() {
				$('<select />').appendTo(mainNav);
	
		        var navSelect = mainNav.find('select');
	
				$('<option />', {
					'selected': 'selected',
					'value'   : '',
					'text'    : 'Go to...'
				}).appendTo(navSelect);
	
				mainNav.find("ul > li").each(function() {
					var parent = $('> a', this);
					
					depthChar = '',
					i = 0;

					$("<option />", {
						"value": parent.attr("href"),
						"text": depthChar + parent.text()
					}).appendTo(navSelect);
					
					
					parent.parent().find('.sub-menu > li').each(function() {
						var child = $('> a', this);
						
						depthChar = '- ';
						
						$("<option />", {
							"value": child.attr("href"),
							"text": depthChar + child.text()
						}).appendTo(navSelect);
						
					});				
				});	

				$('select').niceSelect();
	
			    navSelect.change(function() {
					window.location = $(this).find('option:selected').val();
				});
				
				status = true;
			}

			$(window).resize(debouncer(function(e) {
				if (window_smaller_than(800)) {
					if (status === false) {
						init();
					}
				} else {
					if (status === true) {
						//mainNav.find('select').remove();
						//status = false;
					}
				}
			}));

			window_smaller_than(800) === true && init();
			
			
		},
		navTarget: function () {
			var el = $('.c-nav-target'),
				active = Cookies.get('kpnp_target');

			if (active == 'undefined') {
				$('li', el).eq(0).addClass('current-menu-item');
			} else {
				$('li', el).eq(active).addClass('current-menu-item');
			}
			
			if (active == 1) {
				$('body').addClass('individual');
			} else {
				$('body').addClass('entrepreneurs');
			}
			
			$('li', el).on('click', function() {
				var $i = $(this).index();
				Cookies.set("kpnp_target", $i);
			});
		},
		init: function() {
			exist('.js-goto') && N.goTo();
			exist('.c-nav-secondary') && N.navSelect();
			fixEl('.js-topbar');
			N.mobileNav();
			N.navTarget();
		}
	}

	var S = {
		owl: function() {
			var owl = $('.owl-carousel'), _t;

			owl.each(function() {
				_t = $(this);
				_t.owlCarousel({
					dots: true,
					items: 1,
					loop: true,
					nav: true,
					navText: ['',''],
					smartSpeed: 450
				});
			});
			
			function clients_dots() {
				var e = $('.c-clients'), o = $('.owl-dots', e);
					o.detach();
					$('.o-header-serif', e).after(o);
			}
			
			function reviews_dots() {
				var e = $('.c-reviews__content'), o = $('.owl-dots', e);
					o.detach();
					e.prepend(o);
			}
			
			exist('.c-clients') && clients_dots();
			exist('.c-reviews') && reviews_dots();
		},		

		init: function() {
			exist('.owl-carousel') && S.owl();
		}
	};

	$(document).ready(function() {
		L.init();
		N.init();
		S.init();
		
		exist('#map') && Map();
	});
});