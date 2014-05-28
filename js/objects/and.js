var And = function(target, inputs) {
	this.target = target;
	this.inputs = inputs;
	this.count = 0;
}

And.prototype = {
	name: "And",
	activate : function() {
		this.count++;
		if(this.count >= this.inputs) {
			this.target.activate();
		}
	},
	deactivate : function() {
		this.count--;
		if(this.count < this.inputs) {
			this.target.deactivate();
		}
	}
}
