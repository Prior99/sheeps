var Game = {
	tickables : [],
	drawables : [],
	sheeps : [],
	walls : [],
	targets : [],
	initLevel : function() {
		new Target(130, 450, 50, 20, true);
		new Target(130, 150, 50, 20, true);
		/*new Hole(400, 300, 30);
		new Wolf(790, 20);
		new Wolf(790, 300);
		new Wolf(790, 580);*/
		/*for(var x = 200; x <= 540; x+= 80)
			new MoveableWall(x, 100, x, 300, 20, 200);
		for(var x = 240; x <= 540; x+= 80)
			new MoveableWall(x, 300, x, 100, 20, 200);*/
		for(var i = 0; i < 100; i++) {
			var index = (i / 100) * (Math.PI * 2);
			if(i > 10 && i < 90) {
				new Sheep(400 + Math.sin(index)*80, 300 - Math.cos(index)*80);
			}
		}
	},
	init : function(canvas, FPS) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.cursor = new Cursor(canvas);
		this.bound = {
			min : new vec(10, 10), 
			max : new vec(canvas.width - 10, canvas.height - 10)
		};
		this.drawInterval = setInterval(function() {
			var ctx = Game.ctx;
			ctx.fillStyle = "rgb(140, 140, 255)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			for(var key in Game.drawables) {
				Game.drawables[key].draw();
			}
			Game.cursor.draw(ctx);
			Game.drawInfo();
		}, 100/FPS);
		Game.tickInterval = setInterval(function() {
			for(var key in Game.tickables) {
				Game.tickables[key].tick();
			}
			Game.checkWin();
		}, 100/FPS);
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
