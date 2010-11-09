// includes
require('./point.js');
require('./snake.js');

// game variables
var gameStart = false;
var ready = new Array();
ready[0] = false;
ready[1] = false;

var numOfPlayers = 0,
	players = new Array(),
	http = require('http'), 
	url = require('url'),
	fs = require('fs'),
	io = require('socket.io'),
	sys = require('sys');

server = http.createServer(function(req, res){
	var path = url.parse(req.url).pathname;
	switch (path){
		case '/':
			fs.readFile(__dirname + "/snake.html", function(err, data){
				if (err) return send404(res);
				res.writeHead(200, {'Content-Type': 'text/html'})
				res.write(data, 'utf8');
				res.end();
			});
			break;
		case '/snake.html':
		case '/json.js':
		case '/snake.js':
		case '/point.js':
		case '/variables.js':
		case '/direction.js':
		case '/jquery-1.4.3.min.js':
		case '/jquery.timers.js':
			fs.readFile(__dirname + path, function(err, data){
				if (err) return send404(res);
				res.writeHead(200, {'Content-Type': 'text/javascript'})
				res.write(data, 'utf8');
				res.end();
			});
			break;
		
		default: send404(res);
	}
});

send404 = function(res){
	res.writeHead(404);
	res.write('404');
	res.end();
};

server.listen(8080);

var socket = io.listen(server);
   
socket.on('connection', function(client){
	if(numOfPlayers < 2)
	{
		players[numOfPlayers++] = client;
		
		// send ID over and important message over
		for(var i in players)
		{
			var msg = (numOfPlayers < 2) ? 	{ msg: ['Waiting for your opponent to come..'], id: i } : 
											{ msg: ['Your opponent is here. Press Enter to start.'], id: i };
			
			players[i].send(msg);
		}
	}
	else {
		client.send({msg : ['Server is Full. Please try again later.']});
	}
	
	
	client.on('message', function(msg){
		//if(!msg.id || msg.id > 2 || players[msg.id] != client)	return;
	
		var id = msg.id;
		//console.log(msg);
		if(gameStart)
		{
			if(msg.snake || msg.food) 
			{
				players[1 - id].send(msg);
			}
			else if (msg.gameOver) {
				console.log("game ends, Player " + (1 - msg.id) + " wins.");
				broadcast(msg);
				endGame();
			}
		}
		else if(msg.ready)
		{
			// ready		
			if (players.length == 2) {
				ready[id] = true;
				client.send( {msg : ['Waiting for your Opponent to Ready...'], isReady: true , id: msg.id });
				if(ready[0] && ready[1])
					start();
			}
		}
	});

	client.on('disconnect', function(){
		// remove the element
		for(var i in players )
		{ 
			if(players[i] == client) {	
				players.splice(i,1); 
				numOfPlayers--;
				broadcast({msg: ['The other party has disconnected. Waiting for 2 players to start game.'] , disconnect: 1});
				reset();
			}
		} 
		
	});
});

function broadcast(msg)
{
	for(var i in players)
	{	
		players[i].send(msg);
	}
}

function start()
{
	console.log("game starts");
	gameStart = true;
	
	broadcast({start: true});
}

function reset()
{
	console.log("game resetted");
	
	gameStart = false;
	ready[0] = false;
	ready[1] = false;
}


function endGame()
{

	reset();
}
