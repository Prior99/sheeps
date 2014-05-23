var Button = function(obj) {
	this.pos = new vec(obj.pos[0], obj.pos[1]);
	this.size = new vec(obj.width, obj.height);
	this.sticky = obj.sticky !== undefined;
	Game.tickables.push(this);
	Game.drawables.push(this);
	if(obj.targets == undefined && obj.target != undefined) {
		this.targets = [obj.target];
	}
	else {
		this.targets = obj.targets;
	}
	this.pressed = false;
	if(obj.amount == undefined)
		this.amount = 1;
	else
		this.amount = obj.amount;
	this.count = 0;
};

Button.prototype = {
	draw : function() {
		var ctx = Game.ctx;
		ctx.strokeStyle = "black";
		if(this.pressed) ctx.fillStyle = "rgb(99, 167, 250)";
		else ctx.fillStyle = "rgb(173, 199, 230)";
		ctx.beginPath();
		ctx.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		ctx.stroke();
		ctx.fill();
		if(this.amount > 1) {
			ctx.font = "bold 40px Arial";
			ctx.textAlign = "center";
			ctx.strokeText(this.amount - this.count, this.pos.x + this.size.x /2  , this.pos.y + 10 + this.size.y / 2);
		}
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
	}
};
