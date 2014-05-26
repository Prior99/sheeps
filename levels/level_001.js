module.exports = {
	name : "Potato",
	description : "One of the most sour fruits in the world.", 
	image : "img/thumb_level_001.png",
	bonus : {
		pos : [50, 450],
		radius: 50
	},
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
