### 微风香水作品集
- 左边导航使用nodejs动态创建
- js + css3 样式结构


<link rel="stylesheet" type="text/css" href="./css/tree.css"/>
<script>
var oParent =  document.querySelector('.summary');
var aLi = oParent.querySelectorAll('.chapter');
	for (var i = 0; i < aLi.length; i++) {
		 var oInput = document.createElement('input');
			 oInput.type = 'checkbox';
		 aLi[i].insertBefore(oInput,aLi[i].querySelector('span'));
	}
	oParent.addEventListener('click',function (e) {
		if(e.target.tagName.toLocaleLowerCase()==='a'){
			e.stopPropagation(),e.preventDefault();
			window.open(e.target.getAttribute('href'));
		}
	});
</script>


