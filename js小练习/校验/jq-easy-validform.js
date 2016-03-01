/*!
 * ver 1.0
 * 校验组件
 * 
 * defauls对象参数：
 * subBtn: '.js-submit', //提交按钮的选择器名称
 * isSingle:false,//单条验证
 * way： tip ,inline    //验证形式
 * instant:true,是否即使校验
 * rules: {
			password: {
				regname: 'zh5-15', //使用的校验规则
				demsg: '', //默认提示
				regmsg: '', //校验提示
				ignore   使用这个属性 只有在输入的时候才有校验 不输入不校验
			}
	}
 * 
 * 
 * 
 * 
 * 
 * 
 */

;
(function($) {
	var $t, win = $(window),
		m = {
			init: function() {
				$t = this,
					$t.dom = {}, $t.info = {},
					$t.info.nameList = [],
					$t.info.regNameList = [],
					$t.dom.oRuleList = [],
					$t.dom.oHintList = [],
					$t.dom.oSubBtn = $t.self.find($t.settings.subBtn);
				m.regExtends();
				m.initHint();
				//是否即使校验
				if ($t.settings.instant) {
					m.addInstant();
				}

				$t.dom.oSubBtn.on('click', function() {
					$t.self.trigger('submit');
				});

				$t.self.submit(function() {
					console.log(123);
					var isCheck = $t.settings.isSingle ? m.validTools.single() : m.validTools.complete();
					return false;
				});


			},
			//获取表单数据
			initHint: function() {
				console.log($t.info.nameList);
				for (var i = 0, l = $t.info.nameList.length; i < l; i++) {
					var name = $t.info.nameList[i];
					var $input = $t.self.find('[name=' + name + ']');


					$t.dom.oRuleList[name] = $input;
					m.addHint(name);
				}
			},
			getForms: function() {
				var allValues = {};
				for (var i = 0, l = $t.info.nameList.length; i < l; i++) {
					var name = $t.info.nameList[i];
					if (allValues[name] !== undefined) {
						continue;
					}
					var $input = $t.dom.oRuleList[name];
					var value = $input.val();
					var type = $input.attr('type');
					if (type === 'radio') {
						value = $input.filter('input:checked').val();
					} else if (type === 'checkbox') {
						value = $input.filter('input:checked').map(function() {
							return this.value;
						}).get().join(',');
					}
					allValues[name] = value;
				}
				return allValues;
			},
			//获取校验规则
			getRegList: {
				"*": /[\w\W]+/,
				"*6-16": /^[\w\W]{6,16}$/,
				'email': /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
				'zh1-6': /^[\u4E00-\u9FA5\uf900-\ufa2d]{1,6}$/,
				'en': /^[a-zA-Z\_]+$/,
				'eline6-15': /^(?!_)(?!.*?_$)[a-zA-Z][a-zA-Z0-9]{6,15}$/,
				'ip': /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
				'qq': /^[1-9][0-9]{4,}$/,
				'money': /^(0{1}|[1-9]{1}[0-9]*)(\.[0-9]{1,2})?$/,
				'noSpecia6-15': /^[a-zA-Z0-9\u4E00-\u9FA5\uf900-\ufa2d]{6,15}$/
			},
			//确认校验规则
			regConcat: function(datatype) {
				var regex = /^(.+?)(\d+)-(\d+)$/;
				if (!(datatype in m.getRegList)) {
					var aType = datatype.match(regex),
						tType;
					for (var name in m.getRegList) {
						tType = name.match(regex);
						if (!tType) {
							continue;
						}
						if (aType[1] === tType[1]) {
							var str = m.getRegList[name].toString();
							var regxp = new RegExp("\\{" + tType[2] + "," + tType[3] + "\\}", "g");
							str = str.replace(regxp, "{" + aType[2] + "," + aType[3] + "}").replace(/^\//, "").replace(/\/$/, "");
							m.getRegList[datatype] = new RegExp(str);
							break;
						}
					}
				}
			},
			//正则添加
			regExtends: function() {
				for (var rule in $t.settings.rules) {
					var regName = $t.settings.rules[rule].regname;
					$t.info.nameList.push(rule);
					$t.info.regNameList.push(regName);
					m.regConcat(regName);
				}
			},
			//校验工具
			validTools: {
				single: function() {
					var allValues = m.getForms.call();
					var isCheck = true;
					for (var i = 0, l = $t.info.nameList.length; i < l; i++) {
						var sName = $t.info.nameList[i];
						var sRegName = $t.info.regNameList[i];
						if (!m.getRegList[sRegName].test(allValues[sName])) {
							$t.dom.oHintList[sName].show();
							isCheck = false;
							break;
						}
						$t.dom.oHintList[sName].hide();
					}
					return isCheck;
				},
				complete: function() {
					var allValues = m.getForms.call();
					var isCheck = true;
					for (var i = 0, l = $t.info.nameList.length; i < l; i++) {
						var sName = $t.info.nameList[i];
						var sRegName = $t.info.regNameList[i];
						if (!m.getRegList[sRegName].test(allValues[sName])) {
							m.eidtHint(sName, 'error')
							isCheck = false;
						} else {
							m.eidtHint(sName, 'success')
						}
					}
					return isCheck;
				}
			},
			//获取 tipshtml
			getTipsElement: function() {
				return {
					tip: ['<div  class = "tip-box" ></div>', '<div class="tip-content" ></div>', '<i></i>'],
					inline: ['<div   class="easy-validform "></div>', '<i class="easy-validform-icon"></i>', '<span class="easy-validform-hint"></span>']
				}
			},
			//添加提示
			addHint: function(name) {
				var oThis = $t.dom.oRuleList[name];
				var oRule = $t.settings.rules[name];

				var type = oThis.attr('type');
				if (type === 'radio') {
					oThis = oThis.filter('input:last');
				} else if (type === 'checkbox') {
					oThis = oThis.filter('input:last');
				}
				var oGoal = {
					name: name,
					width: oThis.outerWidth(),
					height: oThis.outerHeight(),
					top: oThis.offset().top,
					left: oThis.offset().left,
					demsg: oRule.demsg,
					regmsg: oRule.regmsg
				};
				var aTip = m.getTipsElement()[$t.settings.way];
				switch ($t.settings.way) {
					case 'inline':
						var oLineBox = $(aTip[0]).attr('id', 'line-box-' + oGoal.name);
						var oLinIcon = $(aTip[1]);
						var oLinContent = $(aTip[2]).html(oGoal.regmsg);
						oLineBox.append(oLinIcon).append(oLinContent);
						oThis.after(oLineBox);
						$t.dom.oHintList[oGoal.name] = oLineBox;
						break;
					default:
						var oTipBox = $(aTip[0]).attr('id', 'tip-box-' + oGoal.name);
						var oTipContent = $(aTip[1]).html(oGoal.regmsg);
						var oTipGuide = $(aTip[2]).addClass('tip-icon-guide ' + $t.settings.disPos);
						oTipBox.append(oTipContent.append(oTipGuide));
						oTipBox.appendTo('body');
						oGoal.tipHeight = oTipBox.outerHeight();
						oGoal.tipWidth = oTipBox.outerWidth();
						oGoal.autoLeft = function() {
							if (oGoal.left + oGoal.tipWidth - win.width() > 0) {
								oGoal.tipLeft = oGoal.left + oGoal.width - oGoal.tipWidth;
							} else {
								oGoal.tipLeft = oGoal.left;
							};
						};
						oGoal.where = [];
						oGoal.where['top'] = function() { //上                
							oGoal.autoLeft();
							oGoal.tipTop = oGoal.top - oGoal.tipHeight - 10 - oGoal.height / 2;
						};
						oGoal.where['right'] = function() { //右
							oGoal.tipLeft = oGoal.left + oGoal.width + 10;
							oGoal.tipTop = oGoal.top - oGoal.height / 2;
						};
						oGoal.where['bottom'] = function() { //下
							oGoal.autoLeft();
							oGoal.tipTop = oGoal.top + oGoal.height + 10 - oGoal.height / 2;
						};
						oGoal.where['left'] = function() { //左
							oGoal.tipLeft = oGoal.left - oGoal.tipWidth - 10;
							oGoal.tipTop = oGoal.top - oGoal.height / 2;
						};
						oGoal.where[$t.settings.disPos]();
						oTipBox.css({
							left: oGoal.tipLeft,
							top: oGoal.tipTop
						});
						$t.dom.oHintList[oGoal.name] = oTipBox;
						break;
				}
			},
			//修改提示
			eidtHint: function(name, className) {
				var oRule = $t.settings.rules[name];
				var oHintBox = $t.dom.oHintList[name];
				oHintBox.removeClass('success info error').addClass(className);
				var oHint = oHintBox.find('.easy-validform-hint');
				switch (className) {
					case 'success':
						oHint.html('信息通过验证！');
						break;
					case 'error':
						oHint.html(oRule.regmsg);
						break;
					default:
						break;
				}
			 oHintBox.attr('style','visibility:visible');
			},
			//添加即时校验
			addInstant: function() {
				for (var i = 0, l = $t.info.nameList.length; i < l; i++) {
					var sName = $t.info.nameList[i];
					var sRegName = $t.info.regNameList[i];
					$t.dom.oRuleList[sName].on('blur', {
						sName: sName,
						sRegName: sRegName
					}, function(e) {
						var className = !m.getRegList[e.data.sRegName].test(this.value) ? 'error' : 'success';
						m.eidtHint(e.data.sName, className);
					});
				}
			}
		};
	var methods = {
		init: function(options) {
			return this.each(function() {
				this.self = $(this);
				this.settings = $.extend({}, $.fn.easyValidform.defaults, options);
				m.init.call(this);
			});
		}
	};
	$.fn.easyValidform = function() {
		var method = arguments[0];
		if (methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
		} else if (typeof(method) == 'object' || !method) {
			method = methods.init;
		} else {
			$.error('方法 [' + method + ']不存在 于 插件中！');
			return this;
		}
		return method.apply(this, arguments);
	};
	$.fn.easyValidform.defaults = {
		subBtn: '.js-submit',
		way: 'inline',
		disPos: 'top',
		isSingle: false,
		instant: true
	};
})(jQuery || $);