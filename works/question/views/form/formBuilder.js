define ( [
    'jquery' ,
    'lodash' ,
    './control_base' ,
    './control_common' ,
    './attribute_base' ,
    './tpl_collect' ,
    'jqEHook' ,
    'jqUI' ,
    'jqICheck' ,
    'jqJsonForm' ,
    'jqSpinner' ,
    'jqLayer'
] , function ( $ , _ , Base , Common , attrEvent , tpl_collect ) {

    var custom = {};

    var defaults = {
        data     : null , //数据
        controls : null , //组件
        saveBack : function ( data ) { //保存回调
        }
    };
    //配置
    custom.config = {};

    //组件对象
    custom.controls = {
        base     : new Base ()
        , common : new Common ()
    };

    //表单jq元素
    custom.$doms = {
        //右侧属性区域
        $right      : $ ( '#js_right' )
        , $options  : $ ( '#js_attr_option' )
        , $dropMain : $ ( '#js_drop_main' )
        , $dropList : $ ( '#js_drop_wrap' )
        , $btn      : {
            $save : $ ( '#js_btn_save' )
        }
        , $content  : $ ( '#js_ctontent' )

    };

    //表单设置
    custom.setting = (function () {
        //行总数缓存
        var _rowNum = 0;
        //列对象缓存
        var _colums = {
            form : _.cloneDeep ( custom.controls.common.data ( 'form.data' ) )
        };

        //当前问题jq对象缓存
        var _$oldDrag = { length : 0 };

        //当前行列缓存对象
        var _currentRowIDObj = {};

        return {

            /**
             * 生成行id
             * @returns {string}
             */
            createRowId : function ( index ) {
                return 'js_row_' + (index || _rowNum);

            }

            /**
             * 生成列id
             * @param colNum
             * @returns {Array}
             */
            , createColumId : function ( colNum ) {

                var arry = [];
                for ( var i = 0; i < colNum; i++ ) {
                    var id = this.createColumsID ( _rowNum , colNum , i );
                    arry.push ( id );
                    //每列初始化对象
                    this.setColums ( id , {} );
                }
                this.updateRowNum ( 1 );
                return arry;

            }
            /**
             * 修改当前总行数
             */
            ,
            updateRowNum    : function ( num ) {
                _rowNum = _rowNum + num;

            }



            ,
            /**
             * 获取列ID
             * @param row     行索引
             * @param colums  总列数
             * @param index   第几列
             * @returns {string}
             */
            createColumsID         : function ( row , colums , index ) {
                return 'js_col_' + row + '_' + (colums || 1) + '_' + (index || 0);
            } ,
            /**
             * 修改列ID
             * @param id
             * @param row
             */
            updateColumsID         : function ( id , row ) {
                var newId = id.split ( '_' );
                newId[2] = row;
                return newId.join ( '_' );

            } ,
            /**
             * 获取列ID
             * @param obj
             */
            getColumsIDForJquery   : function ( $obj ) {
                return $obj[0].id;
            }
            /**
             * 通过列ID 获取行索引
             * @param id
             * @returns {number}
             */
            ,
            getRowIndexForColumsID : function ( id ) {
                return id.split ( '_' )[2] | 0;
            }

            ,
            /**
             * 设置列对象缓存
             * @param key
             * @param json
             */
            setColums : function ( key , json ) {
                return _.set ( _colums , key , json );
            }


            /**
             * 获取列对象缓存
             * @param key
             * @returns {*}
             */
            , getColums : function ( key ) {
                return !key ? _colums : _.get ( _colums , key );
            }

            /**
             * 删除列对象属性
             * @param key
             */
            , unSetColums : function ( key ) {
                return _.unset ( _colums , key );
            }

            /**
             * 替换新的列对象缓存
             * @param json
             */
            , extendColums : function ( json , colums ) {
                return _.assignIn ( colums || _colums , json );
            }

            /**
             * 重置列对象缓存
             * @param json
             * @param index
             */
            , resetColums   : function ( json , index ) {

                var newColums = { form : _colums.form };

                for ( var i = 0; i < index; i++ ) {
                    var id = this.createColumsID ( i );
                    newColums[id] = _colums[id];
                }
                this.extendColums ( json , newColums );
                this.refreshColums ( newColums );
            }
            /**
             * 刷新列对象缓存
             * @param colums
             */
            , refreshColums : function ( colums ) {
                _colums = colums;
            }

            /**
             * 获取列模版json对象
             * @param inId
             * @param outId
             * @returns {*}
             */
            , getColumJson : function ( inId , outId ) {
                var json = _.cloneDeep ( custom.controls[inId[1]].data ( inId[2] + '.data' ) );
                var qId = this.getRowIndexForColumsID ( outId ) + 1;
                this.extendColums ( { name : outId + '_' + json.type , wrap : outId , qId : qId } , json );
                //缓存
                this.setColums ( outId , json );
                return json;
            }
            ,

            /**
             * 克隆列缓存
             * @param inId
             * @param outId
             */
            cloneColumJson : function ( inId , outId ) {
                var cache = _.cloneDeep ( this.getColums ( inId ) );
                return _.isEmpty ( cache ) ? cache : this.extendColums ( {
                    name : outId + '_' + cache.type , wrap : outId , qId : this.getRowIndexForColumsID ( outId ) + 1
                } , cache );

            }

            /**
             *设置当前id对象
             */
            , setCurrentIDObj : function ( colNum ) {
                _currentRowIDObj.rowId = this.createRowId ();
                _currentRowIDObj.colId = this.createColumId ( colNum );
            }

            /**
             * 获取当前ID对象
             * @returns {{}}
             */
            , getCurrentIDObj : function () {
                return _currentRowIDObj;
            }

            /**
             * 获取列模版
             * @param colNum
             * @returns {*}
             */
            , getColumTpl : function ( colNum ) {
                this.setCurrentIDObj ( colNum );
                var oIDs = this.getCurrentIDObj ();
                return custom.controls.base.tpl ( {
                    name : 'colum.base' , data : { rowId : oIDs.rowId , colId : oIDs.colId }
                } );
            }

            /**
             * 获取拖拽组件的实际模版
             * @param inId
             * @param outId
             * @returns {*}
             */
            , getDragTpl : function ( inId , outId ) {
                var json = this.getColumJson ( inId , outId );
                return custom.controls[inId[1]].tpl ( { name : 'control.base' , data : json } );
            }

            /**
             * 获取组件数据的方法
             * @param colName
             * @param option
             * @returns {*}
             */
            , getControlData : function ( colName , option ) {
                return custom.controls[colName].data ( option );
            }

            /**
             * 获取组件模版的方法
             * @param colName
             * @param option
             * @returns {*}
             */
            , getControlTpl : function ( colName , option ) {

                return custom.controls[colName].tpl ( option );
            }
            /**
             * 获取当前选中的item
             * @returns {{length: number}}
             */
            , getOldDrag    : function () {
                return _$oldDrag;
            }
            /**
             * 设置当前选中的item
             * @param $wrap
             */
            , setOldDrag    : function ( $wrap ) {
                _$oldDrag = $wrap || { length : 0 };
            }

            /**
             * 获取当前选中item的JSON
             *
             */
            , getOldDragJson : function () {
                var id = this.getColumsIDForJquery ( _$oldDrag );
                return {
                    id   : id ,
                    json : this.getColums ( id )
                };
            }

        };

    }) ();

    //动画
    custom.animate = {

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

    //校验
    custom.valid = {
        check   : function () {
            var $oldDrag = custom.setting.getOldDrag ();
            if ( !$oldDrag.length ) {
                return true;
            }
            var oldDragJson = custom.setting.getOldDragJson ();
            var msg = [];
            var $msg = $ ( '#' + oldDragJson.id ).prev ();
            $msg.hide ();

            //校验默认值
            if ( this.isEmpty ( oldDragJson.json.value ) ) {
                msg.push ( '<li class="jc-col-valid-value"> 默认值不能为空！</li>' );
            }
            //校验options
            if ( oldDragJson.json.options ) {
                for ( var i = 0 , l = oldDragJson.json.options.length; i < l; i++ ) {
                    var option = oldDragJson.json.options[i];
                    if ( this.isEmpty ( option.text ) ) {
                        msg.push ( '<li class="jc-col-valid-option">选项值不能为空！</li>' );
                        break;
                    }

                }
            }
            //校验标题
            if ( this.isEmpty ( oldDragJson.json.label ) ) {
                msg.push ( '<li class="jc-col-valid-label">标题不能为空！</li>' );
            }

            //校验表单名称
            if ( oldDragJson.json.type === 'form' && this.isEmpty ( oldDragJson.json.fname ) ) {
                msg.push ( '<li class="jc-col-valid-label">表单名称不能为空！</li>' );
            }

            if ( !msg.length ) {
                $oldDrag.data ( 'one' , true );
                return true;
            }

            $oldDrag.data ( 'one' , false );
            $msg.html ( msg.join ( '' ) ).show ();

            var nthisPosionTop = $oldDrag.parent ().position ().top;
            var nthisScrollTop = custom.$doms.$content.scrollTop ();

            custom.animate.shake ( {
                element : $msg[0]
            } );
            custom.$doms.$content.stop ( true , true ).animate ( {
                scrollTop : nthisScrollTop + nthisPosionTop
            } , 300 );

            return false;
        } ,
        /**
         * 判断某属性去掉空格的情况下是否为空值
         * @param attribute
         * @returns {boolean}
         */
        isEmpty : function ( attribute ) {
            return typeof(attribute) !== 'undefined' && !(attribute + '').replace ( /\s+/g , '' ).length;
        }

    };

    //表单属性的业务
    custom.other = {

        raty : function () {


            var $oldDrag = custom.setting.getOldDrag ();
            var oldJson = custom.setting.getOldDragJson ();
            var json = oldJson.json;


            $oldDrag.find ( '.jc-drag-item' ).html ( custom.setting.getControlTpl ( json.col , {
                name : 'control.item' , data : json
            } ) );



        }

        /**
         * 设置列缓存属性数据
         * @param key
         * @param value
         */

        , setColumsAttribute : function ( key , value ) {
            var key = custom.setting.getOldDragJson ().id + '.' + key.replace ( '"' , '' );

            if ( /equalto/g.test ( key ) && !value ) {
                return custom.setting.unSetColums ( key );
            }
            return custom.setting.setColums ( key , value );
        }


        /**
         * 控件缓存转换
         * @param inId
         * @param outId
         * @returns {{in: in, out: out, inEmpty: inEmpty, outEmpty: outEmpty}}
         */
        ,
        getControlCache : function ( inId , outId ) {

            var inCache = custom.setting.cloneColumJson ( inId , outId );
            var outCache = custom.setting.cloneColumJson ( outId , inId );

            return {
                in         : function () {
                    custom.setting.setColums ( inId , outCache );
                }
                , out      : function () {
                    custom.setting.setColums ( outId , inCache );
                }
                , inEmpty  : function () {
                    custom.setting.setColums ( inId , {} );
                }
                , outEmpty : function () {
                    custom.setting.setColums ( outId , {} );
                }
            };

        }

        /**
         * 设置属性事件
         * @param fn
         * @param eInput
         */
        ,
        onAttributeEvent : function ( fn , eInput ) {
            var $oldDrag = custom.setting.getOldDrag ();
            var oldJson = custom.setting.getOldDragJson ();
            attrEvent[fn].call ( $oldDrag , oldJson.json , eInput );
        }

        /**
         * 显示右侧属性设置表单
         */
        , showAttributes : function () {

            //获取当前组件的json对象
            var oldDrag = custom.setting.getOldDragJson ();
            var oldId = oldDrag.id;
            var json = oldDrag.json;
            var tpl = '';
            //动态显示属性
            $ ( '.jc-attr' ).hide ();

            custom.setting.getControlData ( json.col , json.type + '.attrs' ).forEach ( function ( n ) {
                $ ( '.jc-' + n ).show ();
            } );

            //根据json填充属性表单
            custom.$doms.$right.jsonForm ( 'setData' , json );

            //radio checkbox select options
            if ( !_.isUndefined ( json.options ) ) {

                tpl = custom.setting.getControlTpl ( json.col , { name : 'attributes.options' , data : json } );
                //
                $ ( '#js_attr_option' ).html ( tpl ).iCheck ( {
                    checkboxClass : 'icheckbox-ne-info' ,
                    radioClass    : 'iradio-ne-info'
                    , insert      : '<i class="icon"></i>'
                } );
            }
            //iCheck update
            $ ( 'input' , custom.$doms.$right ).iCheck ( 'update' );

        }

        /**
         * 修改当前组件的options
         * @param json
         */
        ,
        editOptions : function ( json ) {
            var $oldDrag = custom.setting.getOldDrag ();
            $oldDrag.find ( '.jc-drag-item' ).html ( custom.setting.getControlTpl ( json.col , {
                name : 'control.item' , data : json
            } ) );
        }

        /**
         * 交换options位置
         * @param first
         * @param second
         */

        ,
        swapOptions : function ( first , second ) {

            var $oldDrag = custom.setting.getOldDrag ();
            var oldJson = custom.setting.getOldDragJson ();
            var json = oldJson.json;
            //
            var oFirst = json.options[first];
            json.options.splice ( first , 1 );
            json.options.splice ( second , 0 , oFirst );

            //
            $oldDrag.find ( '.jc-drag-item' ).html ( custom.setting.getControlTpl ( json.col , {
                name : 'control.item' , data : json
            } ) );

            custom.check ();

            return json;
        }
        /**
         * 删除option选项
         * @param index
         */
        ,
        delOption   : function ( index ) {
            var $oldDrag = custom.setting.getOldDrag ();
            var oldJson = custom.setting.getOldDragJson ();
            var json = oldJson.json;
            _.pullAt ( json.options , index );
            $oldDrag.find ( '.jc-drag-item' ).html ( custom.setting.getControlTpl ( json.col , {
                name : 'control.item' , data : json
            } ) );
        }

        /**
         * 添加option选项
         */
        ,
        addOption : function () {

            var $oldDrag = custom.setting.getOldDrag ();
            var oldJson = custom.setting.getOldDragJson ();
            var json = oldJson.json;
            var l = json.options.length;

            var item = { text : '选项' + (l + 1) , value : l , checked : false };
            json.options.push ( item );

            var tpl = custom.setting.getControlTpl ( json.col , {
                name : 'attributes.option' , data : { item : item , type : json.type , index : l }
            } );

            $oldDrag.find ( '.jc-drag-item' ).html ( custom.setting.getControlTpl ( json.col , {
                name : 'control.item' , data : json
            } ) );

            //
            custom.$doms.$options.append ( tpl ).iCheck ( {
                checkboxClass : 'icheckbox-ne-info' ,
                radioClass    : 'iradio-ne-info'
                , insert      : '<i class="icon"></i>'
            } );

        }

    };

    //表单拖拽
    custom.draging = (function () {

        var draging = {

            //排序设置
            sortable : function () {

                var startIndex , stStopIndex;

                custom.$doms.$dropList.sortable ( {
                    appendTo      : 'body'
                    , handle      : '.js-sort-btn_drag'
                    , cancel      : '.js-sort-content'
                    , placeholder : "ui-state-highlight clearfix"
                    , scroll      : true

                    , start : function ( e , ui ) {
                        var $item = ui.item;
                        startIndex = $item.index ();
                        ui.placeholder.height ( $item.outerHeight () );
                        $item.addClass ( 'dec-dim' );

                    }
                    , stop  : function ( e , ui ) {
                        stStopIndex = ui.item.index ();

                        var sidx = startIndex;
                        var eidx = stStopIndex;

                        if ( startIndex > stStopIndex ) {
                            sidx = stStopIndex;
                            eidx = startIndex;
                        }

                        //获取所有行
                        var $sortList = $ ( '.js-sort' , custom.$doms.$dropList ).slice ( sidx , eidx + 1 );
                        //新列缓存
                        var tColumsJson = {};

                        $sortList.each ( function ( i ) {
                            //获取所有列
                            var $itemList = $ ( '.jc-drop-item' , this );

                            this.id = custom.setting.createRowId ( i );

                            //修改列id
                            $itemList.each ( function () {

                                var inId = this.id;
                                var outId = custom.setting.updateColumsID ( inId , i + sidx );
                                //
                                this.id = outId;
                                tColumsJson[outId] = custom.setting.cloneColumJson ( inId , outId );

                                //修改组件data-warp
                                var $wrap = $ ( '[data-wrap]' , this );
                                if ( $wrap.length ) {
                                    $wrap.attr ( 'data-wrap' , outId );
                                    $wrap.find ( '.jc-ctl-required span' ).html ( 'Q' + ( custom.setting.getRowIndexForColumsID ( outId ) + 1) );
                                }
                            } );
                        } );

                        //重新设置列缓存
                        custom.setting.extendColums ( tColumsJson );
                        ui.item.removeClass ( 'dec-dim' );
                    }

                } ).disableSelection ();
            }

            , sortableOptions : function () {

                var startIndex , stStopIndex;

                custom.$doms.$options.sortable ( {
                    appendTo      : 'body'
                    , axis        : "y" ,
                    delay         : 100 ,
                    handler       : ".js-sort-btn_drag"
                    , placeholder : "ui-state-highlight clearfix"
                    , start       : function ( e , ui ) {
                        startIndex = ui.item.index ();
                        ui.placeholder.height ( ui.item.outerHeight () );
                        ui.item.addClass ( 'dec-dim' );
                    } ,
                    stop          : function ( e , ui ) {
                        stStopIndex = ui.item.index ();
                        if ( startIndex != stStopIndex ) {
                            custom.other.swapOptions ( startIndex , stStopIndex );
                        }
                        ui.item.removeClass ( 'dec-dim' );
                        var $btns = custom.$doms.$options.find ( '[data-btn]' );
                        $btns.show ();
                        $btns.eq ( 0 ).hide ();

                    }
                } );

            }
        };

        return {
            init      : function () {
                draging.sortable ();
                draging.sortableOptions ();
            }
            , refresh : function () {
                custom.$doms.$dropList.sortable ( 'refresh' );
            }
        };

    }) ();

    //全部事件
    custom.events = {

        /**
         * 保存按钮
         * @returns {boolean}
         */
        save : function () {
            if ( !custom.valid.check () ) {
                return false;
            }

            layer.confirm ( '是否发布问卷？' , {
                title : '确认发布' ,
                btn   : ['发布' , '取消']
            } , function () {

                var colums = custom.setting.getColums ();

                if ( custom.config.url && custom.config.url.replace ( '/\s+/g' , '' ).length ) {

                    var index = layer.msg ( '发布中...' , {
                        time  : null ,
                        shade : [0.3 , '#000']
                    } );

                    $.ajax ( {
                        url         : custom.config.url ,
                        method      : 'post' ,
                        data        : { data: JSON.stringify ( _.values ( colums ) )} ,
                        contentType : 'application/json; charset=utf-8' ,
                        complete    : function () {
                            layer.close ( index );
                        } ,
                        success     : function ( data , colums ) {
                            custom.config.saveBack ( data , colums );
                        } ,
                        error       : function () {
                            layer.msg ( '发布失败,请稍后再试...' , {
                                time  : 3000 ,
                                shade : [0.3 , '#000']
                            } );
                        }
                    } );

                } else {
                    custom.config.saveBack ( _.values ( colums ) , colums );
                }
            } );
        }

        /**
         * 预览按钮
         */
        , collect : function () {
            if ( !custom.valid.check () ) {
                return false;
            }
            var colums =     _.cloneDeep( custom.setting.getColums ());
            if(_.size(colums)<=1){
                layer.msg('请添加试题！');
                return false;
            }

            var tpl = '';
            _.forEach ( colums , function ( n , key ) {
                if ( key === 'form' ) {return;}
                tpl += custom.controls[n.col].tpl ( { name : 'control.collect' , data : n } )
            } );

            var winname = window.open ( '' , "_blank" , '' );
            winname.document.open ( 'text/html' , 'replace' );
            winname.document.write ( tpl_collect.tpl ( tpl , colums ) );
            winname.document.close ();

        }



        /**
         * 左侧点击加入中间显示区域
         */
        , control : function () {

            if ( !custom.valid.check () ) {
                return;
            }

            var tpl = custom.setting.getColumTpl ( 1 );
            custom.$doms.$dropList.append ( tpl );
            var idObj = custom.setting.getCurrentIDObj ();

            //拖入元素
            var $in = $ ( this );
            var inId = custom.setting.getColumsIDForJquery ( $in ).split ( '_' );

            //拖出(本身)元素
            var $outWrap = $ ( '#' + idObj.colId[0] );
            var outId = idObj.colId[0];
            var $outDelBtn = $outWrap.find ( '.jc-show-btn_remove' );
            var $outWrapShow = $outWrap.find ( '.jc-drop-item-show' );
            //菜单
            if ( $in.hasClass ( 'jc-in-m' ) ) {
                //将对应的json放到缓存中
                var $conTrol = $ ( custom.setting.getDragTpl ( inId , outId ) );
                //
                $outDelBtn.addClass ( 'dec-show' );
                $outWrap.removeClass ( 'dec-hover' );
                $outWrapShow.empty ().append ( $conTrol );
                $conTrol.trigger ( 'click.content' );
            }
            custom.check ();

            custom.draging.refresh ();

            custom.$doms.$content.stop ( true , true ).animate ( {
                scrollTop : custom.$doms.$content[0].scrollHeight
            } , 'slow' );

        }

        /**
         * 点击item
         */

        , item : function () {

            if ( !custom.valid.check () ) {
                return;
            }
            var $this = $ ( this ) , wrap = $this.attr ( 'data-wrap' ) , wrapId = '#' + wrap;
            var $wrap = $ ( wrapId );
            var $oldDrag = custom.setting.getOldDrag ();
            if ( $wrap.hasClass ( 'dec-active' ) ) {
                return;
            }
            if ( $oldDrag.length ) {
                $oldDrag.removeClass ( 'dec-active' );

            }

            $wrap.addClass ( 'dec-active' );
            custom.setting.setOldDrag ( $wrap );
            custom.other.showAttributes ();
        }

        /**
         * 删除item
         */
        , delItem : function () {

            var $item = $ ( this ).siblings ( '.jc-drop-item' );

            var $sortList = $ ( this ).parent ().nextAll ();
            var index = custom.setting.getRowIndexForColumsID ( custom.setting.getColumsIDForJquery ( $item ) );
            var lindex = index;

            var tColumsJson = {};

            if ( custom.setting.getOldDrag ().length ) {
                custom.setting.getOldDrag ().removeClass ( 'dec-active' );
            }

            custom.setting.setOldDrag ();
            
            $ ( '.jc-attr' ).hide ();
            $ ( '.jc-message' ).show ();
            
            $item.parent ().slideUp ( 300 , function () {

                $item.parent ().remove ();

                $sortList.each ( function ( i ) {
                    //获取所有列
                    var $itemList = $ ( '.jc-drop-item' , this );

                    this.id = custom.setting.createRowId ( index );

                    //修改列id
                    $itemList.each ( function () {

                        var inId = this.id;
                        var outId = custom.setting.updateColumsID ( inId , index );
                        //
                        this.id = outId;
                        tColumsJson[outId] = custom.setting.cloneColumJson ( inId , outId );

                        //修改组件data-warp
                        var $wrap = $ ( '[data-wrap]' , this );
                        if ( $wrap.length ) {
                            $wrap.attr ( 'data-wrap' , outId );
                            $wrap.find ( '.jc-ctl-required span' ).html ( 'Q' + (custom.setting.getRowIndexForColumsID ( outId ) + 1) );
                        }
                    } );
                    index++;
                } );

                //重新设置列缓存

                custom.setting.resetColums ( tColumsJson , lindex );

                custom.setting.updateRowNum ( -1 );

            } );

        }

        /**
         * 执行当前属性方法
         */
        ,
        attribute : function () {



            //更新组件缓存
            function set ( self ) {
                custom.other.setColumsAttribute ( self.name , self.value );
            }

            function text ( self ) {

                var fn = self.id.split ( '_' )[2];
                //执行当前属性方法
                custom.other.onAttributeEvent ( fn , self );
                set ( self );
            };

            switch ( this.tagName.toUpperCase () ) {
                case "INPUT":
                    if ( !this.type && this.type === 'file' ) {
                        return;
                    }
                    switch ( this.type.toUpperCase () ) {
                        case "TEXT":
                            text ( this );
                            break;
                    }
                    break;
                case "SELECT":
                    set ( this );
                    break;
                case "TEXTAREA":
                    text ( this );
                    break;
            }

        }

        /**
         * 选择项方法
         */
        ,
        options : function () {

            var json = {
                    type      : $ ( this ).data ( 'type' )
                    , checked : this.checked
                    , text    : this.value
                    , index   : $ ( this ).parents ( 'li' ).index ()
                }
                ;
            var execute = {
                key     : 'options[' + json.index + ']' + this.name
                ,
                fn      : 'options' + this.name.charAt ( 0 ).toUpperCase () + this.name.slice ( 1 , this.name.length )
                , value : json[this.name]
            }

            custom.other.setColumsAttribute ( execute.key , execute.value );
            custom.other.onAttributeEvent ( execute.fn , json );
        }

        /**
         * 删除选项
         */
        ,
        delOption : function () {
            var $this = $ ( this );
            var $parent = $this.parents ( 'li' ) , index = $parent.index ();
            custom.other.delOption ( index );
            $parent.remove ();
            custom.check ();
        }

        /**
         * 添加选项
         */
        ,
        addOption : function () {
            custom.other.addOption ();
            custom.check ();
        }

        , editOption : function () {

            var oldJson = custom.setting.getOldDragJson ();

            var json = oldJson.json;

            var val = _.map ( json.options , function ( o ) {
                return o.text;
            } ).join ( '\n' );

            layer.open ( {
                type    : 1 ,
                area    : ['600px' , '400px'] ,
                btn     : ['确定' , '取消']
                , yes   : function ( index , layero ) {
                    var $textarea = layero.find ( '.jc-pop-set' );
                    var options = $textarea.val ().split ( '\n' );

                    var items = [];
                    for ( var i = 0 , l = options.length; i < l; i++ ) {
                        items.push ( { text : options[i] , value : i , checked : false } );
                    }
                    json.options = items;
                    custom.other.showAttributes ();
                    custom.other.editOptions ( json );
                    custom.check ();
                    layer.close ( index );

                } ,
                content : $ ( '#js_pop_bulkedit' ) ,
                success : function ( layero , index ) {
                    var $textarea = layero.find ( '.jc-pop-set' );
                    $textarea.val ( val );
                }
            } );
        }

    };

    custom.on = function ( custom ) {
        var _fnEvent = function ( e , name ) {
            e.preventDefault ();
            e.stopPropagation ();
            custom.events[$ ( this ).data ( name )].call ( this , e );
        };

        var _events = {

            /**
             *  //全局按钮
             */
            global : function () {
                $.hook ( 'global' ).off ( 'click.global' ).on ( 'click.global' , function ( e ) {
                    _fnEvent.call ( this , e , 'on' );
                } );
            }

            /**
             * 中间区域
             */
            ,
            content   : function () {
                $.hook ( 'content' ).off ( 'click.content' ).on ( 'click.content' , '[data-on]' , function ( e ) {
                    _fnEvent.call ( this , e , 'on' );
                } );
            }
            /**
             * 右侧属性
             */
            ,
            attribute : function () {
                $.hook ( 'attribute' ).off ( 'input change propertychange ifChanged' ).on ( 'input change propertychange ifChanged' , '[data-on]' , function ( e ) {
                    _fnEvent.call ( this , e , 'on' );
                } );
            }

            /**
             * 选择项
             */
            , options : function () {
                $.hook ( 'attribute' ).on ( 'click.options' , '[data-btn]' , function ( e ) {
                    _fnEvent.call ( this , e , 'btn' );
                } );
            } ,
            /**
             * 特殊组件
             */
            spinner   : function () {
                $.hook ( 'spinner' ).jqspinner ( 'changing' , function ( e , newVal , oldVal ) {
                    custom.other.setColumsAttribute ( this.name , newVal );
                } );

                //评分组件

                var $max = $ ( '#js_attr_raty_number' );
                var $value = $ ( '#js_attr_raty_score' );



                $max.jqspinner ( 'changing' , function ( e , newVal ) {

                    var data = $value.data ( 'spinner' );
                    var valueVal = $value.find ( 'input' ).val () | 0;


                    data.spinning.max = newVal;
                    data.spinning.options.max = newVal;
                    if ( newVal <  valueVal) {
                        $value.find ( 'input' ).val ( newVal - 0 );
                    }

                    custom.other.setColumsAttribute ( this.name , newVal );

                    custom.other.setColumsAttribute ( 'options[score]' , valueVal );

                    custom.other.raty();


                } );
                $value.jqspinner ( 'changing' , function ( e , newVal ) {

                    var data = $value.data ( 'spinner' );
                    var maxval = $max.find ( 'input' ).val () | 0;
                    data.spinning.max = maxval;
                    data.spinning.options.max = maxval;

                    if ( maxval < newVal ) {
                        $value.find ( 'input' ).val ( maxval - 0 );
                    }
                    custom.other.setColumsAttribute ( 'options[number]' , maxval );
                    custom.other.setColumsAttribute ( this.name , newVal );
                    custom.other.raty();
                } );

            }

        };

        return {

            init    : function () {
                _events.global ();
                _events.content ();
                _events.attribute ();
                _events.options ();
                _events.spinner ();
            }
            ,
            content : function () {
                _events.content ();
            }

        }

    } ( custom );

    custom.insert = function () {

        if ( custom.config.data ) {
            var form = custom.config.data.shift ();

            _ ( custom.config.data ).forEach ( function ( n , i ) {
                var rowId = custom.setting.createRowId ( i );
                var tpl = custom.controls.base.tpl ( {
                    name : 'colum.base' , data : { rowId : rowId , colId : [n.wrap] }
                } );
                tpl = $ ( tpl );
                custom.$doms.$dropList.append ( tpl );
                var item = custom.controls[n.col].tpl ( { name : 'control.base' , data : n } );
                var $outWrapShow = $ ( '#' + n.wrap ).find ( '.jc-drop-item-show' );
                $outWrapShow.append ( item );
                custom.setting.setColums ( n.wrap , n );
            } );

            custom.setting.setColums ( 'form' , form );
            $ ( '#form' ).html ( form.fname );
            custom.setting.updateRowNum ( custom.config.data.length );

        }

    };

    custom.check = function () {
        $ ( 'input' ).iCheck ( {
            checkboxClass : 'icheckbox-ne-info' ,
            radioClass    : 'iradio-ne-info'
            , insert      : '<i class="icon"></i>'
        } );

    };

    custom.init = function () {
        custom.insert ();
        this.draging.init ();
        this.on.init ();
        custom.check ();

        $ ( '#js_loading' ).fadeOut ( 300 , function () {
            $ ( '#js_builder' ).fadeIn ( 300 );
        } );
    };

    /**
     *
     * config:{
     *  controls : // 自定义的其他组件
     *  data : []  默认加载的数据
     *  saveBack: function  点击保存的回调函数
     *  url:''    保存的路径
     * }
     */

    return function ( config ) {
        custom.config = $.extend ( true , defaults , config );
        custom.controls = $.extend ( true , custom.controls , custom.config.controls );
        custom.init ();
    }

} );


