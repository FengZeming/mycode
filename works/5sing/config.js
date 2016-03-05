seajs.config({
	base: '../static/',
	alias: {
		'jquery': 'js/libs/jquery/jquery/1.12.0/jquery.min',
		'jquery-support': 'js/modules/jquery/extend/support',
		'jquery-sider': 'js/modules/jquery/plugin/sider/1.1.0/sider',
		'jquery-tab': 'js/modules/jquery/plugin/tab/1.1.1/tab',
		'jquery-gotop': 'js/modules/jquery/plugin/go-top/1.1.0/go-top',
		'js-template': 'js/tpl/build/template'
	},
	paths: {
		'app': 'js/app',
		'tpl': 'js/tpl/build',
		'json': '../../../web/json'
	},
	charset: 'utf-8'
});