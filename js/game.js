var Game = {
	tickables : [],
	drawables : [],
	sheeps : [],
	walls : [],
	targets : [],
	init : function(canvas, FPS, name, startvec) {
		this.canvas = canvas;
		this.name = name;
		this.ctx = canvas.getContext("2d");
		/*
		 * Thx to Andra Ruebsteck for this snippet
		 */
		this.ctx.drawHatchedRect = function(x, y, width, height, stripWidth) {
			this.rect(x, y, width, height);
			this.stroke();
			for(var i = 0; y + i* stripWidth < y+height; i++){
				this.beginPath();
				this.moveTo(x, y +  i* stripWidth);
				var ny = (y +  i* stripWidth) + width;
				var nx = x + width;
				if(ny > y + height){
					nx -= ny-(y+height);
					ny = y + height;
				}
				this.lineTo(nx, ny);
				this.stroke();
			}
			for(var i = 0; x + i*stripWidth < x + width; i++){
				this.beginPath();
				this.moveTo(x +  i* stripWidth, y);
				var nx = (x +  i* stripWidth) + width;
				var ny = y + width;
				if(nx > x + width){
					ny -= nx-(x+width);
					nx = x + width;
				}
				if(ny > y + height){
					nx -= ny-(y+height);
					ny = y + height;
				}
				this.lineTo(nx, ny);
				this.stroke();
			}
		};
		this.cursor = new Cursor(canvas);
		this.bound = {
			min : new vec(10, 10), 
			max : new vec(canvas.width - 10, canvas.height - 10)
		};
		var ctx = this.ctx;
		this.startInterval = setInterval(function() {
			ctx.fillStyle = "rgb(255, 255, 255)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "rgb(255, 255, 255)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.strokeStyle = "black";
			ctx.fillStyle = "rgb(200, 255, 200)";
			ctx.beginPath();
			ctx.arc(startvec.x, startvec.y, 30, 0, Math.PI * 2);
			ctx.stroke();
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.textAlign = 'center';
			ctx.font = "20px Arial";
			ctx.fillText("Start", startvec.x, startvec.y + 5);
			Game.cursor.draw();
			if(Game.cursor.pos.sub(startvec).length() < 30) {
				Game.start();
			}
		}, 100/FPS);
	},
	start : function() {
		this.stopped = false;
		clearInterval(this.startInterval);
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		/*this.drawInterval = setInterval(function() {
			Game.draw();
		}, 100/FPS);*/
		this.draw();
		this.tickInterval = setInterval(function() {
			Game.tick();
		}, 100/FPS);
	},
	draw : function() {
		this.fps = new Date().getTime() - this.lastFrame;
		var ctx = Game.ctx;
		/*ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);*/
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(var key in Game.drawables) {
			Game.drawables[key].draw();
		}
		Game.cursor.draw(ctx);
		
		Game.drawInfo();
		if(!Game.stopped) window.requestAnimationFrame(function() {
			Game.draw();
		});
		this.lastFrame = new Date().getTime();
	},
	tick : function() {
		this.tps = new Date().getTime() - this.lastTick;
		for(var key in Game.tickables) {
			Game.tickables[key].tick();
		}
		Game.checkWin();
		this.lastTick = new Date().getTime();
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
		localStorage.setItem(Game.name, true);
		alert("you win!");
		location.reload();
	},
	lose : function() {
		Game.stop();
		alert("you suck!");
	},
	stop : function() {
		Game.draw();
		clearInterval(Game.tickInterval);
		//clearInterval(Game.drawInterval);
		this.stopped = true;
	},
	drawInfo : function() {
		var ctx = Game.ctx;
		ctx.textAlign = "left";
		ctx.fillStyle = "rgb(70, 70, 255)";
		ctx.font = "bold 16px Arial";
		ctx.fillText(Game.remaining + " sheeps to rescue", 10, 26);
		ctx.fillText(Game.sheeps.length + " sheeps alive", 10, 26 + 16 + 5);
		ctx.fillText("FT: " + parseInt(this.fps) + " | TT:" + parseInt(this.tps), 10, 26 + (16 + 5) * 2);
	}
};
