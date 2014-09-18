/** 
	@author Martin Vézina, 2012-07
	
	

*/

	var $ = require('jquery');
	var AbstractMenus = require('lagrange/content/AbstractMenus.js');
	var Menu = require('example/menus/Menu.js');

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


	module.exports = Menus;

