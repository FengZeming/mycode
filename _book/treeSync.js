 /**
 * 遍历当前文件夹下所有文件，生成summary.md
 * 过滤  开头 = ^. ||  ^_ 
 * 过滤  结尾 = .md$
 * 文件
 * 通过遍历文件生成带有层级的json数据最后写入summary.md
 */
var nPath = require('path');
var nFs = require('fs');
var mdName = 'SUMMARY.md';
var data = [];
//调用方法
main();

//主方法
function main() {
	nFs.existsSync(mdName) && nFs.unlinkSync(mdName);
	eachData(getJson());
	writeData(data.join(''));
	//console.log(JSON.stringify(getJson(),undefined,1));
	
}
//组织数据
function eachData(json) {
	if (json['name'] !== 'root') {
		data.push(getData(json['name'], json['path']));
	}
	json['children'].forEach(function(chid) {
		if (typeof chid === 'string') {
			data.push(getData(chid, json['path'] + '/' + chid));
			return;
		}
		eachData(chid);
	});
}

//创建数据
function getJson(path, name) {
	var name = name || 'root',
		path = path || __dirname,
		files = nFs.readdirSync(path),
		o = {
			name: name,
			path: path.substring(__dirname.length).replace(/\\/g, '/')
		};
	o.children = files.map(function(filename) {
		//去掉以. _ 开头 或 .md 为结尾的文件
		if (/(^\.)|(^\_)|(\.md$)/.test(filename))return;
		var stat = nFs.statSync(nPath.join(path, filename));
		if (stat.isDirectory()) {
			return getJson(nPath.join(path, filename), filename);
		}
		return filename;
	}).filter(function(e) {
		return e; //过滤null
	}).sort(function(a, b) {
		return /\.[a-z]+$/.test(a) - /\.[a-z]+$/.test(b); //将非目录的文件排序到最后
	});
	return o;
}

//层级字符串
function getLevel(index) {
	var level = '';
	for (var i = 0; i < index; i++) {
		level += '  ';
	}
	return level;
}

//获取组织好的数据
function getData(filename, path) {
	var index = path.split('/').length;
	return getLevel(index-1) + '* [' + filename + '](.' + path + ')\n';
}

//写入数据
function writeData(data) {
	nFs.writeFileSync(mdName, data, {
		encoding: 'utf8',
		flag: 'a'
	});
}