var Wall = function(x, y, width, height) {
	this.pos = new vec(x, y);
	this.size = new vec(width, height);
};

Wall.prototype = {
	draw : function(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		ctx.fill();
	}
};
