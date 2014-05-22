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
;var Game = {
	tickables : [],
	drawables : [],
	sheeps : [],
	walls : [],
	targets : [],
	init : function(canvas, FPS) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.cursor = new Cursor(canvas);
		this.bound = {
			min : new vec(10, 10), 
			max : new vec(canvas.width - 10, canvas.height - 10)
		};
		this.drawInterval = setInterval(function() {
			Game.draw();
		}, 100/FPS);
		Game.tickInterval = setInterval(function() {
			Game.tick();
		}, 100/FPS);
	},
	draw : function() {
		var ctx = Game.ctx;
		ctx.fillStyle = "rgb(140, 140, 255)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		for(var key in Game.drawables) {
			Game.drawables[key].draw();
		}
		Game.cursor.draw(ctx);
		Game.drawInfo();
	},
	tick : function() {
		for(var key in Game.tickables) {
			Game.tickables[key].tick();
		}
		Game.checkWin();
	},
	checkWin : function() {
		Game.remaining = 0;
		var won = true;
		for(var key in Game.targets) {
			var target = Game.targets[key];
			Game.remaining += target.remaining();
			if(!target.check()) won = false;
		}
		if(won) {
			Game.win();
		}
		if(Game.sheeps.length < Game.remaining) {
			Game.lose();
		}
	},
	win : function() {
		Game.stop();
		alert("you win!");
	},
	lose : function() {
		Game.stop();
		alert("you suck!");
	},
	stop : function() {
		Game.draw();
		clearInterval(Game.tickInterval);
		clearInterval(Game.drawInterval);
	},
	drawInfo : function() {
		var ctx = Game.ctx;
		ctx.fillStyle = "rgb(70, 70, 255)";
		ctx.font = "bold 16px Arial";
		ctx.fillText(Game.remaining + " sheeps to rescue", 10, 26);
		ctx.fillText(Game.sheeps.length + " sheeps alive", 10, 26 + 16 + 5);
	}
};
;var vec = function(x, y) {
	this.x = x;
	this.y = y;
	this.len = undefined;
	this.norm = undefined;
}

vec.prototype = {
	length : function() {
		if(this.len === undefined) {
			this.len = Math.sqrt(this.x*this.x + this.y*this.y);
		}
		return this.len;
	},
	normalize : function() {
		if(this.norm === undefined) {
			this.norm = new vec(this.x / this.length(), this.y / this.length());
		}
		return this.norm;
	},
	add : function(v) {
		return new vec(this.x + v.x, this.y + v.y);
	},
	sub : function(v) {
		return new vec(this.x - v.x, this.y - v.y);
	},
	scalar : function(v) {
		return this.x * v.x + this.y * v.y;
	},
	mult : function(scalar) {
		return new vec(this.x * scalar, this.y * scalar);
	},
	bound : function(min, max) {
		var x = this.x > max.x ? max.x : this.x < min.x ? min.x : this.x;
		var y = this.y > max.y ? max.y : this.y < min.y ? min.y : this.y;
		return new vec(x, y);
	},
	equals : function(v) {
		return v.x == this.x && v.y == this.y;
	}
};
;var Hole = function(obj) {
	this.pos = new vec(obj.pos[0], obj.pos[1]);
	this.radius = obj.radius;
	Game.tickables.push(this);
	Game.drawables.push(this);
};

Hole.prototype = {
	draw : function() {
		var ctx = Game.ctx;
		ctx.beginPath();
		ctx.fillStyle = "rgb(250, 60, 60)";
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
	},
	tick : function() {
		var sheeps = Game.sheeps;
		for(var key in sheeps) {
			var sheep = sheeps[key];
			var vec = this.pos.sub(sheep.pos);
			if(vec.length() <= this.radius) {
				sheep.die();
			}
		}
	}
};
;var Sheep = function(obj) {
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
;var Target = function(obj) {
	this.pos = new vec(obj.pos[0], obj.pos[1]);
	this.radius = obj.radius;
	this.count = 0;
	this.amount = obj.amount;
	this.sticky = obj.sticky !== undefined;
	Game.tickables.push(this);
	Game.drawables.push(this);
	Game.targets.push(this);
};

Target.prototype = {
	draw : function() {
		var ctx = Game.ctx;
		ctx.beginPath();
		ctx.fillStyle = "rgb(120, 255, 120)";
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.fillStyle = "white";
		ctx.font = "bold 16px Arial";
		ctx.fillText(this.amount - this.count, this.pos.x, this.pos.y);
	},
	tick : function() {
		var sheeps = Game.sheeps;
		if(!this.sticky) {
			this.count = 0;
		}
		var f = true;
		for(var key in sheeps) {
			if(!this.sticky || this.count < this.amount) {
				var sheep = sheeps[key];
				var vec = this.pos.sub(sheep.pos);
				if(vec.length() <= this.radius) {
					this.count++;
					if(this.sticky) {
						sheep.die();
					}
				}
			}
		}
		if(this.sticky && this.check()) {
			this.full();
		}
	},
	check : function() {
		return this.remaining() <= 0;
	},	
	remaining : function() {
		return this.amount - this.count;
	},
	full : function() {
		var index;
		if((index = Game.drawables.indexOf(this)) != -1)
			Game.drawables.splice(index, 1);
		if((index = Game.tickables.indexOf(this)) != -1)
			Game.tickables.splice(index, 1);
	}
}
;var Wall = function(obj) {
	this.pos = new vec(obj.pos[0], obj.pos[1]);
	this.size = new vec(obj.width, obj.height);
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
;var MoveableWall = function(obj) {
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
;var Wolf = function(obj) {
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
