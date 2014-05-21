var Sheep = function(x, y) {
	this.pos = new vec(x, y);
};

Sheep.prototype = {
	draw : function(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "rgb(0, 255, 0)";
		ctx.arc(this.pos.x, this.pos.y, 4, 0, 2 * Math.PI);
		ctx.fill();
	},
	tick : function(cursor) {
		var vec = cursor.pos.sub(this.pos).mult(-1);
		var len = vec.length();
		vec = vec.normalize();
		var speed = (1/len)*50;
		this.pos = this.pos.add(vec.mult(speed));
		this.pos = this.pos.bound(bound.min, bound.max);
	}
};

function len(vec) {
	return 
};
