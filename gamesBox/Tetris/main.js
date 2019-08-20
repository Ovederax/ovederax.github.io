'use strict'

/**
* Tetris - game clone
* @autor Ovederax
* @version 01.09.18
* @license LGPL
*/
/**/
//--------------Html variable----------------------------
var canvas	= document.getElementById("canvas");
var ctx = canvas.getContext("2d");
//-------------Variable----------------------------------
var DEBUG = false;
var figur = {
	x:0,
	y:0,
	type:0,
	rotare:0,
	color:1,
	onGround:true
}
var shadowFigur = {
	x:0,
	y:0,
	type:0,
	rotare:0,
	color:1
}
var field;
var balls = [0,1,3,6,8];
var setting = {
	isGame:false,
	xlen:11,
	ylen:20,
	blockSize:30,// px
	top_padding:40,
	timeKeyEvent:40,//ms
	ticksToDown:10,
	countTicks:0,
	score:0,
	bestscore:0,
	difficult: {
		maxLevel: 30,
		minLevelTime: 40,
		ballStep: 2,
		timeDec:1
	}
}
var typeFigur = ["Quadr","L","J","ZLeft","ZRight","Stick"];
var figurs = { Quard:null,L:null,J:null,ZLeft:null,ZRight:null,Stick:null,Piramide:null }
var color = [];
var debug = function(){};

