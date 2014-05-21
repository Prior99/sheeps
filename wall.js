var Wall = function(x, y, width, height) {
	this.pos = new vec(x, y);
	this.size = new vec(width, height);
	Game.drawables.push(this);
	Game.walls.push(this);
};

Wall.prototype = {
	draw : function() {
		Game.ctx.beginPath();
		Game.ctx.fillStyle = "white";
		Game.ctx.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		Game.ctx.fill();
	}
};
