define ( ['jquery' , 'jqLaytpl'] , function ( $ , l ) {
    
    var style = [
        'static/css/style_collect.css' ,
        "static/css/bootstrap.css"
        , "static/css/font-awesome.css"
        , "static/css/style.css"
        , "static/css/style_expand.css"

        , "static/js/lib/jquery/plugin/spinner/0.2.1/jquery.spinner.css"

        , "static/js/lib/jquery/plugin/icheck/skins/square/all.css"
        ,"static/js/lib/jquery/plugin/raty/2.7.1/jquery.raty.css"
    ];
    var script = [
        'static/js/ba_nenu.js' ,
        'static/js/lib/require/2.1.11/require.js' ,
        'static/js/ba_require.js'
    ];
    
    return {
        
        tpl : function ( tpl , data ) {
            var js = this.js (data);
            var body = this.body ( js , tpl,data );
            var main = this.main ( body );
            
            return main;
            
        } ,
        
        main : function ( body ) {
            
            var link = '';
            for ( var i = 0 , l = style.length; i < l; i++ ) {
                link += '<link rel="stylesheet" href="' + style[i] + '">';
            }
            return '<!DOCTYPE html>' +
                '<html>' +
                '<head>' +
                '<meta charset="utf-8">' +
                ' <title>问卷预览</title>' +
                link +
                '</head>' +
                body +
                '</html>';
            
        }
        , js : function ( data ) {
            var js = '';
            for ( var i = 0 , l = script.length; i < l; i++ ) {
                js += '<script src="' + script[i] + '"></script>';
            }
            js+='<script>var jsons =  ' +JSON.stringify( data )+'; </script>';
            
            js += '<script> window.onload=function(){   require( ["../views/form/collect"] );}</script>';
            return js;
        } ,
        body : function ( js , tpl,data ) {

                var fname = data.form.fname;

            return '<body>' +
                '<form id="js_form">' +
                '<div class="collect-main">' +
                '<div class="collect-header">' +
                ' <h1>'+fname +'</h1>' +
                '<div class="dec-describe">感谢参加本次问卷调查</div>' +
                '<div class="dec-split-line"></div>' +
                '</div>' +
                '<div class="collect-content">' +
                
                tpl +
                
                ' </div>' +
                '<div class="collect-footer">' +
                '<button class="btn btn-w-m btn-success" id="js_submit" type="button">提交</button>' +
                '</div>' +
                '</div>' +
                '</form>' +
                js +
                '</body>';
        }
        
    };
} );