/*!
 * More info at http://lab.la-grange.ca
 * @author Martin Vézina <m.vezina@la-grange.ca>
 * @copyright 2014 Martin Vézina <m.vezina@la-grange.ca>
 * 
*/
	"use strict";

	var $ = require('jquery'); 
	var AbstractTransition = require('lagrange/animation/AbstractTransition.js');

	var A = function(name){
	};

	A.prototype = {
		constructor: A,
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
	A.factory = function(){
		return new A();
	};

	AbstractTransition.factory(A.prototype);



	var B = new AbstractTransition();
	B.factory = function(o){
		return $.extend((o || {}), B);
	};

	B.setAnimation = function(tl, context, setInEndTime) {
		var A = $('.spriteA', context);
		var B = $('.spriteB', context);
		tl.append( TweenLite.from(A, 0.4, {opacity:0, left:"-=100px", ease:Expo.easeOut}) );
		tl.append( TweenLite.from(B, 0.4, {opacity:0, left:"+=100px", ease:Expo.easeOut}) );
		var animateInFinish = setInEndTime();
		tl.append( TweenLite.to(A, 0.4, {opacity:0, left:"-=100px", ease:Expo.easeIn}) );
		tl.append( TweenLite.to(B, 0.4, {opacity:0, left:"+=100px", ease:Expo.easeIn}) );
		return tl;
	};
	B.wakeup = function(what) {
		console.log(what, this);
	};
	B.deactivate = function(what) {
		console.log(what, this);
	};


	module.exports = {
		init : function(){

			var tests = {
				A : new A(),
				B : B.factory()
			};

			tests.A.setupTransition('#rootA');
			tests.B.setupTransition('#rootB');

			//console.dir(AbstractTransition);
			console.log('A',tests.A);
			console.log('B',tests.B);
			console.log('A is AbstractTransition %s', tests.A instanceof AbstractTransition);
			console.log('A is A %s', tests.A instanceof A);
			console.log('B is AbstractTransition %s', tests.B instanceof AbstractTransition);
			console.log('B is A %s', tests.B instanceof A);

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


