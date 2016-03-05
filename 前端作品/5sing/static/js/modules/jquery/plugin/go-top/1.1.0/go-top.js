/*!
 * 侧栏工具插件
 * @author 冯泽民
 * @version 1.1.0 
 * @require 
 * 2016-2-22
 * ============================
 *defaults ={
 *	mode: move=使用动画跳转;go=直接跳转
 *  speed：跳转速度
 *  dest:返回的位置0=top
 *  pos:参照点的高度
 * }
 * ==============================
 */
(function(factory) {
	if (typeof define === 'function') {
		define('jquery-gotop', function(require, exports, moudles) {
			factory(require('jquery'));
		});
	} else {
		factory(jQuery);
	}
}(function($) {
	'use strict';
	var datakey = 'jquery-gotop';
	var defaults = {
		mode: 'move',
		speed: 600,
		dest: 0,
		pos: 250
	};
	$.gotop = function(settings) {
		var run = $.type(settings) === 'string',
			instance = this.gotop.instance;
		if (!instance) instance = this.gotop.instance = new Constructor($.extend({}, defaults, settings))._init();
		if (run && run[0] !== '_') {
			return Constructor.prototype[settings] ? Constructor.prototype[settings].apply(instance, [].slice.call(arguments, 1)) : undefined;
		}
	};
	$.gotop.defaults = defaults;

	function Constructor(options) {
		this.options = options;
	}
	Constructor.prototype = {
		_init: function() {
			var that = this,
				dom = that.dom = {};
			dom.body = $('html,body'), dom.win = $(window);
			that._createHtml();
			that._checkPos();
			that._checkResize();
			dom.win.on('scroll', function() {
				that._checkPos();
			});
			dom.win.on('resize', function() {
				that._checkResize();
			});
		},
		_createHtml: function() {
			var that = this,
				dom = that.dom,
				ope = that.options;
			var html ='<li><a class="dib tc gf" style="line-height:59px;"  href="http://fengzeming.github.io/">博客</a></li>'+ 
				'<li class="m-flmenu-code">'+
				'<a class="bgi-flmenu btn i-fmcode" href="javascript:;">5sing二维码</a>' +
				'<span class=" abs dn">' +
				' <em class="db"> <i class="bgi-flmenu lh20 btn i-down">二维码</i> </em>' +
				'<img class="f0 mb-1" src="../static/img/qrcode.png" alt="二维码"  width="144" height="144"/>' +
				'</span>' +
				'</li>' +
				'<li><a class="bgi-flmenu btn i-fmback" href="javascript:;">用户反馈</a></li>' +
				'<li class="jc-gotop"><a class="bgi-flmenu btn i-fmtop" href="javascript:;">返回顶部</a></li>';
			var oUl = dom.oUl = $('<ul class="m-flmenu"></ul>').html(html);
			dom.oLi = oUl.find('.jc-gotop').on('click', function() {
				ope.mode === 'move' ? that._move() : that._go();
				return false;

			});
			dom.body.eq(1).append(oUl);
		},
		_move: function() {
			var dom = this.dom,
				ope = this.options;
			if (dom.win.scrollTop() !== ope.dest && !dom.body.is(':animated')) {
				dom.body.animate({
					scrollTop: ope.dest
				}, ope.speed);
			}
		},
		_go: function() {
			var dom = this.dom,
				dest = this.options.dest;
			if (dom.win.scrollTop() !== dest) {
				dom.body.scrollTop(dest);
			}
		},
		_checkPos: function() {
			var dom = this.dom,
				oLi = dom.oLi;
			dom.win.scrollTop() > this.options.pos ? oLi.fadeIn() : oLi.fadeOut();
		},
		_checkResize: function() {
			var dom = this.dom,
				oUl = dom.oUl;
			dom.win.outerWidth() > 1060 ? oUl.show() : oUl.hide();
		}
	};
}));