/*!
 * More info at http://lab.la-grange.ca
 * @author Martin Vézina <m.vezina@la-grange.ca>
 * @copyright 2014 Martin Vézina <m.vezina@la-grange.ca>
 * 
 * module pattern : https://github.com/umdjs/umd/blob/master/amdWebGlobal.js
*/
(function (root, factory) {
	var nsParts = 'example/ExampleTransition'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);

	if (typeof define === 'function' && define.amd) {
		define(
			'example/ExampleTransition',//must be a string, not a var
			[
				'jquery',
				'lagrange/animation/AbstractTransition'
			], function ($, AbstractTransition) {
			return (ns[name] = factory($, AbstractTransition));
		});
	} else {
		ns[name] = factory(root.$, root.lagrange.animation.AbstractTransition);
	}
}(this, function ($, AbstractTransition) {
	"use strict";

	var tests = {};

	var ExampleTransition = function(name){
	};

	ExampleTransition.prototype = {
		constructor: ExampleTransition,
		setAnimation : function(tl, context, setInEndTime) {
			var A = $('.spriteA', context);
			var B = $('.spriteB', context);
			tl.append( TweenLite.from(A, 0.4, {opacity:0, left:"-=100px", ease:Expo.easeOut}) );
			tl.append( TweenLite.from(B, 0.4, {opacity:0, left:"+=100px", ease:Expo.easeOut}) );
			var animateInFinish = setInEndTime();
			tl.append( TweenLite.to(A, 0.4, {opacity:0, left:"-=100px", ease:Expo.easeIn}) );
			tl.append( TweenLite.to(B, 0.4, {opacity:0, left:"+=100px", ease:Expo.easeIn}) );
			return tl;
		},
		wakeup : function(what) {
			console.log(what, this);
		},
		deactivate : function(what) {
			console.log(what, this);
		}
	};

	tests.A = new ExampleTransition('pet');
	tests.A = AbstractTransition.factory(tests.A);

	var slide = new AbstractTransition();

	tests.B.setAnimation = function(tl, context, setInEndTime) {
		var A = $('.spriteA', context);
		var B = $('.spriteB', context);
		tl.append( TweenLite.from(A, 0.4, {opacity:0, left:"-=100px", ease:Expo.easeOut}) );
		tl.append( TweenLite.from(B, 0.4, {opacity:0, left:"+=100px", ease:Expo.easeOut}) );
		var animateInFinish = setInEndTime();
		tl.append( TweenLite.to(A, 0.4, {opacity:0, left:"-=100px", ease:Expo.easeIn}) );
		tl.append( TweenLite.to(B, 0.4, {opacity:0, left:"+=100px", ease:Expo.easeIn}) );
		return tl;
	};
	tests.B.wakeup = function(what) {
		console.log(what, this);
	};
	tests.B.deactivate = function(what) {
		console.log(what, this);
	};


	return {
		init : function(){
			tests.A.setupTransition('#rootA');
			tests.B.setupTransition('#rootB');

			//console.dir(AbstractTransition);
			console.log('A',tests.A);
			console.log('B',tests.B);
			console.log('A is AbstractTransition', tests.A instanceof AbstractTransition);
			console.log('A is ExampleTransition', tests.A instanceof ExampleTransition);
			console.log('B is AbstractTransition', tests.B instanceof AbstractTransition);
			console.log('B is ExampleTransition', tests.B instanceof ExampleTransition);

			var btns = $('.check');
			
			btns.each(function(i, el){
				var btn = $(el);
				var status = false;
				var id = btn.data('id');
				btn.on('click.test', function(){
					var fcn = status ? 'Out' : 'In';
					tests[id]['animate'+fcn](fcn);
					status = !status;
				});
			});
		}
	};

}));


