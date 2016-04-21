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
			scrollTop: o - buffer - 50
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
					if (window_smaller_than(1001)) {
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
				if (window_smaller_than(1001)) {
					init();
				}
			}
			shTrigger();
		},
		init: function() {
			exist('.js-goto') && N.goTo();
			fixEl('.js-topbar');
			N.mobileNav();
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