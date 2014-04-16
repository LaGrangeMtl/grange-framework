define(
	[
		'example/NameSpace',
		'lagrange/utils/WindowUtils',
		'jquery',
		'example/Navig'
	], 
	function(ns, WU, $, Navig) {

		return {			
			initialize : function(){

				Navig.init();
				this.activate(WU.body());

				return this;
			},

			activate : function(context) {
				Navig.activateContext(context);
			},

			deactivate : function(context) {
				Navig.deactivateContext(context);
			}
		};
	}
);