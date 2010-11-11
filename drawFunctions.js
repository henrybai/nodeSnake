
/************************** DRAWING FUNCTION **************************/

var TileType = {
	 BLANK : 0,
	 MYSNAKE : 1, 
	 OTHERSNAKE : 2,
	 FOOD : 3,
	 CONFLICT : 4
}

var color= ["#FFF", "#000", "#AAA", "#00F", "#F00"];

var gameBoard = [];

function initBoard() {
	for (var i = 0 ; i < TILESWIDTH ; i++ ) {
		gameBoard[i] = [];
		for (var j = 0; j < TILESHEIGHT ; j++) {
			gameBoard[i][j] = TileType.BLANK;
		}
	} 
}

function clearBoard() {
	for (var i = 0 ; i < TILESWIDTH ; i++ ) {
		for (var j = 0; j < TILESHEIGHT ; j++) {
			gameBoard[i][j] = TileType.BLANK;
		}
	} 
}

function fillBoard() {
	clearBoard();
	
	drawFood();
	drawSnakes();
}


////************** DRAW   **************************

function draw(){
	clearCanvas();	
	fillBoard();
	
	for (var i = 0 ; i < TILESWIDTH ; i++ ) {
		for (var j = 0; j < TILESHEIGHT ; j++) {
			if (gameBoard[i][j] != TileType.BLANK) {
				drawRect(i, j, color[gameBoard[i][j]]);
			}
		}
	}
	//draw Scores
	/*
	ctx.fillStyle    = '#000';
	ctx.font         = 'italic 20px sans-serif';
	ctx.textBaseline = 'top';
	ctx.fillText  (("You: " + snakes[playerId].score), 35, 5);
	ctx.fillStyle    = '#AAA';
	ctx.fillText  (("Opp: " + snakes[1-playerId].score), 700, 5);
	*/
}


function drawRect(x, y, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.rect(x*TILESIZE, y*TILESIZE, TILESIZE, TILESIZE);
	ctx.closePath();
	ctx.fill();
}

function clearCanvas() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function drawFood() {
	for (var i in foods) {
		if (insideGameBoard(foods[i])) {
			if (gameBoard[foods[i].x][foods[i].y] == TileType.BLANK) {
				gameBoard[foods[i].x][foods[i].y] = TileType.FOOD;
			} 
			else {
				gameBoard[foods[i].x][foods[i].y] = TileType.CONFLICT;
			}
		}
	}
}

function drawSnakes() {
	for(var i in snakes)
	{
		for(var j in snakes[i].pts)
		{
			if (insideGameBoard(snakes[i].pts[j])) {
				if (gameBoard[snakes[i].pts[j].x][snakes[i].pts[j].y] == TileType.BLANK) {
					if (i == playerId) { 
						
						gameBoard[snakes[i].pts[j].x][snakes[i].pts[j].y] = TileType.MYSNAKE;
					}
					else {
						gameBoard[snakes[i].pts[j].x][snakes[i].pts[j].y] = TileType.OTHERSNAKE;
			
					}
				}
				else {
					gameBoard[snakes[i].pts[j].x][snakes[i].pts[j].y] = TileType.CONFLICT;
				}
			}
		}
	}
}

function WriteMessage(message, cont)
{
	if(!cont) clearCanvas();

	ctx.textAlign		= 'center'
		ctx.fillStyle    	= cont ? '#F00' : '#000';
	ctx.font         	= 'italic 20px sans-serif';
	ctx.textBaseline 	= 'top';

	ctx.fillText(message, WIDTH / 2,  (cont ? HEIGHT / 2 : (HEIGHT / 2)-40));
}	

function WriteMessage2(message, x, y)
{
	if (!x) x = 10;
	if (!y) y = 10;
	var ctx2 = $('#canvas2')[0].getContext("2d");
	ctx2.clearRect(0, 0, $('#canvas2').width(), $('#canvas2').height());

	ctx2.textAlign		= 'left'
		ctx2.fillStyle    	= '#333';
	ctx2.font         	= 'italic 15px sans-serif';
	ctx2.textBaseline 	= 'top';

	ctx2.fillText(message, x, y);
}	