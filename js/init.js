head.js('https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js')
	.js('https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js')
	.js('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.0.0-beta.3/owl.carousel.min.js')
	.load('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.0.0-beta.3/assets/owl.carousel.min.css')
	.js('js/main.js');

if (head.browser.ie && parseFloat(head.browser.version) < 9) {
    head.js('https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js')
    	.js('https://cdnjs.cloudflare.com/ajax/libs/selectivizr/1.0.2/selectivizr-min.js')
    	.js('https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js');
}
