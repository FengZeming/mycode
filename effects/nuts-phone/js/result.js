var aImg = document.getElementsByTagName('img');
var aLi = document.getElementsByTagName('li');
var oUl = document.getElementById('oUl');

var cw = view().w; //屏幕宽度
var liw = cw / 7 / cw * 100 + '%'; //li平均宽度
var litop;
var scopew = oUl.offsetWidth / 7 * 5; //效果影响范围
var focus; //图片中心点宽度
var i = 0; //循环变量
var timer;
var etime;
var onoff = true;

function view() {
	return {
		w: document.documentElement.clientWidth
	}
}

function offsetL(obj) {
	var left = 0;
	while (obj) {
		left += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	return left;
}

function initLiwidth() {
	for (i = 0; i < aLi.length; i++) {
		aLi[i].style.width = liw;
		aImg[i].index = i;
	}

}

function animation(e) {
	var atime = new Date().valueOf();
	for (i = 0; i < aImg.length; i++) {
		var oImg = aImg[i];
		//中心点X轴的距离
		var middle = offsetL(oImg) + focus;
		//鼠标到每张图片中心点X轴的一个差值
		var distance = Math.abs(e.clientX - middle);
		if (distance > scopew) distance = scopew;
		//得到一个比例
		var scale = Math.abs(distance / scopew) * 60; //鼠标距离x轴中心点差值比例
		var top = oImg.getBoundingClientRect().top - litop; //图片距离li的差值
		var n = top / oImg.offsetHeight * 100; //比例值
		var t = (scale - n) / 1;
		n += t;
		oImg.style.transform = 'translate3d(0,' + n + '%,0)';
	}
	if (atime - etime < 1000) {
		timer = requestAnimationFrame(function() {
			animation(e);
		});
	}
}

function mousemove(e) {
	focus = aImg[0].offsetWidth / 2;
	litop = aLi[0].getBoundingClientRect().top;
	etime = new Date().valueOf();
	cancelAnimationFrame(timer);
	timer = requestAnimationFrame(function() {
		animation(e);
	});
}

function onmouseout() {
	cancelAnimationFrame(timer);
	for (i = 0; i < aImg.length; i++) {
		aImg[i].removeAttribute('style');
	}
}

initLiwidth();
oUl.onmousemove = mousemove;
oUl.onmouseout = onmouseout;

oUl.onclick = function(e) {
	cancelAnimationFrame(timer);
	if (onoff) {

		var target = e.target;
		if (target.tagName.toLowerCase() === 'img') {
			oUl.className = 'zoom';
			target.parentNode.className = 'active';
			for (var i = 0; i < aImg.length; i++) {
				if (i < target.index) {
					aImg[i].parentNode.className = 'prev';
				} else if (i > target.index) {
					aImg[i].parentNode.className = 'next';
				}
			}
			var middle = offsetL(target) + target.offsetWidth / 2;
			var value = view().w / 2 - middle;
			oUl.style.transform = 'translate3d(' + value * 3 + 'px,0,0) scale(3)';
			oUl.onmousemove = null;
			oUl.onmouseout = null;
		}
		onoff = false;
	} else {
		oUl.removeAttribute('style');
		oUl.removeAttribute('class');
		for (i = 0; i < aLi.length; i++) {
			aLi[i].removeAttribute('class');
		}

		setTimeout(function() {
			oUl.onmousemove = mousemove;
			oUl.onmouseout = onmouseout;
			onoff = true;
		}, 300);

	}

};