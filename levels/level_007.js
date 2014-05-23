module.exports = {
	name : "Leafs",
	description : "Try not to choke on it.", 
	image : "img/thumb_level_007.png",
	dependencies : ["Guitar"],
	init : function () {
		new Target({
			pos : [400, 300],
			radius : 30,
			amount : 10, 
			sticky :true
		});
		new Wall({
			pos: [200, 100],
			width: 50,
			height: 400
		});
		for(var i = 0; i < 10; i++)
			new Sheep({
				pos : [100, 50 + 50*i],
				drunkmodifier : 3
			});	
	}
};
