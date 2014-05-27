var MoveableWall = function(obj) {
	this.applyProperties(obj);
	this.target = 0;
	Game.tickables.push(this);
	Game.drawables.push(this);
	Game.walls.push(this);
	this.active = true;
};

MoveableWall.prototype = {
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
	draw : Wall.prototype.draw,
	tick : function() {
		if(!this.active2) return;
		var target = this.targets[this.target];
		if(this.pos.sub(target).length() < 5) {
			this.target = this.target == 0 ? 1 : 0;
		}
		else {
			var v = target.sub(this.pos).normalize();
			this.pos = this.pos.add(v.mult(0.5));
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
