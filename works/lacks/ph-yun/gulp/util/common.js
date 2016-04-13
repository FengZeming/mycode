const SRC = './src/';
const DIST = './dist/';
var gulp = require('gulp'),
	plug = require('gulp-load-plugins')(),
	del = require('del'),
	combiner = require('stream-combiner2'),
	runSequence = require('run-sequence'),
	browserSync = require('browser-sync').create(),
	color = require('bash-color'),
    px2rem =require('postcss-px2rem'); 
	lazypipe = require('lazypipe');

//数据	
var config = require('../config')(SRC, DIST);
module.exports = {
	gulp: gulp,
	plug: plug,
	del: del,
	combiner: combiner,
	color: color,
	runSequence: runSequence,
	browserSync: browserSync,
	lazypipe: lazypipe,
	px2rem:px2rem,
	global: {
		src: SRC,
		dist: DIST,
		autoprefixer: {
			browsers: 'last 4 versions'
		},
		csso: {
			debug: false
		},
		filter: {
			script: '**/*.js',
			sass: '**/*.css',
			image: '**/*.{jpg,jpeg,png,gif,svg}',
			copy: '**/*'
		}
	},
	config: config,
	util: {
		combinerTask: function(taskArray) {
			return	combiner.obj(taskArray).on('error', function(err) {
				console.log('\n');
				console.log(color.red('＝＝＝　出错!!!　＝＝＝'));
				console.log('【文件名: ' + color.red(err.fileName) + ' 】');
				console.log('【所在行: ' + color.red(err.lineNumber) + ' 】');
				console.log('【错误信息: ' + err.message + ' 】');
				console.log('【插件: ' + color.yellow(err.plugin) + ' 】');
				console.log('\n');
			});
		},
		watch: function(src, bsrc, dist, taskName, func) {
			gulp.watch(src, function(event) {
				var paths = plug.watchPath(event, bsrc, dist);
				console.log(color.green(taskName + ': ' + event.type) + ' ' + color.yellow(paths.srcPath));
				console.log(color.green('更新到: ') + color.yellow(paths.distPath));
				console.log(paths.distDir);
				func(paths.srcPath, paths.distDir);
			});
		},
		//将目录后面的*全部去掉 例如 src/css/**/*.css  = src/css/
		getBasePath: function(dir) {
			return dir.match(/.*?(?=\*)/)[0];
		}
	}

};