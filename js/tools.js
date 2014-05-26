
function drawSheepCircle(obj) {
	var herd = [];
	for(var i = 0; i < obj.amount; i++) {
		var index = (i / obj.amount) * (Math.PI * 2);
		herd.push(new Sheep({
			pos : [obj.center[0] + Math.sin(index)*obj.radius, obj.center[1] - Math.cos(index)*obj.radius]
		}));
	}		
	for(var i in herd) {
		herd[i].herd = herd;
	}
}
