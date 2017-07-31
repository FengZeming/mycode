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