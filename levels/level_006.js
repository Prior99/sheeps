module.exports = {
	name : "... To the wolfes",
	description : "Let's make it a bit more complicated.", 
	image : "img/unknown.png",
	dependencies : ["... In a sheeps clothing"],
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
		new Wolf({
			pos: [550, 300],
		});
		drawSheepCircle({
			amount : 40,
			center : [100, 300],
			radius: 50
		});	
	}
};
