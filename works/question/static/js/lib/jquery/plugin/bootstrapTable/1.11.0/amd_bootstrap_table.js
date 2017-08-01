/*
 * @extends jquery.1.11 +
 * @extends bootstrap table 1.11.0
 * @fileOverview neTable
 * @author FZM
 * @version 1.11.1
 * @date 2017-02-09
 * Copyright (c) 2012 FZM
 */
!(function ( root , factory ) {
    'use strict';
    if ( typeof define === 'function' ) {
        if ( define.amd ) {
            define ( ['jquery' , 'jqSerializeJson' , 'jqBootstrapTable/../bootstrap_table' , 'jqBootstrapTableGroupBy' , 'jqBootstrapTable/../bootstrap_table_zh_CN'] , factory );
        }
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory ( root.jQuery );
    }
} ( this , function ( $ ) {
    'use strict';
    var datakey = 'ne_table' ,
    //模版
        preTpl = {
            tplRowBtn : '<span class="ne-grid-row-btn"> <a class=" btn-primary btn-sm jc-grid-row-{{cls}}-btn" href="javascript:void(0)" title="{{title}}"><i class="{{icon}}"></i>&nbsp;{{text}}</a></span>'
        } ,
    // 默认参数
        defaults = {

            // nenu 自定义参数
            nenu : {

                //最大化  默认:position   可选: offset
                fit : 'position' ,

                // toobar上默认定义一下按钮
                toobarBtn : {

                    search : {
                        //是否启用
                        switch : false ,
                        sel    : '#js_grid_search_btn'
                        //callBack :function(){}
                    } ,
                    add    : {
                        switch : false ,
                        sel    : '#js_grid_add_btn'
                        //callBack :function(){}
                    } ,
                    delete : {
                        switch : false ,
                        sel    : '#js_grid_delete_btn'
                        //callBack :function(){}
                    } ,
                    edit   : {
                        switch : false ,
                        sel    : '#js_grid_eidt_btn'
                        //callBack :function(){}
                    }
                } ,

                //行内按钮
                rowBtn : {
                    action : {
                        field : 'action' ,
                        title : '操作' ,
                        align : 'center' ,
                        class : 'ne-grid-col-action' ,
                        width : 200
                    } ,
                    list   : []
                }
            } ,

            //bootstrap table 使用的参数
            table : {
                striped    : true ,
                pagination : true ,
                pageSize   : 20 ,

                //分页端: 默认前端  可选: 'server',
                sidePagination : 'client' ,
                showColumns    : true ,
                iconSize       : 'outline' ,

                //toobarID
                toolbar : '#js_grid_toolbar'
            }
        };

    $.fn.neTable = function ( settings ) {
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
    $.fn.neTable.defaults = defaults;

    // 构造函数
    function Constructor ( element , options ) {
        var the = this;
        the.$el = $ ( element );
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
            // 初始化
            var self = this;
            var oNenu = this.options.nenu;
            var oTable = this.options.table;
            var oToobarBtn = oNenu.toobarBtn;

            //缓存当前选择的row的id
            self.caArrySelectDataByID = [];

            //是否撑满
            //必须有 ne-content
            //必须有 ne-fit
            if ( oNenu.fit && typeof (oNenu.fit) === 'string' ) {

                this.$Row = this.$el.closest ( '.ne-content' );
                this.$fit = this.$el.closest ( '.ne-fit' );
                var rowH , fitH;
                if ( oNenu.fit == 'position' ) {
                    fitH = this.$fit.position ().top;
                } else {
                    fitH = this.$fit.offset ().top;

                }

                oTable.height = this.$Row.height () - fitH;

                //绑定窗口变化重新定义高度
                $ ( window ).on ( 'resize.neTableHt' , function () {

                    setTimeout ( function () {

                        if ( oNenu.fit == 'position' ) {
                            fitH = self.$fit.position ().top;
                        } else {
                            fitH = self.$fit.offset ().top;
                        }

                        self.$el.bootstrapTable ( 'resetView' , {
                            height : self.$Row.height () - fitH
                        } );

                    } , 200 );
                } );
            }

            //如果有查询参数
            if ( oNenu.query ) {

                oTable.queryParams = function ( p ) {
                    var o = {};

                    //如果是stirng 则为form元素选择器
                    if ( $.type ( oNenu.query ) === 'string' ) {
                        o = $ ( oNenu.query ).serializeJSON ();
                    }

                    //如果是数据 直接使用
                    if ( $.type ( oNenu.query ) === 'object' ) {
                        o = oNenu.query;
                    }
                    return $.extend ( {} , p , o );
                }

            }

            //给搜索按钮绑定刷新事件
            if ( oToobarBtn.search.switch ) {
                var fn = function () {
                    self.refresh ();
                };

                //自定义事件覆盖默认事件
                if ( oToobarBtn.search.callBack ) {
                    fn = oToobarBtn.search.callBack;
                }

                $ ( oToobarBtn.search.sel ).on ( 'click' , fn );
            }

            //按钮添加事件-add
            if ( oToobarBtn.add.switch && oToobarBtn.add.callBack ) {
                $ ( oToobarBtn.add.sel ).on ( 'click' , oToobarBtn.add.callBack );
            }

            //按钮添加事件-edit
            if ( oToobarBtn.edit.switch && oToobarBtn.edit.callBack ) {
                $ ( oToobarBtn.edit.sel ).on ( 'click' , oToobarBtn.edit.callBack );
            }

            //按钮添加事件-delete
            if ( oToobarBtn.delete.switch && oToobarBtn.delete.callBack ) {
                self.$btnDelete = $ ( oToobarBtn.delete.sel );

                //给checkBox绑定事件
                self.$el.on ( 'check.bs.table uncheck.bs.table ' + 'check-all.bs.table uncheck-all.bs.table' , function () {
                    self.$btnDelete.prop ( 'disabled' , !self.$el.bootstrapTable ( 'getSelections' ).length );
                    self.caArrySelectDataByID = self._fnGetSelectDataById ();
                    oToobarBtn.delete.checkBack && ( oToobarBtn.delete.checkBack ( self.caArrySelectDataByID ));
                } );

                //给delete按钮绑定事件
                self.$btnDelete.on ( 'click' , function ( e ) {
                    oToobarBtn.delete.callBack.call ( this , e , self.caArrySelectDataByID );
                } );
            }

            //添加行操作按钮
            if ( oNenu.rowBtn.list.length ) {
                self._fnActionObject ();

            }

            //table初始化
            this.$el.bootstrapTable ( oTable );

            return this;
        } ,

        _fnActionObject : function () {
            var oRowBtn = this.options.nenu.rowBtn ,
                oColumns = this.options.table.columns || [];

            var oEvents = {} , aFormat = [];

            for ( var i = 0 , l = oRowBtn.list.length; i < l; i++ ) {
                var o = oRowBtn.list[i];

                oEvents['click .' + o.cls] = function ( e , value , row , index ) {
                    o.callBack.apply ( this , arguments );
                };

                aFormat.push ( this._fnCompile ( preTpl.tplRowBtn , o ) );
            }

            oColumns.push ( $.extend ( oRowBtn.action , {
                events    : oEvents ,
                formatter : function () {
                    return aFormat.join ( '' )
                }
            } ) );

        }
        ,
        _fnGetHeight    : function ( $el ) {
            var h = $el.height () , b = this._fnGetBorders ( $el ) , p = this._fnGetPaddings ( $el ) , m = this._fnGetMargins ( $el );

            return h - b.top - b.bottom - p.top - p.bottom - m.top - m.bottom;
        }
        ,
        /**
         * 编译模版的方法
         * @param str 传入的模版
         * @param obj 传入的数据对象
         * @returns {string}
         * @private
         */
        _fnCompile      : function ( str , obj ) {
            var html = '';

            html = str.replace ( /({{(\w+)}})/g , function ( $1 , $2 , $3 ) {
                return obj[$3] ? obj[$3] : '';
            } );

            return html;
        } ,

        /**
         * 获取通过checkbox选中的row的ID集合
         * @returns {*}
         * @private
         */
        _fnGetSelectDataById : function () {
            return $.map ( this.$el.bootstrapTable ( 'getSelections' ) , function ( row ) {
                return row.id
            } );
        } ,
        _fnGetBorders        : function ( $el ) {
            return {
                top    : parseInt ( $el.css ( "border-top-width" ) , 10 ) || 0 ,
                left   : parseInt ( $el.css ( "border-left-width" ) , 10 ) || 0 ,
                bottom : parseInt ( $el.css ( "border-bottom-width" ) , 10 ) || 0 ,
                right  : parseInt ( $el.css ( "border-right-width" ) , 10 ) || 0
            }
        } ,
        _fnGetPaddings       : function ( $el ) {
            return {
                top    : parseInt ( $el.css ( "padding-top" ) , 10 ) || 0 ,
                left   : parseInt ( $el.css ( "padding-left" ) , 10 ) || 0 ,
                bottom : parseInt ( $el.css ( "padding-bottom" ) , 10 ) || 0 ,
                right  : parseInt ( $el.css ( "padding-right" ) , 10 ) || 0
            }
        } ,
        _fnGetMargins        : function ( $el ) {
            return {
                top    : parseInt ( $el.css ( "margin-top" ) , 10 ) || 0 ,
                left   : parseInt ( $el.css ( "margin-left" ) , 10 ) || 0 ,
                bottom : parseInt ( $el.css ( "margin-bottom" ) , 10 ) || 0 ,
                right  : parseInt ( $el.css ( "margin-right" ) , 10 ) || 0
            }
        }

        /**
         *  自定义刷新方法
         * @param query object 自定义参数
         */
        , refresh : function ( query ) {
            query = !$.isEmptyObject ( query ) ? query : { offset : 0 };
            this.$el.bootstrapTable ( 'refresh' , { query : query } );
        }

        /**
         * 调用 bootstrap table 组件的各种方法 参数请参考 bootstrap table 文档
         * @returns {*}
         */
        , method : function () {
            var fnName = [].shift.call ( arguments , 0 );
            return $.fn.bootstrapTable.Constructor.prototype[fnName].apply ( this.$el.data ( 'bootstrap.table' ) , arguments );
        }
    }
    ;

} ) );