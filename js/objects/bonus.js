var Bonus = function(obj) {
	this.pos = new vec(obj.pos[0], obj.pos[1]);
	this.radius = obj.radius;
	this.amount = obj.amount;
	this.count = 0;
	Game.tickables.push(this);
	Game.drawables.push(this);
};

Bonus.prototype = {
	draw : function() {
		var ctx = Game.ctx;
		ctx.fillStyle = "#FFF29C";
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI *2);
		ctx.stroke();
		ctx.fill();
		ctx.font = "bold 40px Arial";
		ctx.textAlign = "center";
		ctx.strokeText(this.count + "/" + this.amount, this.pos.x , this.pos.y + 10);
	},
	tick : function() {
		for(var key in Game.sheeps) {
			var sheep = Game.sheeps[key];
			if(sheep.pos.sub(this.pos).length() < this.radius) {
				sheep.die();
				this.count++;
			}
		}
	}
};
