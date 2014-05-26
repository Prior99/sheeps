module.exports = {
	name : "Onion",
	description : "Best before: Yesterday.", 
	image : "img/thumb_level_010.png",
	dependencies : ["Cheese"],
	init : function () {
		new Target({
			pos : [700, 300],
			radius : 50,
			amount : 10, 
			sticky :true
		});
		var walls = [];
		for(var i = 0; i < 2; i++) {
			new Wall({
				pos: [400 + i*150, 0],
				width: 50,
				height: 250
			});
			new Wall({
				pos: [400 + i*150, 350],
				width: 50,
				height: 250
			});
			walls[i] = new Wall({
				pos: [400+i*150, 250],
				width: 50,
				height: 100
			});
		}
		new Button({
			pos : [150, 100],
			width: 50,
			height: 50,
			sticky: true,
			targets : [new Not(walls[0])]
		});
		new Button({
			pos : [150, 500],
			width: 50,
			height: 50,
			targets : [new Not(walls[1])]
		});
		for(var i = 0; i < 20; i++)
			new Sheep({
				pos : [100 + i * 10, 300],
			});	
	}
};
