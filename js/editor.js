var Editor = {
	init : function(canvas, div) {
		this.ctx = canvas[0].getContext("2d");
		Game.ctx = this.ctx;
		registerHatched(this.ctx);
		this.div = div;
		this.selection = [];
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
				var f = false;
				for(var key in Game.drawables) {
					var obj = Game.drawables[key];
					if(obj.isClicked(v)) {
						f = true;
						Editor.openProperties(obj);
					}
				}
				if(!f) {
					Editor.openCreateMenu(v);
				}
			}
			else {
				var f = false;
				for(var key in Game.drawables) {
					var obj = Game.drawables[key];
					if(obj.isClicked(v)) {
						console.log("Clicked");
						Editor.grabbed = true;
						console.log("grabbed", Editor.grabbed);
						var index;
						if((index = Editor.selection.indexOf(obj)) === -1) {
							Editor.selection = [];
							Editor.selection.push(obj);
						}
						f = true;
					}
				}
				if(!f) {
					Editor.selection = [];
					Editor.selectionstart = v;
					Editor.pressed = true;
				}
			}
			return false;
		});
		canvas.mouseup(function(e) {
			Editor.pressed = false;
			Editor.grabbed = false;
			e.preventDefault();
			return false;
		});
		canvas.mousemove(function(e) {
			var rect = canvas[0].getBoundingClientRect();
			var v = new vec(e.clientX - rect.left, e.clientY - rect.top);
			Editor.selectionend = v;
			if(Editor.pressed)
				Editor.select();
			if(Editor.grabbed) {
				var delta = v.sub(Editor.lastPosition);
				for(var key in Editor.selection) {
					var obj = Editor.selection[key];
					obj.pos = obj.pos.add(delta);
				}
			}
			Editor.lastPosition = v;
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
			if(thing.isSelected(st, end)) {
				if(this.selection.indexOf(thing) === -1) {
					this.selection.push(thing);
				}
			}
			else {
				var index;
				if((index = this.selection.indexOf(thing)) !== -1) {
					this.selection.splice(index, 1);
				}
			}
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
			ctx.beginPath();
			if(this.selection.indexOf(obj) === -1)
				ctx.fillStyle="lightblue";
			else
				ctx.fillStyle="red";
			ctx.rect(obj.pos.x -15, obj.pos.y -15, 15, 15);
			ctx.stroke();
			ctx.fill();
			ctx.fillStyle = "black;"
			ctx.font = "14px Arial";
			ctx.textAlign = "left";
			ctx.strokeText(key, obj.pos.x -12, obj.pos.y- 4);
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
				
			}))
			.append($("<div class='entry'>Herd (Circle)</div>").click(function() {
				Editor.cancelContext();
				var propDiv = $("<div class='properties'></div>").appendTo(Editor.div);
				Editor.context = propDiv;
				var radius, amount;
				propDiv.append($("<p></p>").append("<label>Radius</label>").append(radius = $("<input type='text'>")))
					.append($("<p></p>").append("<label>Amount</label>").append(amount = $("<input type='text'>")))
					.append($("<button>OK</button>").click(function() {
						drawSheepCircle({
							center : [v.x, v.y],
							radius : parseInt(radius.val()),
							amount : parseInt(amount.val())
						});
						Editor.cancelContext();
					}));
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
	},
	openProperties : function(obj) {
		var propDiv = $("<div class='properties'></div>").appendTo(Editor.div);
		var arr = [];
		for(var key in obj.template) {
			var type = obj.template[key];
			var line = $("<p></p>").appendTo(propDiv);
			line.append("<label>" + key + "</label>");
			var value;
			if(type == "bool") {
				line.append(value = $("<input type='checkbox' " + (obj.properties[key] === true ? "checked='true'" : "") + ">"));
			}
			else if(type == "number") {
				line.append(value = $("<input type='text' value='" + obj.properties[key] + "'>"));
			}
			else if(type == "vector") {
				value = {
					x : $("<input type='text' value='" + obj.properties[key][0] + "'>").appendTo(line),
					y : $("<input type='text' value='" + obj.properties[key][1] + "'>").appendTo(line)
				};
			}
			arr.push({
				type : type,
				value : value,
				name : key
			});
		}
		propDiv.append($("<button>Apply</button>").click(function() {
			var n = {};
			for(var key in arr) {
				var res = arr[key];
				if(res.type == "bool") {
					n[res.name] = res.value.prop("checked");
				}
				else if(res.type == "number") {
					n[res.name] = parseInt(res.value.val());
				}
				else if(res.type == "vector") {
					n[res.name] =  [parseInt(res.value.x.val()), parseInt(res.value.y.val())];
				}
			}
			obj.applyProperties(n);
			propDiv.remove();
		}));
		this.context = propDiv;
	},
	export : function() {
		var string = "function() {\n";
		for(var key in Game.drawables) {
			var object = Game.drawables[key];
			var name = object.name;
			var index = key;
			string += "\tnew " + name + "({\n";
			for(var i in object.template) {
				var type = object.template[i];
				if(type == "bool") {
					string += "\t\t" + i + " : " + (object.properties[i] == true) + ",\n";
				}
				else if(type == "number") {
					string += "\t\t" + i + " : " + object.properties[i] + ",\n";
				}
				else if(type == "vector") {
					string += "\t\t" + i + " : [" + object.properties[i][0] + ", " + object.properties[i][1] + "],\n";
				}
			}
			string += "\t});\n";
		}
		string += "}";
		console.log(string);
	}
};
