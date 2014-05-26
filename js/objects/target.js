var Target = function(obj) {
	this.pos = new vec(obj.pos[0], obj.pos[1]);
	this.radius = obj.radius;
	this.count = 0;
	this.amount = obj.amount;
	this.sticky = obj.sticky !== undefined;
	Game.tickables.push(this);
	Game.drawables.push(this);
	Game.targets.push(this);
	this.active = obj.deactivated == undefined || obj.deactivated == false; 
};

Target.prototype = {
	activate : function() {
		this.active = true;
	},
	deactivate : function() {
		this.active = false;
	},
	draw : function() {
		var ctx = Game.ctx;
		ctx.fillStyle = "rgb(200, 255, 200)";
		if(this.active) ctx.strokeStyle = "rgb(0, 0, 0)";
		else ctx.strokeStyle = "rgb(80, 80, 80)";
		ctx.lineWidth=1;
		
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();
		if(this.active) ctx.fill();
		ctx.font = "bold 40px Arial";
		ctx.textAlign = "center";
		ctx.strokeText(this.amount - this.count, this.pos.x , this.pos.y + 10);
	},
	tick : function() {
		if(!this.active) return;
		var sheeps = Game.sheeps;
		if(!this.sticky) {
			this.count = 0;
		}
		var f = true;
		for(var key in sheeps) {
			if(!this.sticky || this.count < this.amount) {
				var sheep = sheeps[key];
				var v = this.pos.sub(sheep.pos);
				if(v.length() <= this.radius) {
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
	},
	isSelected : Hole.prototype.isSelected,
	isClicked : Hole.prototype.isClicked
}
