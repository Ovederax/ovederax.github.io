'use strict'

/**
* Клон игры Life
* @autor Ovederax
* @version 30.08.18
* @license LGPL
*/
/**/

//------DEFINE----------------------
var BlockState = {
	dead: 0,
	life: 1
}

//------DOM_VARIABLE----------------
var canvas	= document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//------Global variable--------------
var setting = {
	field: null,
	fieldBuffer: null,
	h: 300,
	w: 300,
	dh: 2,
	dw: 2,
	timeout: 40,
	MaxSleep: 1000,
	MinSleep: 30,
	thread: null,
	isPause: false
}
var colors = ["#000000","#007700"];

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
	var mouseObj = {btnClick:0};
	mouseHandle = mouseHandle.bind(mouseObj);
	mouseDown = mouseDown.bind(mouseObj);
	mouseUp = mouseUp.bind(mouseObj);
	canvas.addEventListener("mousedown",mouseDown);
	canvas.addEventListener("mouseup",mouseUp); 
	canvas.addEventListener("mouseout",mouseUp);
	canvas.addEventListener("mousemove",mouseHandle);
	canvas.oncontextmenu = function() {return false;};
}

//------Field -----------------------
/*void*/function clearField()  {
	for(var i=0;i<setting.h;++i)
	{
		for(var j=0;j<setting.w;++j) {
			setting.field[i][j] = 0;
		}
	}
	ctx.fillStyle = colors[BlockState.dead];
	ctx.fillRect(0,0,canvas.height,canvas.width);//<--- optimize
}
/*void*/function randField(seed)  {
	var buff = setting.field;
	var field = setting.field = setting.fieldBuffer;
	setting.fieldBuffer = buff;
	
	seed = seed || 0.3;
	for(var i=0;i<setting.h;++i)
	{
		for(var j=0;j<setting.w;++j) {
			var r = Math.random();
			r = (r>seed)? 0:1;
			setting.field[i][j] = r;
		}
	}

	draw();
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
	switch(ch) {
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
			randField();
			break;
		break;
		default:
	}
}
/*void*/function mouseDown(e) {
	this.btnClick = e.which;
}
/*void*/function mouseUp(e) {
	this.btnClick = 0;
}
/*void*/function mouseHandle(e) {
	var mouseLeft  = 1,
		mouseRight = 3;
	/*
    event.which == 1 – левая кнопка
    event.which == 2 – средняя кнопка
    event.which == 3 – правая кнопка
	*/	
	if(e.type == "mousemove") {
		if(this.btnClick == 0)
			return;
		var isLife = BlockState.dead;
		if(this.btnClick == mouseLeft) {
			isLife = BlockState.life;
		}
		var x = e.layerX,
			y = e.layerY;
		x = Math.trunc(x/setting.dw); 
		y = Math.trunc(y/setting.dh);
		
		setting.field[y][x] = isLife;	
		drawBlock(setting.field[y][x],x,y);
	}
}
//------Draw-------------------------
/*void*/function drawBlock(block,x,y) {
	ctx.fillStyle = colors[block];
	ctx.fillRect(x*setting.dw,y*setting.dh,setting.dw,setting.dh);
}
/*void*/function draw() {
	for(var i=0; i<setting.field.length; ++i)
		for(var j=0; j<setting.field[i].length; ++j) {
			if(setting.field[i][j] != setting.fieldBuffer[i][j])
				drawBlock(setting.field[i][j],j,i);	
		}
}

//------Logic------------------------
/*void*/function newGame() {
	clearField();
}
/*void*/function pause() {
	setting.isPause = !setting.isPause;
}
/*long*/function random(max) {
	return Math.trunc(Math.random()*max);
};
/*void*/function specialCount(i,j,buff,field) {
	var count=0;
	var top=i-1,left=j-1,right=j+1,down=i+1;
	if(i==0) {	
		top = buff.length-1;
	}else if(i == setting.field.length-1) {
		down = 0;
	}
	if(j==0) {
		left = buff[0].length-1;
	}else if(j==setting.field[0].length-1) {
		right=0;
	}
	count+=buff[top][left];
	count+=buff[top][j];
	count+=buff[top][right];
	
	count+=buff[i][left];
	count+=buff[i][right];
	
	count+=buff[down][left];
	count+=buff[down][j];
	count+=buff[down][right];
	
	if(count<2) {
		field[i][j] = BlockState.dead;
	}else if(count == 2) {
		field[i][j]=buff[i][j];
	}else if(count == 3){
		field[i][j] = BlockState.life;
	}else {
		field[i][j] = BlockState.dead;
	}
}
/*void*/function logic() {
	var count;
	var buff = setting.field;
	var field = setting.field = setting.fieldBuffer;
	setting.fieldBuffer = buff;
	
	
	for(var i=1; i<buff.length-1; ++i) {
		for(var j=1;j<buff[i].length-1;++j) {
			count=0;
			count+=buff[i-1][j-1];
			count+=buff[i-1][j];
			count+=buff[i-1][j+1];
			
			count+=buff[i][j-1];
			count+=buff[i][j+1];
			
			count+=buff[i+1][j-1];
			count+=buff[i+1][j];
			count+=buff[i+1][j+1];
			
			if(count<2) {
				field[i][j] = BlockState.dead;
			}else if(count == 2) {
				field[i][j]=buff[i][j];
			}else if(count == 3){
				field[i][j] = BlockState.life;
			}else {
				field[i][j] = BlockState.dead;
			}
		}
	}
	//special
	for(var j = 0;j<buff[0].length;++j) {
		specialCount(0,j,buff,field);
		specialCount(buff.length-1,j,buff,field);
	}
	for(var i = 0;i<buff.length;++i) {
		specialCount(i,0,buff,field);
		specialCount(i,buff[0].length-1,buff,field);
	}
		
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
randField();








