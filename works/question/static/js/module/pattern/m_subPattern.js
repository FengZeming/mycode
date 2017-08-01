/**
 * 发布订阅模式
 */
define(['jquery'], function ($) {

    var topics = {};

    $.subPattern = function (id) {
        var callbacks,
            topic = id && topics[id];
        if (!topic) {
            callbacks = $.Callbacks();
            topic = {
                publish     : callbacks.fire,
                subscribe   : callbacks.add,
                unsubscribe : callbacks.remove
            };
            if (id) {
                topics[id] = topic;
            }
        }
        return topic;
    };


    return {
        hasProperty : function (o, attr) {
            return o.hasOwnProperty(attr);
        },
        subEvent    : function (event, func) {
            $.subPattern(event).subscribe(func);
        },
        pubEvent    : function (event) {
            return   $.subPattern(event).publish.apply(this, Array.prototype.slice.call(arguments).slice(1));
        }
    };


});
