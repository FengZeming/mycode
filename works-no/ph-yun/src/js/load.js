var Load = Base.extend({
	parameter: function() {
		this.set('elem', Fzm.$(this.get('elem')));
		this.stime = Fzm.time();
		this.timer = 0;
		this.istime = false;
		this.isImg = true; //完成图片加载功能请设置成false
	},
	_evEnd: function() {
		Fzm.removeClass(this, 'db')
	},
	render: function() {
		//判断加载是否完成
		var self = this;
		var elem = this.get('elem');
		self.timer = setInterval(function() {
			if (Fzm.time() - self.stime >= 5000) {
				self.istime = true;
			}
			//模拟图片加载完成,图片加载功能未实现!
			if (self.isImg && self.istime) {
				//lib-flexible 引起回流 将transitionend设置在这里避免回流导致提早结束动画
				Fzm.bind(elem, 'transitionend', self._evEnd);
				Fzm.bind(elem, 'webkitTransitionEnd', self._evEnd);
				clearInterval(self.timer);
				Fzm.css(elem, {
					opacity: 0
				});
				init();
			}
		}, 1000);
	}
});
new Load({
elem: '#js-wel-page'
});