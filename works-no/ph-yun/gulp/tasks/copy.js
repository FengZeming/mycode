module.exports = function($, taskName) {
	var gulp = $.gulp,
		color = $.color,
		p = $.plug;
	var config = $.config[taskName];
	//	

	function task(src, dist) {
		const filter = p.filter($.global.filter[taskName], {
			restore: true
		});
		$.util.combinerTask([
			gulp.src(src),
			filter,
			gulp.dest(dist),
			filter.restore
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