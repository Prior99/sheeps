
module.exports = {
	name : "... In a sheeps clothing",
	description : "Watch out so your sheeps will not be eaten.", 
	image : "img/unknown.png",
	dependencies : ["Holes"],
	init : function () {
		new Target({
			pos : [400, 300],
			radius : 30,
			amount : 20, 
			sticky :true
		});
		new Wall({
			pos: [200, 100],
			width: 50,
			height: 400
		});
		new Wall({
			pos: [250, 100],
			height: 50,
			width: 300
		});
		new Wall({
			pos: [250, 450],
			height: 50,
			width: 300
		});
		new Wolf({
			pos: [350, 300],
		});
		drawSheepCircle({
			amount : 40,
			center : [100, 300],
			radius: 50
		});	
	}
};
