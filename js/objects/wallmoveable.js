var MoveableWall = function(obj) {
	this.applyProperties(obj);
	this.target = 0;
	Game.tickables.push(this);
	Game.drawables.push(this);
	Game.walls.push(this);
	this.active = true;
};

MoveableWall.prototype = {
	name : "MoveableWall",
	activate : function() {
		this.active2 = true;
	},
	applyProperties : function(obj) {
		this.properties = obj;
		this.pos = new vec(obj.pos[0], obj.pos[1]);
		this.targets = [
			new vec(obj.loc1[0], obj.loc1[1]),
			new vec(obj.loc2[0], obj.loc2[1])
		];
		this.size = new vec(obj.width, obj.height);
		this.active2 = obj.deactivated == undefined || obj.deactivated == false; 
	},
	deactivate : function() {
		this.active2 = false;
	},
	draw : function() {
		Game.ctx.beginPath();
		Game.ctx.strokeStyle = "rgba(140, 140, 140, 0.5)";
		var p = this.targets[0];
		var s = this.targets[1].sub(this.targets[0]).add(this.size);
		Game.ctx.drawHatchedRect(p.x, p.y, s.x, s.y, 15);
		Game.ctx.strokeStyle = "black";
		Game.ctx.beginPath();
		Game.ctx.fillStyle = "rgb(255, 255, 200)";
		if(this.active) Game.ctx.strokeStyle = "rgb(0, 0, 0)";
		else Game.ctx.strokeStyle = "rgb(80, 80, 80)";
		Game.ctx.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		if(this.active) Game.ctx.fill();
		Game.ctx.drawHatchedRect(this.pos.x, this.pos.y, this.size.x, this.size.y, 15);
	},
	tick : function() {
		if(!this.active2) return;
		var target = this.targets[this.target];
		if(this.pos.sub(target).length() < 5) {
			this.target = this.target == 0 ? 1 : 0;
		}
		else {
			var v = target.sub(this.pos).normalize();
			this.pos = this.pos.add(v.mult(2));
		}
	},
	isSelected : Wall.prototype.isSelected,
	isClicked : Wall.prototype.isClicked,
	template : {
		width : "number",
		height : "number",
		pos : "vector",
		loc1 : "vector",
		loc1 : "vector",
		deactivated: "bool"
	}
	
};
