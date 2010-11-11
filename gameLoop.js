/*
 * refactor food into snake
refactor send message
refactor drawing class
refactored out gameloop
prepare for multiplayer





move sendfood to server side?
add random string auth
game state for game starT on clientside?


how to sync other snake when player come?press enter to start?
draw game?
refactor keydown of jquery to hook different thigns when game start an dbefore game start
Refactor Board and Draw into its own class..  draw takes in board and 

*/

var TILESIZE = 10;
var WIDTH;
var HEIGHT;
var TILESWIDTH;
var TILESHEIGHT;
var LOOPINTERVAL = 90;
var gameLoopID;

var amAlive = true;
var gameStart = false;
var debugLog = {};

var foods = [];
var snakes = [];

var playerId;

var ctx;


var Direction = {	
	DOWN : 1,
	LEFT : 2, 
	RIGHT: 3, 
	UP :  4, 
	NIL: 5
}



$(document).ready(function() {
	ctx = $('#canvas')[0].getContext("2d");
	WIDTH = $('#canvas').width();
	HEIGHT = $('#canvas').height();
	TILESWIDTH = WIDTH / TILESIZE;
	TILESHEIGHT = HEIGHT / TILESIZE;
	initBoard();
	WriteMessage('Connecting...', false);

});

$(document).keydown(function(event) {
	var msg = "";
	var changeDirection = false;
	if (gameStart) {
		switch(event.which) {
		case 38:	// UP
			if(snakes[playerId].changeDirection(Direction.UP))
				changeDirection = true;
			break;
		case 40:	// DOWN
			if(snakes[playerId].changeDirection(Direction.DOWN))
				changeDirection = true;
			break;
		case 37:	// LEFT
			if(snakes[playerId].changeDirection(Direction.LEFT))
				changeDirection = true;
			break;
		case 39:	// RIGHT
			if(snakes[playerId].changeDirection(Direction.RIGHT))
				changeDirection = true;
			break;
		}
		if (changeDirection) {
			sendSnake(); 	
			return false;
		}
	}
	else {
		switch(event.which) {
			case 27:	// ESC
				break;
			case 13:	// Enter
				sendMsg({ready: true})
				return false;
				break;
		}
	}
	return true;
});


var socket = new io.Socket(null, {port: 8080});
socket.connect();

socket.on('connect', function(server){
});

socket.on('message', function(packet){
	// Start game
	if(packet.start)
	{
		start();
	}

	// Sync Snake that change direction
	if(packet.id && packet.snake)
	{
		var s = JSON.parse(packet.snake);
		snakes[packet.id].pts = decodePoints(s.p).slice();
		snakes[packet.id].lag = (s.l);
		snakes[packet.id].directQueue = (s.dQ).slice();
		snakes[packet.id].direct = (s.d);
		snakes[packet.id].score = s.s;
		draw();

		debugLog.bytes = JSON.stringify(packet).length;
		showDebugMsg();
	}

	// Information packet
	if(packet.msg)
	{
		playerId = packet.id;
		WriteMessage(packet.msg, false);
	}

	if (packet.isReady) 
	{
		WriteMessage("Ready", true);
	}

	if (packet.food) {
		p =JSON.parse(packet.food);
		foods[packet.foodID] = new Point(p.x, p.y);
	}

	// End game
	if(packet.gameOver){
		endGame();
		
		var ending = "You lose!";
		if(packet.id == (1 - playerId)) ending = "You win!";
		else if(packet.id == 2)   ending = "Draw game.";

		WriteMessage(("Game Over. " + ending + " Please Enter to try again."), true);
		
	}


	if(packet.disconnect)
	{
		endGame();
	}

});

socket.on('disconnect', function(){
	endGame();
	WriteMessage('You have disconnected from the server.', false);
});

function sendMsg(msg) {
	if (typeof(msg) === "undefined")  return;
	if (typeof(msg.id) === "undefined") { msg.id = playerId; }
	socket.send(msg);
}
function sendAllSnakes() {
	for (var i in snakes) {
		sendSnake(null, i);
	}
}
function sendSnake(message, id) {
	var msg;
	var s = {};

	if (!message) {
		msg = {};
	}
	else {
		msg = message;
	}
	if (typeof(id) === "undefined") {
		id = playerId;
	}


	s.p = encodePoints(snakes[id].pts);
	s.l = snakes[id].lag;
	s.dQ = snakes[id].directQueue;
	s.d = snakes[id].direct;
	s.s = snakes[id].score;

	msg.snake = JSON.stringify(s);
	msg.id = id;
	sendMsg(msg);
}

function start()
{
	if (!gameStart) {
		reset();
		gameStart = true;
		sendAllSnakes();
		sendMsg({food: JSON.stringify(foods[playerId]), foodID: playerId});
		gameLoopID = window.setInterval(gameLoop, LOOPINTERVAL);
		showDebugMsg();
		//$(document).everyTime(2000, "sendSnake", sendSnake, 0);
	}
}


function endGame()
{
	if (gameStart) {
		amAlive = false;
		gameStart = false;
		window.clearInterval(gameLoopID);
	}
}


