

//基类
var Base = Class.extend({
	init: function(config) {
		//自动保存配置项
		this.__config = config;
		this.parameter();
		this.bind();
		this.render();
	},
	set: function(key, value) {
		this.__config[key] = value;
	},
	get: function(key) {
		return this.__config[key];
	},
	parameter: function() {},
	bind: function() {},
	render: function() {},
	destroy: function() {
		this.off();
	}
});

var WaterFall = Base.extend({
	parameter: function() {
		var $Box = $(this.get('boxEl'));
		var $Ul = $Box.find('.list-box');
		var $Load = $Box.find('.load');
		this.set('win', $(window));
		this.set('doc', $(document));
		this.set('box', $Box);
		this.set('list', $Ul);
		this.set('load', $Load);
		//
		this.set('isLoad', false);
		this.set('timer', null);
		this.set('interval', 300);
		if (!this.get('handler')) {
			this.set('handler', function() {});
		}
		this._params();
	},
	bind: function() {
		var self = this;
		var timer = this.get('timer');
		var interval = this.get('interval');
		var $win = this.get('win');
		$win.on('scroll', function() {
			timer && clearTimeout(timer);
			timer = setTimeout(function() {
				//检测load元素是否曝光
				self._checkShow();
			}, interval);
		});
		//$win.on('resize', function() {
		//	self._params();
		//	self.start();
		//});
		$win.unload(function() {
			$('html,body').scrollTop(0);
		});
	},
	render: function() {
		this._checkShow();
		this.set('isLoad', true);
	},
	_params: function() {
		//单个item的宽度
		var itemW = this.get('itemW');
		//边距
		var distW = this.get('distW');
		var $box = this.get('box');
		var $ul = this.get('list');
		var iboxW = $box.width();
		//先设置box宽度为自适应
		//$box.width('auto');
		//用当前宽度计算出当前列数				//获取当前的宽度
		var colNum = Math.floor((iboxW+distW) / (itemW+distW));
		//设置box宽度 可以保持居中
		//$box.width((itemW + distW) * colNum - distW);
		//初始化列数组
		this.set('arrColHeight', []);
		var arr = this.get('arrColHeight');
		for (var i = 0; i < colNum; i++) {
			arr[i] = 0;
		}
	},
	//判断laod元素是否曝光,如果曝光则执行handler
	_checkShow: function() {
		var oLoad = this.get('load');
		var self = this;
		if (this._isShow()) {
			if (this.get('isLoad')) {
				oLoad.removeClass('hide').addClass('show');
			}
			this.get('handler').call(this);
		}
	},
	_isShow: function() {
		var iScrollH = this.get('doc').scrollTop(); //当前滚动的高度
		var iDocH = this.get('doc').height(); //当前页面的总高度
		var iWinH = this.get('win').height(); //当前页面窗口的高度
		if (iScrollH >= iDocH - iWinH - 300) {
			return true;
		}
		return false;
	},
	start: function($nodes) {
		var self = this;
		var $ul = this.get('list');
		var arr = this.get('arrColHeight');
		//数据存在
		if ($nodes) {
			this.get('load').removeClass('show').addClass('hide');
			$ul.append($nodes);
			$nodes.each(function() {
				var $item = $(this);
				$item.find('img').on('load', function() {
					//图片加载完成后开始摆放
					self._setItemW($item);
					$ul.height(Math.max.apply(null, arr));
				});
			});

		} else {
			$ul.find('.item').each(function() {
				self._setItemW($(this));
			});
			$ul.height(Math.max.apply(null, arr));
		}
	},
	_setItemW: function($el) {
		//将item设置到最小高度下
		var distW = this.get('distW');
		var itemW = this.get('itemW');
		var obj = this._getIndexOfMin();
		var idx = obj.idx,
			min = obj.min;
		$el.css({
			left: idx * itemW + idx * distW,
			top: min
		});
		this.get('arrColHeight')[idx] += $el.outerHeight(true) + distW;
	},
	_getIndexOfMin: function() {
		//获取列中最小高度
		var arr = this.get('arrColHeight');
		var min = arr[0],
			idx = 0;
		for (var i = 0; i < arr.length; i++) {
			if (min > arr[i]) {
				min = arr[i];
				idx = i;
			}
		}
		return {
			min: min,
			idx: idx
		};
	}
});