//欢迎页加载模块
var aPage = Fzm.$('.page');

var Tab = Base.extend({
	parameter: function() {
		var oTab,
			oUl,
			oLi;
		this.set('tab', Fzm.$(this.get('elem')));
		oTab = this.get('tab');
		this.set('ul', Fzm.find(oTab, '.m-tab-list'));
		oUl = this.get('ul');
		this.set('li', oUl.children);
		oLi = this.get('li');
		this.set('mask', Fzm.find(oTab, 'a'));
		this.set('h', Fzm.find(oTab, 'p'));
		//参数
		this.set('iAloneWidth', lib.flexible.rem2px(10)); //页面总宽度
		this.set('iRollTotalWidth', 0); //滚动总宽度
		this.set('iImgCount', oLi.length); //图片个数
		this.set('iTimer', 0); //计时器
		this.set('iCurrIdx', 0); //当前图片索引
		this.set('index', 1); //从第几个开始
		this.set('isAnime', false); //动画执行完毕
		//事件参数
		this.set('iStartPageX', 0); //手指按下坐标值
		this.set('iCurrPageX', 0); //滑动到当前坐标值
		this.set('sState', 'prev'); //默认滚动顺序
		this.set('isTouch', false); //是否触屏滑动*/
		//初始化
		oUl.insertBefore(oLi[this.get('iImgCount') - 1].cloneNode(true), oLi[0]);
		oUl.appendChild(oLi[1].cloneNode(true));
		var width = (0 - this.get('iAloneWidth')) + 'px';
		Fzm.css(oUl, 'left', width);
	},
	bind: function() {
		var self = this;
		var oUl = this.get('ul');
		Fzm.bind(oUl, 'transitionend', function() {
			self._onAnimeEnd.call(self);
		});
		Fzm.bind(oUl, 'touchstart', function(e) {
			if (!self.get('isAnime')) {
				this.style.transition = 'none';
				var e = e.changedTouches[0];
				self.set('iStartPageX', e.pageX);
				self._onAutoEnd();
			}
		});
		Fzm.bind(oUl, 'touchmove', function(e) {
			if (!self.get('isAnime')) {
				var e = e.changedTouches[0];
				self.set('iCurrPageX', e.pageX - self.get('iStartPageX'));
				this.style.transform = 'translateX(' + (self.get('iRollTotalWidth') + self.get('iCurrPageX')) + 'px)';
			}
		});
		Fzm.bind(oUl, 'touchend', function(e) {
			if (!self.get('isAnime')) {
				self.set('isTouch', true);
				self.set('sState', self._getDirection());

				if (self.get('sState') === 'none') {
					this.style.transition = '0.5s';
					this.style.transform = 'translateX(' + self.get('iRollTotalWidth') + 'px)';
					return;
				}
				switch (self.get('sState')) {
					case 'prev':
						self._onRoll();
						break;
					case 'next':
						self._onRoll('next');
						break;
				}
			}
		});
	},
	render: function() {
		this._setMask();
		this._onAutoStart();
	},
	_onAutoStart: function() {
		//开始自滚动
		var self = this;
		this.set('iTimer', setInterval(function() {
			self._onRoll();
		}, 2000));

	},
	_onAutoEnd: function() {
		//停止自滚动
		clearInterval(this.get('iTimer'));
	},
	_setMask: function() {
		//设置当前第几张
		var aMask = this.get('mask');
		var iCurrIdx = this.get('iCurrIdx');
		for (var i = 0; i < aMask.length; i++) {
			Fzm.removeClass(aMask[i], 'active');
		}
		Fzm.addClass(aMask[iCurrIdx], 'active');
		this.get('h').innerHTML = aMask[iCurrIdx].getAttribute('data-title');
	},
	_onAnimeEnd: function() {
		//动画执行完毕
		var self = this;
		var iImgCount = self.get('iImgCount');
		var iAloneWidth = self.get('iAloneWidth');
		var oUl = self.get('ul');
		switch (self.get('sState')) {
			case 'prev':
				self.set('iCurrIdx', (iImgCount + self.get('iCurrIdx') - self.get('index')) % iImgCount);
				if (self.get('iCurrIdx') === (iImgCount - 1)) {
					Fzm.css(oUl, {
						'transition': 'none',
						'transform': 'none',
						'left': (0 - iAloneWidth * iImgCount) + 'px'
					});
					self.set('iRollTotalWidth', 0);
				}
				self.set('isAnime', false);
				this._setMask();
				break;
			case 'next':
				var iCurrIdx = self.get('iCurrIdx');
				iCurrIdx++;
				self.set('iCurrIdx', iCurrIdx);
				if (iCurrIdx === iImgCount) {
					Fzm.css(oUl, {
						transition: 'none',
						transform: 'none',
						left: (0 - iAloneWidth) + 'px'
					});
					self.set('iRollTotalWidth', 0);
					self.set('iCurrIdx', 0);
				}
				self.set('isAnime', false);
				this._setMask();
				break;
			default:
				self.set('isAnime', false);
				break;
		}
		if (self.get('isTouch')) {
			self.set('sState', 'prev');
			self.set('isTouch', false);
			this._onAutoEnd();
			this._onAutoStart();
		}
	},
	_onRoll: function(type) {
		var self = this;
		if (!self.get('isAnime')) {
			var width = (self.get('iAloneWidth') * self.get('index'));
			var iRollTotalWidth = self.get('iRollTotalWidth');
			self.set('isAnime', true);
			type = type || 'prev';
			type === 'prev' ? (width = (iRollTotalWidth += width)) : (width = (iRollTotalWidth -= width));
			self.set('iRollTotalWidth', width);
			Fzm.css(self.get('ul'), {
				'webkit-transition': '0.5s',
				'transition': '0.5s',
				'webkit-transform': 'translateX( ' + self.get('iRollTotalWidth') + 'px)',
				'transform': 'translateX( ' + self.get('iRollTotalWidth') + 'px)'
			});
		}
	},
	_getDirection: function() {
		//获取滚动方向
		var iCentre = this.get('iAloneWidth') / 2;
		if (Math.abs(this.get('iCurrPageX')) < iCentre) {
			return 'none';
		}
		if (this.get('iCurrPageX') < 0) {
			return 'next';
		}
		return 'prev';
	}
});

