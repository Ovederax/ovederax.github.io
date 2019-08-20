'use strict'

/**
* ?
* @description ...
* @autor Ovederax
* @version 24.09.18
* @license LGPL
*/
/**/
//--------------Html variable----------------------------
var canvas	= document.getElementById("canvas");
var ctx = canvas.getContext("2d");
//-------------Variable----------------------------------


var setting = {

}

var debug = function(){};

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
		debug = function() {
			for(var i =0;i<arguments.length;++i)
				console.log(arguments[i]);
		}
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













