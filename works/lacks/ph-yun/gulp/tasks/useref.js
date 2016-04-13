module.exports = function($, taskName) {
	var gulp = $.gulp,
		color = $.color,
		p = $.plug;
	var config = $.config[taskName];
	//	
	function task(src, dist) {
		var sassTask = $.lazypipe()
			.pipe(function() {
				return $.util.combinerTask([
					p.sass().on('error', function(err) {
						console.log(taskName + '报错!!!: ', color.red(err.message));
					})
				]);
			});
		var cssTask = $.lazypipe()
			.pipe(function() {
				return $.util.combinerTask([
					p.if(config.isMap, p.sourcemaps.init()),
					p.csso($.global.csso),
					p.autoprefixer($.global.autoprefixer),
					p.if(config.isMap, p.sourcemaps.write('./'))
				]);
			});

		var jsTask = $.lazypipe()
			.pipe(function() {
				return $.util.combinerTask([p.jshint(),
					p.jshint.reporter('jshint-stylish'),
					p.if(config.isMap, p.sourcemaps.init()),
					p.uglify(),
					p.if(config.isMap, p.sourcemaps.write('./'))
				]);
			});
		$.util.combinerTask([
			gulp.src(src),
			p.useref(),
			p.if('**/*.scss', sassTask()),
			p.if('**/*.css', cssTask()),
			p.if('**/*.js', jsTask()),
			gulp.dest(dist)
		]);
	}
	//
	gulp.task(taskName, function() {
		console.log(color.cyan('编译' + taskName + ' ... '));
		config.src.forEach(function(src, i) {
			var bsrc = $.util.getBasePath(src),
				dist = config.dist[i];
			task(src, dist);
			$.util.watch(src, bsrc, dist, taskName, task);
		});
	});
};