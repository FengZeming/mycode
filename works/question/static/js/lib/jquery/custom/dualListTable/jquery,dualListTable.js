!(function ( root , factory ) {
    'use strict';
    if ( typeof define === 'function' ) {
        if ( define.amd ) {
            // AMD
            define ( ['jquery' , 'lodash' , 'jqBootstrapTable'] , factory );
        }
        if ( define.cmd ) {
            // CMD
            define ( factory );
        }
        
    } else if ( typeof exports === 'object' ) {
        // Node, CommonJS之类的
        //   module.exports = factory(require('jquery'), require('underscore'));
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory ( root.jQuery );
    }
} ( this , function ( $ , _ ) {
    'use strict';
    var datakey = 'ne_dualListTable' ,
    //模版
    
    // 默认参数
        defaults = {
            data      : [] ,
            leftData  : [] ,
            rightData : [] ,
            filter    : 'id' ,
            neTable   : {

                nenu  : {
                    fit : 'position'
                } ,
                table : {
                    pagination  : false ,
                    showColumns : false ,
                    search      : true ,
                    
                    columns         : [
                        {
                            checkbox : true ,
                            field    : 'state'
                        } , {
                            field : 'name' ,
                            title : '名称'
                            
                        }
                    ]
                    , rowAttributes : function ( row , index ) {
                        return row.state = false;
                    }
                }
            }
        };
    
    $.fn.neDualListTable = function ( settings ) {
        
        var run = $.type ( settings ) === 'string' ,
            args = [].slice.call ( arguments , 1 ) ,
            options = $.extend ( true , {} , defaults ) ,
            $element ,
            instance;
        
        if ( run && run[0] !== '_' ) {
            if ( !this.length ) return;
            $element = $ ( this[0] );
            instance = $element.data ( datakey );
            if ( !instance ) $element.data ( datakey , instance = new Constructor ( $element[0] , options )._init () );
            return Constructor.prototype[settings] ? Constructor.prototype[settings].apply ( instance , args ) : undefined;
        }
        else if ( !run ) {
            options = $.extend ( true , options , settings );
        }
        
        return this.each ( function () {
            var element = this ,
                instance = $ ( element ).data ( datakey );
            if ( !instance ) {
                $ ( element ).data ( datakey , instance = new Constructor ( element , options )._init () );
            }
        } );
    };

// 暴露插件的默认配置
    $.fn.neDualListTable.defaults = defaults;

// 构造函数
    function Constructor ( element , options ) {
        var the = this;
        the.$el = $ ( element );
        the.id = element.id;
        the.options = options;
    }

// 原型方法，驼峰写法
    Constructor.prototype = {
        /**
         * 初始化
         * @return this
         * @version 1.0
         */
        _init : function () {

            var _this = this;
            var $this = this.$el;
            var opt = this.options;
            var dom = this.dom = {
                left    : {
                    $el : $this.find ( '.jc-dual-list-left' )
                }
                , right : {
                    $el : $this.find ( '.jc-dual-list-right' )
                }
                , arrw  : {
                    $el : $this.find ( '.jc-dual-list-arrw' )
                }
            };
            //
            dom.left.$resetBtn = dom.left.$el.find ( '.jc-reset-btn' );
            dom.left.$query = dom.left.$el.find ( '.jc-query' );
            dom.left.$table = dom.left.$el.find ( '.jc-table' );
            //
            dom.right.$resetBtn = dom.right.$el.find ( '.jc-reset-btn' );
            dom.right.$query = dom.right.$el.find ( '.jc-query' );
            dom.right.$table = dom.right.$el.find ( '.jc-table' );
            //
            dom.arrw.$rightBtn = dom.arrw.$el.find ( '.jc-right-btn' );
            dom.arrw.$leftBtn = dom.arrw.$el.find ( '.jc-left-btn' );
            
            dom.left.$table.neTable ( (opt.neTable.table.toolbar = '#' + _this.id + ' .jc-dual-list-left .jc-table-toobar' , opt.neTable) );
            dom.right.$table.neTable ( (opt.neTable.table.toolbar = '#' + _this.id + ' .jc-dual-list-right .jc-table-toobar' , opt.neTable) );
            
            var cache = this.cache = {
                data  : opt.data ,
                left  : _.isEmpty ( opt.leftData ) ? opt.data : opt.leftData ,
                right : opt.rightData
            };

            this.leftMethod ( 'load' , cache.left );
            this.rightMethod ( 'load' , cache.right );

            //左边设置到右边
            dom.arrw.$rightBtn.on ( 'click' , function () {
                var leftCheckData = _this.leftMethod ( 'getSelections' );
                if ( _.isEmpty ( leftCheckData ) )return;
                cache.right = _.sortBy ( _.concat ( cache.right , leftCheckData ) , [
                    function ( o ) {
                        return o.id;
                    }
                ] );
                cache.left = _.sortBy ( _.pullAllBy ( _.cloneDeep ( cache.data ) , cache.right , opt.filter ) , [
                    function ( o ) {
                        return o.id;
                    }
                ] );
                ;
                //
                _this.leftMethod ( 'load' , cache.left );
                _this.rightMethod ( 'load' , cache.right );
            } );

            //右边设置到左边
            dom.arrw.$leftBtn.on ( 'click' , function () {
                var rightCheckData = _this.rightMethod ( 'getSelections' );
                if ( _.isEmpty ( rightCheckData ) )return;
                cache.left = _.sortBy ( _.concat ( cache.left , rightCheckData ) , [
                    function ( o ) {
                        return o.id;
                    }
                ] );
                cache.right = _.sortBy ( _.pullAllBy ( _.cloneDeep ( cache.data ) , cache.left , opt.filter ) , [
                    function ( o ) {
                        return o.id;
                    }
                ] );
                //
                _this.leftMethod ( 'load' , cache.left );
                _this.rightMethod ( 'load' , cache.right );
                
            } );

            //重置按钮
            dom.left.$resetBtn.on ( 'click' , function () {
                _this.leftMethod ( 'resetSearch' , '' );
            } );
            dom.right.$resetBtn.on ( 'click' , function () {
                _this.rightMethod ( 'resetSearch' , '' );
            } );
            return this;
        }

        , leftMethod  : function (  ) {
            var neTable = this.dom.left.$table.data ( 'ne_table' );
            return neTable['method'].apply ( neTable ,arguments );

        }
        , rightMethod : function (  ) {
            var neTable = this.dom.right.$table.data ( 'ne_table' );
            return neTable['method'].apply ( neTable , arguments );
        }
        , setData     : function ( object ) {
            var cache = this.cache;
            var opt = this.options;
            //
            cache.data = this.options.data = object.data || [];
            cache.right = this.options.rightData = object.right || cache.right;
            cache.left = _.pullAllBy ( _.cloneDeep ( cache.data ) , cache.right , opt.filter );

            //
            this.leftMethod ( 'load' , cache.left );
            this.leftMethod ( 'resetSearch' , '' );
            this.rightMethod ( 'resetSearch' , '' );

        }
        ,
        getData       : function ( type ) {
            var type = type || 'right';
            var data = this.cache.right;
            if ( type == 'left' ) {
                data = this.cache.left;
            }
            return data;
        }

    };
    
} ))
;