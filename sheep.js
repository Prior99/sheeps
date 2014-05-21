var Sheep = function(x, y) {
	this.pos = new vec(x, y);
};

Sheep.prototype = {
	draw : function(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "rgb(0, 255, 0)";
		ctx.arc(this.pos.x, this.pos.y, 4, 0, 2 * Math.PI);
		ctx.fill();
	},
	tick : function(cursor, walls) {
		var vec = cursor.pos.sub(this.pos).mult(-1);
		var len = vec.length();
		vec = vec.normalize();
		var speed = (1/len)*50;
		var oldpos = this.pos;
		this.pos = this.pos.add(vec.mult(speed));
		this.pos = this.pos.bound(bound.min, bound.max);
		/*
		 * Avoid walls
		 */
		for(var key in walls) {
			var wall = walls[key];
			if(this.pos.x >= wall.pos.x - 4 && this.pos.x <= wall.pos.x + wall.size.x + 4 &&
			   this.pos.y >= wall.pos.y - 4 && this.pos.y <= wall.pos.y + wall.size.y + 4) {
				if(this.pos.x >= wall.pos.x - 4 && this.pos.x <= wall.pos.x + wall.size.x + 4) {
					this.pos.x = oldpos.x;
				}
				if(this.pos.y >= wall.pos.y - 4 && this.pos.y <= wall.pos.y + wall.size.y + 4) {
					this.pos.y = oldpos.y;
				}
			}
		}
	}
};

function len(vec) {
	return 
};
