define(function (require) {

    require('mGlBtns');
    var $box = $('.jc-mod-info');


    var caMod = {};

    $box.each(function (i) {
        var $this = $(this);
        caMod[this.id] = {
            $list: $this.find('.jc-mod-info-list'),
            $sticky: $this.find('.jc-mod-info-list_sticky'),
            $normal: $this.find('.jc-mod-info-list_normal')
        };
    });


    //定义当前模块所有按钮的参数
    var oPopup = {
        schedule: {title: '日程', url: './mod_notice/notice_add.html',height:'500px',width:'600px'},
        sticky: {event: 'onMid_Sticky'},
        delete: {title: '确定要删除该条记录吗？', event: 'onMid_delete'}
    };


    //定义当前页面按钮的函数
    //删除
    $.subPattern('onMid_delete').subscribe(function (option, callBack) {
        var $this = option.bobj.$this, $p = option.bobj.$parent;
        $p.addClass('animated fadeOutUp');
        setTimeout(function () {
            $p.remove();
        }, 1100);
        callBack();
    });

    //置顶
    $.subPattern('onMid_Sticky').subscribe(function (option) {
        var $this = option.bobj.$this, $p = option.bobj.$parent, modId = $this.data('modid');
        var $clone = $p.clone(true);
        $p.addClass('animated fadeOutUp');
        setTimeout(function () {
            $p.remove();
            setTimeout(function () {
                $clone.addClass('animated fadeInDown');
                caMod[modId].$sticky.prepend($clone);
            }, 0);
        }, 1000);
    });


    $box.on('click.pageInfodefBtn', '.jc-btn', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(e.currentTarget),
            $parent = $this.parents('.jc-mod-info-item'),
            caBtn = $this.data('btn'),
            option = {bobj: {$parent: $parent, $this: $this}, bdata: {}, popup: {}};
        $.extend(option.popup, oPopup[caBtn.id]);
        $.subPattern(caBtn.name).publish(option);
    });
});
