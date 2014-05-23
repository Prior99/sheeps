
module.exports = {
	name : "Guitar",
	description : "The most comfortable furniture to sit on.", 
	image : "img/thumb_level_005.png",
	dependencies : ["Chicken"],
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
