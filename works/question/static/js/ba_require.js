(function ( window ) {
    'use strict';
    
    var oRequire = window.Nenu.require ,
        jsPath = 'js/lib' ,
        requirePath = jsPath + '/require/plugin' ,
        
        rModulePath = 'js/module';
    
    var baseUrl = Nenu.CONSTANT.PATH.STATIC;

    oRequire.config = {
        baseUrl : baseUrl ,
        map     : {
            '*' : {
                'css' : requirePath + '/css' ,
                
            }
        } ,
        shim    : {
            bootstrap    : {
                deps   : ['jquery'] ,
                export : 'bootstrap'
            } ,
            jqMetisMenu  : {
                deps   : ['jquery'] ,
                export : 'jqMetisMenu'
            } ,
            jqSlimscroll : {
                deps   : ['jquery'] ,
                export : 'jqSlimscroll'
            } ,
            jqLavalamp   : {
                deps   : ['jquery' , 'jqSEasing'] ,
                export : 'jqLavalamp'
            } ,
            jqSEasing    : {
                deps   : ['jquery'] ,
                export : 'jqSEasing'
            } ,
            jqLayer      : {
                deps   : ['css!jsPath/jquery/plugin/layer/3.0.3/skin/default/layer' , 'jquery'] ,
                export : 'jqLayer'
            }
            ,
            tplDoc       : {
                exports : 'tplDoc'
            } ,
            jqZtree      : {
                deps   : ['jquery'] ,
                export : 'jqZtree'
            } ,
            jqLayout     : {
                deps   : ['jquery'] ,
                export : 'jqLayout'
            } ,
            jqLayoutAnd  : {
                deps   : ['jquery'] ,
                export : 'jqLayoutAnd'
            }
            ,
            jqUI         : {
                deps   : ['jquery'] ,
                export : 'jqUI'
            }
            ,
            jqLaytpl     : {
                export : 'jqLaytpl'
            }
            , jqJsForm   : {
                export : 'jqJsForm'
            }
            , jqICheck   : {
                deps : ['jquery'] ,

                export : 'jqICheck'
            } ,
            jqLayerDate  : {
                exprot : 'jqLayerDate'
            }
            , jqListBox  : {
                exprot : 'jqListBox'
            }
            ,jqRaty:{
                deps : ['jquery'] ,
                exprot : 'jqRaty'
            }
        } ,
        paths   : {
            
            //static
            jsPath      : jsPath ,
            appPath     : '../app' ,
            rModulePath : rModulePath ,
            pagePath    : '../page' ,
            jsonPath    : '../json' ,
            //require
            text        : requirePath + '/text' ,
            json        : requirePath + '/json' ,
            image       : requirePath + '/image' ,
            font        : requirePath + '/fonts' ,
            domReady    : requirePath + '/ready' ,
            
            //lib
           // jquery    : jsPath + '/jquery/2.1.4/jquery.min' ,
            jquery   : jsPath + '/jquery/1.11.1/jquery.min' ,
            bootstrap : jsPath + '/bootstrap/3.3.6/js/bootstrap.min' ,
            lodash    : jsPath + '/lodash/4.17.3/lodash.core.min' ,
            
            //jquery plugin
            jqDualListTable         : jsPath + '/jquery/custom/dualListTable/jquery,dualListTable' ,
            jqMetisMenu             : jsPath + '/jquery/plugin/metisMenu/1.1.3/jquery.metisMenu' ,
            jqSlimscroll            : jsPath + '/jquery/plugin/slimscroll/1.3.0/jquery.slimscroll.min' ,
            jqSEasing               : jsPath + '/jquery/plugin/easing/1.1/jquery.easing.min' ,
            jqLavalamp              : jsPath + '/jquery/plugin/lavaLamp/0.2.0/jquery.lavalamp.min' ,
            // jqLayer                 : jsPath + '/jquery/plugin/layer/2.4/jquery.layer' ,
            jqLayer                 : jsPath + '/jquery/plugin/layer/3.0.3/jquery.layer' ,
            jqLayerDate             : jsPath + '/jquery/plugin/layerDate/1.1/jquery.laydate' ,
            jqLaytpl                : jsPath + '/jquery/plugin/laytpl/1.1/laytpl' ,
            jqValidate              : jsPath + '/jquery/plugin/validate/1.15.0/jquery.m.validate' ,
            jqForm                  : jsPath + '/jquery/plugin/form/3.51/jquery.form' ,
            jqGrid                  : jsPath + '/jquery/plugin/jqgrid/5.1.1/i18n/grid.locale-cn' ,
            jqBootstrapTable        : jsPath + '/jquery/plugin/bootstrapTable/1.11.0/amd_bootstrap_table' ,
            jqBootstrapTableGroupBy : jsPath + '/jquery/plugin/bootstrapTable/extens/group_by/bootstrap-table-group-by' ,
            jqSerializeJson         : jsPath + '/jquery/plugin/serializeJSON/2.7.2/jquery.serialize_json' ,
            jqZtree                 : jsPath + '/jquery/plugin/ztree/3.5.26/amd_ztree' ,
            jqLayout                : jsPath + '/jquery/plugin/layout/1.4.0/jquery.layout' ,
            jqLayoutAnd             : jsPath + '/jquery/plugin/layout/1.4.0/jquery.layout_and_plugins' ,
            jqTools                 : jsPath + '/jquery/custom/jqueryTools/jquery_tools' ,
            jqCitys                 : jsPath + '/jquery/plugin/citys/1.0/jquery.citys' ,
            jqToastr                : jsPath + '/jquery/plugin/toastr/2.0.3/jquery.toastr' ,
            jqWebUploader           : jsPath + '/jquery/plugin/webuploader/neWebUploader' ,
            jqSpinner               : jsPath + '/jquery/plugin/spinner/0.2.1/jquery.spinner' ,
            jqICheck                : jsPath + '/jquery/plugin/icheck/1.0.2/icheck' ,
            jqJsonForm              : jsPath + '/jquery/plugin/jsonForm/1.0.0/jquery.jsonForm' ,
            jqEHook                 : jsPath + '/jquery/plugin/eHook/1.0.0/jquery.eHook' ,
            jqListBox               : jsPath + '/jquery/plugin/listbox/2.0.0/jquery.listbox' ,
            jqUI                    : jsPath + '/jquery/plugin/jqueryUI/jquery-ui-1.10.4.custom' ,
            jqRaty : jsPath + '/jquery/plugin/raty/2.7.1/jquery.raty' ,

            //native plugin
            nvMD5 : jsPath + '/native/md5/1.0.1/md5' ,
            
            //bootstrap plugin
            
            bsSelect : jsPath + '/bootstrap/plugin/bootstrapSelect/1.11.2/bootstrap_select' ,
            
            //=======  module  ==============
            
            //nenu
            neToastr : rModulePath + '/nenu/m_toastr' ,
            neDate   : rModulePath + '/nenu/m_date' ,
            neEvent  : rModulePath + '/nenu/m_event' ,
            neUpload : rModulePath + '/nenu/m_upload' ,
            
            //global
            mGlBtns : rModulePath + '/global/m_btns' ,
            mJson   : rModulePath + '/global/m_json' ,
            
            //jquery
            dom : rModulePath + '/jquery/dom' ,
            
            //page
            mPageInfo : rModulePath + '/page/m_info' ,
            
            //pattern
            subPattern : rModulePath + '/pattern/m_subPattern' ,
            
            //system
            mMenu    : rModulePath + '/system/m_menu' ,
            mTabs    : rModulePath + '/system/m_tabs' ,
            mToolTip : rModulePath + '/system/m_tooltip' ,
            mConfig  : rModulePath + '/system/m_config' ,
            
            //markdown
            //----jotted
            md : jsPath + '/markdown/md'
            ,
            
            //tempate
            
            tplDoc : 'js/ba_template_doc'
            
            //devtools
            , logger : jsPath + '/devtools/notification-logger.min'
            
        }
    }
    ;
    if ( oRequire.isLoad ) {
        window.require.config ( oRequire.config );
    }
    
}) ( window );

