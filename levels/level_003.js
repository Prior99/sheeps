module.exports = {
	name : "Motion!",
	description : "A very motivating level.", 
	image : "img/unknown.png",
	dependencies : ["Second steps"],
	init : function () {
		new Target({
			pos : [700, 300],
			radius : 30,
			amount : 20, 
			sticky :true
		});
		new MoveableWall({
			pos: [380, 150],
			loc1 : [380, 30],
			loc2: [380, 270],
			width: 40,
			height: 300
		});
		drawSheepCircle({
			amount : 40,
			center : [100, 300],
			radius: 50
		});	
	}
};
