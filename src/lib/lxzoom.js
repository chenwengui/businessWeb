function LxZoom(options){
	var defaults = {
		// 大图显示区域的宽高
		width:200,
		height:300,

		// 大图的显示位置
		position:'right',

		// 小图与大图的间距
		gap:15,

		// 具有放大镜效果的选择器
		ele:'.lxzoom'
	}

	var opt = Object.assign({},defaults,options);
	
	this.width = opt.width;
	this.height = opt.height;
	this.position = opt.position;
	this.gap = opt.gap;
	this.ele = opt.ele;
}

LxZoom.prototype = {
	init(){
		// 小图容器
		var smallContainer = document.querySelector(this.ele);
		var smallImg = smallContainer.children[0];

		// 大图容器
		var bigContainer = document.createElement('div');
		bigContainer.className = 'lxzoom-big';

		// 定义样式
		bigContainer.style.width = this.width + 'px';
		bigContainer.style.height = this.height + 'px';

		smallImg.onload = ()=>{
			var left,top;
			if(this.position === 'right'){
				left = smallContainer.offsetLeft + smallImg.offsetWidth + this.gap;
				top = smallContainer.offsetTop;
			}else if(this.position === 'left'){
				left = smallContainer.offsetLeft - this.width - this.gap;
				top = smallContainer.offsetTop;
			}else if(this.position === 'top'){
				left = smallContainer.offsetLeft;
				top = smallContainer.offsetTop - this.height - this.gap;
			}else if(this.position === 'bottom'){
				left = smallContainer.offsetLeft;
				top = smallContainer.offsetTop + smallContainer.offsetHeight + this.gap;
			}

			bigContainer.style.left = left + 'px';
			bigContainer.style.top = top + 'px';
		}
		

		// document.createElement('img');
		var bigImg = new Image();
		bigImg.src = smallImg.dataset.big || smallImg.src;
		bigImg.style.width = '1600px';
		bigImg.style.height = '1600px';
		bigContainer.appendChild(bigImg);

		// 把大图写入页面
		document.body.appendChild(bigContainer);

		// 生成放大镜
		var zoom = document.createElement('div');
		zoom.className = 'minzoom';
		// 添加到小图容器
		smallContainer.appendChild(zoom);


		// 绑定事件
		smallContainer.onmouseenter = ()=>{
			this.show();
		}
		smallContainer.onmouseleave = ()=>{
			this.hide();
		}
		smallContainer.onmousemove = e=>{
			var left =  e.clientX - zoom.offsetWidth/2 - smallContainer.offsetLeft;
			var top = e.clientY - zoom.offsetHeight/2 - smallContainer.offsetTop+document.body.scrollTop||document.srcElement.scrollTop;

			if(left<0){
				left = 0;
			}else if(left > smallImg.offsetWidth - zoom.offsetWidth){
				left = smallImg.offsetWidth - zoom.offsetWidth;
			}

			if(top<0){
				top = 0;
			}else if(top > smallImg.offsetHeight - zoom.offsetHeight){
				top = smallImg.offsetHeight - zoom.offsetHeight
			}


			this.setPosition(left,top);
		}


		this.big = bigContainer;
		this.bigImg = bigImg;
		this.small = smallContainer;
		this.smallImg = smallImg;
		this.zoom = zoom;


	},
	show(){
		this.big.style.display = 'block';
		this.zoom.style.display = 'block';

		// 计算大图与小图的比例，用于计算移动的距离
		this.ratio = this.bigImg.offsetWidth/this.smallImg.offsetWidth;

		// 定义放大镜的形状
		this.zoom.style.width = this.width/this.ratio + 'px';
		this.zoom.style.height = this.height/this.ratio + 'px';
	},
	hide(){
		this.big.style.display = 'none';
		this.zoom.style.display = 'none';
		// this.big.parentNode.removeChild(this.big);
		// this.zoom.parentNode.removeChild(this.zoom);
	},
	setPosition(x,y){
		// 放大镜移动
		this.zoom.style.left = x + 'px';
		this.zoom.style.top = y + 'px';

		// 大图移动
		var bigImg = this.big.children[0];
		bigImg.style.left = -x*this.ratio + 'px'
		bigImg.style.top = -y*this.ratio + 'px'
	}
}

// 添加constructor属性
Object.defineProperty(LxZoom.prototype,'constructor',{
	value:LxZoom
});

