/*
 * @extends jquery.1.11 +

 * @fileOverview jquery事件绑定插件
 * @author FZM
 * @version 1.0.1
 * @date 2017-02-09
 * Copyright (c) 2012 FZM
 */
!(function ( root , factory ) {
    'use strict';
    if ( typeof define === 'function' ) {
        if ( define.amd ) {
            // AMD
            define ( ['jquery'] , factory );
        }
        if ( define.cmd ) {
            // CMD
            define ( factory );
        }
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory ( root.jQuery );
    }
} ( this , function ( $ ) {
    'use strict';

    $.extend ( {
        /**
         * 给元素绑定事件
         * @param options
         */
        neOn : function ( options ) {
            /*var defaults = [
             {
             sel: '',   元素
             agent: '', 委托元素
             eName: '', 事件名称默认 click
             eFunc: function () {  //事件函数
             }
             isBubble: false   是否冒泡
             }
             ];*/
            var fnCreate;
            if ( typeof (options) !== 'object' ) {
                return;
            }
            fnCreate = function ( oEl ) {
                if ( oEl.agent ) {
                    $ ( oEl.sel ).on ( !oEl.eName ? 'click' : oEl.eName , oEl.agent , function ( e ) {
                        var isBubble = !oEl.isBubble ? !1 : !0;
                        oEl.eFunc.call ( this , e , isBubble );
                    } );
                    return;
                }
                $ ( oEl.sel ).on ( !oEl.eName ? 'click' : oEl.eName , function ( e ) {
                    var isBubble = !oEl.isBubble ? !1 : !0;
                    oEl.eFunc.call ( this , e , isBubble );
                } );
            }

            if ( !$.isArray ( options ) ) {
                fnCreate ( options );
                return;
            }
            for ( var i = 0 , l = options.length; i < l; i++ ) {
                var oEl = options[i];
                fnCreate ( oEl );
            }
        }

    } );
} ));


