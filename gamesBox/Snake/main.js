'use strict'

/**
* Клон игры Snake
* @autor Ovederax
* @version 29.08.18
* @license LGPL
*/
/**/
//DEFINE
var COLORS_EMPTY_ID = 0;
var COLORS_HEAD_ID = 1;
var COLORS_BODY_ID = 2;
var COLORS_FOOD_ID = 3;
var DIRECTION = {
	top:   0,
	right: 1,
	down:  2,
	left:  3
};
//GLOBAL_VARIABLE
var canvas	= document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var setting = {
	field: null,
	snake:	{
		list: null,
		direction: DIRECTION.right
	},
	food: null,
	h: 20,
	w: 20,
	dh: 20,
	dw: 20,
	
	isGame: false,
	isPause: false,
	keylock: false
}
var colors = ["#000000","#007700","#00aa00","#aa2222"];
//-------------List Class--------------------------------
function Point(x,y) {
	this.x=x;
	this.y=y;
}
function Node(data) {
	this.next = null;
	this.data = data;
}
function List() {
	var head = null;
	var end  = null;
	var _lenght=0;
	this.pushBack = function(item) {
		if(head == null) {
			head = new Node(item);
			end = head;
		}else {
			end.next = new Node(item);
			end = end.next;
		}
		_lenght +=1 ;
	};
	this.pushFront = function(item) {
		if(head == null) {
			head = new Node(item);
			end = head;
		}else {
			var node = new Node(item);
			node.next = head;
			head = node;
		}
		_lenght +=1;
	}
	this.popFront = function() {
		_lenght -=1;
		if(head != null) {
			var node = head;
			head = head.next;
			if(head == null)
				end = null;
			return node.data;
		}//else
			return undefined;
	};
	this.getHead = function() { return head };
	this.getEnd  = function()  { return end  };
	this.toString = function() {
		var str = "[";
		var it = head;
		if(it != null) {
			str += it.data;
			it=it.next;
		}
		for(	 ; it!=null; it=it.next) {
			str +=  ", " + it.data;
		}
		str += "]";
		return str;
	}
	Object.defineProperties(this,{
		length: {
			get: function(){return _lenght}
		}
	});
}
function init()  {
	//FIELD
	setting.field = [];
	for(var i=0;i<setting.h;++i)
	{
		setting.field[i] = [];
		for(var j=0;j<setting.w;++j) {
			setting.field[i][j] = 0;
		}
	}
	//Snake
	setting.snake.list = new List();
	var list = setting.snake.list;
	list.pushBack(new Point(10,10));
	addFood()
}
function newGame() {
	init();
	setting.isGame = true;
	setting.isPause = false;
}
function pause() {
	setting.isPause = !setting.isPause;
}
//Logic
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
	if(ch == null) {
		return;
	}
	ch = ch.toLowerCase();		
	if(ch == 'p' || ch == 'з') {
		pause();
	} else if(ch == 'n' || ch == 'т') {
		newGame();
	}
	
	if(setting.keylock && setting.isGame) {
		return;
	}	
	switch(ch)
	{
		case 'w':
		case 'ц':
			if(setting.snake.direction != DIRECTION.down)
				setting.snake.direction = DIRECTION.top;
		break;
		case 'a':
		case 'ф':
		if(setting.snake.direction != DIRECTION.right)
			setting.snake.direction = DIRECTION.left;
		break;
		case 'd':
		case 'в':
		if(setting.snake.direction != DIRECTION.left)
			setting.snake.direction = DIRECTION.right;
		break;
		case 's':
		case 'ы':
			if(setting.snake.direction != DIRECTION.top)		
				setting.snake.direction = DIRECTION.down;
		break;
		default:
	}
	setting.keylock = true;
}
/*long*/function random(max) {
	return Math.trunc(Math.random()*max);
};
/*void*/function drawBlock(block,x,y) {
	ctx.fillStyle = colors[block];
	ctx.fillRect(x*setting.dw,y*setting.dh,setting.dw,setting.dh);
}
/*void*/function draw() {
	for(var i=0; i<setting.field.length; ++i)
		for(var j=0; j<setting.field[i].length; ++j) {
			drawBlock(setting.field[i][j],j,i);	
		}
	if(!setting.isGame) {
		ctx.fillStyle="#ff0000";
		ctx.fillRect(120,180,160,40);
		ctx.fillRect(120,180,160,40);
		ctx.fillStyle="#ffffff";
		ctx.font = "16px sans-serif"
		ctx.fillText("You are dead",140,210);
	}
}
/*void*/function logic() {
	var head,end,list,elem;
	list = setting.snake.list;
	head = list.getEnd().data;
	
	setting.field[head.y][head.x] = COLORS_BODY_ID;
	
	//promoution
	elem = new Point(head.x, head.y);
	switch(setting.snake.direction) {
		case DIRECTION.top:
			elem.y -= 1;
			if(elem.y < 0) {
				elem.y = setting.h-1;
			}
		break;
		case DIRECTION.right:
			elem.x += 1;
			if(elem.x >= setting.w) {
				elem.x=0;
			}
		break;
		case DIRECTION.down:
			elem.y += 1;
			if(elem.y >= setting.h) {
				elem.y=0;
			}
		break;
		case DIRECTION.left:
			elem.x -= 1;
			if(elem.x < 0) {
				elem.x = setting.w-1;
			}
		break;
	}
	list.pushBack(elem);
	head = elem;
	
	end  = list.popFront();
	setting.field[end.y][end.x] = COLORS_EMPTY_ID;	
	
	//check block
	switch(setting.field[head.y][head.x]) {
		case COLORS_FOOD_ID:
			list.pushFront(end);
			setting.field[end.y][end.x] = COLORS_BODY_ID;
			setting.field[head.y][head.x] = COLORS_HEAD_ID;
			addFood();
		break;
		case COLORS_BODY_ID:
			setting.isGame = false;
		break;
		case COLORS_EMPTY_ID:
			setting.field[head.y][head.x] = COLORS_HEAD_ID;
	}
	//add new segment/add food
}
/*void*/function addFood() {
	var variants = setting.h*setting.w - setting.snake.list.length-2;
	var i,j;
	var place = random(variants);
	for(i=Math.trunc(place/setting.w);i<setting.h;++i) {
		for(j=place%setting.w;j<setting.w;++j) {
			if(setting.field[i][j] == COLORS_EMPTY_ID) {
				setting.field[i][j] = COLORS_FOOD_ID;
				return;
			}
		}
	}
}
/*void*/function gameLoop() {
	//eventsHandler();
	if(!setting.isPause && setting.isGame) {
		logic();
		draw();
		setting.keylock=false;
	}
}
/*void*/function main() {
	document.onkeydown = document.onkeypress = keyboard;
	document.body.onkeydown = document.body.onkeydown = keyboard
	var timeout = 100;
	newGame();
	setInterval(gameLoop,timeout);
}

main();