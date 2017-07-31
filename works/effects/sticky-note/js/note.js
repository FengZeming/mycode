/**
 * 便利贴 - 
 * 参数:{
 * 		root: 容器id
 *		tpl:  模板id
 *		text: 便利贴文本
 *		noteWidth: 便利贴宽度
 *		noteHeight: 便利贴高度
 *		noteLeft: 左边距
 *		noteTop: 上边距
 * }
 */
var note = (function(undefined) {
	var dconfig = {
		root: '#js-content',
		tpl: '#tpl',
		text: '前端患者，有何不可。',
		noteWidth: 160,
		noteHeight: 166,
		noteLeft: 15,
		noteTop: 15
	};
	// headColor, containerColor
	var colors = [
		['#ea9b35', '#efb04e'],
		['#dd598b', '#e672a2'],
		['#eee34b', '#f2eb67'],
		['#c24226', '#d15a39'],
		['#c1c341', '#d0d25c'],
		['#3f78c3', '#5591d2']
	];
	var counters; //计数器
	var nRow; //hang
	var nColumn; //列
	function Constructor(config) {}
	Constructor.prototype = {
		init: function(config) {
			this.c = $.extend({}, dconfig, config);
			this.c.$root = $(this.c.root);
			this.params();
			this.bind();
			this.load();
		},
		params: function() {
			counters = 1;
			nRow = 1;
			var rootWidth = this.c.rootWidth = this.c.$root.outerWidth();
			nColumn = Math.floor(rootWidth / (this.c.noteWidth + this.c.noteLeft));
		},
		bind: function() {
			var self = this;
			var timer = 0;
			$(window).on('resize.note', function() {
				clearTimeout(timer);
				timer = setTimeout(function() {
					self.params();
					self.reset();
				}, 300);
				return false;
			});

			$(document).on('focusin focusout keyup paste', '.note-ct', function(e) {
				var type = e.type;
				var $ct = $(this);
				if (type === 'focusin') {
					$ct.data('before', $ct.html());
					return false;
				}
				if ($ct.data('before') != $ct.html()) {
					var id = $ct.closest('.note').attr('id');
					self.save(id, $ct.html());
				}
				return false;
			});

		},
		add: function(id, text) {
			var $root = this.c.$root;
			var color = colors[Math.floor(Math.random() * 6)];
			var tpl = $(this.c.tpl).html();
			var $note = $(template(tpl, {
				color: color,
				text: text || this.c.text
			}));
			var coord = this.getCoord();
			$note.css({
				left: coord.left,
				top: coord.top
			});
			$note.attr('id', id || 'note_' + (Math.random() + '').substr(2, 8));
			$root.append($note);
		},
		getCoord: function() {
			var left = this.c.noteLeft;
			var top = this.c.noteTop;
			var width = this.c.noteWidth;
			var height = this.c.noteHeight;
			if (counters > nColumn) {
				counters = 1;
				nRow++;
			}
			var o = {
				left: left + (left + width) * counters - (left + width),
				top: top + (top + height) * nRow - (top + height)
			};
			counters++;
			return o;
		},
		reset: function() {
			var self = this;
			var $root = this.c.$root;
			var aNote = $root.find('.note');
			aNote.each(function(i) {
				var coord = self.getCoord();
				$(this).css({
					left: coord.left,
					top: coord.top
				});
			});
		},
		save: function(id, html) {
			localStorage[id] = html;
		},
		del: function(id) {
			delete localStorage[id];
		},
		load: function() {
			var self = this;
			$.each(localStorage, function(key, value) {
				if (key.indexOf('note_') === 0) {
					self.add(key, value);
				}
			});
		}

	};
	var Note = new Constructor();
	return {
		init: function(config) {
			Note.init(config);
		},
		add: function() {
			Note.add();
		},
		del: function(id) {
			Note.del(id);
		}
	};
})();