var Editor = {
	init : function(canvas, div) {
		this.ctx = canvas[0].getContext("2d");
		Game.ctx = this.ctx;
		this.div = div;
		canvas.mousedown(function(e) {
			Editor.cancelContext();
			e.preventDefault();
			var rect = canvas[0].getBoundingClientRect();
			var v = new vec(e.clientX - rect.left, e.clientY - rect.top);
			if(e.button == 2) {
				Editor.openCreateMenu(v);
			}
			else {
				Editor.move(v);
			}
			return false;
		});
		canvas.mouseup(function(e) {
			e.preventDefault();
			return false;
		});
		this.draw();
	},
	move : function(v) {
		new Sheep({
			pos : [400, 300]
		});
	},
	draw : function() {
		var ctx = Editor.ctx;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(var key in Game.drawables) {
			Game.drawables[key].draw();
		}
		window.requestAnimationFrame(function() {
			Editor.draw();
		});
	},
	openCreateMenu : function(v) {
		this.context = $("<div style='left: " + v.x + "; top: " + v.y + "' class='context'></div>").appendTo(this.div)
			.append($("<div class='entry'>Hole</div>").click(function() {
				Editor.cancelContext();
			}))
			.append($("<div class='entry'>Sheep</div>").click(function() {
				Editor.cancelContext();
				new Sheep({
					pos : [v.x, v.y]
				});
			}))
			.append($("<div class='entry'>Wolf</div>").click(function() {
				Editor.cancelContext();
			}))
			.append($("<div class='entry'>Target</div>").click(function() {
				Editor.cancelContext();
			}))
			.append($("<div class='entry'>Wall</div>").click(function() {
				Editor.cancelContext();
			}));
	},
	cancelContext : function() {
		if(this.context !== undefined) this.context.remove();
	}
};
