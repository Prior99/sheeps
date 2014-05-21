var Target = function(x, y, radius, amount,sticky) {
	this.pos = new vec(x, y);
	this.radius = radius;
	this.count = 0;
	this.amount = amount;
	this.sticky = sticky;
};

Target.prototype = {
	draw : function(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "rgb(120, 255, 120)";
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.fillStyle = "white";
		ctx.font = "bold 16px Arial";
		ctx.fillText(this.amount - this.count, this.pos.x, this.pos.y);
	},
	tick : function(sheeps) {
		if(!this.sticky) {
			this.count = 0;
		}
		var f = true;
		if(this.sticky && this.count < this.amount) {
			for(var key in sheeps) {
				var sheep = sheeps[key];
				var vec = this.pos.sub(sheep.pos);
				if(vec.length() <= this.radius) {
					this.count++;
					if(this.sticky) {
						sheeps.splice(sheeps.indexOf(sheep), 1);
					}
				}
			}
		}
		return this.count >= this.amount;
	}
}
