
(function(ns){
	requirejs.config({
		paths:{
			'jquery' : 'vendor/jquery',
			'TweenMax' : 'vendor/greensock/TweenMax.min',
			'native.history' : 'vendor/native.history',
			'imagesloaded/imagesloaded' : 'vendor/imagesloaded',
			'lagrange' : '../../src/js/lagrange'
		},
		shim: {
		
		}
	});

	requirejs(['jquery', 'example/ExampleApp', 'vendor/es5-shim.min', 'vendor/es5-sham.min'], function($, ExampleApp){

		$(function(){
			ns.app = ExampleApp.initialize();
		});

	});
	
})(window.lagrange = window.lagrange || {});