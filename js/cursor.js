var Cursor = function(canvas) {
	this.pos = new vec(0, 0);
	var self = this;
	canvas.addEventListener('mousemove', function(e) {
		var rect = canvas.getBoundingClientRect();
		self.pos = new vec(e.clientX - rect.left - 20, e.clientY - rect.top - 20);
	});
};

Cursor.prototype = {
	draw : function() {
		var ctx = Game.ctx;
		ctx.beginPath();
		ctx.fillStyle = "rgb(180, 180, 180)";
		ctx.strokeStyle = "rgb(0, 0, 0)";
		ctx.arc(this.pos.x, this.pos.y, 8, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		//ctx.fillStyle = "red";
		ctx.fillStyle = "rgb(" + parseInt(255*(Game.power/20)) + ", " + parseInt(255 - 255*(Game.power/20)) + ", 0)";
		ctx.moveTo(this.pos.x, this.pos.y);
		ctx.arc(this.pos.x, this.pos.y, 8, 0, (2 * Math.PI)*(Game.power/20));
		ctx.lineTo(this.pos.x, this.pos.y);
		ctx.fill();
	}
};