function reset()
{
	amAlive = true;
	gameStart = false;
	var startingLength = 5;
	var startingPointA = new Point(10, 10);
	var startingPointB = new Point(TILESWIDTH - 10, TILESHEIGHT - 10);
	
	snakes[0] = new Snake(startingPointA, startingLength, Direction.DOWN);
	snakes[1] = new Snake(startingPointB, startingLength, Direction.UP);

	//snakes[0] = new Snake(startingPointA, length, Math.floor(Math.random()*4+1));
	//snakes[1] = new Snake(startingPointB, length, Math.floor(Math.random()*4+1));

	
	foods[playerId] = getNonSnakePoint();

	debugLog = {};
	debugLog.playerId = playerId;
}
function getStartingPoint()  {
	var p = randomPoint(TILESWIDTH -10, TILESHEIGHT - 10);
	p.x = p.x + 5;
	p.y = p.y + 5;
	return p;
}


function insideGameBoard(point)
{
	return ((point.y >= 0) && (point.y < TILESHEIGHT) &&
			(point.x >= 0) && (point.x < TILESWIDTH));

}


function hitOtherSnakes() {
	for (var i = 0; i<snakes.length; i++) {
		if (i == playerId) { continue; }
		if (snakes[playerId].hitSnake(snakes[i])) {
			return true;
		}
	}

	return false;
}



function gameLoop()
{
	if(amAlive)
	{
		move();

		check();

		amAlive = 	((insideGameBoard(snakes[playerId].getHead())) &&		
				!hitOtherSnakes() && 
				!snakes[playerId].suicide());											

		if (amAlive) {
			draw();
		}
	}
	if (!amAlive)
	{
		var msg = {gameOver: true};
		sendSnake(msg);

		endGame();
	}
}

function move()
{
	for(var i in snakes)
		snakes[i].move();
}

function check()
{
	// check if eaten food

	for(var foodId in foods)
	{
		if(snakes[playerId].getHead().equals(foods[foodId]))
		{
			snakes[playerId].grow();
			foods[foodId] = getNonSnakePoint();  //just let food dissapear

			
			sendMsg({food: JSON.stringify(foods[foodId]), foodID: foodId});
			sendSnake();
		} 
	}


}

function getNonSnakePoint()
{
	fillBoard();
	var fdPoint;
	do {
		fdPoint = randomPoint(TILESWIDTH-1, TILESHEIGHT-1);
	} while(gameBoard[fdPoint.x][fdPoint.y] != TileType.BLANK);

	return fdPoint;
}



function randomPoint(maxX, maxY)
{
	return new Point(Math.floor(Math.random()*maxX), Math.floor(Math.random()*maxY));
}

function showDebugMsg() {
	var debugMsg = "";
	if (debugLog.playerId !== "undefined") {
		debugMsg += "      playerID: " + debugLog.playerId + ";";
	}      
	if (debugLog.bytes !== "undefined") {
		debugMsg += "      bytes received: " + debugLog.bytes  + " bytes;";
	}

	WriteMessage2(debugMsg);


}



/************************** ENCODING FUNCTIONS **************************/


function encodePoints(points) {
	if (points.length < 2) return points;

	var encoded = [];
	encoded.push(points[0]);
	for(var i in points) {
		if (points[i].x == encoded[encoded.length-1].x || points[i].y == encoded[encoded.length-1].y) {
			continue;
		}
		encoded.push(points[i-1]);
	}
	encoded.push(points[points.length-1]);
	return encoded;
}

function decodePoints(points) {
	var decoded = [];
	decoded.push(new Point(points[0]));
	for(var i = 1; i<points.length; i++) {
		if (points[i].y == points[i-1].y && points[i].x  > points[i-1].x)  { //going right
			var diff = Math.abs(points[i].x - points[i-1].x);   
			var j = 0;
			while (++j < diff) {
				decoded.push(new Point(points[i-1].x + j,points[i-1].y)); 
			}
			decoded.push(new Point(points[i]));
		}
		else if (points[i].y == points[i-1].y && points[i].x  < points[i-1].x)  { //going left
			var diff = Math.abs(points[i-1].x -  points[i].x);   
			var j = 0;
			while (++j < diff) {
				decoded.push(new Point(points[i-1].x - j,points[i-1].y)); 
			}
			decoded.push(new Point(points[i]));
		}
		else if (points[i].x == points[i-1].x && points[i].y  < points[i-1].y)  { //going up
			var diff = Math.abs(points[i-1].y -  points[i].y);   
			var j = 0;
			while (++j < diff) {
				decoded.push(new Point(points[i-1].x, points[i-1].y - j)); 
			}
			decoded.push(new Point(points[i]));
		}
		else if (points[i].x == points[i-1].x && points[i].y  > points[i-1].y)  { //going down 
			var diff = Math.abs(points[i-1].y -  points[i].y);   
			var j = 0;
			while (++j < diff) {
				decoded.push(new Point(points[i-1].x, points[i-1].y + j)); 
			}
			decoded.push(new Point(points[i]));
		}
	}
	return decoded;
}


