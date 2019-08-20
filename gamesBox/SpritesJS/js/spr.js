/**
@Author Ovederax
@Version 26.12.18
@license LGPL

SpriteJs - simple 2d drawing on canvas driver.  

Api declaration, class and methods

ImgLoader
	getPercent() 			// return percent of load image data
	load(list, onload)		// load list of images
	getImg(imgName)			// return Image if you download Image before
	
Titleset(image) 
	addTitle(name, props)
	getTileProps(name)
	getImg()
	
Point(x,y) - point class etc.

Rect (x,y,w,h)
	move(dx,dy)
Rect.clone(rect) - return rect clone

Scene() - add later with SpriteJS.drawScene
	addEnemy
	redrawAll
	setBackground

Sprite(texture,rect)

AnimData(countAnim, xinc, yinc)
AnimData.clone()

AnimateSprite(texture,rect,animData) extends Sprite
	nextStep() - 

Animation(spritesList)
	nextFrame()

SpriteJS
	clearCanvas()
	addSprite()
	redrawSprites()
	drawSprite(sprite, pos)
	setViewport()
	
	
*/

function ImgLoader() {
	var images = [];
	var nowLoad =  0;
	var totalLoad = 0;
	
	function onLoad(callback) {
		++nowLoad;
		console.log("onload ")
		if(nowLoad == totalLoad) {
			callback();
		}
	};
	this.getPercent = function() {
		if(totalLoad != 0)
			return nowLoad*100/totalLoad;
		else
			return 100;
	};
	this.load = function(list, onload) {
		var img;
		totalLoad += list.length;
		for(var i=0; i<list.length; ++i) {
			img = new Image();
			img.onload = onLoad.bind(this,onload);
			images[list[i]] = img;
			img.src = list[i];
		}
	};
	this.getImg = function(imgName) {
		return images[imgName];
	};
};

function Tileset(image) {
	if(image == undefined)
		throw new Error("Image is undefined");
	var img = image;
	var tiles = [];
	this.addTile = function(name,props) {
		tiles[name]=props;
	}
	this.getTileProps = function(name) {
		if(tiles[name] == undefined)
			throw new Error("Title with name \""+name+"\" not found");
		return tiles[name];
	}
	this.getImg = function() {
		return img;
	};
};

function Point(x,y) {
	this.x = x;
	this.y = y;
};
function Rect(x,y,w,h) {
	if(typeof x != "number" || typeof y != "number" || 
			typeof w != "number" || typeof h != "number"){
		throw new Error("Bad arguments");
	}
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	this.move = function(dx,dy) {
		this.x += dx;
		this.y += dy;
	};
};
function Scene() {
	this.addAnimate = function(animate) {
		
	}
	//Пусть все будет из тайтлов и все будет Enemy
	this.addEnemy = function() {
		
	}
	this.setBackground = function() {
		
	}
	this.redrawAll = function() {
		
	}
}
/*Rect*/ Rect.clone = function(rect) {
	if(!rect)
		throw new Error("rect is null");
	return new Rect(rect.x,rect.y,rect.w,rect.h);
};


Sprite.prototype = {
	//Перенести функцию setRect?
	constructor: "Sprite"
};

function Sprite(texture,rect) {
	if(!rect)
		throw new Error("rect is null");
	if(!texture)
		throw new Error("texture is null");
	//function
	this.setRect = function(rect) {
		this.rect = Rect.clone(rect);
	}
	this.setRect(rect);
	this.img = texture;	
};

function AnimData(countAnim, xinc, yinc) {
	this.countAnim = countAnim;
	this.xinc = xinc;
	this.yinc = yinc;
};

function AnimateSprite(texture,rect,animData) {
	Sprite.call(this,texture,rect);
	oldRect = Rect.clone(rect);
	var step=0;
	this.animData = AnimData.clone(animData);
	
	this.nextStep = function() {
		var a = animData;
		++step;
		if(step >= a.countAnim)
			step=0;
		this.rect = Rect.clone(oldRect);
		this.rect.move(a.xinc*step,a.yinc*step);
	}
};

function Animation(spritesList) {
	var countFrame = 0;
	this.spritesList = spritesList;
	
	this.nextFrame = function() {
		countFrame =  countFrame + 1;
		if(countFrame >= this.spritesList) {
			countFrame = 0;
		}
	}
}

AnimData.clone = function(ad) {
	return new AnimData(ad.countAnim, ad.xinc, ad.yinc);
};

function SpriteJS(_cnv) {
	var cnv = _cnv;
	var ctx = cnv.getContext('2d');
	var cnvRect = new Rect(0,0,cnv.width,cnv.height);
	
	var animateSpriteList = [];
	
	this.clearCanvas = function() {
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0,cnvRect.w,cnvRect.h);
	}
	
	this.addSprite = function() {
		
	}
	
	this.redrawSprites = function() {
		for(var i=0; i<animateSpriteList.length; ++i) {
			drawSprite(animateSpriteList[i])
		}
	};
	
	this.drawSprite = function(sprite, pos) {
		var r = sprite.rect;
		var img = sprite.img;
		ctx.drawImage(img,   r.x,   r.y,   r.w,r.h,
							pos.x, pos.y,  r.w,r.h);
	};
	
	this.setViewport = function() {
		
	};
}