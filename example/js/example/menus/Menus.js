/** 
	@author Martin Vézina, 2012-07
	
	

*/

define([
		'jquery',
		'lagrange/content/AbstractMenus',
		'example/menus/Menu'
	],
	function($, AbstractMenus, Menu) {


		var Menus = Object.create(AbstractMenus);
		$.extend(Menus, {
			selectors : $.extend({}, AbstractMenus.selectors, {
				menus :'nav',
				active : '.'+Menu.prototype.activeLinkClass
			}),

			instanciateMenu : function(el) {
				//console.log(el);
				return new Menu(el);
			}
			
		});


		return Menus;

	}
);