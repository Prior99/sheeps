var Button = function(obj) {
	this.applyProperties(obj);
	Game.tickables.push(this);
	Game.drawables.push(this);
	if(obj.targets == undefined && obj.target != undefined) {
		this.targets = [obj.target];
	}
	else {
		this.targets = obj.targets;
	}
	this.pressed = false;
	this.count = 0;
};

Button.prototype = {
	name : "Button",
	applyProperties : function(obj) {
		this.pos = new vec(obj.pos[0], obj.pos[1]);
		this.size = new vec(obj.width, obj.height);
		this.sticky = obj.sticky !== undefined;
		if(obj.amount == undefined)
			this.amount = 1;
		else
			this.amount = obj.amount;
	},
	draw : function() {
		var ctx = Game.ctx;
		ctx.strokeStyle = "black";
		if(this.pressed) ctx.fillStyle = "rgb(99, 167, 250)";
		else ctx.fillStyle = "rgb(173, 199, 230)";
		ctx.beginPath();
		ctx.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		ctx.stroke();
		ctx.fill();
		if(this.sticky) {
			if(this.pressed) ctx.fillStyle = "rgb(99, 167, 250)";
			else ctx.fillStyle = "rgb(211, 225, 253)";
			ctx.beginPath();
			ctx.rect(this.pos.x + this.size.x / 8, this.pos.y  + this.size.y / 8, (this.size.x * 6) / 8, (this.size.y * 6) / 8)
			//ctx.stroke();
			ctx.fill();
		}
		ctx.font = "bold 40px Arial";
		ctx.textAlign = "center";
		var i = this.amount - this.count;
		if(i < 0) i = 0;
		ctx.strokeText(i, this.pos.x + this.size.x /2  , this.pos.y + 15 + this.size.y / 2);
	},
	tick : function() {
		if(this.sticky && this.count >= this.amount) return;
		var sheeps = Game.sheeps;
		if(!this.sticky) this.count = 0;
		for(var key in sheeps) {
			var sheep = sheeps[key];
			if(sheep.pos.x > this.pos.x && sheep.pos.y > this.pos.y 
			&& sheep.pos.x < this.pos.x + this.size.x && sheep.pos.y < this.pos.y + this.size.y) {
				this.count++;
				if(this.sticky) sheep.die();
			}
		}
		var nowpressed = this.count >= this.amount;
		if(nowpressed && !this.pressed) {
			for(var key in this.targets) {
				this.targets[key].activate();
			}
		}
		if(!nowpressed && this.pressed) {
			for(var key in this.targets) {
				this.targets[key].deactivate();
			}
		}
		this.pressed = nowpressed;
	},
	isSelected : function(v1, v2) {
		return this.pos.greaterthan(v1) && this.pos.lessthan(v2) && this.pos.add(this.size).lessthan(v2);
	},
	isClicked : function(v) {
		return v.greaterthan(this.pos) && v.lessthan(this.pos.add(this.size));
	},
	template : {
		size : "number",
		sticky : "bool",
		pos : "vector",
		amount : "number"
	}
};
