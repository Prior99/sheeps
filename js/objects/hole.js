var Hole = function(obj) {
	this.applyProperties(obj);
	Game.tickables.push(this);
	Game.drawables.push(this);
};

Hole.prototype = {
	name : "Hole",
	activate : function() {
		this.active = true;
	},
	applyProperties : function(obj) {
		this.properties = obj;
		this.pos = new vec(obj.pos[0], obj.pos[1]);
		this.radius = obj.radius;
		this.active = obj.deactivated == undefined || obj.deactivated == false; 
	},
	deactivate : function() {
		this.active = false;
	},
	draw : function() {
		var ctx = Game.ctx;
		ctx.fillStyle = "rgb(255, 200, 200)";
		if(this.active) ctx.strokeStyle = "rgb(0, 0, 0)";
		else ctx.strokeStyle = "rgb(80, 80, 80)";
		ctx.lineWidth=1;
		
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();
		if(this.active) ctx.fill();
	},
	tick : function() {
		if(!this.active) return;
		var sheeps = Game.sheeps;
		for(var key in sheeps) {
			var sheep = sheeps[key];
			var v = this.pos.sub(sheep.pos);
			if(v.length() <= this.radius) {
				sheep.die();
			}
		}
	},
	isSelected : function(v1, v2) {
		return this.pos.sub(new vec(1, 1).mult(this.radius)).greaterthan(v1) &&
			this.pos.add(new vec(1, 1).mult(this.radius)).lessthan(v2);
	},
	isClicked : function(v) {
		return v.sub(this.pos).length() < this.radius;
	},
	template : {
		radius : "number",
		pos : "vector",
		deactivated: "bool"
	}
};
