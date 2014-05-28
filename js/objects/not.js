var Not = function(target) {
	this.target = target;
}

Not.prototype = {
	name : "Not",
	activate : function() {
		this.target.deactivate();
	},
	islogic : true,
	deactivate : function() {
		this.target.activate();
	}
}
