//类工具
(function() {
	var initializing = false;
	Class = function() {};
	Class.extend = function(prop) {
		// 如果调用当前函数的对象（这里是函数）不是Class，则是父类
		var baseClass = null;
		if (this !== Class) {
			baseClass = this;
		}

		function F() {
			if (!initializing) {
				if (baseClass) {
					this._superprototype = baseClass.prototype;
				}
				this.init.apply(this, arguments);
			}
		}
		if (baseClass) {
			initializing = true;
			F.prototype = new baseClass();
			F.prototype.constructor = F;
			initializing = false;
		}
		F.extend = arguments.callee;
		for (var name in prop) {
			if (prop.hasOwnProperty(name)) {
				if (baseClass &&
					typeof(prop[name]) === "function" &&
					typeof(F.prototype[name]) === "function" &&
					/\b_super\b/.test(prop[name])) {
					F.prototype[name] = (function(name, fn) {
						return function() {
							this._super = baseClass.prototype[name];
							return fn.apply(this, arguments);
						};
					})(name, prop[name]);
				} else {
					F.prototype[name] = prop[name];
				}
			}
		}
		return F;
	};
})();
//观察者模式
var Event = Class.extend({
	//添加监听
	on: function(key, listener) {
		//this.__events存储所有的处理函数
		if (!this.__events) {
			this.__events = {};
		}
		if (!this.__events[key]) {
			this.__events[key] = [];
		}
		if (_indexOf(this.__events, listener) === -1 && typeof listener === 'function') {
			this.__events[key].push(listener);
		}
		return this;
	},
	//取消监听
	off: function(key, listener) {
		if (!key && !listener) {
			this.__events = {};
		}
		//不传监听函数，就去掉当前key下面的所有的监听函数
		if (key && !listener) {
			delete this.__events[key];
		}
		if (key && listener) {
			var listeners = this.__events[key];
			var index = _indexOf(listeners, listener);
			index > -1 && listeners.splice(index, 1);
		}
		return this;
	},
	//触发一个事件,也就是通知
	fire: function(key) {
		if (!this.__events || !this.__events[key]) return;
		var args = Array.prototype.slice.call(arguments, 1) || [];
		var listeners = this.__events[key];
		var i = 0,
			l = listeners.length;
		for (; i < l; i++) {
			listeners[i].apply(this, args);
		}
		return this;
	}
});
//基类
var Base = Event.extend({
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
//封装工具类
var Tools = Class.extend({
	init: function() {},
	$: function() {
		var elements = [];
		for (var i = 0; i < arguments.length; i++) {
			var element = arguments[i];
			if (typeof element === 'string') {
				element = document.querySelectorAll(element);
				element.length === 1 && (element = element[0]);
			}
			if (arguments.length === 1) {
				return element;
			}
			elements.push(element);
		}
		return elements;
	},
	find: function(obj, sel) {
		var elem = obj.querySelectorAll(sel);
		elem.length === 1 && (elem = elem[0]);
		return elem;
	},
	bind: function(obj, ev, fn) {
		if (obj.addEventListener) {
			obj.addEventListener(ev, fn, false);
		} else {
			obj.attachEvent('on' + ev, function() {
				fn.call(obj);
			});
		}
	},
	view: function() {
		return {
			w: document.documentElement.clientWidth,
			h: document.documentElement.clientHeight
		};
	},
	addClass: function(obj, sClass) {
		var aClass = obj.className.split(' ');
		if (!obj.className) {
			obj.className = sClass;
			return;
		}
		for (var i = 0; i < aClass.length; i++) {
			if (aClass[i] === sClass) return;
		}
		obj.className += ' ' + sClass;
	},
	removeClass: function(obj, sClass) {
		var aClass = obj.className.split(' ');
		if (!obj.className) return;
		for (var i = 0; i < aClass.length; i++) {
			if (aClass[i] === sClass) {
				aClass.splice(i, 1);
				obj.className = aClass.join(' ');
				break;
			}
		}
	},
	time: function() {
		return new Date().getTime();
	},

	css: function(obj, name, value) {
		var convert = function(str) {
			var arry = str.split('-');
			if (!arry.length) return str;
			for (var i = 1; i < arry.length; i++) {
				arry[i] = arry[i].charAt(0).toUpperCase() + arry[i].slice(1);
			}
			return arry.join('');
		};

		if (typeof name === 'string') {
			obj.style[convert(name)] = value;
		}
		if (typeof name === 'object') {
			for (var n in name) {
				obj.style[convert(n)] = name[n];
			}
		}
	},
	indexOf: function(arry, key) {
		if (arry === null) return -1;
		var i = 0,
			len = arry.length;
		for (; i < len; i++) {
			if (arry[i] === key) return i;
		}
		return -1;
	},
	alert: function(obj, info) {
		obj.innerHTML = info;
		Fzm.css(obj, {
			'webkit-transform': 'scale(1)',
			'transform': 'scale(1)',
			'opacity': 1
		});
		setTimeout(function() {
			Fzm.css(obj, {
				'webkit-transform': 'scale(0)',
				'transform': 'scale(0)',
				'opacity': 0
			});
		}, 1000);
	}
});
var Fzm = new Tools();