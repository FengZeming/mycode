/*!
 * 图片轮换插件
 * @author 冯泽民
 * @version 1.1.0 
 * @require 
 * 2016-2-14
 * ============================
 *defaults ={
 *	alist:插入的图片 {href:图片链接的地址,url:图片地址  }
 *  iwd：图片宽度
 *  speed:自动滚动速度
 *  canBtn:是否显示上下按钮默认true
 *  canDot：是否显示圆点按钮默认true
 * }
 * ==============================
 */
(function(factory) {
	if (typeof define === 'function') {
		define('jquery-sider', function(require, exports, moudles) {
			factory(require('jquery'));
		});
	} else {
		factory(jQuery);
	}
}(function($) {
	'use strict';
	var datakey = 'jquery-sider',
		// 默认参数
		defaults = {
			aList: [],
			iWd: 650,
			iSpeed: 5000,
			canBtn: true,
			canDot: true
		};
	$.fn.sider = function(settings) {
		var instance,
			options = $.extend({}, defaults, settings);
		return this.each(function() {
			var element = this,
				instance = $(element).data(datakey);
			if (!instance) {
				$(element).data(datakey, instance = new Constructor(element, options)._init());
			}
		});
	};
	$.fn.sider.defaults = defaults;

	function Constructor(element, options) {
		var the = this;
		the.$element = $(element);
		the.options = options;
	}
	Constructor.prototype = {
		_init: function() {
			var that = this,
				$e = that.$element,
				$pic = this.pic = $('<ul class="m-slider-list left"></ul>'),
				cache = this.cache = {
					num: 0,
					timer: undefined,
					curr: undefined
				},
				opt = that.options;
			var len = cache.len = opt.list.length,
				wd = opt.wd,
				twd = wd * len,
				sPic = [];
			for (var i = 0; i < len; i++) {
				sPic.push('<li index="' + i + '"><a href="' + opt.list[i].href + '" ><img src="' + opt.list[i].url + '"/></a></li>');
			}
			sPic = sPic.join(''), sPic += sPic;
			$pic.css('width', twd * 2 + 'px').html(sPic);
			$e.append($pic);
			if (len > 1) {
				if (opt.canBtn) {
					that._createBtn();
				}
				if (opt.canDot) {
					that._createDot();
				}
				that._setTimer();
			}
			return this;
		},
		_createBtn: function() {
			var that = this,
				$prev = $('<a class="m-slider-prev-btn i-prev-prt dn" href="javascript:;"><i class="btn wh16 bgi-nav i-prev">上一张</i></a>'),
				$next = $('<a class="m-slider-next-btn i-next-prt dn" href="javascript:;"><i class="btn wh16 bgi-nav i-next">下一张</i></a>');
			$prev.on('click', function(e) {
				that._motion('left');
				return false;
			});
			$next.on('click', function(e) {
				that._motion();
				return false;
			});
			that.$element.hover(function() {
				$prev.show();
				$next.show();
				that._clearTimer();
			}, function() {
				$prev.hide();
				$next.hide();
				that._setTimer();
			}).append($prev).append($next);

		},
		_createDot: function() {
			var that = this,
				c = that.cache,
				$dot = $('<ul class="m-slider-dot opy"></ul>'),
				sdot = [];
			for (var i = 0; i < c.len; i++) {
				sdot.push('<li ' + (i === 0 ? 'class="curr"' : '') + ' index="' + i + '"></li>');
			}
			$dot.html(sdot.join(''));
			that.$dotList = $dot.find('li'), c.curr = that.$dotList.eq(0);
			$dot.on('mouseover', function(e) {
				var oTag = e.target;
				if (oTag.tagName.toLocaleLowerCase() === 'li') {
					c.num = oTag.getAttribute('index') - 1;
					that._motion();
				}
			});
			that.$element.append($dot);
		},
		_setDotList: function() {
			var c = this.cache;
			c.curr.removeClass('curr');
			c.curr = this.$dotList.eq(c.num % c.len).addClass('curr');
		},
		_setLeft: function() {
			this.pic.css('left', -this.cache.num * this.options.wd + 'px');
		},
		_motion: function(dir) {
			var c = this.cache,
				num = c.num;
			switch (dir) {
				case 'left':
					if (num === 0) {
						c.num = c.len;
						this._setLeft();
					}
					num = --c.num;
					break;
				default:
					if (num === (c.len * 2 - 1)) {
						c.num = c.len - 1;
						this._setLeft();
					}
					num = ++c.num;
					break;
			}
			this._setDotList();
			this.pic.stop().animate({
				left: -num * this.options.wd + 'px'
			}, 500);
		},
		_setTimer: function() {
			var that = this;
			that.cache.timer = setInterval(function() {
				that._motion();
			}, that.options.iSpeed);
		},
		_clearTimer: function() {
			clearInterval(this.cache.timer);
		}
	};
}));