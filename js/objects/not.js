var Not = function(target) {
	this.target = target;
}

Not.prototype = {
	activate : function() {
		this.target.deactivate();
	},
	deactivate : function() {
		this.target.activate();
	}
}