//---------------------Init------------------------------
/* Block place:
   0  1  2  3
   4  5  6  7
   8  9 10 11
  12 13 14 15
*/
/*void*/ function initFigurVariant(figurs) {
	/**Вращение по часовой стрелке*/
	figurs.Quadr = [[0,1,4,5]];
	figurs.L 	 = [[1,5,9,10],[8,4,5,6],[0,1,5,9],[4,5,6,2]];
	figurs.J 	 = [[1,5,9,8],[4,5,6,10],[2,1,5,9],[0,4,5,6]]; 
	figurs.ZLeft = [[4,5,9,10],[2,6,5,9]];
	figurs.ZRight= [[6,5,9,8],[1,6,5,10]];
	figurs.Stick = [[1,5,9,13],[4,5,6,7]];
	figurs.Piramide=[[1,4,5,6],[1,5,6,9],[4,5,6,9],[1,5,9,4]];
}
/*void*/ function firstInit() {
	document.onkeydown = document.onkeypress = keyboard;
	initColors();
	initField();
	initFigurVariant(figurs);
	getNewFigur(figur);
	if(DEBUG) {
		debug = function()
		{
			for(var i =0;i<arguments.length;++i)
				console.log(arguments[i]);
		}
	}
}
/*void*/ function initColors() {
	color[0] = "#000000";
	color[1] = "#444444";
	for(var i=2;i<32;++i)
	{
		color[i] = "#"+(Math.floor(Math.random()*170)+70).toString(16);
		color[i] +=(Math.floor(Math.random()*170)+70).toString(16);
		color[i] +=(Math.floor(Math.random()*170)+70).toString(16);
	}
	
}
/*void*/ function initField() {
	field = []
	for(var i=0;i<setting.ylen;++i)
	{
		field[i] = []
		for(var j=0;j<setting.xlen;++j)
		field[i][j] = 0;
	}
}
//---------------------Draw------------------------------
/*void*/ function draw() {
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,setting.top_padding,canvas.width,canvas.height);
	//111
	
	ctx.fillStyle = "#aaaaaa";
	ctx.fillRect(0,0,canvas.width,setting.top_padding);
	ctx.fillStyle = "#ffffff";
	ctx.font = "36px serif";
	ctx.fillText("Score: "+setting.score,0,setting.top_padding-6);
	ctx.fillText("Best: "+setting.bestscore,180,setting.top_padding-6);
	
	for(var i=0;i<field.length;++i)
		for(var j=0;j<field[i].length;++j)
			drawBlock(field[i][j],i,j);
	drawShadowFigur(shadowFigur);
}
/*void*/ function clearField() {
	for(var i=0;i<setting.ylen;++i)
		for(var j=0;j<setting.xlen;++j)
			field[i][j] = 0;
}
/*void*/ function drawFigure(figure) {
	var fmass,x,y;
	fmass = getMassElem(figure);
	for(var i = 0; i<fmass.length; ++i)
	{
		x = fmass[i] % 4 +figure.x;
		y = Math.floor(fmass[i] / 4) +figure.y;
		if(!((y<0) || (x>=setting.xlen) || (x<0) || y>=setting.ylen))
			drawBlock(figure.color,y,x);
	}
}
/*void*/ function drawBlock(colorID,y,x) {
	var tp = setting.top_padding;
	var size = setting.blockSize;
	ctx.fillStyle = color[colorID];
	ctx.fillRect(x*size,tp+y*size,size,size);
	ctx.strokeRect(x*size,tp+y*size,size,size);
}
/*void*/ function drawShadowFigur(shadow) {
	var fmass,x,y;
	fmass = getMassElem(shadow);
	for(var i = 0; i<fmass.length; ++i)
	{
		x = fmass[i] % 4 +shadow.x;
		y = Math.floor(fmass[i] / 4) +shadow.y;
		if(!((y<0) || (x>=setting.xlen) || (x<0) || y>=setting.ylen))
		if(field[y][x] == 0)
			drawBlock(1,y,x);
	}
}
//-------------------Keyboard----------------------------
/*void*/ function getChar(event)  {
  if (event.which == null) { // IE
    if (event.keyCode < 32) return null; // спец. символ
    return String.fromCharCode(event.keyCode)
  }
  if (event.which != 0 && event.charCode != 0) { // все кроме IE
    if (event.which < 32) 
		return null; // спец. символ
    return String.fromCharCode(event.which); // остальные
  }
  return null; // спец. символ
}
/*void*/ function keyboard(event) {
	//debug("keyboard");
	var ch = getChar(event);
	if(ch !== null)
		ch = ch.toLowerCase();
	if(!setting.isGame) {
		if(ch == 'p' || ch == 'з')
			pause();
		return;
	}
	figurFill(figur,0);
	switch(ch)
	{
		case 'w':
		case 'ц':
			var t = figur.rotare;
			figur.rotare+=1;
			if(figur.rotare>=getMaxRotare(figur))
				figur.rotare=0;
			if(collision(figur))
				figur.rotare = t;
		calcShadow(figur,shadowFigur);
		break;
		case 'a':
		case 'ф':
			figur.x--;
			if(collision(figur))
				figur.x++;
			calcShadow(figur,shadowFigur);
		break;
		case 'd':
		case 'в':
			figur.x++;
			if(collision(figur))
				figur.x--;
			calcShadow(figur,shadowFigur);
		break;
		case 's':
		case 'ы':		
			figur.y++;
			var t = setting.countTicks;
			setting.countTicks=0;
			if(collision(figur))
			{
				figur.y--;
				figur.onGround=true;
				setting.countTicks=t;
			}
		break;
		case 'p':
		case 'з':
			pause();
		break;
		case 'n':
		case 'т':
			newGame();
		break;
		default:
		debug(ch);
	}
	figurFill(figur,figur.color);
}
//---------------------Logic-----------------------------
/*void*/ function calcShadow(figure,shadow) {
	shadow.x 	= figure.x; 
	shadow.y	= figure.y;
	shadow.type	= figure.type;
	shadow.rotare = figure.rotare;
	while(!collision(shadow))
	{shadow.y++;}
	shadow.y--;
}
/*void*/ function getNewFigur(figure) {
	figure.x = Math.floor(setting.xlen/2)-1;
	figure.y = 0;
	figure.type = Math.floor(Math.random()*7);
	figure.color = Math.floor(2+(Math.random()*(color.length-2)));
	if(figure.color >= color.length)
		figure.color = color.length-1;
	figure.rotare = 0;
	figure.onGround = false;
	calcShadow(figure,shadowFigur);
}
/*void*/ function checkLine() {
	var count = 0;
	var check = true;
	for(var i =0;i<field.length;++i)
	{
		check = true;
		for(var j = 0;j<setting.xlen;++j)
			if(field[i][j] == 0)
			{
				check = false;
				break;
			}
		if(check)
		{
			field.splice(i,1);
			--i;
		}
	}
	
	count = setting.ylen-field.length;
	setting.score += balls[count];
	
	//New timeout calc
	var tdec = Math.trunc(setting.score/setting.difficult.ballStep);
	if(tdec >= setting.difficult.maxLevel)
		tdec = setting.difficult.maxLevel;
	setting.timeKeyEvent = setting.difficult.minLevelTime-tdec*setting.difficult.timeDec;
	
	if(setting.score > setting.bestscore)
		setting.bestscore = setting.score;
	for(var i = field.length; i<setting.ylen;++i)
	{
		var t = [];
		for(var j = 0;j<setting.xlen;++j)
			t[j] = 0;
		field.unshift(t);	
	}	
}
/*void*/ function getMaxRotare(figure) {
	var num=0;
	switch(figure.type)
	{
		case 0:
			num = figurs.Quadr.length;
		break;
		case 1:
			num = figurs.L.length;
		break;
		case 2:
			num = figurs.J.length;
		break;
		case 3:
			num = figurs.ZLeft.length;
		break;
		case 4:
			num = figurs.ZRight.length;
		break;
		case 5:
			num = figurs.Stick.length;
		break;
		case 6:
			num = figurs.Piramide.length;
			break;
		default:
			debug("err");
	}
	return num;
}
/*void*/ function getMassElem(figure) {
	var fmass;
	switch(figure.type)
	{
		case 0:
			fmass = figurs.Quadr[figure.rotare];
		break;
		case 1:
			fmass = figurs.L[figure.rotare];
		break;
		case 2:
			fmass = figurs.J[figure.rotare];
		break;
		case 3:
			fmass = figurs.ZLeft[figure.rotare];
		break;
		case 4:
			fmass = figurs.ZRight[figure.rotare];
		break;
		case 5:
			fmass = figurs.Stick[figure.rotare];
		break;
		case 6:
			fmass = figurs.Piramide[figure.rotare];
			break;
		default:
			debug("err");
	}
	return fmass;
}
/*bool*/ function collision(figure){
	var fmass,x,y;
	fmass = getMassElem(figure);
	for(var i = 0; i<fmass.length; ++i)
	{
		x = Math.floor(fmass[i] % 4 +figure.x);
		y = Math.floor(fmass[i] / 4 +figure.y);
		if((y>=setting.ylen) || (x>=setting.xlen) || (x<0))
			return true;
		if(y>=0)
		if(field[y][x] != 0)
			return true;
	}
	return false;
}
/*void*/ function newGame() {
	setting.score = 0;
	clearField();
	getNewFigur(figur);
	figurFill(figur,figur.color);
		
	setting.difficult.level = 0;
	setting.countTicks = 0;
	setting.timeKeyEvent = setting.difficult.minLevelTime;
}
/*void*/ function pause() {
	if(setting.isGame)
		setting.isGame = false;
	else
		setting.isGame = true;
}
/*void*/ function figurFill(figure,fillType) {
	/*if(typeof isFill != "boolean")
		debug("Error");*/
	var fmass,x,y;
	fmass = getMassElem(figure);
	for(var i = 0; i<fmass.length; ++i)
	{
		x = fmass[i] % 4 +figure.x;
		y = Math.floor(fmass[i] / 4) +figure.y;
		if(!((y<0) || (x>=setting.xlen) || (x<0) || y>=setting.ylen))
			field[y][x] = fillType;
	}
}
/*void*/ function logic() {
	if(setting.isGame)
	{
		setting.countTicks+=1;
		if(setting.countTicks>=setting.ticksToDown)
		{
			setting.countTicks=0;
			figurFill(figur,0);
			figur.y++;
			if(collision(figur))
			{
				figur.onGround = true;
				figur.y--;
			}
			figurFill(figur,figur.color);
			if(figur.onGround)
			{
				checkLine();
				getNewFigur(figur);
				if(collision(figur)) {
					newGame();
					return;
				}
				figurFill(figur,figur.color);
			}
		}
	}
}
/*void*/ function gameLoop() {
	draw();
	logic();
	setTimeout(gameLoop,setting.timeKeyEvent);
}
/*void*/ function main() {
	firstInit()
	setTimeout(gameLoop,setting.timeKeyEvent);
	setting.isGame=true;
}
main();













