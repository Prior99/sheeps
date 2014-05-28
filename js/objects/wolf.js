var Wolf = function(obj) {
	this.applyProperties(obj);
	Game.tickables.push(this);
	Game.drawables.push(this);
	this.dir = new vec(1, 0);
}

Wolf.prototype = {
	name : "Wolf",
	draw : function() {
		var ctx = Game.ctx;
		ctx.fillStyle = "rgb(255, 200, 200)";
		ctx.strokeStyle = "rgb(0, 0, 0)";
		ctx.lineWidth=1;
		var normal = new vec(this.dir.y, -this.dir.x);
		var head = this.pos.add(this.dir.mult(9));
		var left = this.pos.add(normal.mult(-7).add(this.dir.mult(-9)));
		var right = this.pos.add(normal.mult(7).add(this.dir.mult(-9)));
		ctx.beginPath();
		ctx.lineTo(left.x, left.y);
		ctx.lineTo(head.x, head.y);
		ctx.lineTo(right.x, right.y);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	},
	applyProperties : function(obj) {
		this.properties = obj;
		this.pos = new vec(obj.pos[0], obj.pos[1]);
	},
	tick : function() {
		var oldpos = this.pos;
		this.dir.x = this.dir.y = 0;
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
			var v = sheep.pos.sub(this.pos);
			if(minLen === undefined || v.length() < minLen) {
				minLen = v.length();
				minSheep = sheep;
			}
		}
		if(minSheep !== undefined) {
			if(this.pos.sub(minSheep.pos).length() < 2) {
				minSheep.die();
			}
			else {
				this.dir = this.dir.add(minSheep.pos.sub(this.pos).normalize().mult(3));
			}
		}
		/*
		 * Be afraid of cursor
		 */
		var v = cursor.pos.sub(this.pos).mult(-1);
		var len = v.length();
		v = v.normalize();
		var speed = (1/(len/20 + 1))*Game.power;
		this.dir = this.dir.add(v.mult(speed));
		this.pos = this.pos.add(this.dir);
		this.dir = this.dir.normalize();
		this.pos = this.pos.bound(Game.bound.min, Game.bound.max);
		/*
		 * Avoid walls
		 */
		for(var key in walls) {
			var wall = walls[key];
			if(this.pos.x >= wall.pos.x - 4 && this.pos.x <= wall.pos.x + wall.size.x + 4 &&
			 this.pos.y >= wall.pos.y - 4 && this.pos.y <= wall.pos.y + wall.size.y + 4) {
				/*if(this.pos.x <= wall.pos.x) this.pos.x = wall.pos.x - 5;
				if(this.pos.x >= wall.pos.x + wall.size.x) this.pos.x = wall.pos.x + wall.size.x + 5;
				if(this.pos.y <= wall.pos.y) this.pos.y = wall.pos.y - 5;
				if(this.pos.y >= wall.pos.y + wall.size.y) this.pos.y = wall.pos.y + wall.size.y + 5;	*/
				if(oldpos.x <= wall.pos.x) this.pos.x = wall.pos.x - 5;
				if(oldpos.x >= wall.pos.x + wall.size.x) this.pos.x = wall.pos.x  + wall.size.x + 5;
				if(oldpos.y <= wall.pos.y) this.pos.y = wall.pos.y - 5;
				if(oldpos.y >= wall.pos.y + wall.size.y) this.pos.y = wall.pos.y  + wall.size.y + 5;
			}
		}
	},
	isSelected : function(v1, v2) {
		var radius = 8;
		return this.pos.sub(new vec(1, 1).mult(radius)).greaterthan(v1) &&
			this.pos.add(new vec(1, 1).mult(radius)).lessthan(v2);
	},
	isClicked : function(v) {
		var radius = 8;
		return v.sub(this.pos).length() < radius;
	},
	template : {
		pos : "vector"
	}
};
