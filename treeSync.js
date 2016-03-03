var nPath = require('path');
var nFs = require('fs');
var arry = [];
var index = 0;
var mdName = 'SUMMARY.md';
var aExclude = ['jq.js', 'README.md', 'tree.js', 'treeSync.js'];
var rPath = '';

//调用方法
main();

//主方法
function main() {
	nFs.existsSync(mdName) && nFs.unlinkSync(mdName);
	createData();
}
//创建数据
function createData(path) {
	var path = path || (arry = [], __dirname);
	var files = nFs.readdirSync(path); //同步读取文件
	//遍历
	files.forEach(function(filename) {
		if (filename.charAt(0) === '.') return;
		//同步读取文件信息
		var stat = nFs.statSync(nPath.join(path, filename));
		//文件层级 
		index = path.substring(__dirname.length).split(nPath.sep).length;
		if (index === 1) {
			arry = [];
		}
		//如果文件是文件夹
		if (stat.isDirectory()) {
			!arry[index - 1] ? arry.push(filename) : arry[index - 1] = filename;
			//写入文件
			writeData(filename, index, 'd');
			//递归
			createData(nPath.join(path, filename));
		}
		if (stat.isFile() && aExclude.indexOf(filename) === -1) {
			writeData(filename, index);
		}
	});
}
//层级字符串
function getLevel(len) {
	var level = '';
	for (var i = 0; i < len; i++) {
		level += ' ';
	}
	return level;
}
//获取组织好的数据
function getData(filename, index, type) {
	var type = type || 'f';
	return getLevel(index) + '* ' + '[' + filename + '](./' + arry.join('/') + (type === 'd' ? '' : '/' + filename) + ')\n';
}


//写入数据
function writeData(filename, index, type) {
	var data = getData(filename, index, type);
	nFs.open(mdName, 'a', 0644, function(e, fd) {
		if (e) throw e;
		nFs.write(fd, data, 0, 'utf8', function(e) {
			if (e) throw e;
			nFs.closeSync(fd);
		})
	});
}