/*!
 * 插件名称
 * @author 作者信息
 * @version 1.1 版本信息
 * @require 依赖信息
 * 时间
 */


/**
 * v1.0
 * 2014年6月1日18:54:12
 * 构造，通过了JSHint检查
 * 2014年6月2日18:54:30
 * 更新了什么什么
 * 2014年6月3日18:54:39
 * 增加了什么
 * 修复了什么
 * TODO什么等等
 *
 * v1.1
 * 2014年7月1日18:55:44
 * 修改了什么，增加了什么
 *
 */


!(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'jqGrid'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        //   module.exports = factory(require('jquery'), require('underscore'));
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory(root.jQuery);
    }
}(this, function ($) {
    'use strict';


    var datakey = 'jquery-pluginName',


    // 默认参数
        defaults = {
            nenu: {
                
            },
            grid: {}
        };


    $.fn.neGrid = function (settings) {

        var run = $.type(settings) === 'string',

            args = [].slice.call(arguments, 1),

            options = $.extend({}, defaults),
            $element,
            instance;

        if (run && run[0] !== '_') {
            if (!this.length) return;

            $element = $(this[0]);

            instance = $element.data(datakey);

            if (!instance) $element.data(datakey, instance = new Constructor($element[0], options)._init());

            return Constructor.prototype[settings] ? Constructor.prototype[settings].apply(instance, args) : udf;
        }
        // instantiation options
        else if (!run) {
            options = $.extend(options, settings);
        }

        return this.each(function () {
            var element = this,
                instance = $(element).data(datakey);
            if (!instance) {
                $(element).data(datakey, instance = new Constructor(element, options)._init());
            }
        });
    };

    // 暴露插件的默认配置
    $.fn.neGrid.defaults = defaults;


    // 构造函数

    function Constructor(element, options) {
        var the = this;
        the.$el = $(element);
        the.options = options;
    }


    // 原型方法，驼峰写法
    Constructor.prototype = {
        /**
         * 初始化
         * @return this
         * @version 1.0
         * 2014年7月3日19:49:20
         */
        _init: function () {
            // 初始化
            return this;
        },


        // 其他私有原型方法
        _otherPrivatePrototypeFunction: function () {
            // do sth
        },


        /**
         * 设置或获取选项
         * @param  {String/Object} key 键或键值对
         * @param  {*}             val 值
         * @return 获取时返回键值，否则返回this
         * @version 1.0
         */
        options: function (key, val) {
            // get
            if ($.type(key) === 'string' && val === udf) return this.options[key];

            var map = {};
            if ($.type(key) === 'object') map = key;
            else map[key] = val;

            this.options = $.extend(this.options, map);
        },


        // 其他公有原型方法
        otherPublicPrototypeFunction: function () {
            // do sth
        }
    };
}));
