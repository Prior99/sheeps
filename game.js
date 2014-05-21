var Game = {
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
