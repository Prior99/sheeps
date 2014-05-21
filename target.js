var Target = function(obj) {
	this.pos = new vec(obj.pos[0], obj.pos[1]);
	this.radius = obj.radius;
	this.count = 0;
	this.amount = obj.amount;
	this.sticky = obj.sticky !== undefined;
	Game.tickables.push(this);
	Game.drawables.push(this);
	Game.targets.push(this);
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
		if(this.sticky && this.check()) {
			this.full();
		}
	},
	check : function() {
		return this.remaining() <= 0;
	},	
	remaining : function() {
		return this.amount - this.count;
	},
	full : function() {
		var index;
		if((index = Game.drawables.indexOf(this)) != -1)
			Game.drawables.splice(index, 1);
		if((index = Game.tickables.indexOf(this)) != -1)
			Game.tickables.splice(index, 1);
	}
}
