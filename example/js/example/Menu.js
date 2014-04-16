
define([
		'jquery',
		'lagrange/content/Async'
	],
	function($, Async) {

		var links;
		var menu;

		/** 
		Trouve tous les items du menu et trouve leur ID
		*/
		var init = function() {
			if(links) return;
			links = {};
			menu = $('nav').find('a');
			menu.each(function(){
				var _self = $(this);
				var part = Async.getPagePart(_self.attr('href'));
				links[part] = _self;
			});
		};

		return {
			activate : function(id){
				init();
				
				//console.log(id, links);
				var act = links[id];

				menu.removeClass('active');

				if(act) {
					act.addClass('active');
				}

			},

			getElements : function(){
				init();
				return menu;
			}
		};
	}
);