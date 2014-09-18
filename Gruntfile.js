'use strict';

module.exports = function(grunt) {

	var _ = require('lodash');

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
		bowercopy: {
			options: {
				srcPrefix: 'bower_components',
			},
			vendor: {
				options: {
					destPrefix: 'example/app/vendor',
				},
				 files: {
					
				}
			}
		},

		browserify : {
			options : {
				external: ['es5-shim', 'gsap', 'jquery', 'historyjs', 'lodash', 'imagesloaded'],
				browserifyOptions : {
					debug: false
				},
				//
			},
			dev : {
				files: {
				  'example/js/app.js': ['example/app/example/ExampleApp.js'],
				},
				options : {
					browserifyOptions : {
						debug: true
					},
				}
			},
			prod : {
				files: {
				  'example/js/app.js': ['example/app/example/ExampleApp.js'],
				},
			},
			common: {
				src: ['.'],
				dest: 'example/js/common.js',
				options: {
					debug: false,
					transforms: ["browserify-shim"],
					alias : [
						'es5-shim:',
						'jquery:',
						'gsap:',
						'imagesloaded:',
						'lodash:',
						'historyjs:',
					],
					external : null,
				},
			}
		},

		watch: {
			js: {
				files: 'example/js/**/*.js',
				tasks: ['browserify:prod']
			},
			less: {
				files: 'example/less/*.less',
				tasks: ['less']
			}
		},
		uglify: {
			options: {
				banner:  '<%= banner %>'
			},
			prod: {
				src: 'example/js/app.js',
				dest: 'example/js/app.js'
			},
			common: {
				src: 'example/js/common.js',
				dest: 'example/js/common.js'
			}
		},
		less: {
			development: {
				options: {
					paths: [],
					compress : true,
					// LESS source maps
			      	// To enable, set sourceMap to true and update sourceMapRootpath based on your install
			      	sourceMap: true,
			      	sourceMapFilename: 'example/css/master.css.map',
			      	sourceMapRootpath: '../../'
				},
				files: {
					"example/css/master.css": "example/less/master.less"
				}
			},
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-bowercopy');

	// Default task.
	grunt.registerTask('default', ['browserify:dev']);
	grunt.registerTask('prod', ['browserify:prod', 'uglify:prod']);
	grunt.registerTask('jslibs', ['browserify:common', 'uglify:common']);
	grunt.registerTask('prebuild', ['requirejs:prebuild', 'bowercopy']);

};
