'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;'+
			'*/\n\n',
		// Task configuration.

		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			imagesloaded: {
				src: ['bower_components/imagesloaded/imagesloaded.js'],
				dest: 'js/vendor/imagesloaded.js'
			},
	    },

		requirejs: {
			build: {
				options: {
					
					skipDirOptimize: true,
					name: "app",
					include: [],
					insertRequire: [],
					out: "example/built/app.js",
					baseUrl: 'example/js/',
					mainConfigFile: 'example/js/app.js',
					done: function(done, output) {
						var duplicates = require('rjs-build-analysis').duplicates(output);

						if (duplicates.length > 0) {
							grunt.log.subhead('Duplicates found in requirejs build:');
							grunt.log.warn(duplicates);
							done(new Error('r.js built duplicate modules, please check the excludes option.'));
						}

						done();
					}
				}
			},
			prebuild: {
				options: {
					optimize: "none",
					skipDirOptimize: true,
					name: "imagesloaded/imagesloaded",
					include: [],
					insertRequire: [],
					out: "example/js/vendor/imagesloaded.js",
					baseUrl: 'bower_components/',
					paths: {}
				}
			}
		},
		watch: {
			js: {
				files: 'example/js/**/*.js',
				tasks: ['requirejs:build']
			},
			less: {
				files: 'example/less/*.less',
				tasks: ['less']
			}
		},
		less: {
			development: {
				options: {
					paths: [],
					compress : true
				},
				files: {
					"example/css/master.css": "example/less/master.less"
				}
			},
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Default task.
	grunt.registerTask('default', ['requirejs:build']);

};
