var Hole = function(obj) {
	this.pos = new vec(obj.pos[0], obj.pos[1]);
	this.radius = obj.radius;
	Game.tickables.push(this);
	Game.drawables.push(this);
};

Hole.prototype = {
	draw : function() {
		var ctx = Game.ctx;
		ctx.beginPath();
		ctx.fillStyle = "rgb(250, 60, 60)";
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
	},
	tick : function() {
		var sheeps = Game.sheeps;
		for(var key in sheeps) {
			var sheep = sheeps[key];
			var vec = this.pos.sub(sheep.pos);
			if(vec.length() <= this.radius) {
				sheep.die();
			}
		}
	}
};
