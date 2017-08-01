define ( ['jquery' , 'jqLaytpl'] , function ( $ , l ) {
    
    var Base = Class ( {
        init      : function () {
            
        }
        , tplList : {
            //列
            colum : {
                base : ''
                + '<div class="ne-builder-sort-wrap clearfix js-sort" id="{{d.rowId}}">'
                // + '     <div title="复制一份" class="ne-builder-sort-btn dec-add"><i class="fa fa-plus"></i></div>'
                + '     <div title="删除" class="ne-builder-sort-btn dec-remove " style="top: 0;" data-on="delItem"><i class="fa fa-remove"></i></div>'
                + '     <div title="拖动改变排序" class="ne-builder-sort-btn dec-sort  js-sort-btn_drag" style="top: 25px;"> <i class="fa fa-reorder"></i></div>'
                
                + '<ul class="ne-builder-valid jc-builder-valid">'
                
                + '</ul>'
                + '{{# for(var i=0,l=d.colId.length;i<l;i++){'
                + '  var cId = d.colId[i], clas = "col-" + l;'
                + ' }}'
                + '     <div class="ne-builder-sort-content  {{clas}} jc-drop-item js-sort-content" id="{{cId}}">'
                
                //+ '        <div title="删除" class="ne-builder-sort-btn dec-remove dec-drop jc-show-btn_remove"><i class="fa fa-remove"></i></div>'
                + '         <div class="jc-drop-item-show"></div>'
                + '     </div>'
                + '{{# } }}'
                + '</div>'
            }
            
            , control    : {
                base           : function ( data ) {
                    
                    return ''
                        + '<div class="jc-drag-item dec-in-f jc-in-f ui-draggable" data-on="item" data-wrap="{{d.wrap}}" style="padding: 10px 35px 10px 10px; overflow: hidden;">'
                        + this.tplList.control.item.call ( this , data )
                        + '</div>';
                }
                , item         : function ( data ) {
                     
                    return ''
                        + '     <label class="control-label" style="min-width: 20px;">'
                        + '          <span class="ne-form-require jc-ctl-required" style="font-size: 18px;font-weight: 400;"><i class="text-danger f16">*</i><span>Q{{d.qId}}</span></span>'
                        + '          <span class="jc-ctl-label">{{d.label}}</span>'
                        + '     </label>'
                        + '     <div class="jc-ctl-area dec-ofh question-box" style="position: relative;padding: 5px 0 5px 10px;" >'
                        
                        + this.tpl ( { name : data.type + '.tpl.base' , data : data } )
                        
                        + '<div style="position: absolute;top: 0;right: 0;bottom: 0;left: 0;opacity: 0; z-index: 3;background: #fff;"></div>'
                        + '     </div>';
                }
                ,
                collect        : function ( data ) {
                    return ''
                        + '<div class="jc-drag-item dec-in-f jc-in-f ui-draggable" data-on="item" data-wrap="{{d.wrap}}" style="padding: 10px 35px 10px 10px; overflow: hidden;">'
                        + this.tplList.control.collect_item.call ( this , data )
                        + '</div>'
                        +'<div style="border-bottom: 1px dashed  #e8e8e8;"></div>';
                }
                , collect_item : function ( data ) {
                    data.collect = true;
                     
                    
                    
                    return ''
                        + '     <label class="control-label" style="min-width: 20px;">'
                        + '          <span class="ne-form-require jc-ctl-required" style="font-size: 18px;font-weight: 400;"><i class="text-danger f16">*</i><span>Q{{d.qId}}</span></span>'
                        + '          <span class="jc-ctl-label">{{d.label}}</span>'
                        + '     </label>'
                        + '<div  class="collect-valid-msg dn jc-msg">此道题必须回答喔！</div>'
                        + '     <div class="jc-ctl-area dec-ofh question-box" style="position: relative;padding: 5px 0 5px 10px;" >'
                        
                        + this.tpl ( { name : data.type + '.tpl.base' , data : data } )
                        
                        + '     </div>';
                    
                }
                
            }
            , attributes : {
                
                option : ''
                + '{{# var  checked = d.item.checked?"checked":"",  ctype = d.type === "checkbox" ? "checkbox" : "radio",isShow=!d.index?\'style="display:none;"\':"" }}'
                + ' <li>'
                //     + '     <div class=" dec-part dec-check ">'
                //   + '         <input  name="checked"  value="{{d.item.value}}" type="{{ctype}}"  data-on="options"   data-type="{{d.type}}"  {{checked}} />'
                //     + '     </div>'
                + '     <div class=" dec-part dec-text" >'
                + '             <input class="form-control" name="text" type="text" data-on="options"  value="{{d.item.text}}"   data-type="{{d.type}}"   />'
                + '     </div>'
                + '     <div class="btn-group btn-group-xs">'
                //   + '         <a class="btn  btn-primary"><i class="fa fa-plus"></i></a>'
                + '         <a class="btn btn-danger  " data-btn="delOption"  {{isShow}}  ><i class="fa fa fa-minus"></i></a>'
                + '         <a class="btn btn-white js-sort-btn_drag " ><i class="fa fa-reorder"></i></a>'
                + '     </div>'
                + ' </li>'
                
                , options : function ( data ) {
                    var tpl = '';
                    for ( var i = 0 , l = data.options.length; i < l; i++ ) {
                        var o = data.options[i];
                        tpl += this.tpl ( {
                            name : 'attributes.option' , data : { item : o , type : data.type , index : i }
                        } );
                    }
                    return tpl;
                    
                }
            }
        }
        
        ,
        tpl : function ( option ) {
            
            return l ( this.data ( option ) ).render ( option.data );
        }
        
        ,
        data : function ( option ) {
            var that = this;
            
            function set () {
                that.tplList = $.extend ( true , that.tplList , option );
            }
            
            function get ( opt ) {
                //get
                var patterns = { key : /[a-z0-9_]+|(?=\[\])/gi };
                var keys = opt.name.match ( patterns.key ) , k;
                var data = that.tplList;
                while ( (k = keys.shift ()) !== undefined && k.length ) {
                    data = typeof (data[k]) === 'function' ? data[k].call ( that , opt.data ) : data[k];
                }
                return data;
            }
            
            if ( typeof(option) === 'string' ) {
                return get ( { name : option , data : {} } );
            }
            if ( typeof(option) === 'object' ) {
                //set
                if ( !option.name && !option.data ) {
                    set ();
                    return;
                }
                return get ( option );
            }
            
        }
    } );
    
    return Base;
    
} )
;

