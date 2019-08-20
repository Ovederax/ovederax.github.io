'use strict'

/**
* Клон игры Chcckers
* @autor Ovederax
* @version ?
* @license LGPL
*/
/**/

//------DOM_VARIABLE----------------
var canvas	= document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//------Global variable--------------
var setting = {
	field: null,
	h: 300,
	w: 300,
	dh: 2,
	dw: 2,
	timeout: 40,
	thread: null,
	isPause: false
}
var colors = ["#000000"];

//------Init-------------------------
/*void*/function firstInit()  {
	setting.field = [];
	for(var i=0;i<setting.h;++i)
	{
		setting.field[i] = [];
		for(var j=0;j<setting.w;++j) {
			setting.field[i][j] = 0;
		}
	}
	
	setting.fieldBuffer = [];
	for(var i=0;i<setting.h;++i)
	{
		setting.fieldBuffer[i] = [];
		for(var j=0;j<setting.w;++j) {
			setting.fieldBuffer[i][j] = 0;
		}
	}
	
	ctx.fillRect(0,0,canvas.height,canvas.width);
	
	document.onkeydown = document.onkeypress = keyboard;
	document.body.onkeydown = document.body.onkeydown = keyboard
	
	canvas.addEventListener("mousedown",mouseHandle);
	canvas.addEventListener("mouseup",mouseHandle); 
	canvas.addEventListener("mouseout",mouseHandle);
	canvas.addEventListener("mousemove",mouseHandle);
}

//------Keyboard/Mouse----------------
/*void*/function getChar(event) {
	if (event.which == null) { 						// IE
		if (event.keyCode < 32) return null; 		// спец. символ
		return String.fromCharCode(event.keyCode)
	}
	if (event.which != 0 && event.charCode != 0) { 	// все кроме IE
		if (event.which < 32) 
			return null; 							// спец. символ
		return String.fromCharCode(event.which); 	// остальные
	}
	return null; 									// спец. символ
}
/*void*/function keyboard(event) {
	var ch = getChar(event);
	if(ch == null)
		return;
	ch = ch.toLowerCase();
	switch(ch)
	{
		case 'r':
		case 'к':
			randField();
			break;
		case 'c':
		case 'с':
			clearField();
			break;
		case 'p':
		case 'з':
			pause();
			break;
		break;
		case 'n':
		case 'т':
			newGame();
			break;
		break;
		default:
	}
}
//------Draw-------------------------
/*voidfunction drawBlock(block,x,y) {
	ctx.fillStyle = colors[block];
	ctx.fillRect(x*setting.dw,y*setting.dh,setting.dw,setting.dh);
}*/
/*void*/function draw() {
	for(var i=0; i<setting.field.length; ++i)
		for(var j=0; j<setting.field[i].length; ++j) {
			if(setting.field[i][j] != setting.fieldBuffer[i][j])
				drawBlock(setting.field[i][j],j,i);	
		}
}

//------Logic------------------------
/*void*/function newGame() {

}
/*void*/function pause() {
	setting.isPause = !setting.isPause;
}
/*long*/function random(max) {
	return Math.trunc(Math.random()*max);
};

/*void*/function logic() {

}
/*void*/function gameLoop() {
	//eventsHandler();
	if(!setting.isPause) {
		logic();
		draw();
	}
}
/*void*/function main() {
	firstInit();
	newGame();
	setting.thread = setInterval(gameLoop,setting.timeout);
}



main();








