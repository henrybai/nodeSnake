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

/*********************************API**********************************
Void		parse(point)
Void		setX(x)
Void		setY(y)
Boolean		hit(point)
**********************************API**********************************/

//======================================================================//
//	Called functions:	-
//	Exceptions:			-
//	Purpose: 			To set the x coordinate of this point.
//======================================================================//
Point.prototype.setPoint = function(x, y){
	this.x = x;
	this.y = y;
}

//======================================================================//
//	Called functions:	-
//	Exceptions:			-
//	Purpose: 			To set the x coordinate of this point.
//======================================================================//
Point.prototype.setX = function(x){
	this.x = x;
}

//======================================================================//
//	Called functions:	-
//	Exceptions:			-
//	Purpose: 			To parse current point to input point.
//======================================================================//
Point.prototype.parse = function(point) {
	this.x = point.x;
	this.y = point.y;
}

//======================================================================//
//	Called functions:	-
//	Exceptions:			-
//	Purpose: 			To set the y coordinate of this point.
//======================================================================//
Point.prototype.setY = function(y){
	this.y = y;
}

//======================================================================//
//	Called functions:	-
//	Exceptions:			-
//	Purpose: 			To check if the point coincide with another point.
//======================================================================//
Point.prototype.hit = function(point){
	return (this.x == point.x) && (this.y == point.y);
}