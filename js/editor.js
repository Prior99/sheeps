var Editor = {
	init : function(canvas, div, side) {
		this.sidebar = side;
		this.objects = [];
		this.ctx = canvas[0].getContext("2d");
		Game.ctx = this.ctx;
		registerHatched(this.ctx);
		this.div = div;
		this.selection = [];
		this.recreateSidebar();
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
			for(var i in obj.herd) {
				ctx.strokeStyle = "rgba(120, 120, 120, 0.2)";
				ctx.beginPath();
				ctx.moveTo(obj.pos.x, obj.pos.y);
				ctx.lineTo(obj.herd[i].pos.x, obj.herd[i].pos.y);
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.strokeStyle = "black";
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
				Editor.objects.push(new Hole({
					pos: [v.x, v.y],
					radius: 20
				}));
				Editor.recreateSidebar();
			}))
			.append($("<div class='entry'>Sheep</div>").click(function() {
				Editor.cancelContext();
				Editor.objects.push(new Sheep({
					pos : [v.x, v.y]
				}));
				Editor.recreateSidebar();
			}))
			.append($("<div class='entry'>Herd (Circle)</div>").click(function() {
				Editor.cancelContext();
				var propDiv = $("<div class='properties'></div>").appendTo(Editor.div);
				Editor.context = propDiv;
				var radius, amount;
				propDiv.append($("<p></p>").append("<label>Radius</label>").append(radius = $("<input type='text'>")))
					.append($("<p></p>").append("<label>Amount</label>").append(amount = $("<input type='text'>")))
					.append($("<button>OK</button>").click(function() {
						var arr = drawSheepCircle({
							center : [v.x, v.y],
							radius : parseInt(radius.val()),
							amount : parseInt(amount.val())
						});
						for(var i in arr) {
							Editor.objects.push(arr[i]);
						}
						Editor.cancelContext();
						Editor.recreateSidebar();
					}));
			}))
			.append($("<div class='entry'>Wolf</div>").click(function() {
				Editor.cancelContext();
				Editor.objects.push(new Wolf({
					pos : [v.x, v.y]
				}));
				Editor.recreateSidebar();
			}))
			.append($("<div class='entry'>Target</div>").click(function() {
				Editor.cancelContext();
				Editor.objects.push(new Target({
					pos: [v.x, v.y],
					amount: 1,
					radius: 20
				}));
				Editor.recreateSidebar();
			}))
			.append($("<div class='entry'>Wall</div>").click(function() {
				Editor.cancelContext();
				Editor.objects.push(new Wall({
					pos: [v.x, v.y],
					width: 50,
					height: 50
				}));
				Editor.recreateSidebar();
			}))
			.append($("<div class='entry'>Button</div>").click(function() {
				Editor.cancelContext();
				var propDiv = $("<div class='properties'></div>").appendTo(Editor.div);
				Editor.context = propDiv;
				var target;
				propDiv.append($("<p></p>").append("<label>Target<label>").append(target = $("<input type='text'>")))
					.append($("<button>OK</button>").click(function() {
						if(target.val() >= 0 && target.val() < Editor.objects.length) {
							Editor.objects.push(new Button({
								pos: [v.x, v.y],
								width: 50,
								height: 50,
								target : Editor.objects[target.val()]
							}));
							Editor.cancelContext();
							Editor.recreateSidebar();
						}
						else {
							alert("Invalid id");
						}
					}));
			}))
			.append($("<div class='entry'>Not</div>").click(function() {
				Editor.cancelContext();
				var propDiv = $("<div class='properties'></div>").appendTo(Editor.div);
				Editor.context = propDiv;
				var target;
				propDiv.append($("<p></p>").append("<label>Target<label>").append(target = $("<input type='text'>")))
					.append($("<button>OK</button>").click(function() {
						if(target.val() >= 0 && target.val() < Editor.objects.length) {
							Editor.objects.push(new Not(Editor.objects[target.val()]));
							Editor.cancelContext();
							Editor.recreateSidebar();
						}
						else {
							alert("Invalid id");
						}
					}));
			}))
			.append($("<div class='entry'>And</div>").click(function() {
				Editor.cancelContext();
				var propDiv = $("<div class='properties'></div>").appendTo(Editor.div);
				Editor.context = propDiv;
				var target, inputs;
				propDiv.append($("<p></p>").append("<label>Target<label>").append(target = $("<input type='text'>")))
					.append($("<p></p>").append("<label>Inputs<label>").append(inputs = $("<input type='text'>")))
					.append($("<button>OK</button>").click(function() {
						if(target.val() >= 0 && target.val() < Editor.objects.length) {
							Editor.objects.push(new And({
								target: Editor.objects[parseInt(target.val())], 
								inputs : parseInt(inputs.val())
							}));
							Editor.cancelContext();
							Editor.recreateSidebar();
						}
						else {
							alert("Invalid id");
						}
					}));
			}));
	},
	cancelContext : function() {
		if(this.context !== undefined) this.context.remove();
	},
	openProperties : function(obj) {
		var propDiv = $("<div class='properties'></div>").appendTo(Editor.div);
		var arr = [];
		var ltarget;
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
		if(obj.islogic) {
			var line = $("<p></p>");
			line.append("<label>Target</label>");
			line.append(ltarget = $("<input type='text' value='" + Editor.objects.indexOf(obj.target) + "'>"));
			line.appendTo(propDiv);
		}
		propDiv.append($("<button>Apply</button>").click(function() {
			if(obj.islogic) {
				var idx = parseInt(ltarget.val());
				if(idx >= 0 && idx < Editor.objects.length) {
					obj.target = Editor.objects[idx];
				}
				else {
					alert("Invalid id");
					return;
				}
			}
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
			Editor.recreateSidebar();
		}));
		this.context = propDiv;
	},
	export : function() {
		var sheeps = [];
		var logics = [];
		var string = "function() {\n";
		string += "\t\t/*\n";
		string += "\t\t * Create and initialize all objects\n";
		string += "\t\t */\n";
		string += "\n";
		string += "\t\tvar objects = [];\n";
		for(var key in this.objects) {
			var object = this.objects[key];
			var name = object.name;
			if(name == "Sheep") sheeps.push(object);
			if(object.islogic) logics.push(object);
			var index = key;
			string += "\t\tobjects[" + index + "] = new " + name + "({\n";
			for(var i in object.template) {
				var type = object.template[i];
				if(type == "bool") {
					string += "\t\t\t" + i + " : " + (object.properties[i] == true) + ",\n";
				}
				else if(type == "number") {
					string += "\t\t\t" + i + " : " + object.properties[i] + ",\n";
				}
				else if(type == "vector") {
					string += "\t\t\t" + i + " : [" + object.properties[i][0] + ", " + object.properties[i][1] + "],\n";
				}
			}
			string += "\t\t});\n";
		}
		string += "\n";
		string += "\t\t/*\n";
		string += "\t\t * Assign all sheeps to their respective herds\n";
		string += "\t\t */\n";
		string += "\n";
		string += "\t\tvar herds = [];\n";
		/*
		 * Herden
		 */
		var herdnum = 0; //Index im späteren Array
		while(sheeps.length > 0) {
			var sheep = sheeps[0];
			sheeps.splice(0, 1);
			var herdreferenced = sheep.herd;
			var herdplain = [];
			for(var i in herdreferenced) {
				sheeps.splice(sheeps.indexOf(herdreferenced[i]), 1);
				herdplain.push(this.objects.indexOf(herdreferenced[i]));
			}
			//An dieser Stelle ist herdplain bekannt, ein Array mit den indizes aller schafe in diesem Array.
			string += "\t\therds[" + herdnum + "] = [";
			for(var j = 0; j < herdplain.length; j++) {
				string += "objects[" + herdplain[j] + "]";
				if(j != herdplain.length -1) string += ",";
			}
			string += "];\n";
			string += "\t\tfor(var index in herds[" + herdnum + "]) {\n";
			string += "\t\t\therds[" + herdnum + "][index].herd = herds[" + herdnum + "];\n";
			string += "\t\t}\n";
			herdnum++;
		}
		/*
		 * Logics
		 */
		 if(logics.length > 0) {
			string += "\n";
			string += "\t\t/*\n";
			string += "\t\t * Build all connections between logic components\n";
			string += "\t\t */\n";
			string += "\n";
			for(var i in logics) {
				var logic = logics[i];
				var idx = Editor.objects.indexOf(logic.target);
				var index = Editor.objects.indexOf(logic);
				string += "\t\tobjects[" + index + "].target = objects[" + idx + "];\n"
			}
		}
		string += "\t}";
		return string;
	},
	recreateSidebar : function() {
		this.sidebar.html("");
		this.sidebar.append($("<button>Export</button>").click(function() {
			Editor.cancelContext();
			var propDiv = $("<div class='properties'></div>").appendTo(Editor.div);
			Editor.context = propDiv;
			var name, description;
			propDiv.append($("<p></p>")
				.append("<label>Name</label>")
				.append(name = $("<input type='text'>"))
			);
			propDiv.append($("<p></p>")
				.append("<label>Beschreibung</label>")
				.append(description = $("<input type='text'>"))
			);
			propDiv.append($("<button>Export</button>").click(function() {
				var link;
				propDiv.append(link = $("<a download='level_" + name.val() + ".js' target='_blank'>Export</a>").attr("href", "data:application/octet-stream;base64," + 
				btoa("module.exports = {\n" + 
					"\tname : \"" + name.val() + "\",\n" + 
					"\tdescription : \"" + description.val() + "\",\n" + 
					"\tinit : " + Editor.export() + "\n" + 
					"}"
				)).click(function() {
					link.remove();
					Editor.cancelContext();
				}));
				link[0].click();
			}));
			
			
		}));
		for(var key in this.objects) {
			(function(obj) {
				var id = $("<div class='id'>" + key + "</div>");
				var elem = $("<div class='elem'></div>")
					.append(id)
					.append(obj.name);
				if(obj.islogic !==undefined && obj.islogic === true) {
					id.addClass("logic");
					elem.append(" -> " + Editor.objects.indexOf(obj.target));
				}
				else id.addClass("object");
				if(obj.inputs !== undefined) elem.append(" (" + obj.inputs + ")");
				elem.click(function(e) {
					Editor.openProperties(obj);
				});
				Editor.sidebar.append(elem);
			})(this.objects[key]);
		}
	}
};
