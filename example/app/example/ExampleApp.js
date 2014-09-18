
	var $ = require('jquery'); 
	var WU = require('lagrange/utils/WindowUtils.js');
	var Navig = require('example/Navig.js');
	var ExampleTransition = require('example/ExampleTransition.js');

	module.exports = ({			
		initialize : function(){
			$(document).ready(function(){
				Navig.init();
				ExampleTransition.init();
				this.activate(WU.body());
			}.bind(this));
			return this;
		},

		activate : function(context) {
			Navig.activateContext(context);
		},

		deactivate : function(context) {
			Navig.deactivateContext(context);
		}
	}).initialize();