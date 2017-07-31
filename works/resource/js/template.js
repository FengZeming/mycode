var template = function(tpl, data) {
	var reg = /<%([^>]+)?%>/g,
		regOut = /(^( )?(console|var|if|for|else|switch|case|break|{|}))(.*)?/g,
		code = 'var data =this,r=[];',
		cursor = 0;
	var add = function(line, js) {
			line= line.replace(/^\s+|\s+$/g,'');
		js ? (code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n') :
			(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');

	}
	while (match = reg.exec(tpl)) {
		add(tpl.slice(cursor, match.index));
		add(match[1], true);
		cursor = match.index + match[0].length;
	}
	add(tpl.substr(cursor, tpl.length - cursor));
	code += 'return r.join("");';
	return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
};