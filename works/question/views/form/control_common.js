define ( ['./control_base'] , function ( Base ) {

    var Common = Class ( Base , {
        init : function () {

            var __options = [
                {
                    value     : 0
                    , text    : '选项1'
                    , checked : false
                } ,
                {
                    value     : 1
                    , text    : '选项2'
                    , checked : false
                }
                , {
                    value     : 2
                    , text    : '选项3'
                    , checked : false
                }
            ];

            var __plugin = {
                upload : {}
            };

            var colType = 'common';

            this.data ( {
                form : {
                    data    : {
                        col     : colType ,
                        type    : 'form'
                        , fname : '问卷名称'
                        , wrap  : 'form'
                    }
                    , attrs : [
                        'fname'
                    ]
                }

                //下拉框组件
                , select : {
                    data    : {
                        col     : colType
                        ,
                        type    : 'select'
                        , label : '选择列表'

                        , valid   : {
                            required : false
                        }
                        , options : __options
                    }
                    , attrs : [
                        'label'

                        , 'hint'
                        , 'boolean'
                        , 'setting'
                        , 'required'
                        , 'visib'
                        , 'hide'
                        , 'option'
                    ]
                    , tpl   : {
                        base : ''
                        + '<select class="form-control input-sm "  name="{{d.name}}"  style="width: auto !important; min-width: 300px;"  >'
                        + '{{# if(d.collect){ }}    '
                        + '<option value=""   >==请选择==</option>'
                        + '{{# } }}'
                        + '{{# for(var i=0,l=d.options.length;i<l;i++){ }}'
                        + '{{# var o = d.options[i], checked = o.checked?"selected":"" }}'

                        + '<option value="{{o.value}}"   {{checked}} >{{o.text}}</option>'
                        + '{{# } }}'
                        + '</select>'
                    }

                }

                //单选组件
                , radio : {
                    data    : {
                        col : colType
                        ,

                        type  : 'radio' ,
                        label : '单选题'

                        , valid   : {
                            required : false

                        }
                        , options : __options
                    }
                    , attrs : [
                        'label'

                        , 'hint'
                        , 'boolean'
                        , 'setting'
                        , 'required'
                        , 'visib'
                        , 'hide'
                        , 'option'
                    ]
                    , tpl   : {
                        base : ''
                        + '     <div class="input-sm" style="padding: 0;height: auto;" >'
                        + '{{# for(var i=0,l=d.options.length;i<l;i++){ }}'
                        + '{{# var o = d.options[i],checked=o.checked?"checked":""; }}'
                        // + '         <div class="radio  radio-info ">'
                        //  + '             <input  type="radio" name="{{d.name}}"  value="{{o.value}}"  disabled  {{checked}}/>'
                        //  + '             <label >{{o.text}}</label>'
                        + '<div style="padding: 2px 0;">'
                        + '<input id="{{d.name+i}}" type="radio" name="{{d.name}}"  value="{{o.value}}" >'
                        + ' <label for="{{d.name+i}}">{{o.text}}</label>'
                        + '</div>'
                        //   + '         </div>'
                        + '{{# } }}'
                        + '     </div>'
                    }

                }

                //多选组件
                , checkbox : {
                    data : {
                        col       : colType
                        ,
                        type      : 'checkbox' ,
                        label     : '多选题'
                        , valid   : {
                            required : false
                        }
                        , options : __options
                    }

                    , attrs : [
                        'label'

                        , 'hint'
                        , 'boolean'
                        , 'setting'
                        , 'required'
                        , 'visib'
                        , 'hide'
                        , 'option'
                    ]

                    , tpl : {
                        base : ''
                        + '     <div class="input-sm" style="padding: 0;height: auto;" >'
                        + '{{# for(var i=0,l=d.options.length;i<l;i++){ }}'
                        + '{{# var o = d.options[i],style =d.cate && d.cate==="line"?"radio-inline":"",checked=o.checked?"checked":""; }}'
                        //  + '         <div class="checkbox {{style}} checkbox-info">'
                        //  + '             <input type="checkbox"  name="{{d.name}}"  value="{{o.value}}"  disabled {{checked}}/>'
                        //   + '             <label >{{o.text}}</label>'
                        //  + '         </div>'
                        + '<div style="padding: 2px 0;">'
                        + '<input id="{{d.name+i}}" type="checkbox" name="{{d.name}}"  value="{{o.value}}" >'
                        + ' <label for="{{d.name+i}}">{{o.text}}</label>'
                        + '</div>'

                        + '{{# } }}'
                        + '     </div>'
                    }

                }


                //数字组件
                , number : {
                    data : {
                        col    : colType
                        , type : 'number' ,
                        label  : '分值题' ,
                        value  : 0 ,
                        valid  : {
                            required : false
                            , min    : 0
                            , max    : 999
                        }
                    }

                    , attrs : [
                        'label'
                        , 'value'
                        , 'hint'
                        , 'boolean'
                        , 'setting'
                        , 'required'
                        , 'visib'
                        , 'hide'
                        , 'scope'
                        , 'min'
                        , 'max'
                    ]
                    , tpl   : {
                        base : ''
                        + '{{# if(d.collect){ }}'
                        + '     分值范围： >{{d.valid.min}}，<={{d.valid.max}}； '
                        + '{{# } }}'
                        + '     <div class="input-group input-group-sm spinner" data-trigger="spinner" >'
                        + '             <input class="form-control text-center jc-ctl-value" type="text"  name="{{d.name}}"   value=" {{# if(!d.collect){ }} {{d.value}} {{# }else{ }}0 {{# } }} "   data-min="{{d.valid.min}}"   data-max="{{d.valid.max}}"  >'
                        + '         <div class="input-group-addon" style="width: auto !important;">'
                        + '             <a href="javascript:;" class="spin-up" data-spin="up"><i class="fa fa-caret-up"></i></a>'
                        + '             <a href="javascript:;" class="spin-down" data-spin="down"><i class="fa fa-caret-down"></i></a>'
                        + '         </div>'
                        + '     </div>'
                    }

                } ,

                //评分组件
                raty : {
                    data    : {
                        col     : colType
                        ,
                        type    : 'raty' ,
                        label   : '评分题'
                        , valid : {
                            required : false
                        } ,
                        options : {
                            number   : 5 ,
                            score : 0
                        }
                    }
                    , attrs : [
                        'label'
                        , 'hint'
                        , 'boolean'
                        , 'setting'
                        , 'required'
                        , 'visib'
                        , 'hide'
                        , 'raty'
                        , 'raty_max'
                        , 'raty_value'

                    ]
                    , tpl   : {
                        base : ''
                        +'{{# if(!d.collect){ }}'
                        + '     <div class="input-sm" style="padding:  0;height: auto;" >'
                        + '{{# for(var i=1;i<=d.options.number;i++){ }}'
                        + '<i class="fa fa-star{{# if(i> d.options.score){ }}'+'-o'+'{{# } }} " style="font-size: 30px;margin-left: 5px;"></i>'
                        + '{{# } }}'
                        + '     </div>'

                       +' {{#   }else{  }}'

                        +' <div class="jc-raty" data-number="{{d.options.number}}"   data-score="{{d.options.score}}" data-name="{{d.name}}"></div>'
                        +'{{# } }}'
                    }
                }

            } );
        }

    } );
    
    return Common;

} );

