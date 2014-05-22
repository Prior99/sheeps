module.exports = {
	name : "Holes",
	description : "Try avoiding the hole in the moddle.", 
	image : "img/thumb_level_004.png",
	dependencies : ["Motion!"],
	init : function () {
		new Target({
			pos : [700, 300],
			radius : 30,
			amount : 20, 
			sticky :true
		});
		new Hole({
			pos: [400, 300],
			radius : 30
		});
		drawSheepCircle({
			amount : 40,
			center : [100, 300],
			radius: 50
		});	
	}
};
