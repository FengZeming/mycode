(function (window, udf) {
    'use strict';
    function argumentNames(fn) {
        var names = fn.toString().match(/^[\s\(]*function[^(]*\(([^\)]*)\)/)[1].replace(/\s+/g, '').split(',');
        return names.length == 1 && !names[0] ? [] : names;
    }

    function Class(baseClass, prop) {
        if (typeof (baseClass) === "object") {
            prop = baseClass;
            baseClass = null;
        }
        function F() {
            if (baseClass) {
                this.baseprototype = baseClass.prototype;
            }
            this.init.apply(this, arguments);
        }

        if (baseClass) {
            var middleClass = function () {
            };
            middleClass.prototype = baseClass.prototype;
            F.prototype = new middleClass();
            F.prototype.constructor = F;
        }

        for (var name in prop) {
            if (prop.hasOwnProperty(name)) {
                if (baseClass &&
                    typeof (prop[name]) === "function" &&
                    argumentNames(prop[name])[0] === "$super") {
                    F.prototype[name] = (function (name, fn) {
                        return function () {
                            var that = this;
                            $super = function () {
                                return baseClass.prototype[name].apply(that, arguments);
                            };
                            return fn.apply(this, Array.prototype.concat.apply($super, arguments));
                        };
                    })(name, prop[name]);
                } else {
                    F.prototype[name] = prop[name];
                }
            }
        }
        return F;
    };


    var rootPath = window.rootPath || {
            BASE     : '/'
            , PAGE   : '/page/'
            , JSON   : '/json/'
            , STATIC : '/mycode/works/question/static/'
        };


    //
    var Nenu = Class({
        init    : function () {
        },
        /**
         * 弹窗组件
         */
        event   : {},
        require : { isLoad : true },

        tool     : {
            /**
             * 获取当前项目的根目录
             * @returns {string}
             */
            fnGetRootPath : function () {
                if (this.rootPath) {
                    return this.rootPath;
                }
                var lo = window.document.location,
                    protocol = lo.protocol,
                    host = lo.host,
                    name = lo.pathname,
                    aName = name.match(/\/(\w+\/){1}/);
                return this.rootPath = (protocol + '//' + host + aName[0]);
            }

        }
        ,
        path     : {},
        /**
         * 常量
         * @returns {{}}
         * @constructor
         */
        CONSTANT : {
            PATH : rootPath
        },

        /**
         * 页面上下文对象
         */

        context : {
            /**
             * event 组件事件参数
             */
            event : {
                ease : function () {
                    console.log('默认函数');
                }
            }
        },
        /**
         *
         * @param e
         */
        method  : {

            /**
             * event 组件事件监听
             * @param e
             */
            event : function (e, isBubble) {
                console.log(this);
                var data = $(this).data('btn') || 'ease';
                if (typeof(data) === 'string') {
                    data = { name : 'ease', fn : data };
                }
                isBubble = data.isBubble || isBubble;
                if (isBubble) {
                    e.stopPropagation();
                }
                e.preventDefault();
                window.Nenu.event[data.name || 'ease'].call(this, window.Nenu.context.event[data.fn || 'ease'], e);
            },

            /**
             *  事件组件的事件绑定
             * @param option
             */
            bind : function (classList) {

            }

        },
        open    : {
            /**
             * 获取页面参数在弹窗中重写 直接调用即可
             */
            data : {
                //父页面参数
                parent : {},
                //子页面参数
                child  : {}
            },
            //关闭窗口的回调方法，该方法在每个页面重写
            end  : function () {
            }
        }
    });
    //类继承工具
    window.Class = Class;
    //项目全局对象，提供各种公用参数与函数
    window.Nenu = new Nenu();
})(this, undefined);

