'use strict'



/**
* Клон игры BallBounce в Андроид маркете
* 
* @autor Ovederax
* @version 15.06.18
* @license LGPL
*/
/*
* FixMe 
* Добавить ООП, переменые рассфосовать по объектам
* Починить коллизии - не работают так как надо
* Продумать оптимизации
*/
//--------------Html variable----------------------------
var btn 	= document.getElementById("btnNewGame");
var canvas	= document.getElementById("canvas");
var divStats= document.getElementById("Stats");
var ctx = canvas.getContext("2d");

//------------------Draw style variable-------------------

//------Draw text var---------
ctx.font = "14pt Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
var fontColor = "#ffffff";
//----------outher------------
var sizeBlock = 40;
var retryArray=0; 		    //тк двумерный массив сдвигается вниз к низу канваса
var field =[]; /* =[y][x]*/ //будем использовать цикличиский массив(нужно будет поянить/продумать идею лучше)

var widthField  = canvas.width/sizeBlock;
var heightField = Math.floor(canvas.height/sizeBlock)-1;
var color = ["#000000","#50f050","#208020","#102080","#f00000"];//rgb
var dcolor = 10;
var lineLenght = 300;//px
//----------------------Game------------------------------
var isGame = false;
var scoreBreak = 0;
var elapsedTime = 20;//ms
var angle=0;
var dropBegin = false;			//Будет указвать на то что начался бросок шаров...
var timeToDropNext = 7;		//время между бросками шаров
var countTime = 0;
var numAccountPromoution=6;//продвижение без переририсовки
var killedBlock = 0;		//кол-во уничтоженных блоков за один бросок
//----------------------Ball------------------------------
var colorBall = "#ffffff";
var radiusBall = 6;
var countBall = 1;
var balls = []
var speedBall = 100;//px/s
var ball = {
	x:0,y:0,		//текущая позиция
	direction:90,	//угол движения
	dx:0,dy:0,		//проекции скорости
	isLife:false,
	isActive:true
};
ball.x = canvas.width/2;
ball.y = canvas.height-radiusBall;
//--------------------Mouse variable-----------------------
/**
* Событие нажатия будет отработано только в том случае, если
* не будет выхода за границы поля и угол броска шаров будет больше 20 град. 
*/
var mouseAccept = false;
var mouseLeftKey  = 0;
var mouseRightKey = 2;

