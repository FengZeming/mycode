define ( function ( require ) {
    var dom = require ( 'dom' );
    require ( 'jqWebUploader' );

    var i = 0;
    var $layer;

    function open ( options ) {
        if ( $layer ) {
            return;
        }
        var defaults = {
            nenu : {
                plugin     : {
                    layer : {
                        layero     : null ,
                        index      : i ,
                        cancelBack : function ( callBack ) {
                            callBack ();
                            setTimeout ( function () {
                                layer.close ( i );
                                $layer = null;
                            } , 0 );
                        }
                    }
                }
                ,
                finishBack : function ( files ) {

                }
            }
        };

        var options = $.extend ( true , defaults , options );

        $layer = layer.open ( {
            type    : 1 ,
            title   : '文件上传' ,
            area    : ['595px' , '500px'] ,
            content : template ( 'tpl_uploader' , {} ) ,
            offset  : 'rb' , //右下角弹出
            shift   : 2 ,
            shade   : 0 ,
            resize  : false ,
            move    : false ,
            maxmin  : true ,
            success : function ( layero , index ) {
                var max = layero.find ( '.layui-layer-max' );
                max.hide ();
                i = index;
                options.nenu.plugin.layer.layero = $ ( layero );
                $ ( '.ne-uploader' ).neUploader ( options );
            } ,
            cancel  : function () {
                $layer = null;
            }
            ,
            //最小化按钮的回调
            min     : function ( layero ) {
                layero.css ( {
                    top      : 'auto' ,
                    left     : 'auto'
                    , right  : 0
                    , bottom : 0
                } );
                var max = layero.find ( '.layui-layer-max' );
                max.css ( 'display' , 'inline-block' );
            } ,
            restore : function ( layero ) {
                var max = layero.find ( '.layui-layer-max' );
                max.hide ();
            }
        } );
    }

    return {
        open : function ( options ) {
            open ( options );
        }
    }
} );