/*!
 * 选项卡插件
 * @author 冯泽民
 * @version 1.1.1 
 * @require 
 * 2016-2-21
 */

/*
 *defaults ={
 *	seBtn:翻页按钮
 *  seItem：'tab的内容'
 *  seTitle:'tab的title'
 * }
 */
;
(function(factory) {
	if (typeof define === 'function') {
		define('jquery-tab', function(require, exports, moudles) {
			factory(require('jquery'), undefined);
		});
	} else {
		factory(jQuery);
	}
}(function($, udf) {
	'use strict';
	var datakey = 'jquery-tab',
		// 默认参数
		defaults = {
			seBtn: '.jc-tab-btn',
			seItem: '.jc-tab-item',
			seTitle: '.jc-tab-title'
		};
	$.fn.tab = function(settings) {
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
	$.fn.tab.defaults = defaults;

	function Constructor(element, options) {
		var the = this;
		the.$element = $(element);
		the.options = options;
		the.dom = {};
		the.cache = {
			idx: 0,
			isClick: true,
			currArray: udf,
			currList: udf,
			currTitle: udf,
			currItem: udf,
			ianim: 2,
			animaend: false,
			flip: 'next'
		};
	}
	Constructor.prototype = {
		_init: function() {
			var that = this,
				$e = that.$element,
				ope = that.options,
				ce = that.cache,
				$title,
				$Item = that.dom.item = $e.find(ope.seItem),
				$list = that.dom.list = [];
			ce.animaend = $.support ? $.support.getEnd().animationend : $.error('没有加载support插件!');
			$Item.each(function() {
				$list.push($(this).find('.jc-tab-list'));
			});
			ce.currItem = $Item.first(), ce.currArray = $list[0], ce.currList = ce.currArray.first();
			//事件
			that._bindAnimaEnd(ce,$Item);
			if (ope.seTitle.length > 0) {
				that._createTitle($e, that.dom, ce, ope);
			}
			if (ope.seBtn.length > 0) {
				that._createBtns();
			}
			return this;
		},
		_bindAnimaEnd: function(ce,elem) {
			if (ce.animaend) {
				elem.on(ce.animaend, '.jc-tab-list', function() {
					var $t = $(this);
					if ($t.hasClass('current')) {
						++ce.ianim;
						$t.removeClass(ce.flip + '-out' + ' current');
					} else {
						++ce.ianim;
						$t.removeClass(ce.flip + '-in').addClass('current');
					}
					if (ce.ianim === 2) {
						ce.isClick = true;
					}
					return false;
				});
			}
		},
		_createTitle: function(e, dom, ce, ope) {
			var $title = dom.title = e.find(ope.seTitle + ' li');
			ce.currTitle = $title.first();
			$title.on('click.title', function(e) {
				var $t = $(this),
					idx;
				if ($t.hasClass('curr') || !ce.isClick) {
					return false;
				}
				ce.currTitle.removeClass('curr');
				ce.currTitle = $t.addClass('curr');
				if ($t.hasClass(ope.seBtn.substring(1))) {
					$(this).data('curr', 0);
					return false;
				}
				ce.currItem.hide();
				idx = $t.index();
				ce.currItem = dom.item.eq(idx).show();
				ce.currArray = dom.list[idx];
				ce.currList = ce.currItem.find('.current');
				ce.isClick = true;
				ce.idx = ce.currList.index();
				return false;
			});
		},

		_createBtns: function() {
			var that = this,
				ce = this.cache,
				type = ['next', 'prev'],
				len = ce.currArray.length,
				$btns = this.dom.btns = this.$element.find(this.options.seBtn);
			$btns.on('click.btns', function() {
				var $t;
				if (!ce.isClick) {
					return false;
				}
				$t = $(this);
				if ($t.hasClass('curr')) {
					if ($t.data('curr')) {
						return false;
					}
					$t.data('curr', 1);
				}
				ce.flip = type[0], ce.isClick = false;
				if ($t.hasClass('jc-tab-next')) {
					ce.idx = ce.idx < len - 1 ? ce.idx + 1 : 0;
				} else {
					ce.idx = ce.idx > 0 ? ce.idx - 1 : len - 1;
					ce.flip = type[1];
				}
				that._animation();
				return false;
			});
		},
		_animation: function() {
			var ce = this.cache,
				$list = ce.currArray,
				animaend = ce.animaend,
				p0, p1;
			ce.ianim = 0;
			if (animaend) {
				p0 = ce.flip + '-in', p1 = ce.flip + '-out';
				ce.currList.removeClass(p0).addClass(p1);
				ce.currList = $list.eq(ce.idx).removeClass(p1).addClass(p0);
				return;
			}
			ce.currList.removeClass('current').hide();
			ce.currList = $list.eq(ce.idx).addClass('current').show();
			ce.isClick = true;
		}
	};
}));