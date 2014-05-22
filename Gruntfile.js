var fs = require("fs");

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

module.exports = function(grunt) {
	grunt.registerTask('cleanup', function() {
		fs.unlink("sheeps.js");
	});
		grunt.registerTask('descriptor', function() {
		grunt.log.writeln("Building level descriptor...");
		var done = this.async();
		fs.mkdir("dist/levels", function(err) {
			fs.readdir("dist/levels", function(err, files) {
				if(!err) {
					for(var i = 0; i < files.length; i++) {
						fs.unlink("dist/levels/" + files[i]);
					}
				}
				fs.readdir("levels", function(err, files) {
					if(!err) {
						var arr = [];
						for(var i = 0; i < files.length; i++) {
							var level = require("./levels/" + files[i]);
							level.file = "levels/" + files[i];
							var init = level.init;
							fs.writeFile("dist/levels/" + files[i], ""+init, function(err) {
								if(err) {
									grunt.log.writeln("Error saving level " + files[i]);
								}
							});
							arr.push(level);
						}
						fs.writeFile("dist/levels/descriptor.json", JSON.stringify(arr), function(err) {
							if(err) {
								grunt.log.writeln("Error saving descriptor");
							}
						});
					}
					else {
						grunt.log.writeln(err);
					}
					done();
				});
			});
		});
	});
	
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'), 
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['js/*.js', 'js/objects/*.js'],
				dest: '<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
				sourceMap: 'sheeps.map'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		includeSource: {
			options: {
				basePath: 'dist',
				baseUrl: ''
			},
			myTarget: {
				files: {
					'dist/index.html': 'index.html'
				}
			}
		},
		less: {
			development: {
				options: {
					paths: ["style"]
				},
				files: {
					"dist/style.css": "style/style.less"
				}
			},
			production: {
				options: {
					paths: ["style"],
					cleancss: true,
				},
				files: {
					"dist/style.css": "style/style.less"
				}
			}
		},
		copy: {
			images: {
				files: [
					{expand: true, src: ['img/*.png'], dest: 'dist/', filter: 'isFile'}
				]
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-include-source');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.registerTask('default', ['concat', 'uglify', 'less', 'includeSource', 'descriptor', 'cleanup', 'copy']);
};
