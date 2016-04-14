var Exposure = {
	init: function($target, handler) {
		this.$c = $(window);
		this.$target = $target;
		this.handler = handler;
		this.bind();
		this.checkShow();
	},
	bind: function() {
		var self = this,
			timer = null,
			interval = 100;
		this.$c.on('scroll', function(e) {
			timer && clearTimeout(timer);
			timer = setTimeout(function() {
				//检测load元素是否曝光
				self.checkShow();
			}, interval);
		});
	},
	checkShow: function() {
		var $target = this.$target;
		//判断laod元素是否曝光,如果曝光则执行handler
		/*if (this.isShow($target)) {
			this.handler && this.handler();
		}*/
		var self = this;
		this.$target.each(function() {

			var $cur = $(this);
			if (self.isShow($cur)) {
				self.handler && self.handler.call(this, this);

			}
		});

	},
	isShow: function($el) {
		var scrollH = this.$c.scrollTop(),
			winH = this.$c.height(),
			top = $el.offset().top;
		if (top < winH + scrollH) {
			return true;
		}
		return false;
	}
};

var WaterFall = {
	arrColHeight: [],
	istrue: false,
	init: function($ct) {
		this.$ct = $ct;
		this.bind();
	},
	bind: function() {
		var self = this;
		$(window).on('resize', function() {
			self.istrue = false;
			self.start();
		});
	},
	start: function($nodes) {
		var self = this;
		//获取item
		if (!self.istrue) {
			self.istrue = true;
			var $items = this.$items = this.$ct.find('.item');
			if ($items.length === 0) return;
			//单个item的宽度
			var itemW = this.itemWidth = $items.outerWidth(true);
			//先设置box宽度为自适应
			this.$ct.width('auto');
			//用当前宽度计算出当前列数			//获取当前的宽度
			var colNum = this.colNum = Math.floor(this.$ct.width() / itemW);
			//设置box宽度 可以保持居中
			this.$ct.width(itemW * colNum);
			//初始化列数组
			this.arrColHeight = [];
			for (var i = 0; i < colNum; i++) {
				this.arrColHeight[i] = 0;
			}

		}

		//数据存在
		if ($nodes) {
			$nodes.each(function() {
				var $item = $(this);
				$item.find('img').on('load', function() {
					//图片加载完成后开始摆放
					self.placeItem($item);
					self.$ct.height(Math.max.apply(null, self.arrColHeight));
				});
			});
		} else {
			$items.each(function() {
				self.placeItem($(this));
			});
			self.$ct.height(Math.max.apply(null, self.arrColHeight));
		}
	},
	placeItem: function($el) {
		//将item设置到最小高度下
		var obj = this.getIndexOfMin();
		idx = obj.idx,
			min = obj.min;
		$el.css({
			left: idx * this.itemWidth,
			top: min
		});
		this.arrColHeight[idx] += $el.outerHeight(true);
	},
	getIndexOfMin: function() {
		//获取列中最小高度
		var arr = this.arrColHeight;
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
};