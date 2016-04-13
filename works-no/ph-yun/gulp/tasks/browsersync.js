module.exports = function($, taskName) {
	//
	var gulp = $.gulp,
		browserSync = $.browserSync,
		config = $.config[taskName];
	//
	gulp.task(taskName, function() {
		browserSync.init(config.option);
	});
};

