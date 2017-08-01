/**
 * 全局通知提示组件
 */

define(function (require) {
    'use strict';

    var toastr = require('jqToastr');
    var isShow = false;

    toastr.options = {
        "closeButton"     : false,
        "debug"           : false,
        "progressBar"     : true,
        "positionClass"   : "toast-top-right",
        "onclick"         : null,
        "showDuration"    : "400",
        "hideDuration"    : "1000",
        "timeOut"         : "2000",
        "extendedTimeOut" : "1000",
        "showEasing"      : "swing",
        "hideEasing"      : "linear",
        "showMethod"      : "fadeIn",
        "hideMethod"      : "fadeOut"
    };

    /**
     * 配置
     * @param options
     * @returns {*[]}
     */
    function getOptions(options) {
        if (typeof(options) === 'string') {
            return [options];
        }
        if (typeof(options) === 'object') {
            return [
                options.msg
                , options.title || ''
                , {
                    onShown    : options.show || function () {
                    }
                    , onHidden : options.hide || function () {
                    }
                }];
        }
    }

    function hide() {
        isShow = false;
    }

    /**
     *  主方法
     * @param name
     * @param msg
     * @param once
     */
    function main(name, msg, once) {

        var once = once ? true : false;
        if (once) {
            if (!isShow) {
                isShow = true;

                var a = getOptions(
                    typeof(msg) === 'string' ?
                    {
                        msg : msg, hide : hide
                    } : msg.hide = hide
                );
                toastr[name].apply(null, a);
            }
            return;
        }

        toastr[name].apply(null, getOptions(msg));

    }



    Nenu.toastr = {
        /**
         * 全局配置
         * @param options
         * @param options.show  function   显示回调函数
         * @param options.hide  function   隐藏回调函数
         */
        options : function (options) {
            $.extend(toastr.options, {
                onShown     : options.show || function () {
                }, onHidden : options.hide || function () {
                }
            });
        },
        /**
         * 信息
         * @param msg   string   文本
         *  @param msg   object   {msg : 文本 , title : 标题 , show : 显示回调函数 , hide : 隐藏回调函数 }
         *  @param once  boolean  默认false 是否只执行一次
         * @returns {*}
         */
        info    : function (msg, once) {
            main('info', msg, once);


        },
        /**
         * 警告
         * @param msg   string   文本
         *  @param msg   object   {msg : 文本 , title : 标题 , show : 显示回调函数 , hide : 隐藏回调函数 }
         *  @param once  boolean  默认false 是否只执行一次
         * @returns {*}
         */
        warning : function (msg, once) {
            main('warning', msg, once);
        },
        /**
         * 成功
         * @param msg   string   文本
         *  @param msg   object   {msg : 文本 , title : 标题 , show : 显示回调函数 , hide : 隐藏回调函数 }
         *  @param once  boolean  默认false 是否只执行一次
         * @returns {*}
         */
        success : function (msg, once) {
            main('success', msg, once);
        },

        /**
         * 错误
         * @param msg   string   文本
         *  @param msg   object   {msg : 文本 , title : 标题 , show : 显示回调函数 , hide : 隐藏回调函数 }
         *  @param once  boolean  默认false 是否只执行一次
         * @returns {*}
         */
        error : function (msg, once) {
            main('error', msg, once);
        }
    };
});
