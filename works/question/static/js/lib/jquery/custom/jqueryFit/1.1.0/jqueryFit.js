!(function (root, factory) {
    'use strict';
    if (typeof define === 'function') {
        if (define.amd) {
            // AMD
            define(['jquery'], factory);
        }
        if (define.cmd) {
            // CMD
            define(factory);
        }

    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        //   module.exports = factory(require('jquery'), require('underscore'));
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory(root.jQuery);
    }
}(this, function ($) {
    'use strict';
    var fit = {
        parse: function (b) {
            var b = b || document.body;
            if (!b) {
                return;
            }
            var m = b.nodeName.toLowerCase();
            if (!m) {
                return;
            }
            var j = String(b.className);

            if (j && j == 'ne-fit') {
                this.el = b;
                this.doLayout();
            }

            var a = fit.getChildNodes(b);
            for (var g = 0, e = a.length; g < e; g++) {
                var c = a[g];
                if (c.nodeType == 1) {
                    if (c.parentNode == b) {
                        fit.parse(c);
                    }
                }
            }
        },
        getChildNodes: function (h) {
            if (!h) {
                return
            }
            var b = h.childNodes;
            var f = [];
            for (var d = 0, a = b.length; d < a; d++) {
                var j = b[d];
                if (j.nodeType == 1) {
                    f.push(j)
                }
            }
            return f;

        },
        doLayout: function () {
            if (!this.isDisplay()) {
                return;
            }
            var k = this.el.parentNode;
            var p = fit.getChildNodes(k);
            if (k == document.body) {
                this.el.style.height = "0px";
            }
            var q = fit.getHeight(k, true);
            for (var g = 0, c = p.length; g < c; g++) {
                var b = p[g];
                var a = b.tagName ? b.tagName.toLowerCase() : "";
                if (b == this.el || (a == "style" || a == "script")) {
                    continue
                }
                var n = fit.getStyle(b, "position");
                if (n == "absolute" || n == "fixed") {
                    continue
                }
                var j = fit.getHeight(b);
                var f = fit.getMargins(b);
                q = q - j - f.top - f.bottom
            }
            var d = fit.getBorders(this.el);
            var o = fit.getPaddings(this.el);
            var f = fit.getMargins(this.el);
            q = q - f.top - f.bottom;
            if ($.boxModel) {
                q = q - o.top - o.bottom - d.top - d.bottom
            }
            if (q < 0) {
                q = 0
            }
            this.el.style.height = q + "px";
            try {
                p = fit.getChildNodes(this.el);
                for (var g = 0, c = p.length; g < c; g++) {
                    var b = p[g];
                    fit.doLayout(b);
                }
            } catch (m) {
            }
        },
        isDisplay: function () {
            if (!this.el) {
                return false;
            }
            var b = document.body;
            var a = this.el;
            while (1) {
                if (a == null || !a.style) {
                    return false;
                }
                if (a && a.style && a.style.display == 'none') {
                    return false;
                }
                if (a == b) {
                    return true;
                }
                a = a.parentNode;
            }
            return true;
        },
        getHeight: function (a, b) {
            if (a.style.display == 'none' || a.type == 'text/javascript') {
                return 0
            }
            return b ? $(a).height() : $(a).outerHeight()
        },
        getStyle: function (el, style) {
            var a = document.defaultView;
            return new Function(
                "el",
                "style", [
                    "style.indexOf('-')>-1 && (style=style.replace(/-(\\w)/g,function(m,a){return a.toUpperCase()}));",
                    "style=='float' && (style='",
                    a ? "cssFloat" : "styleFloat",
                    "');return el.style[style] || ",
                    a ? "window.getComputedStyle(el, null)[style]" :
                        "el.currentStyle[style]", " || null;"
                ].join(""));
        }(),
        getBorders: function (a) {
            var b = $(a);
            return {
                top: parseInt(b.css("border-top-width"), 10) || 0,
                left: parseInt(b.css("border-left-width"), 10) || 0,
                bottom: parseInt(b.css("border-bottom-width"), 10) || 0,
                right: parseInt(b.css("border-right-width"), 10) || 0
            }
        },
        getPaddings: function (a) {
            var b = $(a);
            return {
                top: parseInt(b.css("padding-top"), 10) || 0,
                left: parseInt(b.css("padding-left"), 10) || 0,
                bottom: parseInt(b.css("padding-bottom"), 10) || 0,
                right: parseInt(b.css("padding-right"), 10) || 0
            }
        },
        getMargins: function (a) {
            var b = $(a);
            return {
                top: parseInt(b.css("margin-top"), 10) || 0,
                left: parseInt(b.css("margin-left"), 10) || 0,
                bottom: parseInt(b.css("margin-bottom"), 10) || 0,
                right: parseInt(b.css("margin-right"), 10) || 0
            }
        }
    };

    $.neFit = function () {
        console.log(123);
        fit.parse();
        $(window).on('resize.jqueryFitResize', function () {
            if (fit.doWindowResizeTimer) {
                clearTimeout(fit.doWindowResizeTimer)
            }
            debugger;
            fit.doWindowResizeTimer = setTimeout(function () {
                var f = document.documentElement.clientWidth;
                var d = document.documentElement.clientHeight;
                if (fit.__LastWindowWidth !== f && fit.__LastWindowHeight !== d) {
                    fit.__LastWindowWidth = f;
                    fit.__LastWindowHeight = d;
                    fit.parse();
                }
                fit.doWindowResizeTimer = null;
            }, 200);
        });
    };
}));