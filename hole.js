var Hole = function(x, y, radius) {
	this.pos = new vec(x, y);
	this.radius = radius;
};

Hole.prototype = {
	draw : function(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "rgb(250, 60, 60)";
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
	},
	tick : function(sheeps) {
		for(var key in sheeps) {
			var sheep = sheeps[key];
			var vec = this.pos.sub(sheep.pos);
			if(vec.length() <= this.radius) {
				sheeps.splice(sheeps.indexOf(sheep), 1);
			}
		}
	}
};
