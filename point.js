Point = function(x, y) {
	switch(typeof x){
		case 'number':
			this.x = x;
			this.y = y;
			break;
		default:
			this.x = x.x;
			this.y = x.y;
			break;
	}
}

Point.prototype.setPoint = function(x, y){
	this.x = x;
	this.y = y;
}

Point.prototype.setX = function(x){
	this.x = x;
}

Point.prototype.parse = function(point) {
	this.x = point.x;
	this.y = point.y;
}

Point.prototype.setY = function(y){
	this.y = y;
}

Point.prototype.equals = function(point){
	return (this.x === point.x) && (this.y === point.y);
}