//----------------------Game Function----------------------
function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var  temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function promoutionBall(ball) {
	if(ball.isActive)
	if(ball.isLife)
	{
		
		ball.x += ball.dx*elapsedTime/1000;
		ball.y -= ball.dy*elapsedTime/1000;
		
		var x0=Math.floor((ball.x)/sizeBlock);		//center ball
		var y0=Math.floor((ball.y)/sizeBlock);		//midle lines
		
		var x1=Math.floor((ball.x+radiusBall)/sizeBlock);	//right
		var x2=Math.floor((ball.x-radiusBall)/sizeBlock);	//left
		var y1=Math.floor((ball.y+radiusBall)/sizeBlock);	//bottom
		var y2=Math.floor((ball.y-radiusBall)/sizeBlock);	//top
		
		
		if((x0>=0)&&(x0<field[0].length))
		{
			if((y1<field.length)&&(y1>=0)) //bottom
			{
				if(field[y1][x0]>0)
				{
					checkBlockState(field,y1,x0);
					ball.dy = -ball.dy;
					ball.y=((y1)*sizeBlock)-radiusBall-0.1;
					return;
				}
			}
			if((y2<field.length)&&(y2>=0)) //top
			{
				if(field[y2][x0]>0)
				{
					checkBlockState(field,y2,x0);
					ball.dy = -ball.dy;
					ball.y=((y2+1)*sizeBlock)+radiusBall+0.1;
					return;
				}
			}
		}
		if((y0>=0)&&(y0<field.length))
		{
			if((x1<field[y0].length)&& (x1>=0))//right
			{
				if(field[y0][x1]>0)
				{
					checkBlockState(field,y0,x1);
					ball.dx = -ball.dx;
					ball.x=((x1)*sizeBlock)-radiusBall-0.1;
					return;
				}	
			}
			if((x2<field[y0].length)&& (x2>=0))//left
			{
				if(field[y0][x2]>0)
				{
					checkBlockState(field,y0,x2);
					ball.dx = -ball.dx;
					ball.x=((x2+1)*sizeBlock)+radiusBall+0.1;
					return;
				}	
			}
		}

		if(ball.y + radiusBall >= canvas.height)
		{
			ball.y = canvas.height - radiusBall;
			ball.isLife=false;
		}else if(ball. y - radiusBall <=0)
		{
			ball.y = radiusBall;
			ball.dy = -ball.dy;
		}else if(ball.x - radiusBall < 0)
		{
			ball.x = radiusBall;
			ball.dx = -ball.dx;
		}else if(ball.x + radiusBall > canvas.width)
		{
			ball.x = canvas.width - radiusBall;
			ball.dx = -ball.dx;
		}
	}	
}
function checkBlockState(array,i,j) {
	--array[i][j];
	if(array[i][j]==0)
	{
		killedBlock+=1;
		scoreBreak+=killedBlock*10;
	}
}
function initField() {
	for(var i=0;i<heightField;++i)
	{
		field[i] = []
		for(var j=0;j<widthField;++j)
			field[i][j] = 0;
	}
}
function nextLevel() {
	//Проигрыш
	for(var i=0;i<field[heightField-1].length;++i)
		if(field[heightField-1][i]>0)
		{
			isGame = false;
			isEmptyField =false;			
			return;
		}
	var isEmptyField = true;
	for(var i=0;(i<field.length) && isEmptyField;++i)
		for(var j=0;j<field[i].length;++j)
			if(field[i][j]>0)
			{
				isEmptyField = false;
				break;
			}
	if(isEmptyField)
	{
			var c = Math.floor((balls.length/5)+3);
		if(c>widthField-3)
			c=widthField-3
			addLineBlocks(c);
			addLineBlocks(c);
	}else
	{
		var c = Math.floor((balls.length/7)+2);
		if(c>widthField-4)
			c=widthField-4
		addLineBlocks(c);
	}
	
	while(field.length>heightField)
		field.pop();
	
}
function addLineBlocks(countBlocks,count) {
	if(countBlocks === undefined)
		countBlocks = 2;
	if(count === undefined)
		count = balls.length;
	var len = field[0].length;
	var line = [];
	for (var i = 0; i<countBlocks; ++i)
		line[i] = count;
	for (var i = countBlocks; i<len; ++i)
		line[i] = 0;
	shuffleArray(line);
	field.unshift(line);
}
//------------------------Draw----------------------------
function drawLineDrop(angle) {
	var x = balls[0].x;
	var y = balls[0].y;
	var dx = lineLenght*Math.cos(angle);
	var dy = lineLenght*Math.sin(angle);
	ctx.strokeStyle="#ffffff";
	ctx.beginPath()
	ctx.moveTo(x,y)
	ctx.lineTo(x+dx, y-dy)
	ctx.closePath()
	ctx.stroke();
}
function drawField() {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	var pos = {x:0,y:0};
	for(var i=0;i<heightField;++i)
	{
		pos.y=i*sizeBlock;
		for(var j=0;j<widthField;++j)
		{
			pos.x=j*sizeBlock;
			drawQuard(pos,field[i][j]);
		}
	}
}
function drawQuard(pos,val) {
	var id = Math.floor(val/dcolor);
	if(val>0)
		id+=1;
	if(id>=color.length)
		id = color.length-1;
	ctx.strokeStyle = color[id];
	ctx.fillStyle = color[id];
	ctx.fillRect(pos.x,pos.y,sizeBlock,sizeBlock);
	if(id>0)
	{
		ctx.fillStyle = fontColor;
		ctx.fillText(val,pos.x+sizeBlock/2,pos.y+sizeBlock/2);
	}
}
function drawBall(ball) {
	ctx.fillStyle = colorBall;
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, radiusBall, 0, Math.PI*2, false);
	ctx.closePath();
	ctx.fill(); 	
}
function draw() {
	if(isGame)
		divStats.textContent = "Your stats = " + scoreBreak + "  Level:" + balls.length;
	else
		divStats.textContent = "GAME OVER! Your stats = " + scoreBreak + "  Level:" + balls.length;
	drawField();
	for(var i=0;i<balls.length;++i)
		drawBall(balls[i]);
	if(mouseAccept)
		drawLineDrop(angle);
}
//--------------------Control---------------------------------------
function btnNewGameClick() {
	isGame = true;
	scoreBreak = 0;
	var dropBegin = false;
	balls = [];
	balls.push(JSON.parse(JSON.stringify(ball)));
	//balls[0].isLife=false;
	divStats.textContent = "Your stats = " + scoreBreak + "  Level:" + balls.length;
	for(var i=0;i<heightField;++i)
	{
		field[i] = []
		for(var j=0;j<widthField;++j)
			field[i][j] = 0;
	}
	for(var i =0;i<3;++i)
		addLineBlocks(2,1);
	draw();
}
function mouseHandle(e) {
	if(!isGame)//В случае проигрыша не обрабатывать события мыши
		return;
	if(dropBegin)
		return;
	if(e.type === "mouseout")
	{
		mouseAccept = false;
		draw();
		return;
	}

	var line_dx = e.offsetX-balls[0].x;
	var line_dy = canvas.height-e.offsetY;
	angle = Math.atan(line_dy/line_dx);
	if(angle<0)
		angle+=Math.PI;
	
	
	if(e.button === mouseLeftKey)
	{
		if(e.type === "mouseup")
		{
			if(mouseAccept==true)
			{
				mouseAccept=false;
				//edit
				killedBlock=0;
				ball.isLife=true;
				dropBegin = true;
				var dx = speedBall*Math.cos(angle);
				var dy = speedBall*Math.sin(angle);
				for(var i=0;i<balls.length;i++)
				{
					balls[i].dx = dx;
					balls[i].dy = dy;
					balls[i].isLife = true;
					balls[i].isActive=false;
				}
				balls[0].isActive=true;
			}
			mouseAccept=false;
		}else if(e.type === "mousedown")
		{
			mouseAccept = true;
		}
	}
}
//---------------------Main---------------------------------
function gameLoop() {
	if(mouseAccept || dropBegin)
		draw();
	if(dropBegin)
	{
		countTime++;
		var check = false;
		
		for(var j=0;j<numAccountPromoution;++j)
		for(var i=0;i<balls.length;i++)
		{
			check = check || balls[i].isLife;
			if(!balls[i].isActive)
			{
				if(countTime>=timeToDropNext)
				{
					balls[i].isActive = true;
					countTime-=timeToDropNext;
					return;//-----------exit
				}
					
			}
			if(balls[i].isActive)
			if(balls[i].isLife)
				promoutionBall(balls[i]);
		}	
		if(!check)
		{
			dropBegin=false;
			balls.push(JSON.parse(JSON.stringify(balls[0])));//пфф, и так сойдет 
			for(var i=1;i<balls.length;i++)
			{
				balls[i].x = balls[0].x;
				balls[i].y = balls[0].y;
			}
			countTime=0;
			nextLevel();
			draw();
			return;
		}
	}
}
function main() {
	
	initField();
	btnNewGameClick()
	
	btn.addEventListener("click",btnNewGameClick);
	
	canvas.addEventListener("mousedown",mouseHandle);
	canvas.addEventListener("mouseup",mouseHandle); 
	canvas.addEventListener("mouseout",mouseHandle);
	canvas.addEventListener("mousemove",mouseHandle)
	
	draw();
	setInterval(gameLoop,elapsedTime);
	
}


main();







