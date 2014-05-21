var Target = function(x, y, radius) {
	this.pos = new vec(x, y);
	this.radius = radius;
	this.count = 0;
};

Target.prototype = {
	draw : function(ctx) {
		ctx.fillStyle = "rgb(180, 120, 120)";
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.fillStyle = "white";
		ctx.font = "bold 16px Arial";
		ctx.fillText(this.count, this.pos.x, this.pos.y);
	},
	tick : function(sheeps) {
		this.count = sheeps.length;
		var f = true;
		for(var key in sheeps) {
			var sheep = sheeps[key];
			var vec = this.pos.sub(sheep.pos);
			if(vec.length() > this.radius) {
				f = false;
				this.count--;
			}
		}
		return f;
	}
}
