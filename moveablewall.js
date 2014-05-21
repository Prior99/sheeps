var MoveableWall = function(x1, y1, x2, y2, width, height) {
	this.pos = new vec(x1, y1);
	this.targets = [
		new vec(x1, y1),
		new vec(x2, y2)
	];
	this.target = 0;
	this.size = new vec(width, height);
};

MoveableWall.prototype = {
	draw : Wall.prototype.draw,
	tick : function() {
		var target = this.targets[this.target];
		if(this.pos.sub(target).length() < 5) {
			this.target = this.target == 0 ? 1 : 0;
		}
		else {
			var vec = target.sub(this.pos).normalize();
			this.pos = this.pos.add(vec.mult(0.5));
		}
	}
	
};
