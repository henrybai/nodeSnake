

Snake = function(startingPoint, startingLength, startingDirection) {
	this.score = 0;
	this.pts = []
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
		case Direction.UP:
			pt.setY(pt.y - 1);
			break;
		case Direction.DOWN:
			pt.setY(pt.y + 1);
			break;
		case Direction.LEFT:
			pt.setX(pt.x - 1);
			break;
		case Direction.RIGHT:
			pt.setX(pt.x + 1);
			break;
	}
	
	this.pts.unshift(pt);
}



Snake.prototype.setPoint = function(point) {
	this.point = point;
}




Snake.prototype.changeDirection = function(dir, check) {
	var ret = false;
	if(	(this.direct != dir &&	// not the same direction
		!this.isOpposite(dir)) ||	// nothing is stored in the history movemen
		 this.directQueue.length > 0)		
	{
		this.directQueue.push(dir)
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
			(pt1.equals(pt2)));
}



Snake.prototype.isOpposite = function(dir) {
	ret = false;
	switch(this.direct)
	{
		case Direction.UP:
			ret = (dir == Direction.DOWN);
			break;
		case Direction.DOWN:
			ret = (dir == Direction.UP);
			break;
		case Direction.LEFT:
			ret = (dir == Direction.RIGHT);
			break;
		case Direction.RIGHT:
			ret = (dir == Direction.LEFT);
			break;
	}
	return ret;
}



Snake.prototype.suicide = function() {
	var snakeHead = this.getHead();
	for(var i= 1 ; i<this.pts.length; i++)
	{
		if(snakeHead.equals(this.pts[i]))
			return true;
	}
	return false;
}


Snake.prototype.contains = function(point) {
	for(var i= 0 ; i<this.pts.length; i++)
	{
		if(point.equals(this.pts[i]))
			return true;
	}
	return false;
}

Snake.prototype.hitSnake = function(otherSnake) {
	return otherSnake.contains(this.getHead());
}



Snake.prototype.getHead = function()
{
	return new Point(this.pts[0]);
}