//评分模块
var Grade = Base.extend({
	parameter: function() {
		var oGrade = Fzm.$(this.get('elem')),
			aLi = Fzm.find(oGrade, 'li');
		this.set('grade', oGrade);
		this.set('li', aLi);
		this.set('avalued', ['好失望', '比想象的差', '很一般', '还不错', '棒极了']);

	},
	render: function() {
		this._onStar();
	},
	_setStar: function(li) {
		var aStar = Fzm.find(li, 'a');
		var oInput = Fzm.find(li, 'input');
		var avalued = this.get('avalued');
		for (var i = 0, l = aStar.length; i < l; i++) {
			aStar[i].index = i;
			Fzm.bind(aStar[i], 'touchstart', function() {
				for (var i = 0, l = aStar.length; i < l; i++) {
					if (aStar[i].index <= this.index) {
						Fzm.addClass(aStar[i], 'active');
					} else {
						Fzm.removeClass(aStar[i], 'active');
					}
				}
				oInput.value = avalued[this.index];
			});
		}
	},
	_onStar: function() {
		var aLi = this.get('li');
		for (var i = 0, l = aLi.length; i < l; i++) {
			this._setStar(aLi[i]);
		}
	}
});

var Valid = Base.extend({
	parameter: function() {
		var oPage = this.get('pageout');
		var oBtn = Fzm.find(oPage, '.btn');
		var oInfo = Fzm.find(oPage, '.info');
		var oGrade = Fzm.$(this.get('grade'));
		var oTags = Fzm.$(this.get('tags'));
		this.set('btn', oBtn);
		this.set('info', oInfo);
		this.set('grade', oGrade);
		this.set('tags', oTags);
	},
	bind: function() {
		var self = this;
		var oBtn = this.get('btn');
		var oInfo = this.get('info');
		//首页绑定
		Fzm.bind(oBtn, 'touchend', function() {
			if (!self._isChecked()) {
				Fzm.alert(oInfo, '请给景区评分');
				return;
			}
			if (!self._isTagsChecked()) {
				Fzm.alert(oInfo, '请给景区添加标签');
				return;
			}
			self._onSkip();
		});

	},
	render: function() {}
		/*_setInfo: function(oInfo, sInfo) {
			oInfo.innerHTML = sInfo;
			Fzm.css(oInfo, {
				'webkit-transform': 'scale(1)',
				'transform': 'scale(1)',
				'opacity': 1
			});
			setTimeout(function() {
				Fzm.css(oInfo, {
					'webkit-transform': 'scale(0)',
					'transform': 'scale(0)',
					'opacity': 0
				});
			}, 1000);
		}*/
		,
	_isChecked: function() {
		//是否全部评分
		var oGrade = this.get('grade');
		var aInput = Fzm.find(oGrade, 'input');
		for (var i = 0; i < aInput.length; i++) {
			if (aInput[i].value == 0) {
				return false;
			}
		}
		return true;
	},
	_isTagsChecked: function() {
		//是否添加标签
		var oTags = this.get('tags');
		var aInput = Fzm.find(oTags, 'input');
		for (var i = 0; i < aInput.length; i++) {
			if (aInput[i].checked) {
				return true;
			}
		}
		return false;
	},
	_onSkip: function() {
		var oSkip = this.get('skip');
		var oPageOut = this.get('pageout');
		var oPageIn = this.get('pagein');
		Fzm.addClass(oSkip, "db");
		Fzm.addClass(oPageIn, "db");
		setTimeout(function() {
			oSkip.style.opacity = 1;
			oPageOut.style.WebkitFilter = oPageOut.style.filter = "blur(5px)";
		}, 14);
		setTimeout(function() {
			oPageIn.style.transition = "0.5s";
			oSkip.style.opacity = 0;
			oPageOut.style.WebkitFilter = oPageOut.style.filter = "blur(0px)";
			oPageIn.style.opacity = 1;
			Fzm.removeClass(oSkip, "db");
			//Fzm.removeClass(oPageOut,'db');
		}, 3000);

	}
});

