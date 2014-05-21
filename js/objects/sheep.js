var Sheep = function(obj) {
	this.pos = new vec(obj.pos[0], obj.pos[1]);
	Game.tickables.push(this);
	Game.drawables.push(this);
	Game.sheeps.push(this);
};

Sheep.prototype = {
	draw : function() {
		var ctx = Game.ctx;
		ctx.beginPath();
		ctx.fillStyle = "rgb(0, 255, 0)";
		ctx.arc(this.pos.x, this.pos.y, 4, 0, 2 * Math.PI);
		ctx.fill();
	},
	tick : function() {
		var cursor = Game.cursor;
		var walls = Game.walls;
		var vec = cursor.pos.sub(this.pos).mult(-1);
		var len = vec.length();
		vec = vec.normalize();
		var speed = (1/len)*50;
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
	},
	die : function() {
		var index;
		if((index = Game.sheeps.indexOf(this)) != -1)
			Game.sheeps.splice(index, 1);
		if((index = Game.drawables.indexOf(this)) != -1)
			Game.drawables.splice(index, 1);
		if((index = Game.tickables.indexOf(this)) != -1)
			Game.tickables.splice(index, 1);
	}
};

function len(vec) {
	return 
};
