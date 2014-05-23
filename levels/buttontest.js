module.exports = {
	name : "Buttontest",
	description : "I once was bitten by one. It hurt for days.", 
	image : "img/thumb_level_008.png",
	init : function () {
		new Target({
			pos : [200, 200],
			radius : 30,
			amount : 2, 
			sticky :true
		});
		var t = new Target({
			pos : [600, 400],
			radius : 30,
			amount : 2, 
			sticky :true
		});
		var wall = new Wall({ //Top Left
			pos: [100, 100],
			width: 50,
			height: 175
		});
		var mwall = new MoveableWall({
			pos: [100, 275],
			loc1 : [0, 275],
			loc2 : [200, 275],
			width : 600,
			height: 50
		});
		var h = new Hole({
			pos : [400, 150],
			radius: 10,
			deactivated : true
		});
		new Button({
			pos : [250, 150],
			width: 80,
			height: 80,
			amount: 5,
			sticky: true,
			targets : [new Not(wall), new Not(mwall), new Not(t), h]
		});
		for(var i = 0; i < 10; i++)
			new Sheep({
				pos : [10 + i * 5, 60 - 5 * i],
				drunkmodifier : 1.75
			});	
		for(var i = 0; i < 10; i++)
			new Sheep({
				pos : [790 - 50 + i * 5, 590  - 5 * i],
				drunkmodifier : 1.75
			});	
	}
};
