!(function ( root , factory ) {
    'use strict';
    if ( typeof define === 'function' ) {
        if ( define.amd ) {
            // AMD
            define ( ['jquery' , 'jqWebUploader/../webuploader' , 'nvMD5' , 'jqLayer' , 'jqSlimscroll' , 'jqWebUploader/../template'] , factory );
        }
        if ( define.cmd ) {
            // CMD
            define ( factory );
        }

    }
    else if ( typeof exports === 'object' ) {
        // Node, CommonJS之类的
        //   module.exports = factory(require('jquery'), require('underscore'));
    }
    else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory ( root.jQuery );
    }
} ( this , function ( $ , WebUploader ) {
    'use strict';

    if ( !WebUploader.Uploader.support () ) {
        alert ( 'Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器' );
        throw new Error ( 'WebUploader does not support the browser you are using.' );
    }

    var datakey = 'ne_webuploader';

    /**
     *        fileNumLimit        : 300,
     fileSizeLimit       : 5 * 1024 * 1024, // 200 M
     fileSingleSizeLimit : 3 * 1024 * 1024 // 50 M
     */


    var _type = {
        images  : {
            accept : {
                title      : 'Images' ,
                extensions : 'gif,jpg,jpeg,png' ,
                mimeTypes  : 'image/*'
            }

        } ,
        default : {
            accept : {
                extensions : 'gif,jpg,jpeg,png,docx,doc,ppt,pptx,pps,xls,xlsx,txt,pdf,zip,rar,mp3,wav,mp3pro,wma,rm,rmvb,avi,mp4,mkv,mov,mpeg,mpg,wmv,flv,3gp'
            }
        }
    };

    //todo 断点续传
    var chunked = {
        chunked     : true                           // 是否要分片处理大文件上传
        , chunkSize : 5000 * 1024                    // 分块大小
        , threads   : true                           // 默认允许 同时最大上传进程数。
    };

    /**
     * de-invisible = 隐藏
     */
    var utils = {

        /**
         *  获取selecter
         * @param selstr
         * @returns {string}
         */
        getSelector   : function ( selstr ) {
            var arry = selstr.split ( '|' );
            var symbol = ['#' , '.' , ''];
            var prefix = arry.length == 3 ? symbol[parseInt ( arry[2] )] : symbol[1];
            var ocss = {
                t : 'cssTotal' ,
                f : 'cssFile' ,
                j : 'js'
            };
            return prefix + this[ocss[arry[0]]][parseInt ( arry[1] )];
        }
        /**
         * 获取文件类型
         * @param type
         */
        , getFileType : function ( type ) {
            var icon;
            var aType = {
                ai   : 'ai' , psd : 'psd' , doc : 'doc' , docx : 'doc' , ppt : 'ppt' , pptx : 'ppt' , pps : 'ppt' ,
                xls  : 'xls' , xlsx : 'xls' , pdf : 'pdf' , txt : 'txt' , rtf : 'rtf' , zip : 'zip' , rar : 'zip' ,
                gz   : 'gz' , torrent : 'bt' , htm : 'html' , html : 'html' , mp3 : 'audio' , mp3pro : 'audio' ,
                wav  : 'audio' , wma : 'audio' , ra : 'audio' , ram : 'audio' , flac : 'audio' , aac : 'audio' ,
                rm   : 'video' , rmvb : 'video' , avi : 'video' , mp4 : 'video' , mkv : 'video' , mov : 'video' ,
                mpeg : 'video' , mpg : 'video' , wmv : 'video' , flv : 'video' , '3gp' : 'video' , asf : 'video' ,
                ts   : 'video' , ico : 'img' , jpeg : 'img' , jpg : 'img' , png : 'img' , gif : 'img' ,
                bmp  : 'img' , tif : 'ps' , tiff : 'ps' , pcx : 'ps'
            };
            return icon = aType[type.toLowerCase ()], icon ? icon : 'unknow';
        } ,

        /**
         * 获取文件图标
         * @param icon
         * @returns {string}
         */
        getFileIcon : function ( icon ) {
            return 'file file-' + icon;
        }

        ,
        cssTotal : [
            'de-invisible'
            , 'jc-uploader-queue'       //文件容器 [1]
            , 'jc-total-btn_upload'      //上传按钮[2]
            , 'jc-total-btn_pick_go'    //继续上传按钮[3]
            , 'jc-uploader-pack'        //没选择文件之前的内容。[4]
            , 'jc-uploader-bottom-bar'          //下边操作栏[5]
            , 'jc-total-info'            //总提示信息[6]
            , 'jc-total-progress'        //总进度信息[7]
            , 'jc-total-btn_pick'          //主上传按钮[8]
            , 'jc-uploader-filelist'        //文件包装器[9]
            , 'jc-uploader-top-bar'          //上边操作栏[10]
            , 'jc-total-error'            //全局错误提示[11]
        ] ,
        cssFile  : [
            'jc-file-progress'  //文件进度信息[0]
            , 'jc-file-bar'    //文件操作栏[1]
            , 'jc-file-thumb'  //文件缩略图[2]
            , 'jc-file-info'   //文件错误信息[3]
        ]
        ,
        js       : [
            'js-uploader'
        ]
        , error  : {
            'Q_EXCEED_NUM_LIMIT'    : '超出允许上传文件的总数！'
            , 'Q_EXCEED_SIZE_LIMIT' : '超出允许上传文件的总大小！'
            , 'Q_TYPE_DENIED'       : '当前上传的文件类型不在允许范围内！'
        }
    };

    var ratio = window.devicePixelRatio || 1; // 优化retina, 在retina下这个值是2

    var defaults = {

        nenu : {
            type       : 'default' ,
            plugin     : {
                slimScroll : true ,
                layer      : {
                    layero     : null ,
                    index      : -1 ,
                    cancelBack : function () {
                    }
                }
            } ,
            finishBack : function () {
            }
        } ,

        config : {
            // swf文件路径
            swf                : './Uploader.swf'
            , server           : '/upload'
            // , pick                : {
            //     id      : '#js_btn_pick'
            //     , label : '点击选择图片'
            // }
            //
            // , dnd                 : '#js_uploader .queueList'      // 指定拖拽容器
            , disableGlobalDnd : true                           // 默认启用拖拽
            , paste            : document.body                  // 启用截屏图片粘贴上传功能
            , resize           : false                          // 不压缩image
            //
            , compress         : false
            , prepareNextFile  : true                           // 上传前提前准备下一个文件
            , duplicate        : true                           // 默认文件 去重
        }
        ,
        //事件
        events : {

            // uploadAccept : function ( file , response ) {

            //  }
        }

    };

    $.fn.neUploader = function ( settings ) {

        var run = $.type ( settings ) === 'string' ,
            args = [].slice.call ( arguments , 1 ) ,
            options = $.extend ( {} , defaults ) ,
            $element ,
            instance;

        if ( run && run[0] !== '_' ) {
            if ( !this.length ) return;
            $element = $ ( this[0] );
            instance = $element.data ( datakey );
            if ( !instance ) $element.data ( datakey , instance = new Constructor ( $element[0] , options )
                ._init () );
            return Constructor.prototype[settings] ? Constructor.prototype[settings].apply ( instance , args ) : udf;
        }
        else if ( !run ) {
            options = $.extend ( true , options , settings );
        }

        return this.each ( function ( i ) {
            var element = this ,
                instance = $ ( element )
                    .data ( datakey );
            if ( !instance ) {
                $ ( element )
                    .data ( datakey , instance = new Constructor ( element , options )
                        ._init ( i ) );
            }
        } );
    };

    // 暴露插件的默认配置
    $.fn.neUploader.defaults = defaults;
    // 构造函数
    function Constructor ( element , options ) {

        var the = this;
        the.id = element.id;
        the.dom = {
            $el : $ ( element )
        };

        the.argum = {

            fileCount           : 0                         // 添加文件的数量
            , fileSize          : 0                         // 添加的文件总大小
            , thumbnailWidth    : 100 * ratio               // 缩略图宽度
            , thumbnailHeight   : 100 * ratio               // 缩略图高度
            , state             : 'initial'                 // 可能有 initial = 初始化  , ready, uploading, confirm, done.
            , percentages       : {}                        // 所有文件的进度信息，key为file id
            , supportTransition : (function () {
                var s = document.createElement ( 'p' )
                        .style ,
                    r = 'transition' in s ||
                        'WebkitTransition' in s ||
                        'MozTransition' in s ||
                        'msTransition' in s ||
                        'OTransition' in s;
                s = null;
                return r;
            }) ()

        };

        the.uploader = undefined;

        the.options = options;
    }

    // 原型方法，驼峰写法
    Constructor.prototype = {

        _init : function ( i ) {

            this.id = this.id ? this.id : (utils.getSelector ( 'j|0|2' ) + '-' + i);
            this.dom.$el.attr ( 'id' , this.id );
            //创建dom
            this._domCreage ();
            this._domEvent ();

            //创建uploader实例
            this._uploadCreate ();
            //uploader绑定各种事件
            this._uploadEvent ();
            //初始化下总进度
            this._uploadUpdateProgress ();
        }

        /**
         * 创建dom
         * @private
         */
        ,

        _domCreage  : function () {
            var _this = this;
            var _dom = _this.dom;
            var $el = _dom.$el;
            //主容器
            _dom.$queue = $el.find ( utils.getSelector ( 't|1' ) ).height ( $el.height () );
            //文件容器
            _dom.$list = $ ( template ( 'tpl_fileList' , {} ) );
            _dom.$queue.append ( _dom.$list );

            // 上传按钮
            _dom.$uploadBtn = $el.find ( utils.getSelector ( 't|2' ) );

            //继续添加按钮
            _dom.$goPickBtn = $el.find ( utils.getSelector ( 't|3' ) );

            // 没选择文件之前的内容。
            _dom.$pack = $el.find ( utils.getSelector ( 't|4' ) );

            var $topBar = _dom.$topBar = $el.find ( utils.getSelector ( 't|10' ) );

            //文件总体选择信息
            _dom.$info = $topBar.find ( utils.getSelector ( 't|6' ) );

            // 总体进度条
            _dom.$progress = $topBar.find ( utils.getSelector ( 't|7' ) ).hide ();

            //下边操作栏

            _dom.$bottomBar = $el.find ( utils.getSelector ( 't|5' ) );

            _dom.$error = $el.find ( utils.getSelector ( 't|11' ) );

        }
        /**
         * dom 事件绑定
         * @private
         */
        , _domEvent : function () {
            var _this = this;
            var _dom = _this.dom;
            var _argum = _this.argum;
            var _options = _this.options;

            //按钮绑定事件
            _dom.$uploadBtn.on ( 'click' , function () {


                if ( $ ( this ).hasClass ( 'disabled' ) ) {
                    return false;
                }
                if ( _argum.state === 'ready' ) {

                    _options.nenu.plugin.layer.layero.find ( '.layui-layer-close' ).hide ();
                    _this.uploader.upload ();
                }
                else if ( _argum.state === 'paused' ) {
                    _this.uploader.upload ();
                }
                else if ( _argum.state === 'uploading' ) {
                    _this.uploader.stop ();
                }
                //完成后点击关闭回调
                else if ( _argum.state === 'finish' ) {

                    _options.nenu.plugin.layer.cancelBack ( function () {
                    } );
                }

            } );

            //
            _dom.$info.on ( 'click' , '.retry' , function () {
                _this.uploader.retry ();
            } );

            //
            _dom.$info.on ( 'click' , '.ignore' , function () {
                _this.uploader.reset ();
                _dom.$list.empty ();
                _this._uploadSetState ( 'initial' );
            } );

            _dom.$uploadBtn.addClass ( 'state-' + _argum.state );
        }

        /**
         * uploader 事件绑定
         * @private
         */
        , _uploadEvent : function () {

            var _this = this;
            var _argum = _this.argum;
            var _dom = _this.dom;
            var _uploader = _this.uploader;
            var _options = _this.options;

            /**
             * 当文件被加入队列以后触发
             * @param {Object} file
             */
            _uploader.on ( 'fileQueued' , function ( file ) {

                _argum.fileCount++;
                _argum.fileSize += file.size;

                //当前如果加入文件则,隐藏主按钮
                if ( _argum.fileCount === 1 ) {
                    _dom.$pack.addClass ( utils.getSelector ( 't|0|2' ) );
                    _dom.$topBar.show ();
                    _dom.$bottomBar.show ();

                    //启用scroll
                    if ( _options.nenu.plugin.slimScroll ) {

                        _dom.$queue.slimScroll ( {
                            height          : _dom.$queue.height ()
                            , railOpacity   : 0.9
                            , alwaysVisible : false

                        } );
                    }

                }

                //添加文件
                _this._uploadAddFile.call ( _this , file );

                //修改状态

                _this._uploadSetState ( 'ready' );

                //修改总进度
                _this._uploadUpdateProgress ();
            } );

            /**
             * 上传过程中触发，携带上传进度。
             * @param {Object} file         上传份文件
             * @param {Object} percentage  上传百分比
             */
            _uploader.on ( 'uploadProgress' , function ( file , percentage ) {
                var $li = $ ( '#' + file.id );

                //修改当前上传的文件的进度
                var $percent = $li.find ( utils.getSelector ( 'f|0' ) + ' span' );
                $percent.css ( 'width' , percentage * 100 + '%' );

                //修改文件上传的总进度
                _argum.percentages[file.id][1] = percentage;
                //
                _this._uploadUpdateProgress ();
            } );

            /**
             * 当文件被移除队列后触发。
             */
            _uploader.on ( 'fileDequeued' , function ( file ) {
                _argum.fileCount--;
                _argum.fileSize -= file.size;

                if ( !_argum.fileCount ) {
                    //修改状态 初始值
                    _this._uploadSetState ( 'initial' );
                }

                //删除文件
                _this._uploadRemoveFile ( file );

                //修改总进度
                _this._uploadUpdateProgress ();

            } );

            //报错

            _uploader.on ( 'error' , function ( code ) {
                //_dom.$error.removeClass('info success').addClass('danger').text(utils.error[code]);
                // layer.msg('玩命提示中');
            } );

            _uploader.on ( 'reset' , function () {
                _argum.fileCount = 0;
                _argum.fileSize = 0;
                _argum.percentages = {};
                _options.nenu.plugin.layer.layero.find ( '.layui-layer-close' ).show ();

            } );

            /* _uploader.on ( 'uploadAccept' , function ( file , ret ) {
             $.extend ( file , ret );
             console.log ( file );
             var $li = $ ( '#' + file.file.id );
             var $info = $li.find ( utils.getSelector ( 'f|3' ) ).hide ();
             _this._uploadErrorFile ( $info );
             } );*/

            _uploader.on ( 'uploadSuccess' , function ( file , res ) {
                file.resData = res._raw || res;
            } );

            //
            _uploader.on ( 'all' , function ( type ) {
                switch ( type ) {

                    //当所有文件上传结束时触发。
                    case 'uploadFinished':
                        _this._uploadSetState ( 'confirm' );
                        break;
                    //当开始上传流程时触发。
                    case 'startUpload':
                        _this._uploadSetState ( 'uploading' );
                        break;
                    //当开始上传流程暂停时触发。
                    case 'stopUpload':
                        _this._uploadSetState ( 'paused' );
                        break;

                }

            } );
        }

        /**
         * uploader 创建
         * @private
         */
        , _uploadCreate : function () {
            var _this = this;
            var _options = _this.options;
            var _dom = _this.dom;

            var option = $.extend ( true , _options.config , {
                dnd  : '#' + _this.id + ' ' + utils.getSelector ( 't|1' ) ,
                pick : {
                    id          : '#' + _this.id + ' ' + utils.getSelector ( 't|8' )
                    , innerHTML : '点击选择文件'
                }
            } );

            option = $.extend ( option , _type.default );

            if ( _options.nenu.type === 'images' ) {
                option = $.extend ( option , _type.images );
            }

            // 实例化
            var _uploader = _this.uploader = new WebUploader.Uploader ( option );

            // 添加“添加文件”的按钮，
            _uploader.addButton ( {
                id          : '#' + _this.id + ' ' + utils.getSelector ( 't|3' )
                , innerHTML : '继续添加'
            } );

        }


        /**
         * 设置状态
         * @param val
         * @private
         */
        , _uploadSetState : function ( val ) {

            var stats;
            var _this = this;
            var _argum = _this.argum;
            var _dom = _this.dom;
            var _options = _this.options;

            var cssInvisible = utils.getSelector ( 't|0|2' );

            if ( _argum.state === val ) {
                return;
            }

            _dom.$uploadBtn.removeClass ( 'state-' + _argum.state ).addClass ( 'state-' + val );
            _argum.state = val;

            switch ( _argum.state ) {

                //初始化  initial
                case 'initial':
                    _dom.$pack.show ();
                    _dom.$queue.removeClass ( 'filled' );
                    _dom.$list.hide ();
                    _dom.$bottomBar.hide ();
                    _dom.$topBar.hide ();
                    _this.uploader.refresh ();

                    break;

                //插入文件 准备上传
                case 'ready':
                    _dom.$pack.hide ();
                    _dom.$queue.addClass ( 'filled' );
                    _dom.$list.show ();
                    _dom.$bottomBar.show ();
                    _dom.$topBar.show ();

                    _dom.$uploadBtn.text ( '开始上传' );
                    _this.uploader.refresh ();

                    break;

                //暂停上传
                case 'uploading':
                    //  _dom.$goPickBtn.hide();
                    _dom.$progress.show ();
                    _dom.$uploadBtn.text ( '暂停上传' );
                    break;

                //继续上传
                case 'paused':
                    _dom.$progress.show ();
                    _dom.$uploadBtn.text ( '继续上传' );
                    break;

                //全部文件上传结束
                case 'confirm':
                    _dom.$progress.hide ();
                    _dom.$uploadBtn.text ( '开始上传' );  //.addClass('disabled');
                    stats = _this.uploader.getStats ();
                    if ( stats.successNum && !stats.uploadFailNum ) {
                        _this._uploadSetState ( 'finish' );
                        return;
                    }
                    break;

                //上传完成
                case 'finish':
                    stats = _this.uploader.getStats ();
                    if ( stats.successNum ) {
                        _dom.$uploadBtn.text ( '完成' );
                        _options.nenu.finishBack ( _this.uploader.getFiles ( 'complete' ) );
                        _dom.$error.removeClass ( 'danger success' ).addClass ( 'info' );
                        _options.nenu.plugin.layer.layero.find ( '.layui-layer-close' ).show ();
                    }
                    else {
                        // 没有成功的图片，重设
                        _argum.state = 'done';
                        location.reload ();
                    }
                    break;
            }

            //修改总进度
            _this._uploadUpdateStatus ();
        }

        , _uploadUpdateStatus : function () {
            var _this = this;
            var _argum = _this.argum;
            var _dom = _this.dom;
            var text = '';
            var stats;
            if ( _argum.state === 'ready' ) {
                text = '选中&nbsp;' + _argum.fileCount + '&nbsp;个文件，共' + WebUploader.formatSize ( _argum.fileSize ) + '。';
            }
            else if ( _argum.state === 'confirm' ) {
                stats = _this.uploader.getStats ();
                if ( stats.uploadFailNum ) {
                    text = '已成功上传&nbsp;' + stats.successNum + '&nbsp;个文件，' +
                        stats.uploadFailNum + '&nbsp;个文件上传失败，<a class="retry" href="#">重新上传</a>失败文件或<a class="ignore" href="#">忽略</a>'
                }

            }
            else {
                stats = _this.uploader.getStats ();
                text = '共&nbsp;' + _argum.fileCount + '&nbsp;个文件（' +
                    WebUploader.formatSize ( _argum.fileSize ) +
                    '），已上传&nbsp;' + stats.successNum + '&nbsp;个';

                if ( stats.uploadFailNum ) {
                    text += '，失败&nbsp;' + stats.uploadFailNum + '&nbsp;个';
                }
            }

            _dom.$info.html ( text );

        }

        /**
         * 修改总进度
         * @private
         */
        , _uploadUpdateProgress : function () {
            var _this = this;
            var _dom = _this.dom;
            var _argum = _this.argum;
            var percentages = _argum.percentages;
            var $progress = _dom.$progress;
            var loaded = 0 ,
                total = 0 ,
                spans = $progress.children () ,
                percent;

            $.each ( percentages , function ( k , v ) {
                total += v[0];
                loaded += v[0] * v[1];
            } );

            percent = total ? loaded / total : 0;

            spans.eq ( 0 )
                 .text ( Math.round ( percent * 100 ) + '%' );
            spans.eq ( 1 )
                 .css ( 'width' , Math.round ( percent * 100 ) + '%' );

            //
            _this._uploadUpdateStatus ();
        }

        /**
         * 删除文件
         * @param file
         * @private
         */
        , _uploadRemoveFile : function ( file ) {
            var $li = $ ( '#' + file.id );
            delete this.argum.percentages[file.id];

            //修改总进度
            this._uploadUpdateProgress ();

            $li.off ()
               .find ( utils.getSelector ( 'f|1' ) )
               .off ()
               .end ()
               .remove ();
            var _dom = this.dom;

        }


        /**
         *
         *    文件状态值，具体包括以下几种类型：
         *
         *    inited 初始状态
         *    queued 已经进入队列, 等待上传
         *    progress 上传中
         *    complete 上传完成。
         *    error 上传出错，可重试
         *    interrupt 上传中断，可续传。
         *    invalid 文件不合格，不能重试上传。会自动从队列中移除。
         *    cancelled 文件被移除。
         * @param {Object} file
         */
        , _uploadAddFile : function ( file ) {
            var _this = this;
            var _dom = this.dom;
            var _argum = this.argum;

            var $li = $ ( template ( 'tpl_file' , file ) );
            var $btns = $li.find ( utils.getSelector ( 'f|1' ) );
            var $prgress = $li.find ( utils.getSelector ( 'f|0' ) + ' span' );
            var $wrap = $li.find ( utils.getSelector ( 'f|2' ) );
            var $info = $li.find ( utils.getSelector ( 'f|3' ) ).hide ();

            if ( file.getStatus () === 'invalid' ) {
                _this._uploadErrorFile ( $info , file.statusText );
            }
            else {
                // @todo lazyload
                $wrap.text ( '预览中' );
                var icon = utils.getFileType ( file.ext );

                if ( icon === 'img' ) {

                    _this.uploader.makeThumb ( file , function ( error , src ) {
                        if ( error ) {
                            $wrap.text ( '不能预览' );
                            return;
                        }
                        var img = $ ( '<img src="' + src + '" />' );
                        $wrap.empty ().append ( img );
                    } , _argum.thumbnailWidth , _argum.thumbnailHeight );
                } else {
                    var span = $ ( '<span class="type ' + utils.getFileIcon ( icon ) + '"></span>' );
                    $wrap.empty ().append ( span );
                }

                _argum.percentages[file.id] = [file.size , 0];
                file.rotation = 0;
            }

            //文件状态变化
            file.on ( 'statuschange' , function ( cur , prev ) {
                //上传中
                if ( prev === 'progress' ) {
                    $prgress.hide ().width ( 0 );
                }
                //已经进入队列, 等待上传
                else if ( prev === 'queued' ) {
                    $li.off ( 'mouseenter mouseleave' );
                    $btns.remove ();
                }

                // 成功
                //如果出错或是初始状态
                if ( cur === 'error' || cur === 'invalid' ) {

                    _this._uploadErrorFile ( $info , file.statusText );
                    _argum.percentages[file.id][1] = 1;

                }
                //上传中断，可续传。
                else if ( cur === 'interrupt' ) {
                    _this._uploadErrorFile ( $info , 'interrupt' );
                }
                //已经进入队列, 等待上传
                else if ( cur === 'queued' ) {
                    _argum.percentages[file.id][1] = 0;
                }
                //上传中
                else if ( cur === 'progress' ) {
                    $info.hide ();
                    $prgress.css ( 'display' , 'block' );
                }
                //上传完成。
                else if ( cur === 'complete' ) {
                    $li.find ( '.thumb' ).append ( '<span class="success"></span>' );
                }
                //修改当前状态
                $li.removeClass ( 'state-' + prev ).addClass ( 'state-' + cur );
            } );

            //绑定移入移出时间
            $li.on ( 'mouseenter' , function () {
                $btns.stop ().animate ( { height : 30 } );
            } );

            $li.on ( 'mouseleave' , function () {
                $btns.stop ().animate ( { height : 0 } );
            } );

            //按钮绑定事件
            $btns.on ( 'click' , 'span' , function () {
                var index = $ ( this ).index ();
                var deg;

                switch ( index ) {
                    case 0:
                        _this.uploader.removeFile ( file );
                        return;

                    /* case 1:
                     file.rotation += 90;
                     break;

                     case 2:
                     file.rotation -= 90;
                     break;*/
                }

                /*   if (_argum.supportTransition) {
                 deg = 'rotate(' + file.rotation + 'deg)';
                 $wrap.css({
                 '-webkit-transform' : deg,
                 '-mos-transform'    : deg,
                 '-o-transform'      : deg,
                 'transform'         : deg
                 });
                 }
                 else {
                 $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
                 }*/

            } );
            //将file item 添加到 容器内
            $li.appendTo ( _dom.$list );
        }

        /**
         * upload 文件报错
         * @param $info
         * @param code
         * @private
         */
        , _uploadErrorFile : function ( $info , code ) {
            var text = '';
            switch ( code ) {
                case 'exceed_size':
                    text = '文件大小超出';
                    break;

                case 'interrupt':
                    text = '上传暂停';
                    break;

                default:
                    text = '上传失败，请重试';
                    break;
            }

            $info.text ( text );
        }
    }
} ));