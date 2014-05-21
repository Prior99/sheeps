var vec = function(x, y) {
	this.x = x;
	this.y = y;
	this.len = undefined;
	this.norm = undefined;
}

vec.prototype = {
	length : function() {
		if(this.len === undefined) {
			this.len = Math.sqrt(this.x*this.x + this.y*this.y);
		}
		return this.len;
	},
	normalize : function() {
		if(this.norm === undefined) {
			this.norm = new vec(this.x / this.length(), this.y / this.length());
		}
		return this.norm;
	},
	add : function(v) {
		return new vec(this.x + v.x, this.y + v.y);
	},
	sub : function(v) {
		return new vec(this.x - v.x, this.y - v.y);
	},
	scalar : function(v) {
		return this.x * v.x + this.y * v.y;
	},
	mult : function(scalar) {
		return new vec(this.x * scalar, this.y * scalar);
	},
	bound : function(min, max) {
		var x = this.x > max.x ? max.x : this.x < min.x ? min.x : this.x;
		var y = this.y > max.y ? max.y : this.y < min.y ? min.y : this.y;
		return new vec(x, y);
	}
};
