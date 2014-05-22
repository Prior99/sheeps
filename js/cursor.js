var Cursor = function(canvas) {
	this.pos = new vec(0, 0);
	var self = this;
	canvas.addEventListener('mousemove', function(e) {
		var rect = canvas.getBoundingClientRect();
		self.pos = new vec(e.clientX - rect.left, self.pos.y = e.clientY - rect.top);
	});
	Game.drawables.push(this);
};

Cursor.prototype = {
	draw : function() {
		var ctx = Game.ctx;
		ctx.beginPath();
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.arc(this.pos.x, this.pos.y, 6, 0, 2 * Math.PI);
		ctx.fill();
	}
};