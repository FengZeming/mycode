!(function ( root , factory ) {
    'use strict';
    if ( typeof define === 'function' ) {
        if ( define.amd ) {
            // AMD
            define ( ['jquery' , 'jqZtree/../jquery.ztree.all'] , factory );
        }
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory ( root.jQuery );
    }
} ( this , function ( $ ) {
    'use strict';
    var datakey = 'ne_tree' ,

    // 默认参数
        defaults = {
            setting : {
                data  : {
                    key        : {
                        checked  : 'checked' ,
                        children : 'children' ,
                        name     : 'name' ,
                        title    : '' ,
                        url      : 'url'
                    } ,
                    simpleData : {
                        enable  : true ,
                        idKey   : 'id' ,
                        pIdKey  : 'pId' ,
                        rootPId : 0
                    }
                } ,
                async : {
                    enable      : false ,
                    type        : 'get' ,
                    contentType : 'application/json' ,
                    autoParam   : ['id']
                }
            } ,
            data    : undefined
        };

    $.fn.neTree = function ( settings ) {

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
            return Constructor.prototype[settings] ? Constructor.prototype[settings].apply ( instance , args ) : udf;
        }
        else if ( !run ) {
            options = $.extend ( true , options , settings );
        }

        return this.each ( function () {
            var element = this ,
                instance = $ ( element ).data ( datakey );
            if ( !instance ) {
                $ ( element ).data ( datakey , instance = new Constructor ( element , options )._init () );
            } else {
                instance._init ();
            }
        } );
    };

    // 暴露插件的默认配置
    $.fn.neTree.defaults = defaults;

    // 构造函数
    function Constructor ( element , options ) {
        var the = this;
        the.$el = $ ( element );
        the.$tree = undefined;
        the.options = options;
    }

    // 原型方法，驼峰写法
    Constructor.prototype = {
        /**
         * 初始化
         * @return this
         * @version 1.0
         */
        _init      : function () {
            // 初始化
            this.refreshRoot ();
            return this;
        }
        ,
        /**
         * 编译模版的方法
         * @param str 传入的模版
         * @param obj 传入的数据对象
         * @returns {string}
         * @private
         */
        _fnCompile : function ( str , obj ) {
            var html = '';

            html = str.replace ( /({{(\w+)}})/g , function ( $1 , $2 , $3 ) {
                return obj[$3] ? obj[$3] : '';
            } );

            return html;
        }
        ,

        expand      : function ( isCheck ) {
            var isCheck = !isCheck ? true : !!isCheck;
            this.$tree.expandAll ( isCheck );
        } ,
        refreshRoot : function ( options ) {

            var self = this;
            var op = this.options = options ? $ ( this.options , options ) : this.options;
            var data = null;
            //如果没有data则整个树组件都是异步加载
            if ( op.data ) {
                data = op.data;
            }

            self.$tree = $.fn.zTree.init ( self.$el , op.setting , data );
        }
    };
} ));