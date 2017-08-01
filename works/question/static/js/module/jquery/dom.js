define(['jquery'], function($) {

	return {
		body: $('body'),
		win: $(window),
		dt: $(document),
		top: $(window.top),
		layer: window.top.layer
	};
});