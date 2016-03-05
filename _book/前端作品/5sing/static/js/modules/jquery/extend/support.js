/*
 * 获取浏览器是否支持css动画监听事件
 * */
(function(factory) {
	if (typeof define === 'function') {
		define('jquery-support', function(require, exports, moudles) {
			factory(require('jquery'));
		});
	} else {
		factory(jQuery);
	}
}(function($) {
	$.support.getEnd = function() {
		var t,
			el = document.createElement("fakeelement"),
			animations = {
				"animation": "animationend",
				"OAnimation": "oAnimationEnd",
				"MozAnimation": "animationend",
				"WebkitAnimation": "webkitAnimationEnd"
			},
			transitions = {
				"transition": "transitionend",
				"OTransition": "oTransitionEnd",
				"MozTransition": "transitionend",
				"WebkitTransition": "webkitTransitionEnd"
			},
			oEnd = {
				transitionend: false,
				animationend: false
			};

		for (t in transitions) {
			if (el.style[t] !== undefined) {
				oEnd.transitionend = transitions[t];
			}
		}
		for (t in animations) {
			if (el.style[t] !== undefined) {
				oEnd.animationend = animations[t];
			}
		}
		return oEnd;
	};
}));