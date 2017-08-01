!(function ( root , factory ) {
    'use strict';
    if ( typeof define === 'function' ) {
        if ( define.amd ) {
            // AMD
            define ( ['jquery' , 'jqLayer'] , factory );
        }
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory ( root.jQuery );
    }
} ( this , function ( $ ) {
    'use strict';
    var datakey = 'ne_layer' ,
    //模版
        preTpl = {
            tplRowBtn : '<span class="ne-grid-row-btn"> <a class=" btn-primary btn-sm jc-grid-row-{{cls}}-btn" href="javascript:void(0)" title="{{title}}"><i class="{{icon}}"></i>&nbsp;{{text}}</a></span>'
        } ,
    // 默认参数
        defaults = {
            fix : false
        };

    function extend ( options ) {
        return $.extend ( defaults , options );
    }

    $.fn.neLayer = {
        open    : function ( options ) {
            layer.open ( extend ( options ) );
        } ,
        alert   : function ( content , options , yes ) {
            layer.alert ( content , extend ( options ) , yes )
        } ,
        confirm : function ( content , options , yes , cancel ) {
            layer.confirm ( content , extend ( options ) , yes , cancel );
        } ,
        msg     : function ( content , options , end ) {
            layer.msg ( content , extend ( options ) , end );

        } ,
        load    : function ( icon , options ) {
            layer.load ( icon , extend ( options ) );
        } ,
        tips    : function ( content , follow , options ) {
            layer.tips ( content , follow , extend ( options ) );

        } ,
        close   : function ( index ) {
            layer.close ( index );
        }
    }
    ;
} ));