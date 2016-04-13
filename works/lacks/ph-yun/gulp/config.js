module.exports = function(src, dist) {
	return {
		image: {
			isUse: true,
			src: [src + 'img/**/*.{jpg,jpeg,png,gif,svg}', src + 'css/img/**/*.{jpg,jpeg,png,gif,svg}'],
			dist: [dist + 'img/', dist + 'css/img/'],
			option: {
				optimizationLevel: 5,//类型：Number  默认：3  取值范围：0-7（优化等级）
				progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
				interlaced: true,//类型：Boolean 默认：false 隔行扫描gif进行渲染
				multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
			}
		},
		sass: {
			isUse: true,
			isMap: true,
			src: [src + 'sass/**/*.{sass,scss}'],
			dist: [dist + 'css/']
		},
		script: {
			isUse: true,
			isMap: true,
			src: [src + 'js/**/*.js'],
			dist: [dist + 'js/']
		},
		copy: {
			isUse: true,
			src: [src + 'fonts/**/*', src + 'app/**/*.html'],
			dist: [dist + 'fonts/', dist + 'app/']
		},
		browsersync: {
			isUse: true,
			option: {
				server: {
					baseDir: [dist, src]
				},
				port: 9999,
				files: [
					dist + 'app/**/*.html',
					dist + 'css/**/*.css',
					dist + 'js/**/*.js',
					dist + 'img/**/**',
					dist + 'fonts/**/**'
				]
			}
		},
		useref: {
			isUse: false,
			isMap: true,
			src: [src + 'app/**/*.html'],
			dist: [dist + 'app/']
		}
	}
};