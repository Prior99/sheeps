var Hole = function(obj) {
	this.pos = new vec(obj.pos[0], obj.pos[1]);
	this.radius = obj.radius;
	Game.tickables.push(this);
	Game.drawables.push(this);
};

Hole.prototype = {
	draw : function() {
		var ctx = Game.ctx;
		ctx.fillStyle = "rgb(255, 200, 200)";
		ctx.strokeStyle = "rgb(0, 0, 0)";
		ctx.lineWidth=1;
		
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
	},
	tick : function() {
		var sheeps = Game.sheeps;
		for(var key in sheeps) {
			var sheep = sheeps[key];
			var v = this.pos.sub(sheep.pos);
			if(v.length() <= this.radius) {
				sheep.die();
			}
		}
	}
};
