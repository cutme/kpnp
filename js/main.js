/*jshint expr:true */

jQuery(function($) {
	function exist(o) {
		d = ($(o).length>0) ? true : false;
		return d;
	}

	function fixEl(el) {
		var pos = $(el).position(), b = $('body');
		$(window).on('scroll', function() {
			b.scrollTop() >= pos.top ? b.addClass('fixed') : b.removeClass('fixed');
		});
	}
	
	function isScrolledIntoView(elem) {
		var $e = elem, 
			$w = $(window),
			docViewTop = $w.scrollTop(),
			docViewBottom = docViewTop + $w.height(),
			elemTop = $e.offset().top,
			elemBottom = elemTop + $e.height();
		return docViewBottom >= elemTop;
	}

	var L = {
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
			exist('.js-count') && L.counting('.js-count');
			L.modernizrSupport();
		}
	};

	var N = {
		init: function() {
			fixEl('.js-topbar');
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
	});
});