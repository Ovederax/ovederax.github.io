'use strict'

/*///
* @autor Ovederax
/*///

//------DOM_VARIABLE----------------
var canvas	= document.getElementById("canvas");

function Timer() {
	var time = Date.now();
	this.start = function() {
		time=Date.now();
	};
	this.getElapsedTime = function() {
		var tmp = time;
		time = Date.now();
		return time-tmp;
	}
}

var list = ["img/15.png"]
var loader = new ImgLoader();

loader.load(list,main);


function main() {
	var spj = new SpriteJS(canvas);
	var animDate = new AnimData(4,100,0);
	var animateSprite = new AnimateSprite(loader.getImg(list[0]),new Rect(0,0,100,100),animDate);
	var i = 0;
	function draw() {
		spj.clearCanvas();
		spj.drawSprite(animateSprite,{x:i*4,y:i*4});
		animateSprite.nextStep();
		++i;
		setTimeout(draw,100);
	}
	draw();
}




