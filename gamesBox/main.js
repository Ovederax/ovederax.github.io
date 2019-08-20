//handle clicks change game at iframe

var iframe = document.getElementById("game");
function selectGame(path) {
	var src = path + "/index.html";
	iframe.src = src;
	iframe.onload = function() {
		iframe.focus();
	}
}
selectGame('Tetris');


