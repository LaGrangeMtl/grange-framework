
(function(ns){
	requirejs.config({
		paths:{
			'jquery' : 'vendor/jquery',
			'TweenMax' : 'vendor/greensock/TweenMax.min',
			'native.history' : 'vendor/native.history',
			'imagesloaded/imagesloaded' : 'vendor/imagesloaded',
			'lagrange' : '../../src/js/lagrange'
		}
	});

	requirejs(['jquery', 'example/ExampleApp'], function($, ExampleApp){
		$(function(){
			ns.app = ExampleApp.initialize();
		});

	});
	
})(window.lagrange = window.lagrange || {});