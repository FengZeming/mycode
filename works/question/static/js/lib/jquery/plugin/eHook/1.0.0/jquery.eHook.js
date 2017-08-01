/**
 * @extends jquery.1.11 +
 * @fileOverview 事件绑定插件
 * @author FZM
 * @version 1.0.0
 * @date 2017-02-09
 * Copyright (c) 2012 FZM
 */

/**
 * 使用方法:
 *
 * 1. <div data-hook="global"></div>
 *  $.hook ( 'global' ).on ( 'click.global' , fnEvent );
 *
 * 2. <div data-hook="global">
 *          <a data-on="btn"></a>
 *     </div>
 *  $.hook ( 'global' ).on ( 'click' ,'[data-on], fnEvent );
 */


!(function ( root , factory ) {
    'use strict';
    if ( typeof define === 'function' ) {
        if ( define.amd ) {
            // AMD
            define ( ['jquery'] , factory );
        }
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory ( root.jQuery );
    }
} ( this , function ( $ ) {

    'use strict';

    $.extend ( {
        hook : function ( h ) {
            return $ ( '[data-hook' + (!h || h == '*' ? '' : '~="' + h + '"') + ']' );
        }
    } );

} ));


