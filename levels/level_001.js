module.exports = {
	name : "First steps",
	description : "A first and easy level", 
	image : "img/thumb_level_001.png",
	init : function () {
		new Target({
			pos : [130, 450],
			radius : 50,
			amount : 4, 
			sticky :true
		});
		new Target({
			pos : [130, 150],
			radius : 50,
			amount : 4, 
			sticky :true
		});
		drawSheepCircle({
			amount : 10,
			center : [400, 300],
			radius: 50
		});	
	}
};