var Form = Base.extend({
	parameter: function() {

	},
	bind: function() {
		var self = this;
		var oNews = this.get('news');
		var oInfo = Fzm.find(oNews, '.info');
		var aInput = Fzm.find(oNews, 'input');
		//新闻页绑定
		Fzm.bind(aInput[0], 'change', function() {
			if (this.files[0].type.split('/')[0] == 'video') {
				this.value = '';
				self._onOut();
				return;
			}
			Fzm.alert(oInfo, '请上传视频');

		});
		Fzm.bind(aInput[1], 'change', function() {
			if (this.files[0].type.split('/')[0] == 'image') {
				this.value = '';
				self._onOut();
				return;
			}
			Fzm.alert(oInfo, '请上传视频');
		});
	},
	render: function() {},
	_onOut: function() {
		var oNews = this.get('news');
		var oForm = this.get('form');
		Fzm.addClass(oForm, 'db');
		oForm.setAttribute('style', '');
		Fzm.removeClass(oNews, 'db');
		this._onIn();
	},
	_onIn: function() {
		var self = this;
		var oForm = this.get('form');
		var oResult = this.get('result');
		var aLable = Fzm.find(oForm, 'label');
		var oBtn = Fzm.find(oForm, '.btn');
		var isOff = false;

		for (var i = 0; i < aLable.length; i++) {
			aLable[i]
			Fzm.bind(aLable[i], 'touchend', function() {
				isOff = true;
				Fzm.addClass(oBtn, 'submit');
			});
		}
		Fzm.bind(oBtn, 'touchend', function() {
			if (isOff) {
				for (var i = 0; i < aLable.length; i++) {
					Fzm.find(aLable[i], 'input').checked = false;
				}
				isOff = false;
				Fzm.addClass(oResult, 'db');
				Fzm.removeClass(oForm, 'db');
				Fzm.removeClass(oBtn, 'submit');
				self._onResult();
			}
		});
	}, 
	_onResult: function() {
		var self = this;
		var oResult = this.get('result');
		var oHome = this.get('home');
		var oSkip = this.get('skip');
		var oNews = this.get('news');
		var oBtn = Fzm.find(oResult, '.btn');

		this._evEnd.call(oSkip);
		this._evEnd.call(oNews);
		oHome.setAttribute('style', '');
		Fzm.css(oHome, {
			opacity: 0
		});

		Fzm.bind(oBtn, 'touchend', function() {
			Fzm.css(oResult, {
				opacity: 0
			});
			
			Fzm.css(oHome, {
				opacity: 1
			});
		});
		Fzm.bind(oResult, 'webkitTransitionEnd', function() {
			self._evEnd.call(this);

		});
		Fzm.bind(oResult, 'transitionend', function() {
			self._evEnd.call(this);
		});
	},
	_evEnd: function(home) {
		Fzm.removeClass(this, 'db');
		this.setAttribute('style', '');
	},
});

function init() {
	new Tab({
		elem: '#js-tab'
	});
	new Grade({
		elem: '#js-grade'
	});
	new Valid({
		pageout: aPage[5], //跳出页-首页
		skip: aPage[4], //跳转页
		pagein: aPage[3], //跳进页-新闻页
		grade: '#js-grade', //星评
		tags: '#js-tags' //标签
	});
	new Form({
		news: aPage[3], //新闻页
		form: aPage[2], //表单页
		result: aPage[1], //结果页
		home: aPage[5], //首页
		skip: aPage[4] //跳转页
	});
}