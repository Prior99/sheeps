var And = function(obj) {
	this.applyProperties(obj);
	this.count = 0;
}

And.prototype = {
	applyProperties : function(obj) {
		this.properties = obj;
		this.target = obj.target;
		this.inputs = obj.inputs;
	},
	name: "And",
	activate : function() {
		this.count++;
		if(this.count >= this.inputs) {
			this.target.activate();
		}
	},
	islogic : true,
	deactivate : function() {
		this.count--;
		if(this.count < this.inputs) {
			this.target.deactivate();
		}
	},
	template : {
		inputs : "number"
	}
}
