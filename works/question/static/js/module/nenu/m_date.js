/**
 * 全局通知提示组件
 */

define ( function ( require ) {
    'use strict';
    require ( 'jqLayerDate' );

    var format = {
        ymd : 'YYYY-MM-DD' ,

        ymdhms : 'YYYY-MM-DD hh:mm:ss' ,
        hms    : 'hh:mm:ss'
    };

    var defaults = {
        elem    : '#js_student_info_form_date_birthday' ,
        format  : format['ymd'] ,
        isclear : false ,
        istime  : true ,
        start   : laydate.now ( 0 , format['ymd'] ) ,
        choose  : function ( dates ) {
            $ ( this.elem ).focus ();
        }
    };

    Nenu.date = {
        /**
         * 默认格式
         *
         * @param option   layerDate参数
         * @param str      日期格式化字符串 默认 ymd
         */
        default   : function ( option , str ) {
            option.format = format[str || 'ymd'];
            return laydate ( $.extend ( {} , defaults , option ) );
        }
        , options : function ( option ) {

            if ( option.format ) {
                option.format = format [option.format];
                option.start = laydate.now ( 0 , option.format );
            }
            laydate.options(option);
        } ,
        setDate   : function ( ymd , callback ) {

            if ( arguments.length == 1 && typeof (ymd) === 'function' ) {
                [].splice.call ( arguments , 0 , 0 , undefined );
                callback = arguments[1];
                ymd = arguments[0];
            }

            var date = laydate.setDate ( ymd );

            if ( typeof (callback) === 'function' ) {
                callback ( date );
            }

        }
    }
} );



