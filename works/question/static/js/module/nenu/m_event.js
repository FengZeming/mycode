define(function (require) {
    'use strict';

    var dom = require('dom');
    require('jqTools');


    var argument = {
        /**
         * 事件方法列表
         */
        aFnList : ['load', 'msg', 'alert', 'confirm', 'ifreame', 'ease']

        /**
         * layer对象集合
         */
        , layerList : {}

        /**
         * 窗口变化定时器
         */
        , resizeTimer : undefined

        , pagePath : Nenu.CONSTANT.PATH.PAGE
    };


    var options = {

        load : {
            icon : 1
        },

        msg   : {
            close    : function () {
            }
            , offset : 'auto'
            , title  : '提示信息'
        }
        ,
        alert : {
            close   : function () {
            }
            , title : '提示信息'
        }

        , confirm : {
            execute   : function () {
            }
            , isClose : true
            , title   : '确定要删除该条记录吗？'
        }

        , ifreame : {
            title    : '信息'
            , url    : argument.pagePath + '404.html'
            , height : '600px'
            , width  : '600px'
            , index  : 0
            , neData : {}
        }
    };


    var popup = {
        layer : {
            setWH : function (option) {
                var $top = dom.top;
                var nW = $top.width(),
                    nH = $top.height();
                var area = option.isInit ? [parseFloat(option.width), parseFloat(option.height)] : [parseFloat(argument.layerList[option.index].option.width), parseFloat(argument.layerList[option.index].option.height)];
                if (nW < area[0]) {
                    area[0] = nW * 0.8;
                }
                if (nH < area[1]) {
                    area[1] = nH * 0.8;
                }
                option.offsetWidth = area[0] + 'px';
                option.offsetHeight = area[1] + 'px';
                option.offsetTop = Math.abs((nH - area[1]) / 2);
                option.offsetLeft = Math.abs((nW - area[0]) / 2);
            },

            offset : function (option) {
                var obj = argument.layerList[option.index];
                if (obj) {
                    option.isInit = false;
                    this.setWH(option);
                    obj.layero.css({
                        width  : option.offsetWidth,
                        height : option.offsetHeight,
                        top    : option.offsetTop,
                        left   : option.offsetLeft
                    });
                    obj.layero.find('iframe').height(parseFloat(option.offsetHeight) - 42);
                } else {
                    option.isInit = true;
                    this.setWH(option);
                }

            }
        }
    };


    var oEvent = {

        popup_confirm : function (option, e) {
            var self = this;

            var _fnClose = function (index) {
                dom.layer.close(index);
            };

            dom.layer.confirm(option.title, {
                btn    : ['确定', '取消'], //按钮
                shade  : [0.01, '#fff'], //显示遮罩
                cancel : function (index) {
                    _fnClose(index);
                }
            }, function (index) { // 确定按钮

                option.execute.call(self, function () {
                    _fnClose(index);
                });
                if (option.isClose) {
                    _fnClose(index);
                }

            }, function (index) { //关闭按钮
                _fnClose(index);
            });

        }

        , popup_ifreame : function (option, e) {

            var __option = {
                width  : option.width,
                height : option.height
            };

            popup.layer.offset(option);

            var resizefn = 'resize.layer' + option.index;
            dom.top.on(resizefn, function () {
                if (argument.resizeTimer) {
                    clearTimeout(argument.resizeTimer);
                }
                argument.resizeTimer = setTimeout(function () {
                    popup.layer.offset(option);
                }, 100);
            });

            dom.layer.open({
                type  : 2,
                title : option.title,
                shade : [0.01, '#fff'], //显示遮罩

                content : [option.url, 'no'],
                area    : option.isInit ? [option.offsetWidth, option.offsetHeight] : [option.width, option.height],

                success : function (layero, index) {

                    argument.layerList[index] = {
                        option : __option,
                        layero : layero

                    };

                    var ifName = layero.find('iframe')[0]['name'];
                    var iframeWin = dom.top[0][ifName];
                    //传递参数
                    option.index = index;

                    //
                    option.close = function () {
                        dom.layer.close(index);
                    };
                    //
                    option.setParentData = function (data) {
                        Nenu.open.data.parent = data;

                    };
                    iframeWin.Nenu.open.data.child = option;

                },
                end     : function () {
                    Nenu.open.end(option);
                    argument.layerList[option.index] = null;
                    dom.top.off(resizefn);
                }
            });

        }

        , popup_alert : function (option, e) {

            dom.layer.alert(option.title, {
                closeBtn : 0,
                shade    : [0.01, '#fff']
            }, function (index) {
                option.close(index);
                setTimeout(function () {
                    dom.layer.close(index);
                }, 0);

            });
        }

        , popup_msg  : function (option, e) {

            dom.layer.msg(option.title, {
                closeBtn : 0
                , shade  : [0.01, '#fff']
                , offset : option.offset || 'auto'
            }, function (index) {
                option.close(index);
                setTimeout(function () {
                    dom.layer.close(index);
                }, 0);

            });
        }
        , popup_load : function (option, e) {
            if (typeof (layer) === 'undefined') {
                $.error('请引入 jquery.layer.js! requirejs 里 jqLayer');
                return;
            }
            var index = layer.load(option.icon, { time : null });
            return index;
        }
    };


    var logic = {

        /**
         * 通用入口方法
         */
        entry : function (fnName, option, e) {

            if (!$.isEmptyObject(typeof(option) === 'function' ? (option = option.call(this, e), option ) : (typeof(option) === 'undefined' ? options[fnName] : option))) {
                option = $.extend({}, options[fnName], option);
                return oEvent['popup_' + fnName].call(this, option, e);

            }
        }

        /**
         * 注册事件
         */
        , register : function () {
            var _this = this;
            for (var i = 0; i < argument.aFnList.length; i++) {
                var key = argument.aFnList[i];

                Nenu.event[key] = (function (key) {
                    return function (option, e) {
                        return _this.entry.call(this, key, option, e);
                    }
                })(key);

            }
        }

        /**
         * 事件绑定
         */
        , bind : function () {

            Nenu.method.bind = function (classList) {
                var arry = classList || [];
                for (var i = 0, l = arry.length; i < l; i++) {
                    var carry = arry[i].split('|');
                    $.neOn([{
                        sel   : '.jc-btn-wrapper',
                        eName : carry[1],
                        agent : '.' + carry[0],
                        eFunc : Nenu.method.event
                    }]);
                }
            };

            $.neOn([{
                sel   : '.jc-btn-wrapper',
                agent : '.jc-btn',
                eFunc : Nenu.method.event
            }]);

        }

        /**
         * 初始化
         */
        , init : function () {
            this.bind();
            this.register();
        }

    };


    logic.init();

});