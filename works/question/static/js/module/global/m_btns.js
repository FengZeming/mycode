/**
 * 公共按钮函数 默认
 */
define(function (require) {

    var $top = $(window.top);
    var layer = window.top.layer;
    var dom = require('dom');
    require('subPattern');


    function hasOwn(o, attr) {
        return o.hasOwnProperty(attr);
    }


    /**
     *   弹窗询问事件
     */
    $.subPattern('popup_confirm').subscribe(function (option) {


        // var $parent = option.$parent;

        var _fnClose = function (index) {
            // $parent.attr('isLayer', 0);
            layer.close(index);
        };
        /*

         if ($parent.attr('isLayer') == '1') {
         return;
         }

         $parent.attr('isLayer', 1);
         */


//
        layer.confirm(option.popup.title, {
            btn: ['确定', '取消'], //按钮
            shade: [0.01, '#fff'], //显示遮罩
            cancel: function (index) {
                _fnClose(index);
            }
        }, function (index) {
            //  $parent.attr('isLayer', 0);
            $.subPattern(option.popup.event).publish(option, function () {
                _fnClose(index);
            });
        }, function (index) {
            _fnClose(index);
        });


    });


    /**
     *   弹窗内嵌页面事件
     *   需要参数：
     *    option.popup = '弹窗参数对象，这个对象都是弹窗内需要使用的到的参数'
     *    option.popup.url = '需要加载的页面地址'
     *    option.popup.title = '弹窗标题'
     *    option.popup.index = '当前弹窗的索引，操作弹窗需要'
     */
    $.subPattern('popup_ifreame').subscribe(function (option) {

        /*  var nWinH = $top.height(), nWinW = $top.width();
         var percentW = percentH = 0.9;

         if (nWinW > 768) {
         percentW = 0.8;
         percentH = 0.8;
         }
         if (nWinW > 1000) {
         percentW = 0.7;
         percentH = 0.7;
         }
         if (nWinW > 1200) {
         percentW = 0.55;
         percentH = 0.6;
         }
         if (nWinW > 1400) {
         percentW = 0.45;
         percentH = 0.6;
         }
         var layerH = nWinH * percentH + 'px', layerW = nWinW * percentW + 'px';*/

        var layerH = option.popup.height, layerW = option.popup.width;

        layer.open({
            type: 2,
            title: option.popup.title,
            content: [option.popup.url, 'no'],
            area: [layerW, layerH],
            success: function (layero, index) {
                var ifName = layero.find('iframe')[0]['name'];
                var iframeWin = $top[0][ifName];
                //传递参数
                option.popup.index = index;
                iframeWin.Nenu.getParameterData = function () {
                    return option;
                }
            }
        });


    });


    /**
     * 定义提示按钮
     */
    $.subPattern('jb_confirm').subscribe(function (option) {
        var e = 'onConFirm', t = '确定要删除该条记录吗？', p = option.popup = option.popup || {event: e, title: t};
        !hasOwn(p, 'event') && ( p.event = e );
        !hasOwn(p, 'title') && ( p.title = t );
        $.subPattern('popup_confirm').publish(option);
    });

    /**
     *  定义内嵌按钮
     */
    $.subPattern('jb_ifreame').subscribe(function (option) {
        var url = './404.html', t = '信息', p = option.popup = option.popup || {url: url, title: t};
        !hasOwn(p, 'url') && ( p.url = url );
        !hasOwn(p, 'title') && ( p.title = t );
        $.subPattern('popup_ifreame').publish(option);
    });

    /**
     * 自定义按钮
     */
    $.subPattern('jb_custom').subscribe(function (option) {
        var e = 'onCustom', p = option.popup = option.popup || {event: e};
        !hasOwn(p, 'event') && ( p.event = e );
        $.subPattern(p.event).publish(option);
    });


});
