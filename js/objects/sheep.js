var Sheep = function(obj) {
	this.pos = new vec(obj.pos[0], obj.pos[1]);
	Game.tickables.push(this);
	Game.drawables.push(this);
	Game.sheeps.push(this);
	this.dir = new vec(0, 0);
	this.drunk = new vec(0, 0);
	this.drunkraddelta = (Math.random()-0.5)/10;
	this.drunkrad = 0;
	if(obj.drunkmodifier === undefined) this.drunkmod = 1;
	else this.drunkmod = obj.drunkmodifier;
};

Sheep.prototype = {
	draw : function() {
		var ctx = Game.ctx;
		var red = (this.len/800)*255;
		ctx.fillStyle = "rgb("+parseInt(red)+", " + parseInt(255 - red) + ", 200)";
		ctx.strokeStyle = "rgb(0, 0, 0)";
		ctx.lineWidth=1;
		var tail = this.pos.add(this.dir.mult(5));
		
		ctx.beginPath();
		ctx.arc(tail.x, tail.y, 3, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		
		ctx.beginPath();
		ctx.lineWidth=1;
		ctx.arc(this.pos.x, this.pos.y, 4, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		
	},
	tick : function() {
		this.drunkrad += this.drunkraddelta * 2 * Math.random();
		this.drunk = rad2vec(this.drunkrad).normalize().mult(0.3);
		var cursor = Game.cursor;
		var walls = Game.walls;
		var v = cursor.pos.sub(this.pos).mult(-1);
		var len = v.length();
		this.len = v.length();
		v = v.normalize();
		this.dir = v.add(this.drunk.mult(this.drunkmod)).normalize();
		var speed = (1/len)*49;
		speed = speed > 5 ? 5 : speed;
		this.pos = this.pos.add(this.dir.mult(speed));
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
