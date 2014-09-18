/** 
	@author Martin Vézina, 2012-07
	
	

*/


	var $ = require('jquery');
	var AbstractTransition = require('lagrange/animation/AbstractTransition.js');
	var TweenMax = require('gsap');

	var Menu = function(node){
		AbstractTransition.factory(this);
		this.setupTransition(node);

		this.links = node.find('a');

	};

	Menu.prototype.activeLinkClass = 'active';

	Menu.prototype.setAnimation = function(tl, rootNode, setInEndTime) {
		var links = $.makeArray(rootNode.find('a'));
		tl.staggerFrom(links, 0.5, {left:"30px", opacity:0, ease:Expo.easeIn}, 0.2, 0 );
		var animateInFinish = setInEndTime();
		tl.staggerTo(links, 0.5, {top:"30px", opacity:0, ease:Expo.easeIn}, 0.2, animateInFinish );
		return tl;
	};

	Menu.prototype.activateLink = function(id) {
		this.links.removeClass(this.activeLinkClass);
		this.links.filter('[data-id="'+id+'"]').addClass(this.activeLinkClass);
	};

	module.exports = Menu;

	