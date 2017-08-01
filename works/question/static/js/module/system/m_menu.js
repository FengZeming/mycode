define(function (require) {

    'use strict';

    var $ = require('jquery'),
        oDom = require('dom'),
        jqMetisMenu = require('jqMetisMenu'),
        jqSlimscroll = require('jqSlimscroll');
    //
    var $sideMenu = $('#side-menu'),
        $body = oDom.body,
        $win = oDom.win;
    return {
        /**
         * 侧栏高度随窗口变化而变化
         */
        onBindSidebarWindow: function () {
            var self = this;
            $win.bind("load resize click scroll", function () {
                if (!$body.hasClass('body-small')) {
                    self.fnSidebarH();
                }
            });
        }
        ,
        /**
         * 侧栏滚动
         */
        onBindSidebarScroll: function () {
            $win.scroll(function () {
                if ($win.scrollTop() > 0 && !$body.hasClass('fixed-nav')) {
                    $('#right-sidebar').addClass('sidebar-top');
                } else {
                    $('#right-sidebar').removeClass('sidebar-top');
                }
            });


        }


        ,


        /**
         *  开关左边菜单栏
         */
        onClickBtnMenu: function () {
            var self = this;
            $('.js-btn-menu-system').on('click', function () {
                $body.toggleClass("mini-navbar");
                self.fnMenu();
            });

        },
        /**
         * 开关右边侧边栏
         */
        onClickBtnSidebar: function () {
            $('.right-sidebar-toggle').click(function () {
                $('#right-sidebar').toggleClass('sidebar-open');
            });
        }
        ,

        /**
         *  左边菜单栏
         */
        fnMenu: function () {
            if (!$body.hasClass('mini-navbar')) {
                $sideMenu.hide();
                setTimeout(
                    function () {
                        $sideMenu.fadeIn(500);
                    }, 100);
            } else if ($body.hasClass('fixed-sidebar')) {
                $sideMenu.hide();
                setTimeout(
                    function () {
                        $sideMenu.fadeIn(500);
                    }, 300);
            } else {
                $sideMenu.removeAttr('style');
            }
        },
        /**
         * 侧边栏高度
         */
        fnSidebarH: function () {
            var h = $('#wrapper').height() - 61;
            $('.sidebard-panel').css('min-height', h + 'px');
        }
        ,
        /**
         * 判断浏览器是否支持html5本地存储
         * @returns {boolean}
         */

        localStorageSupport: function () {
            return (('localStorage' in window) && window['localStorage'] !== null);
        }


        ,
        //初始化
        init: function () {

            var self = this;

            // 左边菜单初始化
            $sideMenu.metisMenu();

            //固定菜单栏
            $('.sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: 0.9,
                alwaysVisible: false
            });

            self.onClickBtnMenu();


            $win.bind("load resize", function () {
                if ($(this).width() < 769) {
                    $body.addClass('mini-navbar');
                    $('.navbar-static-side').fadeIn();
                }
            });


        }
    }
});