var Wolf = function(obj) {
	this.pos = new vec(obj.pos[0], obj.pos[1]);
	Game.tickables.push(this);
	Game.drawables.push(this);
}

Wolf.prototype = {
	draw : function() {
		var ctx = Game.ctx;
		ctx.beginPath();
		ctx.fillStyle = "rgb(250, 60, 60)";
		ctx.arc(this.pos.x, this.pos.y, 6, 0, 2 * Math.PI);
		ctx.fill();
	},
	tick : function() {
		var walls = Game.walls;
		var sheeps = Game.sheeps;
		var cursor = Game.cursor;
		/*
		 * Hunt nearest sheep
		 */
		var minLen = undefined;
		var minSheep = undefined
		for(var key in sheeps) {
			var sheep = sheeps[key];
			var vec = sheep.pos.sub(this.pos);
			if(minLen === undefined || vec.length() < minLen) {
				minLen = vec.length();
				minSheep = sheep;
			}
		}
		if(minSheep !== undefined) {
			if(this.pos.sub(minSheep.pos).length() < 2) {
				minSheep.die();
			}
			else {
				var vec = minSheep.pos.sub(this.pos).normalize();
				this.pos = this.pos.add(vec.mult(0.3));
			}
		}
		/*
		 * Be afraid of cursor
		 */
		vec = cursor.pos.sub(this.pos).mult(-1);
		var len = vec.length();
		vec = vec.normalize();
		var speed = (1/len)*30;
		this.pos = this.pos.add(vec.mult(speed));
		this.pos = this.pos.bound(Game.bound.min, Game.bound.max);
		/*
		 * Avoid walls
		 */
		for(var key in walls) {
			var wall = walls[key];
			if(this.pos.x >= wall.pos.x - 4 && this.pos.x <= wall.pos.x + wall.size.x + 4 &&
			 this.pos.y >= wall.pos.y - 4 && this.pos.y <= wall.pos.y + wall.size.y + 4) {
				if(this.pos.x <= wall.pos.x) this.pos.x = wall.pos.x - 5;
				if(this.pos.x >= wall.pos.x + wall.size.x) this.pos.x = wall.pos.x + wall.size.x + 5;
				if(this.pos.y <= wall.pos.y) this.pos.y = wall.pos.y - 5;
				if(this.pos.y >= wall.pos.y + wall.size.y) this.pos.y = wall.pos.y + wall.size.y + 5;			
			}
		}
	}
};
