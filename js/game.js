var Game = {
	tickables : [],
	drawables : [],
	sheeps : [],
	walls : [],
	targets : [],
	init : function(canvas, FPS, name, startvec, bonus) {
		this.canvas = canvas;
		this.name = name;
		this.bonus = bonus;
		this.ctx = canvas.getContext("2d");
		this.sidebar = {
			alive : $("<span class='highlight'></span>").appendTo($("<span>Alive: </span>").appendTo($("div.sidebar"))),
			remaining : $("<span class='highlight'></span>").appendTo($("<span>Remaining: </span>").appendTo($("div.sidebar"))),
			tt : $("<span class='highlight'></span>").appendTo($("<span>Tick: </span>").appendTo($("div.sidebar"))),
			ft : $("<span class='highlight'></span>").appendTo($("<span>Frame: </span>").appendTo($("div.sidebar")))
		};
		if(this.bonus !== undefined) {
			this.startSheepAmount = this.sheeps.length;
			this.targetSheeps = 0;
			for(var key in this.targets) {
				var target = this.targets[key];
				if(target.sticky) {
					this.targetSheeps += target.amount;
				}
			}
			bonus.amount = this.startSheepAmount - this.targetSheeps;
		}
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
			ctx.fillRect(0, 0, 840, 640);
			ctx.translate(20, 20);
			ctx.beginPath();
			ctx.rect(0, 0, 800, 600);
			ctx.stroke();
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
			ctx.translate(-20, -20);
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
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillRect(0, 0, 840, 640);
		Game.cursor.draw(ctx);
		this.ctx.translate(20, 20);
		this.ctx.beginPath();
		this.ctx.rect(0, 0, 800, 600);
		this.ctx.stroke();
		
		for(var key in Game.drawables) {
			Game.drawables[key].draw();
		}
		
		Game.drawInfo();
		if(!Game.stopped) window.requestAnimationFrame(function() {
			Game.draw();
		});
		this.ctx.translate(-20, -20);
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
		if(!this.bonusTime) {
			Game.remaining = 0;
			var won = true;
			for(var key in Game.targets) {
				var target = Game.targets[key];
				Game.remaining += target.remaining();
				if(!target.check()) won = false;
			}
			if(won) {
				if(this.bonus !== undefined) {
					Game.startBonus();
				}
				else {
					this.win();
				}
			}
			if(Game.sheeps.length < Game.remaining) {
				Game.lose();
			}
		}
		else {
			if(this.sheeps.length == 0) {
				this.win();
			}
		}
	},
	startBonus : function() {
		this.bonusTime = true;
		this.bonus = new Bonus(this.bonus);
	},
	win : function() {
		Game.stop();
		if(this.bonus !== undefined) {
			localStorage.setItem(Game.name, JSON.stringify({
				count : this.bonus.count,
				amount : this.bonus.count
			}));
		}
		else {
			localStorage.setItem(Game.name, JSON.stringify({
				count : 0,
				amount : 0
			}));
		}
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
		this.sidebar.alive.html(Game.sheeps.length);
		this.sidebar.remaining.html(Game.remaining);
		this.sidebar.ft.html(parseInt(this.fps) + "ms");
		this.sidebar.tt.html(parseInt(this.tps) + "ms");
	}
};
