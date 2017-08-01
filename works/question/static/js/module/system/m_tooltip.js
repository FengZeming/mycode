define(function (require) {
    'use strict';
    var $ = require('jquery');
    require('bootstrap');
    // tooltips
    $('.jc-tooltip-box').tooltip({
        selector: "[data-toggle=tooltip]",
        container: "body"
    });

});