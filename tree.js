/*
   未完成 遍历目录使用同步方式
 * 
 * */


var nPath = require('path');
var nFs = require('fs');

var arry = [];
var fuhao = '* ';
var suojin = ' ';
var index = 0;

fileEach();

function fileEach() {
	if (nFs.existsSync('SUMMARY.md')) {
		nFs.unlink('SUMMARY.md', function(e) {
			if (e) throw e;
			create();
		});
	} else {
		create();
	}
};
function create(path) {
	var path = path || (arry = [], index = 0, __dirname);
	nFs.readdir(path, function(e, files) {
		if (e) throw e;
		files.forEach(function(filename) {
			nFs.stat(nPath.join(path, filename), function(e, stats) {
				if (e) throw e;
				if (filename.charAt(0) === '.') return;
				if (stats.isFile()) {}
				if (stats.isDirectory()) {
					arry.push(filename);
					index = path.substring(__dirname.length).split(nPath.sep).length;
					writeFile(getSuojin(index) + fuhao + filename);
					create(nPath.join(path, filename));
				}
			});
		});
	});
}
function getSuojin(len) {
	var suojin = '';
	for (var i = 0; i < len; i++) {
		suojin += ' ';
	}
	return suojin;
}
function writeFile(data) {
	nFs.open('SUMMARY.md', 'a', 0644, function(e, fd) {
		if (e) throw e;
		nFs.write(fd, data + '\n', 0, 'utf8', function(e) {
			if (e) throw e;
			nFs.closeSync(fd);
		})
	});
}