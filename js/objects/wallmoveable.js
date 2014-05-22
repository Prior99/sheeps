var MoveableWall = function(obj) {
	this.pos = new vec(obj.pos[0], obj.pos[1]);
	this.targets = [
		new vec(obj.loc1[0], obj.loc1[1]),
		new vec(obj.loc2[0], obj.loc2[1])
	];
	this.target = 0;
	this.size = new vec(obj.width, obj.height);
	Game.tickables.push(this);
	Game.drawables.push(this);
	Game.walls.push(this);
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
