module.exports = {
	name : "Paper",
	description : "Be it raw, cooked or grilled, it's always delicious.", 
	image : "img/thumb_level_002.png",
	dependencies : ["Potato"],
	init : function () {
		new Target({
			pos : [700, 300],
			radius : 30,
			amount : 20, 
			sticky :true
		});
		new Wall({
			pos: [200, 100],
			width: 40,
			height: 400
		});
		drawSheepCircle({
			amount : 40,
			center : [100, 300],
			radius: 50
		});	
	}
};
