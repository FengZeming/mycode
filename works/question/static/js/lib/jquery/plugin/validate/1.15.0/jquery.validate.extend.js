/*
 修改jQuery Validation插件兼容Bootstrap的方法，没有直接写在插件中是为了便于插件升级
 */
(function ( root , factory ) {
    'use strict';
    if ( typeof define === 'function' && define.amd ) {
        // AMD
        define ( ['jquery' , 'jqSerializeJson' , 'jqForm' , 'jqValidate/../jquery.validate'] , factory );
        
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory ( root.jQuery );
    }
} ( this , function ( $ ) {
    'use strict';

    //通用函数
    var fgBack = function ( element , state ) {
        var $el = $ ( element );
        var $parent = $el.closest ( '.js-validate-choice' );
        var _state = $parent.data ( 'state' ) , state = state || 'yes';
        $el.$parent = $parent;
        if ( _state === state ) {
            return $el;
        }
        var cache = {
            no  : {
                hasok  : 'has-success' ,
                iconok : 'glyphicon-ok' ,
                hasno  : 'has-error' ,
                iconno : 'glyphicon-remove'
            } ,
            yes : {
                hasok  : 'has-error' ,
                iconok : 'glyphicon-remove' ,
                hasno  : 'has-success' ,
                iconno : 'glyphicon-ok'
            }
        };
        var $p = $parent.closest ( '.jc-validate-box' );
        var o = cache[state];
        $p.removeClass ( o.hasok ).addClass ( o.hasno ).find ( '.glyphicon' ).removeClass ( o.iconok ).addClass ( o.iconno );
        $parent.data ( 'state' , state );
        return $el;

    };

    var fnSubmit = function ( options , option ) {
        var self = this;
        if ( option.btn ) {
            option.btn.on ( 'click' , function ( e ) {
                e.preventDefault ();
                e.stopPropagation ();
                if ( !$ ( self.selector ).valid () )return;
                self.ajaxSubmit ( option );
            } );
        } else {
            options.submitHandler = function ( form ) {
                self.ajaxSubmit ( option );
            };
        }

    };

    //设置自定义校验业务逻辑
    $.validator.setDefaults ( {
        onkeyup : false ,

        ignore         : ".ignore" ,
        highlight      : function ( element ) {
            fgBack ( element , 'no' );
        } ,
        success        : function ( error , element ) {
            var $el = fgBack ( element );
            $el.$parent.find ( '.jc-message' ).html ( '&nbsp;' );

        } ,
        errorElement   : "span" ,
        errorPlacement : function ( error , element ) {
            var $el = element;
            var $parent = $el.closest ( '.js-validate-choice' );
            var _state = $parent.data ( 'state' );
            var $message = $parent.find ( '.jc-message' );
            var fnMessage = function () {
                $message.html ( error.text () );
            };

            if ( !$parent.data ( 'init' ) ) {
                $parent.append ( '<span class="glyphicon glyphicon-remove  form-control-feedback"></span>' );
                $parent.closest ( '.jc-validate-box' ).addClass ( 'has-error' );
                $parent.data ( 'state' , 'no' );
                $parent.data ( 'init' , 'init' );
                !$message.data ( 'msg' ) && ( $message.data ( 'msg' , $message.text () ));
                fnMessage ();
                return;
            }

            if ( _state === 'no' ) {
                fnMessage ();
                return;
            }
        }
    } );

    //自定义校验方法
    $.validator.addMethod ( 'isSole' , function ( value , element , params ) {
        var $el = $ ( element ) , sOld = $el.data ( 'old' ) , state = false;

        if ( sOld === value ) {
            return state = false;
        }

        $.ajax ( $.extend ( true , {
            type    : 'get' ,
            url     : '/json/result.json' ,
            async   : false , //同步请求
            data    : {} ,
            success : function ( result ) {
                $el.data ( 'old' , value );
                if ( result ) {
                    state = true;
                }
            }
        } , params ) );

        return state;

    } , "用户名已经存在！" );

    // 中文字两个字节
    $.validator.addMethod ( "regByteLength" , function ( value , element , param ) {
        var length = value.length;
        for ( var i = 0; i < value.length; i++ ) {
            if ( value.charCodeAt ( i ) > 127 ) {
                length++;
            }
        }
        return this.optional ( element ) || ( length >= param[0] && length <= param[1] );
    } , $.validator.format ( "请输入{0}-{1}个字节之间的值(一个中文字算2个字节)！" ) );

    // 邮政编码验证
    $.validator.addMethod ( "isZipCode" , function ( value , element ) {
        var tel = /^[0-9]{6}$/;
        return this.optional ( element ) || (tel.test ( value ));
    } , "请输入正确的邮政编码！" );

    // 身份证
    $.validator.addMethod ( "isIdCad" , function ( value , element ) {
        var tel = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return this.optional ( element ) || (tel.test ( value ));
    } , "请输入正确的身份证！" );

    // 手机号码
    $.validator.addMethod ( "isPhone" , function ( value , element ) {
        var tel = /^1[3|5|7|8|][0-9]{9}$/;
        return this.optional ( element ) || (tel.test ( value ));
    } , "请输入正确的手机号码！" );

    //校验使用的组件
    $.extend ( $.fn , {
        neValidate  : function ( options ) {

            var self = this;
            options = options || {};

            if ( !this.length ) {
                if ( options && options.debug && window.console ) {
                    console.warn ( '校验组件没有匹配到元素! ' );
                }
                return;
            }

            //如果有ajaxBtn 则使用 jq.form ajaxSubmit提交
            if ( !options.hasOwnProperty ( 'submitHandler' ) && options.hasOwnProperty ( 'ajaxBtn' ) ) {
                var ajaxOption = typeof (options.ajaxBtn) === 'function' ? options.ajaxBtn () : options.ajaxBtn;
                fnSubmit.call ( this , options , ajaxOption );
            }

            return this.validate ( options );

        } ,
        neResetForm : function () {
            this.find ( '.jc-validate-box' ).removeClass ( 'has-success has-error' );

            this.find ( '.js-validate-choice' ).each ( function () {
                var $self = $ ( this ) , $msg = $self.find ( '.jc-message' );
                $self.removeData ( 'init' );
                $self.removeData ( 'state' );
                $msg.html ( $msg.data ( 'msg' ) );
            } );
            this.find ( '.glyphicon' ).remove ();

            this.resetForm ();
        }
        , neIsValid : function () {
            return $ ( this.selector ).valid ();
        }
    } );
} ));