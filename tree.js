var nPath = require('path');
var nFs = require('fs');

var arry = [];
var fuhao = '* ';
var suojin = ' ';
var index = 0;
fileEach();

console.log(arry);

function fileEach(path) {
	var path = path || __dirname;
	index++;
	nFs.readdir(path, function(err, files) {
		if (err) throw err;
		files.forEach(function(filename) {
			nFs.stat(nPath.join(path, filename), function(err, stats) {
				if (err) throw err;
				if (filename.charAt(0) === '.') return;
				if (stats.isFile()) {}
				if (stats.isDirectory()) {
					console.log()
					writeFile(getSuojin(index) + fuhao + filename);
					fileEach(nPath.join(path, filename));
				}
			});
		});
	});
};




function getSuojin(len) {
	var suojin = '';
	for (var i = 0; i < len; i++) {
		suojin += ' ';
	}
	return suojin;
}


function writeFile(data) {
	nFs.open('SUMMARY.md','a', 0644, function(e, fd) {
		if (e) throw e;
		nFs.write(fd, data + '\n', 0, 'utf8', function(e) {
			if (e) throw e;
			nFs.closeSync(fd);
		})
	});

}