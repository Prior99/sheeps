var Sheep = function(obj) {
	this.applyProperties(obj);
	Game.tickables.push(this);
	Game.drawables.push(this);
	Game.sheeps.push(this);
	this.dir = new vec(0, 0);
	this.drunk = new vec(0, 0);
	this.drunkraddelta = (Math.random()-0.5)/10;
	this.drunkrad = 0;
	this.len = 0;
};

Sheep.prototype = {
	name : "Sheep",
	applyProperties : function(obj) {
		this.pos = new vec(obj.pos[0], obj.pos[1]);
		if(obj.drunkmodifier === undefined) this.drunkmod = 1;
		else this.drunkmod = obj.drunkmodifier;
		if(obj.herd !== undefined) this.herd = herd;
		else this.herd = [];
	},
	draw : function() {
		var ctx = Game.ctx;
		var red = (this.len/800)*255;
		ctx.fillStyle = "rgb("+parseInt(red)+", " + parseInt(255 - red) + ", 200)";
		ctx.strokeStyle = "rgb(0, 0, 0)";
		ctx.lineWidth=1;
		/*var tail = this.pos.add(this.dir.normalize().mult(5));
		
		ctx.beginPath();
		ctx.arc(tail.x, tail.y, 3, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();*/
		
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, 4, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
	},
	tick : function() {
		var oldpos = this.pos;
		this.drunkrad += this.drunkraddelta * 2 * Math.random();
		this.drunk = rad2vec(this.drunkrad).normalize().mult(0.3);
		var cursor = Game.cursor;
		var walls = Game.walls;
		var v = cursor.pos.sub(this.pos).mult(-1);
		
		
		var len = v.length();
		this.len = v.length();
		v = v.normalize();
		var speed = (1/(len/20 + 1))*Game.power;
		this.dir = v.add(this.drunk.mult(this.drunkmod)).normalize().mult(speed);
		//this.dir = v.mult(speed);
		//this.dir = new vec(0, 0);
		for(var key in this.herd) {
			var sheep = this.herd[key];
			if(sheep !== this) {
				var len = sheep.pos.sub(this.pos).length();
				if(len == 0) {
					console.log("DAMNED");
				}
				if(len < 20) {//retreat
					var speed = (1/len)*49;
					speed = speed > 5 ? 5 : speed;
					speed = speed < 0.2 ? 0 : speed;
					//speed = speed < -1 ? -1 : speed > 1 ? 1 : speed;
					var dir = this.pos.sub(sheep.pos).normalize().mult(speed/2);
					this.dir = this.dir.add(dir);
				}
				if(len > 40) {//approach
					var speed = Math.log(len + 1 - 40)*0.1;
					var dir = sheep.pos.sub(this.pos).normalize().mult(speed/2);
					this.dir = this.dir.add(dir);
				}
			}
		}
		
		this.pos = this.pos.add(this.dir);
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
	die : function() {
		var index;
		if((index = this.herd.indexOf(this)) != -1)
			this.herd.splice(index, 1);
		if((index = Game.sheeps.indexOf(this)) != -1)
			Game.sheeps.splice(index, 1);
		if((index = Game.drawables.indexOf(this)) != -1)
			Game.drawables.splice(index, 1);
		if((index = Game.tickables.indexOf(this)) != -1)
			Game.tickables.splice(index, 1);
	},
	isSelected : function(v1, v2) {
		var radius = 4;
		return this.pos.sub(new vec(1, 1).mult(radius)).greaterthan(v1) &&
			this.pos.add(new vec(1, 1).mult(radius)).lessthan(v2);
	},
	isClicked : function(v) {
		var radius = 4;
		return v.sub(this.pos).length() < radius;
	},
	template : {
		pos : "vector"
	}
};
