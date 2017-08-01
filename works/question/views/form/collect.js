define ( [
        'jquery' ,
        'lodash' ,
        'jqICheck' ,
        'jqSerializeJson' ,
        'jqSpinner' ,
        'jqEHook' ,
        'jqLayer' ,
        'jqRaty'
    ]
    , function ( $ , _ ) {



        var animate = {

            shake : (function () {

                var isEnd = true;

                function _shake ( option ) {
                    var config = {
                        e             : option.element ,
                        time          : option.time || 500 ,
                        distance      : option.distance || 5 ,
                        originalStyle : option.element.style.cssText ,
                        after         : option.after
                    };

                    config.e.style.position = "relative";

                    if ( isEnd ) {
                        option.before && option.before.call ( e );
                        setTimeout ( function () {
                            isEnd = false;
                            //开始时间
                            config.start = (new Date ()).getTime ();
                            animate ( config );
                        } , 100 );
                    }

                };

                function animate ( config ) {
                    var now = (new Date ()).getTime ();
                    var elapsed = now - config.start;
                    var fraction = elapsed / config.time;
                    if ( fraction < 1 ) {
                        var x = config.distance * Math.sin ( fraction * 15 * Math.PI );
                        config.e.style.left = x + "px";
                        setTimeout ( function () {
                            animate ( config );
                        } , Math.min ( 25 , config.time - elapsed ) );
                    } else {
                        config.e.style.cssText = config.originalStyle;
                        //执行完毕回调函数
                        config.after && config.after.call ( e );
                        isEnd = true;
                    }
                };

                return function ( option ) {
                    _shake ( option );
                };

            }) ()

        };

        var valid = {
            check    : function () {

                var _this = this;

                var result = true;
                var firstMsg = { p : null , msg : null };

                _.forEach ( jsons , function ( node , key ) {

                    if ( node.type === 'form' ) {
                        return;
                    }
                    var $wrap = $ ( '[data-wrap=' + key + ']' );
                    var $obj = node.type === 'select' ? $ ( 'select[name=' + node.name + ']' ) : $ ( 'input[name=' + node.name + ']' );
                    var $msg = $wrap.find ( '.jc-msg' );
                    $msg.hide ();

                    if ( _this[node.type] ( $obj ) ) {

                        result && (firstMsg = { p : $wrap , msg : $msg } );
                        result = false;
                        $msg.show ();
                    }

                } );

                if ( !result ) {

                    var nthisPosionTop = firstMsg.p.offset ().top;

                    $ ( 'html,body' ).stop ().animate ( {
                        scrollTop : nthisPosionTop
                    } , 300 , function () {
                        animate.shake ( {
                            element : firstMsg.msg[0]
                        } );
                    } );
                    return false;
                }
                return true;

            } ,
            /**
             * 判断某属性去掉空格的情况下是否为空值
             * @param attribute
             * @returns {boolean}
             */
            isEmpty  : function ( val ) {

                return !(val + '').replace ( /\s+/g , '' ).length;
            } ,
            number   : function ( $obj ) {

                return $obj.val () == $obj.attr ( 'data-min' );
            } ,
            radio    : function ( $obj ) {
                return !$obj.is ( ':checked' );
            } ,
            checkbox : function ( $obj ) {
                return !$obj.is ( ':checked' );
            } ,
            select   : function ( $obj ) {

                return this.isEmpty ( $obj.val () );
            } ,
            raty     : function ( $obj ) {
                return this.isEmpty ( $obj.val () );
            }

        };


        $ ( function () {
            //
            $ ( 'input' ).iCheck ( {
                checkboxClass : 'icheckbox-ne-info' ,
                radioClass    : 'iradio-ne-info'
                , insert      : '<i class="icon"></i>'
            } );
            //
            $ ( '[data-trigger~="spinner"]' ).jqspinner ();

            //
            $ ( '.jc-raty' ).raty ( {
                starType  : 'i' ,
                hints:['','','','','','','','','',''],
                scoreName : function () {
                    return $ ( this ).attr ( 'data-name' );
                }

                ,
                score     : function () {
                    return $ ( this ).attr ( 'data-score' );
                } ,
                number    : function () {
                    return $ ( this ).attr ( 'data-number' );
                }
            } );
            //
            $ ( '#js_submit' ).on ( 'click' , function () {

                if ( !valid.check () ) {
                    return;
                }
                layer.msg ( '问卷测试通过！' );

                // console.log($('#js_form').serializeJSON());
            } );
        } );
    } );