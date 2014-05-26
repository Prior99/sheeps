
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

function registerHatched(ctx) {
	/*
	 * Thx to Andra Ruebsteck for this snippet
	 */
	ctx.drawHatchedRect = function(x, y, width, height, stripWidth) {
		this.rect(x, y, width, height);
		this.stroke();
		for(var i = 0; y + i* stripWidth < y+height; i++){
			this.beginPath();
			this.moveTo(x, y +  i* stripWidth);
			var ny = (y +  i* stripWidth) + width;
			var nx = x + width;
			if(ny > y + height){
				nx -= ny-(y+height);
				ny = y + height;
			}
			this.lineTo(nx, ny);
			this.stroke();
		}
		for(var i = 0; x + i*stripWidth < x + width; i++){
			this.beginPath();
			this.moveTo(x +  i* stripWidth, y);
			var nx = (x +  i* stripWidth) + width;
			var ny = y + width;
			if(nx > x + width){
				ny -= nx-(x+width);
				nx = x + width;
			}
			if(ny > y + height){
				nx -= ny-(y+height);
				ny = y + height;
			}
			this.lineTo(nx, ny);
			this.stroke();
		}
	};
};
