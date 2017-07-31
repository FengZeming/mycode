//组件
var $ = require('gulp');
	var bs = require('browser-sync');
$.task('default', function() {
	bs.init({
			server: {
				baseDir: ['./']
			},
			port: 9999,
			files: [
				'./*.html',
				'./css/*.css',
				'./js/*.js',
				'./img/**/**',
				'./fonts/**/**'
			]
	});

});