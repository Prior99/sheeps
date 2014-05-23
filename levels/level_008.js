module.exports = {
	name : "Toothpaste",
	description : "I once was bitten by on. It hurt for days.", 
	image : "img/thumb_level_008.png",
	dependencies : ["Beer", "Leafs"],
	init : function () {
		new Target({
			pos : [200, 200],
			radius : 30,
			amount : 10, 
			sticky :true
		});
		new Target({
			pos : [600, 400],
			radius : 30,
			amount : 10, 
			sticky :true
		});
		
		new Wall({ //Top Left
			pos: [100, 100],
			width: 50,
			height: 175
		});
		new Wall({//Top Right
			pos: [375, 100],
			width: 50,
			height: 175
		});
		new Wall({ //Top Top
			pos: [150, 100],
			width: 225,
			height: 50
		});
		
		new Wall({ //Bottom Left
			pos: [375, 325],
			width: 50,
			height: 175
		});
		new Wall({ //Bottom Right
			pos: [375 + 275, 325],
			width: 50,
			height: 175
		});
		new Wall({ //Bottom Bottom
			pos: [375 + 50, 450],
			width: 275,
			height: 50
		});
		new MoveableWall({
			pos: [100, 275],
			loc1 : [0, 275],
			loc2 : [200, 275],
			width : 600,
			height: 50
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
