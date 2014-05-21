var Target = function(x, y, radius, amount,sticky) {
	this.pos = new vec(x, y);
	this.radius = radius;
	this.count = 0;
	this.amount = amount;
	this.sticky = sticky;
	Game.tickables.push(this);
	Game.drawables.push(this);
};

Target.prototype = {
	draw : function() {
		var ctx = Game.ctx;
		ctx.beginPath();
		ctx.fillStyle = "rgb(120, 255, 120)";
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.fillStyle = "white";
		ctx.font = "bold 16px Arial";
		ctx.fillText(this.amount - this.count, this.pos.x, this.pos.y);
	},
	tick : function() {
		var sheeps = Game.sheeps;
		if(!this.sticky) {
			this.count = 0;
		}
		var f = true;
		for(var key in sheeps) {
			if(!this.sticky || this.count < this.amount) {
				var sheep = sheeps[key];
				var vec = this.pos.sub(sheep.pos);
				if(vec.length() <= this.radius) {
					this.count++;
					if(this.sticky) {
						sheep.die();
					}
				}
			}
		}
		return this.count >= this.amount;
	}
}
