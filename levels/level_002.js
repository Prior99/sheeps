module.exports = {
	name : "Second steps",
	description : "Some less easier but still childish steps.", 
	image : "img/unknown.png",
	dependencies : ["First steps"],
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
