var fs = require("fs");

function buildLevelDescriptor() {
	console.log("Building level descriptor...");
	fs.readdir("levels", function(err, files) {
		if(!err) {
			console.log(files);
			var arr = [];
			for(var i = 0; i < files.length; i++) {
				var level = require("./levels/" + files[i]);
				level.file = "levels/" + files[i];
				arr.push(level);
			}
			fs.writeFile("levels/descriptor.json", JSON.stringify(arr), function(err) {
				if(err) {
					console.log("Error saving descriptor");
				}
			});
		}
		else {
			console.log(err);
		}
	});	
}
buildLevelDescriptor();
