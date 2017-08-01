/**
 * @extends jquery.1.11 +
 * @fileOverview json填充表单
 * @author FZM
 * @version 1.0.0
 * @date 2017-02-09
 * Copyright (c) 2012 FZM
 */
/**
 * 使用方法:
 *   1. setData
 *   $('#div').jsonForm('setData', {...});
 *   2. clear
 *   $('#div').jsonForm('clear');
 *
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
    var datakey = 'jsonForm' ,

    // 默认参数
        defaults = {};

    $.fn.jsonForm = function ( settings ) {

        var run = $.type ( settings ) === 'string' ,
            args = [].slice.call ( arguments , 1 ) ,
            options = $.extend ( {} , defaults ) ,
            $element ,
            instance;

        if ( run && run[0] !== '_' ) {
            if ( !this.length ) return;
            $element = $ ( this[0] );
            instance = $element.data ( datakey );
            if ( !instance ) $element.data ( datakey , instance = new Constructor ( $element[0] , options )._init () );
            return Constructor.prototype[settings] ? Constructor.prototype[settings].apply ( instance , args ) : undefined;
        } else if ( !run ) {
            options = $.extend ( true , options , settings );
        }

        return this.each ( function () {
            var element = this ,
                instance = $ ( element ).data ( datakey );
            if ( !instance ) {
                $ ( element ).data ( datakey , instance = new Constructor ( element , options )._init () );
            } else {

            }
        } );
    };

    // 暴露插件的默认配置
    $.fn.jsonForm.defaults = defaults;

    // 构造函数
    function Constructor ( element , options ) {
        var the = this;
        the.$el = $ ( element );
        the.options = options;
    };

    // 原型方法，驼峰写法
    Constructor.prototype = {
        /**
         * 初始化
         * @return this
         * @version 1.0
         */
        _init : function () {
            // 初始化
            var self = this;

            return this;
        } ,

        setData      : function ( data ) {
            if ( $.isEmptyObject ( data ) ) return false;
            this.options.data = $.isPlainObject ( data ) ? data : JSON.parse ( data );
            this._displayData ();
        } ,
        _displayData : function () {
            this._set ();
        } ,

        clear       : function () {
            $ ( "input,select,textarea" , this.$el ).each ( function () {

                switch ( this.tagName.toUpperCase () ) {
                    case "INPUT":
                        if ( !this.type && this.type === 'file' ) {
                            return
                        }
                        switch ( this.type.toUpperCase () ) {
                            case "RADIO":
                            case "CHECKBOX":
                                this.checked = false;
                                break;
                            case "TEXT":
                            case "PASSWORD":
                            case "HIDDEN":
                            case "NUMBER":
                            case "COLOR":
                            case "DATE":
                            case "DATETIME":
                            case "TIME":
                            case "DATETIME-LOCAL":
                            case "EMAIL":
                            case "MONTH":
                            case "WEEK":
                            case "TEL":
                            case "URL":
                            case "SEARCH":
                            case "RANGE":
                                this.value = '';
                                break;
                        }
                        break;
                    case "SELECT":
                    case "TEXTAREA":
                        this.value = '';
                        break;
                }
            } );
        }
        ,
        _set        : function () {
            var that = this;
            that.clear ();
            that.cacheData = that._getNewData ( that.options.data );

            //文本
            $ ( 'input,select,textarea' , this.$el ).each ( function () {
                var $input = this;
                var name = this.name;
                if ( !name ) {
                    return;
                }

                var value = that._getJson ( that.cacheData , name );

                if ( $.type ( value ) !== 'boolean' && $.type ( value ) !== 'number' && $.type ( value ) !== 'string' && !value )return;

                switch ( this.tagName.toUpperCase () ) {
                    case "INPUT":
                        if ( !this.type && this.type === 'file' ) {
                            return
                        }
                        switch ( this.type.toUpperCase () ) {
                            case "CHECKBOX":

                                if ( $.isArray ( value ) ) {
                                    $ ( value ).each ( function ( i , n ) {
                                        if ( n + '' == $ ( $input , that.$el ).val () ) {
                                            $ ( $input , that.$el ).prop ( "checked" , true );
                                            value.splice ( i , 1 );
                                            return false;
                                        }
                                    } );
                                    return;
                                }

                                //
                                if ( value + '' == $ ( $input , that.$el ).val () ) {
                                    $ ( this , that.$el ).prop ( "checked" , true );
                                }
                                break;
                            case "RADIO":
                                if ( value + '' == $ ( this , that.$el ).val () ) {
                                    $ ( this , that.$el ).prop ( "checked" , true );
                                }
                                break;
                            case "TEXT":
                            case "PASSWORD":
                            case "HIDDEN":
                            case "NUMBER":
                            case "COLOR":
                            case "DATE":
                            case "DATETIME":
                            case "TIME":
                            case "DATETIME-LOCAL":
                            case "EMAIL":
                            case "MONTH":
                            case "WEEK":
                            case "TEL":
                            case "URL":
                            case "SEARCH":
                            case "RANGE":
                                $ ( this , that.$el ).val ( value );
                                break
                        }

                        break;
                    case "SELECT":
                    case "TEXTAREA":
                        $ ( this , that.$el ).val ( value );
                        break
                }

            } );

        } ,
        _getNewData : function ( obj , k ) {
            obj = typeof(k) === 'undefined' ? obj : obj[k];
            obj = $.extend ( true , {} , {
                obj : obj
            } )['obj'];
            return obj;
        }

        ,
        _getJson : function ( obj , expr ) {
            var that = this;
            var patterns = {
                validate : /^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i ,
                key      : /[a-z0-9_]+|(?=\[\])/gi ,
                push     : /^$/ ,
                fixed    : /^\d+$/ ,
                named    : /^[a-z0-9_]+$/i
            };

            var keys = expr.match ( patterns.key ) , k;

            while ( (k = keys.shift ()) !== undefined && k.length ) {
                if ( $.type ( obj[k] ) !== 'boolean' && $.type ( obj[k] ) !== 'number' && $.type ( obj[k] ) !== 'string' && !obj[k] ) {return ''}
                ;
                // foo[n]
                if ( patterns.fixed.test ( k ) ) {
                    obj = obj[k];
                }
                // foo; foo[bar]
                else if ( patterns.named.test ( k ) ) {
                    obj = obj[k];
                }
            }
            return obj;
        }

    }

} ));