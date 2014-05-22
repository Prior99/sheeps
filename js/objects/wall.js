var Wall = function(obj) {
	this.pos = new vec(obj.pos[0], obj.pos[1]);
	this.size = new vec(obj.width, obj.height);
	Game.drawables.push(this);
	Game.walls.push(this);
};

Wall.prototype = {
	draw : function() {
		Game.ctx.beginPath();
		Game.ctx.fillStyle = "white";
		Game.ctx.strokeStyle = "rgb(0, 0, 0)";
		Game.ctx.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		Game.ctx.stroke();
		Game.ctx.fill();
	}
};
