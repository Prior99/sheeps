var Wall = function(obj) {
	this.applyProperties(obj);
	Game.drawables.push(this);
};

Wall.prototype = {
	activate : function() {
		this.active = true;
		if(Game.walls.indexOf(this) == -1) {
			Game.walls.push(this);
		}
	},
	applyProperties : function(obj) {
		this.properties = obj;
		this.pos = new vec(obj.pos[0], obj.pos[1]);
		this.size = new vec(obj.width, obj.height);
		if(obj.deactivated == undefined || obj.deactivated == false) {
			Game.walls.push(this);
			this.active = true;
		}
		else {
			this.active = false;
		}
	},
	deactivate : function() {
		this.active = false;
		var index;
		if((index = Game.walls.indexOf(this)) != -1) {
			Game.walls.splice(index, 1);
		}
	},
	draw : function() {
		Game.ctx.beginPath();
		Game.ctx.fillStyle = "rgb(255, 255, 200)";
		if(this.active) Game.ctx.strokeStyle = "rgb(0, 0, 0)";
		else Game.ctx.strokeStyle = "rgb(80, 80, 80)";
		Game.ctx.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		if(this.active) Game.ctx.fill();
		Game.ctx.drawHatchedRect(this.pos.x, this.pos.y, this.size.x, this.size.y, 15);
	},
	isSelected : Button.prototype.isSelected,
	isClicked : Button.prototype.isClicked,
	template : {
		width : "number",
		height : "number",
		pos : "vector",
		deactivated: "bool"
	}
};
