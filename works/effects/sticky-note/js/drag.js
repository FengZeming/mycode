/**
 * 拖拽
 * 
 *  参数:
 * 	elem:
 * 	    sel:   执行拖拽的元素选择器名
 * 	  width:   元素宽度
 *   height:   元素高度
 *   iselem:   false拖动head true拖动自身
 *  root:
 *       id:   根元素id
 * 
 * range:      可拖动的范围  0:值, 是否限制
 * 		 top:
 * 	   right:
 * 	    left:
 *    bottom:
 * callDel:    删除回调
 */

var drag = (function(undefined) {
	var defaultConfig = {
		elem: {
			sel: '.note',
			width: 160,
			height: 166,
			//x: 0,
			//y: 0,
			iselem: false //是否拖动自己,是则拖动本身,不是则设置$head
		},
		root: {
			id: '#js-content'
				//$root: undefined,
				//width: 0,
				//height: 0,
				//left: 0,
				//top: 0
		},
		range: {
			top: [0, false],
			right: [0, false],
			left: [0, false],
			bottom: [0, true]
				//x: [],
				//y: []
		},
		callDel: function() {},
		state: false
			//lockX: false, //锁定只在X轴移动
			//lockY: false //锁定只在Y轴移动
	};

	function Constructor(config) {
		this.init(config);
		this.setRoot();
		this.bind();
	};
	Constructor.prototype = {
		init: function(config) {
			this.c = $.extend({}, defaultConfig, config);
			this.c.root.$root = $(this.c.root.id).length ? $(this.c.root.id) : $('body');
			this.c.$doct = $(document);
		},
		setRoot: function() {
			var root = this.c.root;
			var $root = root.$root;
			var elem = this.c.elem;
			var oRange = this.c.range;
			//初始化容器信息
			root.left = $root.offset().left;
			root.top = $root.offset().top;
			root.width = $root.outerWidth();
			root.height = $root.outerHeight();
			//计算活动范围
			oRange.x = [-oRange.left[0] + root.left,
				oRange.right[0] + root.left + root.width - elem.width
			];
			oRange.y = [-oRange.top[0] + root.top,
				oRange.bottom[0] + root.top + root.height - elem.height
			];
		},
		bind: function() {
			var self = this;
			var config = this.c;
			var $root = config.root.$root;
			var $doct = config.$doct;
			var iselem = config.elem.iselem;
			var sel = config.elem.sel;
			!iselem && (sel = sel + ' ' + sel + '-head');
			$root.on('click.sticky', sel+' .delete', $.proxy(self.dragFn.del, self));
			$root.on('mousedown.sticky', sel, $.proxy(self.dragFn.strat, self));
			$doct.on('mousemove.sticky', $.proxy(self.dragFn.move, self));
			$doct.on('mouseup.sticky', $.proxy(self.dragFn.end, self));
		},
		dragFn: {
			strat: function(e) {
				var $this = $(e.target);
				if ($this.hasClass('delete')) return false;
				var config = this.c;
				var elem = config.elem;
				elem.$parent = $this.parent(elem.sel);
				var pos = elem.$parent.offset();
				config.state = true;
				elem.x = e.pageX - pos.left;
				elem.y = e.pageY - pos.top;
				elem.$parent.addClass('draggable');
				return false;
			},
			move: function(e) {
				if (!this.c.state) return false;
				var elem = this.c.elem;
				var oRange = this.c.range;
				var left = e.pageX - elem.x;
				var top = e.pageY - elem.y;
				if (!oRange.left[1] && left < oRange.x[0]) {
					left = oRange.x[0];
				}
				if (!oRange.right[1] && left > oRange.x[1]) {
					left = oRange.x[1];
				}
				if (!oRange.top[1] && top < oRange.y[0]) {
					top = oRange.y[0];
				}
				if (!oRange.bottom[1] && top > oRange.y[1]) {
					top = oRange.y[1];
				}
				elem.$parent.offset({
					left: left,
					top: top
				});
				return false;
			},
			end: function(e) {
				if ($(e.target).hasClass('delete')) return false;
				var config = this.c;
				config.state = false;
				config.elem.$parent && config.elem.$parent.removeClass('draggable');
				return false;
			},
			del: function(e) {
				var $parent = $(e.target).closest(this.c.elem.sel);
				$parent.remove();
				this.c.callDel.call(this, $parent.attr('id'));
				return false;
			}
		}
	};
	return {
		init: function(config) {
			return new Constructor(config);
		}
	};
})();