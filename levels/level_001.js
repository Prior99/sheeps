module.exports = {
	name : "First steps",
	description : "A first and easy level", 
	image : "img/unknown.png",
	init : function () {
		new Target({
			pos : [130, 450],
			radius : 50,
			amount : 20, 
			sticky :true
		});
		new Target({
			pos : [130, 150],
			radius : 50,
			amount : 20, 
			sticky :true
		});
		new Hole({
			pos : [400, 300], 
			radius : 30
		});
		new Wolf({
			pos : [790, 20]
		});
		new Wolf({
			pos : [790, 300]
		});
		new Wolf({
			pos : [790, 580]
		});
		for(var x = 200; x <= 540; x+= 80)
			new MoveableWall({
				pos : [x, 100],
				loc1 : [x, 100], 
				loc2 : [x, 300], 
				width : 20, 
				height : 200
			});
		for(var x = 240; x <= 540; x+= 80)
			new MoveableWall({
				pos : [x, 300],
				loc1 : [x, 100], 
				loc2 : [x, 300], 
				width : 20, 
				height : 200
			});
		for(var i = 0; i < 100; i++) {
			var index = (i / 100) * (Math.PI * 2);
			if(i > 10 && i < 90) {
				new Sheep({
					pos : [400 + Math.sin(index)*80, 300 - Math.cos(index)*80]
				});
			}
		}	
	}
};
