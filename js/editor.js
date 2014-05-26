var Editor = {
	init : function(canvas, div) {
		this.ctx = canvas[0].getContext("2d");
		Game.ctx = this.ctx;
		registerHatched(this.ctx);
		this.div = div;
		document.oncontextmenu = function(e) {
			e.preventDefault();
			return false;
		};
		canvas.mousedown(function(e) {
			Editor.cancelContext();
			e.preventDefault();
			var rect = canvas[0].getBoundingClientRect();
			var v = new vec(e.clientX - rect.left, e.clientY - rect.top);
			if(e.button == 2) {
				Editor.openCreateMenu(v);
			}
			else {
				//Editor.move(v);
				Editor.selectionstart = v;
				Editor.pressed = true;
			}
			return false;
		});
		canvas.mouseup(function(e) {
			Editor.pressed = false;
			e.preventDefault();
			return false;
		});
		canvas.mousemove(function(e) {
			var rect = canvas[0].getBoundingClientRect();
			var v = new vec(e.clientX - rect.left, e.clientY - rect.top);
			Editor.selectionend = v;
			if(Editor.pressed)
				Editor.select();
		});
		this.draw();
	},
	select : function() {
		var st = this.selectionstart;
		var end = this.selectionend;
		if(st.greaterthan(end)) {
			var tmp = end;
			end = st;
			st = tmp;
		}
		for(var key in Game.drawables) {
			var thing = Game.drawables[key];
			if(thing.isSelected(st, end)) thing.selected = true;
			else thing.selected = false;
		}
	},
	drawselection : function() {
		if(Editor.pressed) {
			var sub = Editor.selectionend.sub(Editor.selectionstart);
			var ctx = Editor.ctx;
			ctx.strokeStyle ="rgb(0, 0, 255)";
			ctx.fillStyle = "rgba(180, 180, 255, 0.5)";
			ctx.beginPath();
			ctx.rect(Editor.selectionstart.x, Editor.selectionstart.y, sub.x, sub.y);
			ctx.stroke();
			ctx.fill();
		}
	},
	move : function(v) {
		new Sheep({
			pos : [400, 300]
		});
	},
	draw : function() {
		var ctx = Editor.ctx;
		ctx.clearRect(0, 0, 800, 600);
		for(var key in Game.drawables) {
			var obj = Game.drawables[key];
			obj.draw();
			if(obj.selected !== undefined && obj.selected) {
				ctx.beginPath();
				ctx.fillStyle = "red";
				ctx.arc(obj.pos.x, obj.pos.y, 20, 0, Math.PI *2);
				ctx.fill();
			}
		}
		Editor.drawselection();
		window.requestAnimationFrame(function() {
			Editor.draw();
		});
	},
	openCreateMenu : function(v) {
		this.context = $("<div style='left: " + v.x + "; top: " + v.y + "' class='context'></div>").appendTo(this.div)
			.append($("<div class='entry'>Hole</div>").click(function() {
				Editor.cancelContext();
				new Hole({
					pos: [v.x, v.y],
					radius: 20
				});
			}))
			.append($("<div class='entry'>Sheep</div>").click(function() {
				Editor.cancelContext();
				var sheep = new Sheep({
					pos : [v.x, v.y]
				});
				sheep.len = 0;
				
			}))
			.append($("<div class='entry'>Wolf</div>").click(function() {
				Editor.cancelContext();
				new Wolf({
					pos : [v.x, v.y]
				});
			}))
			.append($("<div class='entry'>Target</div>").click(function() {
				Editor.cancelContext();
				new Target({
					pos: [v.x, v.y],
					amount: 1,
					radius: 20
				});
			}))
			.append($("<div class='entry'>Wall</div>").click(function() {
				Editor.cancelContext();
				new Wall({
					pos: [v.x, v.y],
					width: 50,
					height: 50
				});
			}))
			.append($("<div class='entry'>Button</div>").click(function() {
				Editor.cancelContext();
				new Button({
					pos: [v.x, v.y],
					width: 50,
					height: 50
				});
			}));
	},
	cancelContext : function() {
		if(this.context !== undefined) this.context.remove();
	}
};
