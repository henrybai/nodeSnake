
direction = new function() {	
	this.Up = 4;
	this.Down = 1;
	this.Left = 2;
	this.Right = 3;
	this.Nil = 5;
}

Snake = function(startingPoint, startingLength, startingDirection) {
	this.score = 0;
	this.pts = new Array();
	this.pts.push(startingPoint);
	this.lag = startingLength;
	this.direct = startingDirection;
	this.directQueue = [];
}


Snake.prototype.setSnake = function(tmpSnake)
{
	this.score = tmpSnake.score;
	this.pts = tmpSnake.pts.slice();
	this.lag = tmpSnake.lag;
	this.direct = tmpSnake.direct;
	this.directQueue = tmpSnake.directQueue.slice();
}








Snake.prototype.reset = function(startingPoint, startingLength, startingDirection)
{
	this.score = 0;
	this.pts.clear();
	this.pts.push(startingPoint);
	this.lag = startingLength;
	this.direct = startingDirection;
}



Snake.prototype.move = function() {
	if(this.lag==0)
	{
		this.pts.pop();
	}
	else
	{
		this.lag--;
	}
	var pt = new Point(this.getHead().x, this.getHead().y);
	if (this.directQueue.length > 0) {
		this.direct = this.directQueue.shift();
	}
	switch(this.direct)
	{
		case direction.Up:
			pt.setY(pt.y - 1);
			break;
		case direction.Down:
			pt.setY(pt.y + 1);
			break;
		case direction.Left:
			pt.setX(pt.x - 1);
			break;
		case direction.Right:
			pt.setX(pt.x + 1);
			break;
	}
	
	this.pts.unshift(pt);
}



Snake.prototype.setPoint = function(point) {
	this.point = point;
}




Snake.prototype.changeDirection = function(direction, check) {
	var ret = false;
	if(	(this.direct != direction &&	// not the same direction
		!this.isOpposite(direction)) ||	// nothing is stored in the history movemen
		 this.directQueue.length > 0)		
	{
		this.directQueue.push(direction)
		ret = true;
	}
	
	return ret;
}




Snake.prototype.grow = function() {
	this.score ++;
	this.lag += 10;
}



Snake.prototype.same = function(snake) {
	
	var pt1 = new Point(this.getHead());
	var pt2 = new Point(snake.getHead());
	
	return ((this.lag == snake.lag) && 
			(this.direct == snake.direct) &&
			(pt1.hit(pt2)));
}



Snake.prototype.isOpposite = function(direct) {
	ret = false;
	switch(this.direct)
	{
		case direction.Up:
			ret = (direct == direction.Down);
			break;
		case direction.Down:
			ret = (direct == direction.Up);
			break;
		case direction.Left:
			ret = (direct == direction.Right);
			break;
		case direction.Right:
			ret = (direct == direction.Left);
			break;
	}
	return ret;
}



Snake.prototype.suicide = function() {
	return this.hit(this.getHead(), false);
}


Snake.prototype.contains = function(point) {
	return this.hit(point, true);
}


Snake.prototype.hit = function(point, includeHead) {
	var length = this.pts.length;
	
	for(var i= (includeHead ? 0 : 1) ; i<length; i++)
	{
		if(point.hit(this.pts[i]))
			return true;
	}
	
	return false;
}


Snake.prototype.hitSnake = function(snake) {
	var length = this.pts.length>= 5 ? Math.floor(0.3 * this.pts.length) : 1;
	
	for (var i = 0 ; i < length ; i++) 
	{
		for(var j = 0; j<snake.pts.length; j++)
		{
			if(this.pts[i].x == snake.pts[j].x && this.pts[i].y == snake.pts[j].y) 
			{
				return true;
			}
		}
	}
	return false;
}



Snake.prototype.getHead = function()
{
	return this.pts[0];
}

