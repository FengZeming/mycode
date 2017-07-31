### 微风香水作品集

 - 前端作品
 
  - [5sing首页 ie8+ chrome@latest firefox@latest](http://fengzeming.github.io/mycode/works/full/5sing/views/index.html)
  - [复杂的后台模板 chrome@latest](http://fengzeming.github.io/mycode/works/full/admin/index.html)
  - [flex移动端布局 chrome@latest	](http://fengzeming.github.io/mycode/works/full/flex-layout/index.html)
  - [栅格化布局 chrome@latest](http://fengzeming.github.io/mycode/works/full/grid-layout/index.html)
  - [懒加载(全屏) ie8+ chrome@latest](http://fengzeming.github.io/mycode/works/effects/lazyload/screen/index.html)
  - [懒加载(固定宽度) ie8+ chrome@latest](http://fengzeming.github.io/mycode/works/effects/lazyload/fixed/index.html)
  - [懒加载(图片)  chrome@latest](http://fengzeming.github.io/mycode/works/effects/lazyload/img/index.html)
  - [坚果手机效果  chrome@latest](http://fengzeming.github.io/mycode/works/effects/nuts-phone/index.html)
  - [可拖拽便利贴效果 chrome@latest](http://fengzeming.github.io/mycode/works/effects/sticky-note/index.html)



<link rel="stylesheet" type="text/css" href="./css/tree.css"/>
<script>
var oParent =  document.querySelector('.summary');
var aLi = oParent.querySelectorAll('.chapter');
	for (var i = 0; i < aLi.length; i++) {
		 var oInput = document.createElement('input');oInput.type = 'checkbox';
		 var oChild = aLi[i].children[0],oB=oChild.querySelector('b');
			if(oB){
				oB.innerHTML='';
				var sHtml = oChild.innerText.replace(/\s+/g,'');
			 	var match = sHtml.match(/\.[a-z]+$/);
			 	if(match){
			 	  var oA = document.createElement('a');
			 	      oA.setAttribute('class','modify');
			 	  	  oA.href= aLi[i].getAttribute('data-path').replace(/\.[a-z]+$/,match[0]);
			 	  	  oA.innerHTML='<b></b>'+sHtml;
			 		aLi[i].removeChild(oChild);
			 		aLi[i].appendChild(oA);
			 		continue ;
			 	}
			}
			if(oChild.tagName.toLocaleLowerCase()==='span'){
			 aLi[i].insertBefore(oInput, oChild);
			}
	}
	oParent.addEventListener('click',function (e) {
		var tg =e.target,url;
		if(tg){
			 url = fzm_getURL(tg),!url&& (url= fzm_getURL(tg.parentNode));
			 url&&(e.stopPropagation(),e.preventDefault(),window.open(url));
		}
	});
	function fzm_getURL(node){
		 if(node.tagName.toLocaleLowerCase()==='a'){
		   return node.getAttribute('href');
		 }
	}
</script>


