//组件
var $ = require('./gulp/util/common.js'),
	gulp = $.gulp,
	runSequence = $.runSequence;
config = $.config;
taskList = [];
//将任务添加进来
for (var taskName in config) {
	if (config[taskName].isUse) {
		require('./gulp/tasks/' + taskName + '.js')($, taskName);
		taskName !== 'useref' && taskList.push(taskName);
	}
}
gulp.task('clean', function() {
	console.log($.color.cyan('清理目录...'));
	$.del.sync($.global.dist);
});
gulp.task('task', function() {
	gulp.start($.plug.taskListing);
});
gulp.task('default', ['task'], function() {
	runSequence('clean', taskList);
});

gulp.task('dist', function() {
	runSequence('clean', 'useref');
});