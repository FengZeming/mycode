define ( function ( require ) {
    'use strict';
    
    require ( 'jquery' );
    require ( 'jqEHook' );
    require ( 'jqUI' );
    require ( 'jqICheck' );
    require ( 'jqJsonForm' );
    require ( 'jqSpinner' );
    require ( 'jqLayer' );

    var _ = require ( 'lodash' );
    
    var Base = require ( './control_base' );
    var Common = require ( './control_common' );
    
    var custom = {};
    
    //组件对象
    custom.controls = {
        base     : new Base ()
        , common : new Common ()
    };
    
    //属性事件
    custom.attributesEvents = require ( './attribute_base' );
    
    //表单jq元素
    custom.$doms = {
        //右侧属性区域
        $right : $ ( '#js_right' )
        
        , $options : $ ( '#js_attr_option' )
        
        , $dropList : $ ( '#js_drop_wrap' )
        //
        , $btn      : {
            $save : $ ( '#js_btn_save' )
        }
    };
    
    //表单设置
    custom.setting = (function () {
        //行总数缓存
        var _rowNum = 0;
        //列对象缓存
        var _colums = {
            form : _.cloneDeep ( custom.controls.common.data ( 'form.data' ) )
        };

        //当前输入值缓存
        var _equalTo = {};
        
        var _$oldDrag = { length : 0 };
        
        //当前行列缓存对象
        var _currentIDObj = {};

        var _tools = {
            
            //输入值缓存
            
            /**
             * 设置输入值相同缓存
             * @param key
             * @param json
             */
            setEqualTo : function ( key , json ) {
                if ( json.type === 'text' ) {
                    _equalTo[key] = json;
                }
            }
            
            /**
             * 获取输入值相同缓存
             * @param key
             * @returns {{}}
             */
            , getEqualTo : function ( key ) {
                return !key ? _equalTo : _equalTo[key];
            }
            
            /**
             * 删除输入值相同缓存
             * @param key
             * @param json
             */
            , unSetEqualTo : function ( key , json ) {
                if ( json.type === 'text' ) {
                    _.unset ( _equalTo , key );
                }
            }
            
            /**
             * 过滤输入值相同缓存
             * @param json
             * @returns {Array}
             */
            , filterEqualTo : function ( json ) {
                
                return _.filter ( this.getEqualTo () , function ( o , k ) {
                    return !_.isEqual ( k , json.wrap );
                } );
                
            }
            
            //列对象缓存
            
            /**
             * 设置列对象缓存
             * @param key
             * @param json
             */
            , setColums : function ( key , json ) {
                return _.set ( _colums , key , json );
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
            , replaceColums : function ( json ) {
                _.assignIn ( _colums , json );
            }



            /**
             * 获取列对象缓存
             * @param key
             * @returns {*}
             */
            , getColums : function ( key ) {
                return !key ? _colums : _.get ( _colums , key );
            }
            
            //获取拖拽组件数据与模版
            
            /**
             * 获取列模版json对象
             * @param inId
             * @param outId
             * @returns {*}
             */
            , getColumJson : function ( inId , outId ) {

                var json = _.cloneDeep ( custom.controls[inId[1]].data ( inId[2] + '.data' ) );
                var qId = (outId.split ( '_' )[2] | 0) + 1;
                json = _.assignIn ( json , { name : outId + '_' + json.type , wrap : outId , qId : qId } );
                //缓存
                this.setColums ( outId , json );
                this.setEqualTo ( outId , json );
                
                return json;
                
            }

            /**
             * 克隆列缓存
             * @param inId
             * @param outId
             */
            , cloneColumJson : function ( inId , outId ) {
                var cache = _.cloneDeep ( this.getColums ( inId ) );
                return _.isEmpty ( cache ) ? cache : _.assignIn ( cache , {
                    name : outId + '_' + cache.type , wrap : outId , qId : (outId.split ( '_' )[2] | 0) + 1
                } );

            }

            /**
             *设置当前id对象
             */
            , setCurrentIDObj : function ( colNum ) {
                _currentIDObj.rowId = this.createRowId ();
                _currentIDObj.colId = this.createColumId ( colNum );
            }
            , getCurrentIDObj : function () {
                return _currentIDObj;
            }


            /**
             * 获取列模版
             * @param colNum
             * @returns {*}
             */
            , getColumTpl : function ( colNum ) {
                this.setCurrentIDObj ( colNum );
                var iDobj = this.getCurrentIDObj ();

                return custom.controls.base.tpl ( {
                    name : 'colum.base' , data : { rowId : iDobj.rowId , colId : iDobj.colId }
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
            
            ,
            
            /**
             * 生成行id
             * @returns {string}
             */
            createRowId : function () {
                var s = 'js_row_' + _rowNum;
                return s;
            }
            
            /**
             * 生成列id
             * @param colNum
             * @returns {Array}
             */
            , createColumId : function ( colNum ) {
                
                var arry = [];
                for ( var i = 0; i < colNum; i++ ) {
                    var id = 'js_col_' + _rowNum + '_' + colNum + '_' + i;
                    arry.push ( id );
                    //每列初始化对象
                    this.setColums ( id , {} );
                }
                _rowNum++;
                return arry;
                
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
            
        };
        
        return {

            /**
             * 验证 抖动
             *  element : 元素
             *  time :  时间
             *  distance: 距离
             *  before:之前回调
             *  after: 之后回调
             */
            validation : function ( option ) {

                var e = option.element ,
                    time = option.time || 500 ,
                    distance = option.distance || 5;
                var originalStyle = e.style.cssText;
                e.style.position = "relative";

                option.before && option.before.call ( e );

                setTimeout ( function () {
                    //开始时间
                    var start = (new Date ()).getTime ();
                    animate ();
                    function animate () {
                        var now = (new Date ()).getTime ();
                        var elapsed = now - start;
                        var fraction = elapsed / time;
                        if ( fraction < 1 ) {
                            var x = distance * Math.sin ( fraction * 15 * Math.PI );
                            e.style.left = x + "px";
                            setTimeout ( animate , Math.min ( 25 , time - elapsed ) );
                        } else {
                            e.style.cssText = originalStyle;
                            //执行完毕回调函数
                            option.after && option.after.call ( e );
                        }
                    }

                } , 0 );
            
                return 
            
            }()
            ,

            //获取组件模版
            getDragTpl : function ( inId , outId ) {
                return _tools.getDragTpl ( inId , outId );
            }
            
            //获取列模版
            , getColumTpl : function ( colNum ) {
                return _tools.getColumTpl ( colNum );
            }
            
            //设置当前缓存的组件
            , setOldDrag : function ( $wrap ) {
                _$oldDrag = $wrap || { length : 0 };
            }
            
            //获取当前缓存的组件
            , getOldDrag : function () {
                return _$oldDrag;
            }

            /**
             * 获取列缓存
             * @param key
             * @returns {*}
             */
            , getColums   : function ( key ) {
                return _tools.getColums ( key );
            }
            /**
             * 替换新的列缓存
             */
            ,
            replaceColums : function ( json ) {
                _tools.replaceColums ( json );
            }

            /**
             *获取当前的行列ID对象
             */
            , getCurrentIDObj : function () {
                return _tools.getCurrentIDObj ();
            }


            /**
             * 设置列缓存属性数据
             * @param key
             * @param value
             */
            , setColumsAttribute : function ( key , value ) {
                var key = this.getOldDrag ()[0].id + '.' + key.replace ( '"' , '' );
                
                if ( /equalto/g.test ( key ) && !value ) {
                    return _tools.unSetColums ( key );
                    
                }
                return _tools.setColums ( key , value );
            }
            
            
            //控件缓存转换
            , getControlCache : function ( inId , outId ) {
                
                var inCache = _tools.cloneColumJson ( inId , outId );
                var outCache = _tools.cloneColumJson ( outId , inId );
                
                return {
                    
                    in         : function () {
                        _tools.setColums ( inId , outCache );
                        _tools.setEqualTo ( inId , outCache );
                    }
                    , out      : function () {
                        _tools.setColums ( outId , inCache );
                        _tools.setEqualTo ( outId , inCache );
                    }
                    , inEmpty  : function () {
                        _tools.setColums ( inId , {} );
                        _tools.unSetEqualTo ( inId , inCache );
                    }
                    , outEmpty : function () {
                        _tools.setColums ( outId , {} );
                        _tools.unSetEqualTo ( outId , outCache );
                        
                    }
                };
                
            }

            /**
             * 克隆列缓存
             * @param inId
             * @param outId
             */
            ,
            cloneColumJson : function ( inId , outId ) {
                return _tools.cloneColumJson ( inId , outId );
            }
            
            , onAttributeEvent : function ( fn , eInput ) {
                var oldId = this.getOldDrag ()[0].id;
                var json = _tools.getColums ( oldId );
                custom.attributesEvents[fn].call ( this.getOldDrag () , json , eInput );
            }

            //显示右侧属性设置表单
            , showAttributes : function () {
                
                //获取当前组件的json对象
                var oldId = this.getOldDrag ()[0].id;
                var json = _tools.getColums ( oldId || 'form' );
                var tpl = '';
                //动态显示属性
                $ ( '.jc-attr' ).hide ();

                _tools.getControlData ( json.col , json.type + '.attrs' ).forEach ( function ( n ) {
                    $ ( '.jc-' + n ).show ();
                } );
                
                //根据json填充属性表单
                custom.$doms.$right.jsonForm ( 'setData' , json );
                
                //radio checkbox select options
                if ( !_.isUndefined ( json.options ) ) {
                    
                    tpl = _tools.getControlTpl ( json.col , { name : 'attributes.options' , data : json } );
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

            , editOptions : function ( json ) {
                var $oldDrag = this.getOldDrag ();
                $oldDrag.find ( '.jc-drag-item' ).html ( _tools.getControlTpl ( json.col , {
                    name : 'control.item' , data : json
                } ) );
            }


            /**
             * 交换options位置
             * @param first
             * @param second
             */
            
            , swapOptions : function ( first , second ) {
                
                var $oldDrag = this.getOldDrag ();
                var oldId = $oldDrag[0].id;
                var json = _tools.getColums ( oldId );
                
                var oFirst = json.options[first];
                json.options.splice ( first , 1 );
                json.options.splice ( second , 0 , oFirst );
                
                //
                $oldDrag.find ( '.jc-drag-item' ).html ( _tools.getControlTpl ( json.col , {
                    name : 'control.item' , data : json
                } ) );
                
                return json;
            }

            /**
             * 删除option选项
             * @param index
             */
            , delOption : function ( index ) {
                var $oldDrag = this.getOldDrag ();
                var key = this.getOldDrag ()[0].id;
                var json = _tools.getColums ( key );
                _.pullAt ( json.options , index );
                $oldDrag.find ( '.jc-drag-item' ).html ( _tools.getControlTpl ( json.col , {
                    name : 'control.item' , data : json
                } ) );
                
            }

            /**
             * 添加option选项
             */
            , addOption : function () {

                var $oldDrag = this.getOldDrag ();
                var key = this.getOldDrag ()[0].id;
                var json = _tools.getColums ( key );
                var l = json.options.length;

                var item = { text : '选项' + (l + 1) , value : l , checked : false };
                json.options.push ( item );

                var tpl = _tools.getControlTpl ( json.col , {
                    name : 'attributes.option' , data : { item : item , type : json.type , index : l }
                } );

                $oldDrag.find ( '.jc-drag-item' ).html ( _tools.getControlTpl ( json.col , {
                    name : 'control.item' , data : json
                } ) );
                custom.$doms.$options.append ( tpl ).iCheck ( {
                    checkboxClass : 'icheckbox-ne-info' ,
                    radioClass    : 'iradio-ne-info'
                    , insert      : '<i class="icon"></i>'
                } );

            }
        }
        
    }) ();
    
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

                            this.id = 'js_row_' + i;

                            //修改列id
                            $itemList.each ( function () {

                                var inId = this.id;
                                var aIds = inId.split ( '_' );
                                aIds[2] = i + sidx;
                                var outId = aIds.join ( '_' );
                                //
                                this.id = outId;
                                tColumsJson[outId] = custom.setting.cloneColumJson ( inId , outId );

                                //修改组件data-warp
                                var $wrap = $ ( '[data-wrap]' , this );
                                if ( $wrap.length ) {
                                    $.data ( $wrap[0] , 'wrap' , outId );
                                    $wrap.find ( '.jc-ctl-required span' ).html ( 'Q' + ((outId.split ( '_' )[2] | 0) + 1) );
                                }
                            } );
                        } );

                        //重新设置列缓存
                        custom.setting.replaceColums ( tColumsJson );
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
                            custom.setting.swapOptions ( startIndex , stStopIndex );
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
    
    //表单事件
    
    custom.events = {
        
        save : function () {

            var array = [];

            var colums = custom.setting.getColums ();

            // console.log(_.values(colums));

            for ( var key in  colums ) {
                var colum = colums[key];

                var valid = { id : colum.wrap , msglist : [] };
                //

                if ( typeof(colum.value) !== 'undefined' && !(colum.value + '').replace ( /\s+/g , '' ).length ) {
                    valid.msglist.push ( '<li class="jc-col-valid-value"> 默认值不能为空！</li>' );
                }
                //

                if ( colum.options ) {
                    var options = colum.options;

                    for ( var i = 0 , l = options.length; i < l; i++ ) {
                        var option = options[i];

                        if ( !option.text.replace ( /\s+/g , '' ).length ) {
                            valid.msglist.push ( '<li class="jc-col-valid-option">选项值不能为空！</li>' );
                            break;
                        }

                    }
                }

                //

                if ( typeof(colum.label) !== 'undefined' && !colum.label.replace ( /\s+/g , '' ).length ) {
                    valid.msglist.push ( '<li class="jc-col-valid-label">标题不能为空！</li>' );
                }
                if ( !valid.msglist.length ) {
                    continue;
                }

                $ ( '#' + valid.id ).prev ().hide ();

                valid.msglist = valid.msglist.join ( '' );
                array.push ( valid );

            }

            //
            for ( var i = 0 , l = array.length; i < l; i++ ) {
                var o = array[i];
                $ ( '#' + o.id ).data ( 'one' , false );
                $ ( '#' + o.id ).prev ().html ( o.msglist ).show ();
            }

            if ( array.length ) {

                var parent = $ ( '#' + array[0].id ).parents ( '.js-sort' );

                var top = parent.position ();
                console.log ( top );

                var h = custom.$doms.$dropList.height ();
                console.log ( h );
                var dslk = $ ( '#js_ctontent' ).scrollTop ();
                console.log ( dslk );
                var stc = dslk + top.top;
                console.log ( stc );

                $ ( '#js_ctontent' ).stop ( true , true ).animate ( {
                    scrollTop : stc
                } , 'slow' );

            }

        }

        , control : function () {

            var tpl = custom.setting.getColumTpl ( 1 );
            custom.$doms.$dropList.append ( tpl );
            var idObj = custom.setting.getCurrentIDObj ();

            //拖入元素
            var $in = $ ( this );
            var inId = $in[0].id.split ( '_' );

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

            custom.draging.refresh ();

            $ ( '#js_ctontent' ).stop ( true , true ).animate ( {
                scrollTop : custom.$doms.$dropList.height () + 51
            } , 'slow' );

        }
        ,
        item      : function () {

            var $this = $ ( this ) , wrap = $this.data ( 'wrap' ) , wrapId = '#' + wrap;
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
            custom.setting.showAttributes ();

        }

        ,
        attribute : function () {


            //更新组件缓存
            function set ( self ) {
                custom.setting.setColumsAttribute ( self.name , self.value );
            }

            function text ( self ) {
                var fn = self.id.split ( '_' )[2];

                //执行当前属性方法
                custom.setting.onAttributeEvent ( fn , self );

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

        ,
        options      : function () {

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

            custom.setting.setColumsAttribute ( execute.key , execute.value );
            custom.setting.onAttributeEvent ( execute.fn , json );
        }
        ,
        delOption    : function ( $this ) {
            var $parent = $this.parents ( 'li' ) , index = $parent.index ();
            custom.setting.delOption ( index );
            $parent.remove ();
        }
        ,
        addOption    : function () {

            custom.setting.addOption ();
        }
        , editOption : function () {

            var oldId = custom.setting.getOldDrag ()[0].id;
            var json = custom.setting.getColums ( oldId );
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

                    var $oldDrag = custom.setting.getOldDrag ();
                    var key = custom.setting.getOldDrag ()[0].id;
                    var json = custom.setting.getColums ( key );

                    var items = [];
                    for ( var i = 0 , l = options.length; i < l; i++ ) {
                        items.push ( { text : options[i] , value : i , checked : false } );
                    }
                    json.options = items;
                    custom.setting.showAttributes ();

                    custom.setting.editOptions ( json );

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
        var that = custom;

        var _fnEvent = function ( e , name ) {
            e.preventDefault ();
            e.stopPropagation ();
            that.events[$ ( this ).data ( name )].call ( this , e );
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
                    that.setting.setColumsAttribute ( this.name , newVal );
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

    custom.init = function () {
        this.draging.init ();
        this.on.init ();

        $ ( 'input' , this.$doms.$right ).iCheck ( {
            checkboxClass : 'icheckbox-ne-info' ,
            radioClass    : 'iradio-ne-info'
            , insert      : '<i class="icon"></i>'
        } );

    };

    return function ( config ) {
        custom.config = $.extend ( custom.config , config );
        custom.init ();

    }
    
} );