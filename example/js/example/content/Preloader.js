

define([
		'jquery'
	],
	function($) {

		var getPreloader = function() {
			return $('<div class="preloader"><div> </div></div>');
		};
		
		var mainPreloader;
		var getMainPreloader = function() {
			mainPreloader = mainPreloader || getPreloader().attr('id', 'mainPreloader').prependTo('body');
			return mainPreloader; 
		};
		
		return {
			show : function(container){
				
				container = container || $('body');
				var p = getPreloader();
				p.appendTo(container);
				
				p.css({
					top:(container.outerHeight()-p.outerHeight()) /2,
					left:(container.outerWidth()-p.outerWidth()) /2
				});
				p.stop().hide().fadeIn(600, function(){
						
				});
			},
			
			hide:function(container) {
				
				container = container || $('body');
				var p = container.find('.preloader');
				
				if(p.length ) {
					p.stop().fadeOut(400, function(){
						p.remove();
					});
					
				}
			},
			
			showMain:function() {
				var p = getMainPreloader();
				
				p.css({
					top:-75,
					left:(p.parent().outerWidth()-p.outerWidth()) /2
				});
				p.stop().show().animate({
					top:-15
				}, {
					duration:200,
					onComplete: function(){}
				});
				
			},
			
			hideMain:function(){
				var p = getMainPreloader();
				p.stop().animate({
					top:-75
				}, {
					duration:200,
					complete: function(){
						p.hide();
					}
				});
			}
		};
	}
);