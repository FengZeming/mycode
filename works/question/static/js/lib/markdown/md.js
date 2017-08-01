/**
 * 组装markdown
 */
define(function (require) {
    //引入markdown相关css
    //markdown主题
    // require('css!md/../css/markdown');
    //  require('css!md/../css/pilcrow');
    //  require('css!md/../css/hljs-github.min');

    //引入jotted组件   类似 JSFiddle 前端 代码即时查看
    //相关css
    require('css!md/../jotted/1.4.3/jotted.min');
    require('css!md/../jotted/1.4.3/codemirror/lib/codemirror');
    require('css!md/../jotted/1.4.3/codemirror/addon/hint/show_hint');
    require('css!md/../jotted/1.4.3/codemirror/theme/material');
    //相关js
    //代码提示
    require('md/../jotted/1.4.3/codemirror/addon/hint/html_hint');
    require('md/../jotted/1.4.3/codemirror/addon/hint/javascript_hint');
    require('md/../jotted/1.4.3/codemirror/addon/hint/css_hint');
    require('md/../jotted/1.4.3/codemirror/addon/hint/show_hint');
    //语法
    require('md/../jotted/1.4.3/codemirror/mode/htmlmixed/htmlmixed');
    require('md/../jotted/1.4.3/codemirror/mode/http/http');
    require('md/../jotted/1.4.3/codemirror/mode/markdown/markdown');


    CodeMirror = require('md/../jotted/1.4.3/codemirror/lib/codemirror');

    //核心文件
    var Jotted = require('md/../jotted/1.4.3/jotted.min');
    require('tplDoc');
    var $ = require('jquery');
    //发布订阅模式
    require('subPattern');


    //订阅弹出窗口
    $.subPattern('doc_blank').subscribe(function (content) {
        var winname = window.open('/page/document/run.html', "_blank", '');
        winname.document.open('text/html', 'replace');
        winname.document.write(content);
        winname.document.close();
    });


    //jotted 操作 对象

    /**
     *
     * @type {
     *  {       cache: {}, //jotted缓存
     *==========================================================
     *          //创建jotted
         *          jotted.iframe  绑定内置的 iframe 单独打开页面时获取html使用
         *          方法参数：
         *          el: string 获取元素的id 不加#
         *          tpl：object 要传入的源码的模版 html ,css ,js
      *         create: jottedTools.create(el,data,tpl)
      *==========================================================
      *         //获取iframe里的html内容
      *             方法参数：
      *             name：string jotted缓存名称
      *         , getHtml: jottedTools.getHtml(name)
      *==========================================================
      *         //获取模版内容
      *           方法参数：
      *             name：string 传入模版名称 使用 arttemplate
      *         , getTpl: jottedTools.getTpl(name)
      *==========================================================
      *         //获取jotted的配置对象
      *           方法参数：
      *           tpl: object 传入源码模版名称： html,css,js
      *         , getOption: jottedTools.getOption(tpl)
      * ==========================================================
      *         //初始化方法
      *          方法参数：
      *           options：object 工具配置参数
      *           ｛prefix: string '模版前缀'
      *            list:[
      *                 {
      *                     el: string 'jotted元素的获取名',
      *                     data: string 'jotted的缓存标识 ， btn 上 data-jotted属性与该名称保持一致'，
      *                     tpl：object  'arttemplate模版的名称 html ，css， js'
      *                 }
      *
      *             ]
      *           ｝
      *         , init: jottedTools.init(options)
      *     }
      * }
     */
    var jottedTools = {
        cache   : {},
        create  : function (el, tpl) {
            console.log(el, tpl);
            var self = this;
            var othis = this.cache[el] = new Jotted(document.querySelector('#' + el), this.getOption({
                html : tpl.html,
                css  : tpl.css,
                js   : tpl.js
            }));
            //iframe
            othis.iframe = othis.$container.children[1].querySelector('iframe');
            //添加运行按钮
            var btn = document.createElement("button");
            btn.className = "jotted-button jotted-button-play", btn.innerHTML = '运行';
            btn.addEventListener("click", function () {
                var content = self.getHtml(el);
                $.subPattern('doc_blank').publish(content);
            }, false);
            othis.$container.appendChild(btn);
            //配置高度
            othis.$container.style.height = self.options.height;
        },
        getHtml : function (name) {
            return '<!DOCTYPE html><html>' + this.cache[name].iframe.contentWindow.document.querySelector('html').innerHTML + '</html>';
        },

        getTpl : function (name) {
            var name = this.options.prefix + name;
            return template(name, { rootPath : this.options.rootPath, filePath : this.options.filePath });
        },

        getOption : function (code) {
            return {
                files      : [{
                    type    : 'html',
                    content : this.getTpl(code.html) || ''
                },
                    {
                        type    : 'css',
                        content : this.getTpl(code.css) || ''
                    },
                    {
                        type    : 'js',
                        content : this.getTpl(code.js) || ''
                    }],
                showBlank  : false, // 其他窗口如果没有代码是否可见 false
                runScripts : true, // 如果html窗口有js代码是否执行 true
                //  pane: 'html',   // 指定默认打开的面板 result
                plugins    : [
                    //  'play'
                    {
                        name    : 'console',
                        options : {
                            // clear the console on each change
                            autoClear : true
                        }
                    }
                    ,
                    {
                        name    : 'codemirror',
                        options : {
                            extraKeys    : { "Alt-/" : "autocomplete" },//输入s然后ctrl就可以弹出选择项
                            theme        : 'material',
                            lineWrapping : true,//自动换行
                            auto         : 'auto' //自动高度
                        }
                    }
                ]
            };
        },
        init      : function (options) {
            var self = this;
            var options = this.options = $.extend({
                list     : [],
                prefix   : '',
                height   : '20em',
                rootPath : {},
                filePath : ''
            }, options);

            for (var i = 0, l = options.list.length; i < l; i++) {
                var item = options.list[i];
                self.create(item.el, item.tpl);
            }
        }
    };


    return jottedTools;
});
