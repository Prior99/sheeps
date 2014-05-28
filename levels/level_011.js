module.exports = {
	name : "Train",
	description : "It can be somehow exhausting to row it up a stream all day.", 
	image : "img/thumb_level_011.png",
	dependencies : ["Onion"],
	init : function () {
		new Target({
			pos : [400, 550],
			radius : 20,
			amount : 1, 
			sticky :true
		});
		new Wall({
			pos : [0, 275],
			width: 350,
			height: 50
		});
		new Wall({
			pos : [450, 275],
			width: 350,
			height: 50
		});
		var hole = new Hole({
			pos : [400, 300],
			radius: 50
		});
		var and = new And({target: new Not(hole), inputs :2});
		new Button({
			pos : [550, 100],
			width: 200,
			height: 100,
			target : and
		});
		new Button({
			pos : [50, 100],
			width: 200,
			height: 100,
			target : and
		});
		for(var i = 0; i < 5; i++)
			new Sheep({
				pos : [200 + 50 * i, 50],
				drunkmodifier : 0
			});	
	}
};
