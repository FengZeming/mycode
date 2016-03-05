define(function(require) {
	var oSlider, oRecoTab, oAudiTab, oAlbumTab, oSpreadTab, oOriginalTab, oCoverTab, oHot,
		path = '../web/img/',
		siderPath = path + 'pic-scroll/';
	var onAnimate = function(e) {
		var $em = $(this).find('em'),
			iH = this.tagName.toLocaleLowerCase() === 'span' ? 30 : 36;
		iH += 'px';
		switch (e.type) {
			case 'mouseenter':
				$em.stop().animate({
					height: iH
				}, 300);
				break;
			default:
				$em.stop().animate({
					height: 0
				}, 300);
				break;
		}
	};
	//加载公共库
	require('jquery');
	require('jquery-support');
	require('jquery-sider');
	require('jquery-tab');
	require('jquery-gotop');
	$(function() {
		//获取元素
		oHot = $('#js-hot'),
			oSlider = $('#js-slider'),
			oRecoTab = $('#js-reco-tab'),
			oAudiTab = $('#js-audi-tab'),
			oAlbumTab = $('#js-album-tab'),
			oSpreadTab = $('#js-spread-tab'),
			oOriginalTab = $('#js-original-tab'),
			oCoverTab = $('#js-cover-tab');
		//载入数据
		oRecoTab.find('.jc-tab-content').html(require('tpl/index/tpl-reco')(require('json/index/json-reco')));
		oAudiTab.find('.jc-tab-content').html(require('tpl/index/tpl-audi')(require('json/index/json-audi')));
		oAlbumTab.find('.jc-tab-content').html(require('tpl/index/tpl-ablum')(require('json/index/json-album')));
		oSpreadTab.find('.jc-tab-content').html(require('tpl/index/tpl-spread')(require('json/index/json-spread')));
		oOriginalTab.find('.jc-tab-content').html(require('tpl/index/tpl-song')(require('json/index/json-song1')));
		oCoverTab.find('.jc-tab-content').html(require('tpl/index/tpl-song')(require('json/index/json-song2')));
		//监听事件
		oHot.on('mouseenter mouseleave', 'li>span', onAnimate);
		oHot.on('mouseenter mouseleave', 'dt', onAnimate);
		//幻灯片
		oSlider.sider({
			wd: 650,
			list: [{
				href: '#',
				url: siderPath + '1.jpg'
			}, {
				href: '#',
				url: siderPath + '2.jpg'
			}, {
				href: '#',
				url: siderPath + '3.jpg'
			}, {
				href: '#',
				url: siderPath + '4.jpg'
			}, {
				href: '#',
				url: siderPath + '5.jpg'
			}, {
				href: '#',
				url: siderPath + '6.jpg'
			}]
		});
		//选项卡
		oRecoTab.tab();
		oAudiTab.tab();
		oAlbumTab.tab();
		oSpreadTab.tab();
		oOriginalTab.tab();
		oCoverTab.tab();
		//侧栏工具与返回顶部 
		$.gotop();
	});

});