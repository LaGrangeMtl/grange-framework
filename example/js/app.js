(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
},{"example/ExampleTransition.js":2,"example/Navig.js":3,"jquery":"jquery","lagrange/utils/WindowUtils.js":15}],2:[function(require,module,exports){
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



},{"jquery":"jquery","lagrange/animation/AbstractTransition.js":9}],3:[function(require,module,exports){


	var $ = require('jquery');
	var WU = require('lagrange/utils/WindowUtils.js');
	var MobileDetect = require('lagrange/utils/MobileDetect.js');
	var Menus = require('example/menus/Menus.js');
	var PageFactory = require('example/content/PageFactory.js');
	var Preloader = require('example/content/Preloader.js');
	var TweenMax = require('gsap');
	var History = window.History;


	var containerId = 'navigWrapper';
	var container;
	var canonical;
	var currentPage;
	var currentHash;
	var loading = false;

	var isAvailable = function() {
		var isMobile = MobileDetect.any();
		return (!isMobile);// && History.enabled);
	};

	var setMenuActive = function(currentPage, isOnInit) {
		Menus.activate(bindClicks);
	};

	var loadPage = function(url){
		if(loading) return;

		var nextId = PageFactory.getPageId(url);
		//console.log(currentPage.getId()+'=>'+nextId);
		
		//on est deja sur la page qu'on request. do nothing
		if(nextId === currentPage.getId()) return;

		loading = PageFactory.load(url);

		$.when(loading).then(function(nextPage){
			//console.log('go in');
			transitTo(nextPage, false);
		});

	};

	var transitTo = function(nextPage, isSubNavig){

		//swap les pages : l'ancienne s'en va, la prochaine devient l'actuelle
		var oldNode = currentPage.getContentNode();
		var currentNode = nextPage.getContentNode();

		//finds menus in loaded page
		//var loadedMenus = nextPage.find(

		
		ns.app.deactivate(oldNode);
		var oldPage = currentPage;
		currentPage = nextPage;

		var onNewAdded = currentPage.onAddedToDOM();
		container.append(currentNode.hide());
		

		var onOldOut = oldPage.animateOut();
		onOldOut.then(function(){
			Preloader.show();
		});
		$.when(onNewAdded, onOldOut).then(function(){
			Preloader.hide();
			oldNode.detach();//enleve la page passée

			setMenuActive(currentPage);

			History.pushState(null, currentPage.getTitle(), '/'+currentPage.getId());
			currentNode.show();
			currentPage.animateIn();
			ns.app.activate(currentNode);//init les listeners de la nouvelle page

			loading = false;
		});
	}

	var onAddressChange = function(hash) {
		//strip ./ ou / du debut du hash
		var parsedHash = hash.replace(/^[\.\/]+/, '');
		
		//le / est la page originalement loadée, dont le id est le canonical
		if(parsedHash === '') return onAddressChange(canonical);
		
		//ajoute le slash et enleve le _suid
		parsedHash = '/' + parsedHash.replace(/\??&_suid=[0-9]+/, '');
		
		//console.log(hash+' => '+parsedHash+' (current is '+currentPage.getId()+')');
		
		if(currentPage && currentPage.getId() === parsedHash) return;
		
		//load la page. Si la page loadee est la meme qu'actuellement, ça fera rien, meme si le nom de la page et le hahs sont pas pareil (dans ie)
		return loadPage(window.location.protocol + '//' + window.location.host + parsedHash);
	};

	var bindClicks = (function(){
		var onNavig = function(e){
			e.preventDefault();
			var _self = $(this);
			loadPage(_self.attr('href'));
			return false;
		};

		return function(elements){
			if (!isAvailable()) return;
			elements.off(".navig").on('click.navig', onNavig);
		};
	}());

	module.exports = {
		init: function(){
			var path = $('link[rel="canonical"]').attr('href');

			var title = $('title').html();
			//console.log(path, title)
			currentPage = PageFactory.createOriginalPage(path, title);
			canonical = currentPage.name;

			if(isAvailable()){
				console.log(History.getState().hash);
				History.Adapter.bind(window, 'statechange', function(){
					onAddressChange(History.getState().hash);
					return false;
				});

				container = $('#'+containerId);
				if(container.length === 0) {
					currentPage.getContentNode().wrap('<div id="'+containerId+'"></div>');
					container = $('#'+containerId);
				}
			}
			
			var def = currentPage.onAddedToDOM();
			
			def.always(function(){	
				currentPage.jumpToInState();
				setMenuActive(currentPage, true);
				if (!isAvailable()) return;
			});

			Menus.activate(bindClicks);
		},

		activateContext : function(context) {
			
			if (!isAvailable()) return;
			
			bindClicks(context.find('a.inner'))/**/

		},

		deactivateContext : function(context) {
			//desactive la navig, mais desactive ausis les liens pour ne pas cliquer pendant les transitions
			context.find('a.inner').off('.navig').on('click.navig', function(e){
				e.preventDefault();
			});
		}
	}
	

},{"example/content/PageFactory.js":5,"example/content/Preloader.js":6,"example/menus/Menus.js":8,"gsap":"gsap","jquery":"jquery","lagrange/utils/MobileDetect.js":14,"lagrange/utils/WindowUtils.js":15}],4:[function(require,module,exports){

	var $ = require('jquery'); 
	var AsyncContent = require('lagrange/content/AsyncContent.js');

	var Page = function(){

		this.initPage = function(id, title){
			
			this.initAsyncContent(id, title);
			this.setupTransition(this.getContentNode());

			return this;	
		};

		var onAddedToDomCallback = function(){
			console.log('Page  '+this.getTitle()+' is ready');
		};
		
		var readyPromise ;
		var asyncContentAddedToDom = this.onAddedToDOM.bind(this);
		
		this.onAddedToDOM = function () {
			if(readyPromise) {
				return readyPromise;
			}
			//console.log('create page');
			readyPromise = asyncContentAddedToDom();
			readyPromise.then(onAddedToDomCallback.bind(this));
			return readyPromise;
		};

		this.setAnimation = function(tl, rootNode, setInEndTime) {
			var img = rootNode.find('img');
			var title = rootNode.find('h1');
			tl.append( TweenLite.from(img, 0.5, {opacity:0, ease:Expo.easeIn}) );
			tl.insert( TweenLite.from(title, 0.6, {left:400, opacity:0, ease:Expo.easeIn}), 0.3);
			var animateInFinish = setInEndTime();
			tl.insert( TweenLite.to(img, 0.8, {opacity:0, ease:Expo.easeOut}), animateInFinish);
			tl.insert( TweenLite.to(title, 0.6, {left:400, opacity:0, ease:Expo.easeOut}), animateInFinish);
			return tl;
		};
		
		this.wakeup = function(){
			console.log('Page  '+this.getTitle()+' is going in');
		};

		this.sleep = function(){
			console.log('Page  '+this.getTitle()+' is sleeping');
		};

		return this;
	};

	Page.factory = function(){

		return Page.call(AsyncContent.factory());

	};
	
	module.exports = Page;


},{"jquery":"jquery","lagrange/content/AsyncContent.js":12}],5:[function(require,module,exports){
/** 
	@author Martin Vézina, 2012-07
	
	

*/

	var $ = require('jquery');
	var Async = require('lagrange/content/Async.js');
	var ContentFactory = require('lagrange/content/ContentFactory.js');
	var Menus = require('example/menus/Menus.js');
	var Page = require('example/content/Page.js');

	var selector = 'article';

	var PageFactory = Object.create(ContentFactory);
	
	$.extend(PageFactory, {
		
		createContent : function(context, createParams) {

			Menus.setCurrent(context);

			var node = this.getNodeFromSelector(context, selector);

			var page = Page.factory();
			page.setContentNode(node);
			
			page.initPage(createParams.id, createParams.title);

			console.log('**** '+page.getTitle()+' created', page.getId());
			return page;
		},
		
		load : function(path){
			return this.getLoadingDeferred(path);
		},
		
		/** la page originale a aussi un buffered definition qui ne sera pas aexécuté si on ne passe pas par le factory */
		createOriginalPage : function(canonical, title) {				
			return this.createOriginalContent(canonical, title);
		}
		
	});


	//console.dir(PageFactory);
	module.exports = PageFactory;

},{"example/content/Page.js":4,"example/menus/Menus.js":8,"jquery":"jquery","lagrange/content/Async.js":11,"lagrange/content/ContentFactory.js":13}],6:[function(require,module,exports){

	var $ = require('jquery');

	var getPreloader = function() {
		return $('<div class="preloader"><div> </div></div>');
	};
	
	var mainPreloader;
	var getMainPreloader = function() {
		mainPreloader = mainPreloader || getPreloader().attr('id', 'mainPreloader').prependTo('body');
		return mainPreloader; 
	};
	
	module.exports = {
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

},{"jquery":"jquery"}],7:[function(require,module,exports){
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

	
},{"gsap":"gsap","jquery":"jquery","lagrange/animation/AbstractTransition.js":9}],8:[function(require,module,exports){
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


},{"example/menus/Menu.js":7,"jquery":"jquery","lagrange/content/AbstractMenus.js":10}],9:[function(require,module,exports){
/*!
 * More info at http://lab.la-grange.ca
 * @author Martin Vézina <m.vezina@la-grange.ca>
 * @copyright 2014 Martin Vézina <m.vezina@la-grange.ca>
 * 
*/
(function (root, factory) {
	var nsParts = 'lagrange/animation/AbstractTransition'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof exports === 'object') {
	    // CommonJS
	    ns[name] = module.exports = factory(require('jquery'), require('gsap'));
  	} else {
		ns[name] = factory(root.$, root.TweenMax);
	}
}(this, function ($, TweenMax) {
	"use strict";

	var TweenLite = (window.GreenSockGlobals || window).TweenLite;
	var TimelineMax = (window.GreenSockGlobals || window).TimelineMax;

	var IN = 1;
	var OUT = -1;
	var STOPPED = 0;

	var noop = function(){};
	
	var AbstractTransition = function(){
		
		var root;
		var tl;
		// Time at which the in finishes and out starts
		var animateInFinishTime;
		var animateOutStartTime;
		// current animState (1/-1)
		var animState;
		var animDeferred;

		this.setupTransition = function(node) {
			root = (typeof node === 'string') ? $(node) : node;
			setTimeline.call(this);
			return this;
		};

		this.getAnimationRoot = function(){
			return root;
		};
		
		/**
		Creates TimelineMax for the animation
		*/
		var setTimeline = function(){
			if(!TimelineMax) throw new Error('TimelineMax not loaded');
			
			tl = new TimelineMax({
				onComplete : afterAnimateOut,
				onCompleteScope : this
			});

			tl.stop();

			this.setAnimation(tl, root, setAnimInFinishTime);

			tl.addCallback(afterAnimateIn, animateInFinishTime, null, this);

		};

		var afterAnimateOut = function(){
			if(animState === OUT){
				animDeferred && animDeferred.resolve();
				animState = STOPPED;
				(this.sleep || noop).call(this);
				animDeferred = null;
			}
		};

		var afterAnimateIn = function(){
			if(animState === IN){
				tl.stop();
				animDeferred && animDeferred.resolve();
				animState = STOPPED;
				(this.activate || noop).call(this);
				animDeferred = null;
			};
		};

		var setAnimInFinishTime = function(){
			animateInFinishTime = tl.totalDuration();
			tl.append( TweenLite.to({}, 1, {}) );
			animateOutStartTime = animateInFinishTime + 1;
			return animateOutStartTime;
		};

		/**
		Jumps directly to the IN state of the animation if it exists.
		*/
		this.jumpToInState = function() {
			this.cancelTransition();
			if(animateInFinishTime && tl) {
				tl.gotoAndStop(animateInFinishTime);
			}
			animState = STOPPED;
			(this.activate || noop).apply(this, arguments);
		};

		/** 
		Defaults to fadein/fadeout
		*/
		this.setAnimation = this.setAnimation || function(tl, rootNode, setInEndTime) {
			tl.append( TweenLite.from(rootNode, 1, {opacity:0, ease:Expo.easeIn}) );
			var animateInFinish = setInEndTime();
			tl.insert( TweenLite.to(rootNode, 1, {opacity:0, ease:Expo.easeOut}), animateInFinish);
			return tl;
		};

		this.cancelTransition = function() {
			if(animDeferred) {
				animDeferred.reject();
				animDeferred = null;
			}
		};
		
		this.animateIn = function(){
			if(animDeferred && animState === IN) return animDeferred;
			this.cancelTransition();
			(this.wakeup || noop).apply(this, arguments);//passes arguments to the beforeAnimateIn, if any
			animState = IN;
			tl.restart();
			animDeferred = $.Deferred();
			return animDeferred.promise();
		};

		this.animateOut = function(){
			if(animDeferred && animState === OUT) return animDeferred;
			this.cancelTransition();
			(this.deactivate || noop).apply(this, arguments);//passes arguments to the beforeAnimateOut, if any
			animState = OUT;
			tl.play(animateOutStartTime);
			animDeferred = $.Deferred();
			return animDeferred.promise();
		};

		return this;

	};

	AbstractTransition.factory = function(instance) {
		instance = instance || {};
		return AbstractTransition.call(instance);
	};

	return AbstractTransition;

}));



},{"gsap":"gsap","jquery":"jquery"}],10:[function(require,module,exports){
/** 

	@author Martin Vézina, 2012-06

*/
(function (root, factory) {
	var nsParts = 'lagrange/content/AbstractMenus'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof exports === 'object') {
	    // CommonJS
	    ns[name] = module.exports = factory(require('jquery'));
  	} else {
		ns[name] = factory(root.$);
	}
}(this, function ($) {

	var ACTIVATE = 'activate';
	var REMOVE = 'remove';

	var queue = [];

	var activeMenus = (function(){
		var menus = [];

		return {
			setMenu : function(menu, bindClicks) {
				menus[menu.level] = menu;
				bindClicks(menu.element.find('a'));
			},

			getMenu : function(level){
				level = level || 0;
				return menus[level];
			},

			deleteMenu : function(level) {
				delete menus[level];
			},

			getDefinedLevels : function(){
				return menus.reduce(function(vals, menu, idx){
					vals.push(menu.level);
					return vals;
				}, []);
			}
			
		};

	}());

	var getNodeFromSelector = function(input, selector){
		var node = selector ? $(selector, input) : $('<div>').append(input);
		//si le node n'est pas trouvé avec le selector, il est possible que le node soit au premier niveau du jquery donné
		if(node.length == 0 && selector){
			node = input.filter(selector);
		}
		return node;
	};

	var setInitialState = function(bindClicks){
		if(!activeMenus.getMenu()) {
			queue.forEach(function(menu, i) {
				activeMenus.setMenu(menu, bindClicks);
				menu.instance.jumpToInState();
			});
			queue.length = 0;
		}
	};

	return {
		//default
		selectors : {
			menus :'nav',//the actual menus
			active : '.active',//active links in the loaded menus, to determine the page's place in the tree
			containers : '#menu_' //container's selector for each level. Level will be appended (0, 1, 2...)
		},

		setCurrent : function(context) {

			queue.length = 0;
			var menus = getNodeFromSelector(context, this.selectors.menus);
			var activeSelector = this.selectors.active;
			menus.each(function(i, el){
				var _self = $(el);
				var level = _self.data('level');
				var parentId = _self.data('parent');
				var thisLevelActive = activeMenus.getMenu(level);
				//menu for this level has changed
				if(!thisLevelActive || thisLevelActive.parent !== parentId) {
					queue.push({
						element : _self,
						//extended object (in client folder) only should be aware of the menu concrete types, as long as they are AbstractTransitions. This function is therefore the factory to create each menu.
						instance : this.instanciateMenu(_self),
						parent : parentId,
						level : level
					});
				//menu for this level has not changed. Only need to activate another link in it.
				} else {
					//console.log(_self);
					queue.push({
						level : level,
						action : ACTIVATE,
						activeId : _self.find(activeSelector).data('id')
					});
				}
			}.bind(this));

			//now make sure that each active menu level is to be activated/replaced by an item in the cue. Otherwise, we will detach the active menu.	
			activeMenus.getDefinedLevels().forEach(function(level){
				var isDefinedInQueue = queue.reduce(function(isFound, menu){
					return isFound || menu.level === level;
				}, false);
				if(!isDefinedInQueue){
					queue.push({
						level: level,
						action : REMOVE
					});
				}
			});
		
			//make sure queue is in the right order
			queue.sort(function(a, b){
				return a.level - b.level;
			});
		},

		/**
		This method, called by the app, activates each menu when changing from one page to the other. It is the most tricky part, as it has the responsability to remove irrelevent menus and attach the new ones in the dom, depending on the structure of the loaded page.
		*/
		activate : function(bindClicks){

			setInitialState(bindClicks);

			if(!queue.length) return;
			//console.log(queue);
			queue.forEach(function(item){
				var activeMenu = activeMenus.getMenu(item.level);

				//right menu for this level is already in the dom
				if(item.action === ACTIVATE) {	
					
					item.activeId && activeMenu.instance.activateLink(item.activeId);

				//page does not require this menu level
				} else if(item.action === REMOVE) {
					var onOut = activeMenu.instance.animateOut();
					onOut.then(function(){
						activeMenu.element.remove();
						activeMenus.deleteMenu(item.level);
					});

				//this level's menu needs to be replaced
				} else if(activeMenu) {
					var onOut = activeMenu.instance.animateOut();
					onOut.then(function(){
						activeMenu.element.replaceWith(item.element);
						activeMenus.setMenu(item, bindClicks);
						item.instance.animateIn();
					});
				
				//this level's menu simply does not exist, add it
				} else {
					var container = $(this.selectors.containers + item.level);
					container.append(item.element);
					item.instance.animateIn();
					activeMenus.setMenu(item, bindClicks);
				}
			}.bind(this));
			queue.length = 0;
		}

	};

}));
},{"jquery":"jquery"}],11:[function(require,module,exports){
/**

	Non revu 2014-04-14. Devra être testé lors de la prochaine utilisation

*/
(function (root, factory) {
	var nsParts = 'lagrange/content/Async'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	
	if (typeof exports === 'object') {
	    // CommonJS
	    ns[name] = module.exports = factory(require('jquery'), require('lagrange/utils/WindowUtils.js'));
  	} else {
		ns[name] = factory(root.jQuery, root.lagrange.utils.WindowUtils);
	}
}(this, function($, WU) {
	var AsyncExtender = (function(asyncNs) {
		/** 

		Quand un element de DOM est loadé et doit devenir un objet, certains de ses comportements sont définis dans un tag scriptprésent dans le node loadé. AsyncExtender a la responsabilité de trouver ces scripts (qui doivent avoir la classe async) et d'extender un objet avec les définitiuons comprises dans ce script.

		*/
		var scriptSelector = 'script.async';

		var AsyncExtender = function(jqEl) {
			
			//scripts loadés par ajax ne sont pas exécutés car ils sont déplacés dans le head, qu'on ne place pas dans la page. On doit les trouver à part. Si pas de jq setté, on cherche les scripts dans le html général (on peut être au load original de la page)
			//
			if(jqEl) {
				this.script = jqEl.filter(scriptSelector);
				//append le script async loadé au body pour l'exécuter. Il settera ns.bufferedDefinition, qui extend le AsyncContentTransition créé
				WU.body().append(this.script);
			} else {
				this.script = $(scriptSelector);
			}
			
			this.getFilteredResponse = function(){
				return jqEl && jqEl.not(this.script);
			}
			
			
			this.extend = function(content) {
				
				this.script.each(function(i, scr){
					var id = $(scr).attr('id');
					//est-ce que ce script est unedéfinition async? Si oui, le script a un ID et sette un objet [id] dans le namespace, qui est une fonction qui retourne la définition de l'objet
					if(id && asyncNs[id]){
						var extendDefinition = asyncNs[id]();
						$.extend(content, extendDefinition);
						delete asyncNs[id];
					}
				});
				return content;
				
			}
			
		};
		return AsyncExtender;
	})(window.grangeAsync = window.grangeAsync || {});
	
					
	/* =============================================================================
	MAIN OBJECT
	========================================================================== */
	return {
		/**
		retourne la partie "page" de l'url
		*/
		getPagePart : function(url) {
			var a = document.createElement('a');
			a.href = url;
			var part = a.pathname;
			if(a.search) {
				part += a.search;
			}
			//console.log(url, part);
			return part;
		},
		
		getExtender : function(content) {
			
			return new AsyncExtender(content);				
		}
		
	};
}));


},{"jquery":"jquery","lagrange/utils/WindowUtils.js":15}],12:[function(require,module,exports){
/** 
	
	@author Martin Vézina, 2012-06

	Base class for content that is intended to be loaded by an Ajax call. Will load its images and resolve a $.Deffered when ready.

*/
(function (root, factory) {
	var nsParts = 'lagrange/content/AsyncContent'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof exports === 'object') {
	    // CommonJS
	    ns[name] = module.exports = factory(require('jquery'), require('lagrange/animation/AbstractTransition.js'), require('imagesloaded'));
  	} else {
		ns[name] = factory(root.$, root.lagrange.animation.AbstractTransition, imagesloaded);
	}
}(this, function ($, AbstractTransition, imagesLoaded) {


	var AsyncContent = function(){
		/** 
		Initializes the content. At this point, by requirement, the node has already been set. The node is set before the content is added to the dom, and this init is called only when injected in the dom.
		*/

		var node;
		var asyncContentPromise;
		var title;
		var id;

		this.initAsyncContent = function(idParam, titleParam){
			id = idParam;
			title = titleParam;
		};

		this.setContentNode = function(data) {
			node = $(data);
		};

		this.getContentNode = function() {
			return node;
		};

		this.getId = function() {
				return id;
		};
		this.getTitle = function() {
			return title;
		};
		
		this.onAddedToDOM = function() {
			
			if(asyncContentPromise) {
				return asyncContentPromise;
			}
			
			var imagesDeferred = node.imagesLoaded();
			
			//Some images can be included in the content because they are used as css backgrounds and we still want to wait for them to be loaded before resolving. We need to remove these images when they are loaded, as their purpose is only to know when they are ready.
			imagesDeferred.always(function(){
				node.find('img.bgLoader').remove();
			});
			
			var wholeDeferred = $.Deferred();
			var afterDeferred = this.afterAdded();
			
			var resolveWhole = function() {
				wholeDeferred.resolve();
			};
			
			//we want to resolve even if some images are broken
			imagesDeferred.fail(function(){
				afterDeferred.then(resolveWhole);
			});
			
			$.when(imagesDeferred, afterDeferred).then(resolveWhole);
			
			asyncContentPromise = wholeDeferred.promise();
			return asyncContentPromise;
		};
		
		//this function can be overridden by the concrete class, if some actions are to be performed and for which we might have to wait before the content is ready
		this.afterAdded = this.afterAdded || function() {
			return $.Deferred().resolve();
		};

		return this;
	};

	AsyncContent.factory = function(instance) {
		instance = instance || {};
		instance = AbstractTransition.factory(instance);
		return AsyncContent.call(instance);
	};

	return AsyncContent;

}));

},{"imagesloaded":"imagesloaded","jquery":"jquery","lagrange/animation/AbstractTransition.js":9}],13:[function(require,module,exports){
/** 
	@author Martin Vézina, 2012-06
	Loads content through AJAX and create it as an AsyncContentTransition. The definition of a transition must be included in a script with class "async", that sets

	

	This script will be injected in the dom and called immediately so as to extend the object with the defined transition.

*/
(function (root, factory) {
	var nsParts = 'lagrange/content/ContentFactory'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);

	if (typeof exports === 'object') {
	    // CommonJS
	    ns[name] = module.exports = factory(require('jquery'), require('lagrange/content/Async.js'));
  	} else {
		ns[name] = factory(root.$, root.lagrange.content.Async);
	}
}(this, function ($, Async) {


	var createLoadedContent = function(rawResponse, createParams, createContentCallback) {
			
		var title = rawResponse.filter('title').html();
		var asyncExtender = Async.getExtender(rawResponse);
		var noscriptResponse = asyncExtender.getFilteredResponse();
				
		createParams.title = title;
		var content = createContentCallback(noscriptResponse, createParams, noscriptResponse);
		content = asyncExtender.extend(content);
		
		return content;
	};

	var getFromAjax = function(path, createParams, selector, createContentCallback) {

		var ajax = $.ajax({
			url : path,
			dataType :'html'
		});
		var success = function(data, textStatus, jqXHR) {
			return createLoadedContent($(data), createParams, selector, createContentCallback);
		};

		var fail = function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, jqXHR.responseText);
		};

		var filtered = ajax.pipe(success, fail);
		
		return filtered.promise();
	};

	var getParams = function(path, title) {
		return {
			id : Async.getPagePart(path),
			path : path,
			title : title
		};
	};

	return {

		getNodeFromSelector : function(input, selector){
			var node = selector ? $(selector, input) : $('<div>').append(input);
			//si le node n'est pas trouvé avec le selector, il est possible que le node soit au premier niveau du jquery donné
			if(node.length == 0 && selector){
				node = input.filter(selector);
			}
			return node;
		},
		
		//si la page est celle affichée au load (donc pas par ajax) il faut quand meme la créer parce qu'elle doit exister pour la navigation. i.e. elle doit avoir le meme comportement qu'une page qui serait loadée par ajax
		createOriginalContent : function(path, title) {
			var createParams = getParams(path, title);
			var content = this.createContent(null, createParams);
			
			var asyncExtender = Async.getExtender();
			content = asyncExtender.extend(content);
			
			var deferred = $.Deferred();
			deferred.resolve(content);
			return content;
		},

		getPageId : function(path){
			var createParams = getParams(path);
			return createParams.id;
		},
	
		/** 
		ABSTRACT Crée l'objet de page. La fonction doit être overridée par les sous-classes pour crer d'autres types de contenus.
		*/
		createContent : function() {
			throw new Error('createContent is abstract');	
		},
		
		/**
		ABSTRACT
		*/
		load : function() {
			throw new Error('load is abstract');	
		},
		
		getLoadingDeferred : function(path){
			
			createParams = getParams(path);
			
			return getFromAjax(path, createParams, this.createContent.bind(this));

		}
	};

}));
},{"jquery":"jquery","lagrange/content/Async.js":11}],14:[function(require,module,exports){
(function (root, factory) {
	var nsParts = 'lagrange/utils/MobileDetect'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof exports === 'object') {
	    // CommonJS
	    ns[name] = module.exports = factory();
  	} else {
		ns[name] = factory();
	}
}(this, function () {

	var MobileDetect = {
		Android: function() {
			return navigator.userAgent.match(/Android/i) ? true : false;
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i) ? true : false;
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i) ? true : false;
		},
		any: function() {
			//return true;
			return (MobileDetect.Android() || MobileDetect.BlackBerry() || MobileDetect.iOS() || MobileDetect.Windows());
		}
	};
	
	return MobileDetect;
	
}));
},{}],15:[function(require,module,exports){
/**

	Revoir : faire scroll avec greensock
	

*/

(function (root, factory) {
	var nsParts = 'lagrange/utils/WindowUtils'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof exports === 'object') {
	    // CommonJS
	    ns[name] = module.exports = factory(require('jquery'));
  	} else {
		ns[name] = factory(root.jQuery);
	}
}(this, function ($) {

	var page, htmlWindow, htmlDocument, body;
	var getPage = function(){
		page = page || $("html, body");
		return page;
	};
	var getBody = function(){
		body = body || $("body");
		return body;
	};
	var getWindow = function(){
		htmlWindow = htmlWindow || $(window);
		return htmlWindow;
	};
	var getDocument = function(){
		htmlDocument = htmlDocument || $(document);
		return htmlDocument;
	};


	return {
		body : function(){
			return getBody();
		},
		scrollTopPage : function() {
			getPage().animate({ scrollTop: 0 }, 600, "easeOutExpo");
		},

		scrollBottomPage : function() {
			var windowHeight = getWindow().height();
			var documentHeight = getDocument().height();
			getPage().animate({ scrollTop: documentHeight - windowHeight }, 600, "easeOutExpo");
			return false;
		},

		hasHitBottom : function() {
			if(getDocument().height() == window.pageYOffset + window.innerHeight){
				return true;
			}
		},

		//retourne la pos du scroll
		getScroll : function() {
			return getDocument().scrollTop();
		},

		//retourne la pos du scroll
		getWinWidth : function() {
			return getWindow().width();
		},
		//retourne la pos du scroll
		getWinHeight : function() {
			return getWindow().height();
		},

		//indique si un element est visible dans la page dépendant du scroll.
		isElementVisible : function(el) {
			var elTop = el.position().top;
			var elBot = elTop + el.height();
			var minVisible = this.getScroll();
			var maxVisible = minVisible + getWindow().height();
			//console.log(elTop, '<', maxVisible, elBot, '>', minVisible);
			if(elTop < maxVisible && elBot > minVisible) {
				return true;
			}
			return false;
		}
	};

}));
},{"jquery":"jquery"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYWdyYW5nZS9naXQvbGFiL2dyYW5nZS1mcmFtZXdvcmsvbm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9sYWdyYW5nZS9naXQvbGFiL2dyYW5nZS1mcmFtZXdvcmsvZXhhbXBsZS9hcHAvZXhhbXBsZS9FeGFtcGxlQXBwLmpzIiwiL1VzZXJzL2xhZ3JhbmdlL2dpdC9sYWIvZ3JhbmdlLWZyYW1ld29yay9ub2RlX21vZHVsZXMvZXhhbXBsZS9FeGFtcGxlVHJhbnNpdGlvbi5qcyIsIi9Vc2Vycy9sYWdyYW5nZS9naXQvbGFiL2dyYW5nZS1mcmFtZXdvcmsvbm9kZV9tb2R1bGVzL2V4YW1wbGUvTmF2aWcuanMiLCIvVXNlcnMvbGFncmFuZ2UvZ2l0L2xhYi9ncmFuZ2UtZnJhbWV3b3JrL25vZGVfbW9kdWxlcy9leGFtcGxlL2NvbnRlbnQvUGFnZS5qcyIsIi9Vc2Vycy9sYWdyYW5nZS9naXQvbGFiL2dyYW5nZS1mcmFtZXdvcmsvbm9kZV9tb2R1bGVzL2V4YW1wbGUvY29udGVudC9QYWdlRmFjdG9yeS5qcyIsIi9Vc2Vycy9sYWdyYW5nZS9naXQvbGFiL2dyYW5nZS1mcmFtZXdvcmsvbm9kZV9tb2R1bGVzL2V4YW1wbGUvY29udGVudC9QcmVsb2FkZXIuanMiLCIvVXNlcnMvbGFncmFuZ2UvZ2l0L2xhYi9ncmFuZ2UtZnJhbWV3b3JrL25vZGVfbW9kdWxlcy9leGFtcGxlL21lbnVzL01lbnUuanMiLCIvVXNlcnMvbGFncmFuZ2UvZ2l0L2xhYi9ncmFuZ2UtZnJhbWV3b3JrL25vZGVfbW9kdWxlcy9leGFtcGxlL21lbnVzL01lbnVzLmpzIiwiL1VzZXJzL2xhZ3JhbmdlL2dpdC9sYWIvZ3JhbmdlLWZyYW1ld29yay9ub2RlX21vZHVsZXMvbGFncmFuZ2UvYW5pbWF0aW9uL0Fic3RyYWN0VHJhbnNpdGlvbi5qcyIsIi9Vc2Vycy9sYWdyYW5nZS9naXQvbGFiL2dyYW5nZS1mcmFtZXdvcmsvbm9kZV9tb2R1bGVzL2xhZ3JhbmdlL2NvbnRlbnQvQWJzdHJhY3RNZW51cy5qcyIsIi9Vc2Vycy9sYWdyYW5nZS9naXQvbGFiL2dyYW5nZS1mcmFtZXdvcmsvbm9kZV9tb2R1bGVzL2xhZ3JhbmdlL2NvbnRlbnQvQXN5bmMuanMiLCIvVXNlcnMvbGFncmFuZ2UvZ2l0L2xhYi9ncmFuZ2UtZnJhbWV3b3JrL25vZGVfbW9kdWxlcy9sYWdyYW5nZS9jb250ZW50L0FzeW5jQ29udGVudC5qcyIsIi9Vc2Vycy9sYWdyYW5nZS9naXQvbGFiL2dyYW5nZS1mcmFtZXdvcmsvbm9kZV9tb2R1bGVzL2xhZ3JhbmdlL2NvbnRlbnQvQ29udGVudEZhY3RvcnkuanMiLCIvVXNlcnMvbGFncmFuZ2UvZ2l0L2xhYi9ncmFuZ2UtZnJhbWV3b3JrL25vZGVfbW9kdWxlcy9sYWdyYW5nZS91dGlscy9Nb2JpbGVEZXRlY3QuanMiLCIvVXNlcnMvbGFncmFuZ2UvZ2l0L2xhYi9ncmFuZ2UtZnJhbWV3b3JrL25vZGVfbW9kdWxlcy9sYWdyYW5nZS91dGlscy9XaW5kb3dVdGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcblx0dmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTsgXG5cdHZhciBXVSA9IHJlcXVpcmUoJ2xhZ3JhbmdlL3V0aWxzL1dpbmRvd1V0aWxzLmpzJyk7XG5cdHZhciBOYXZpZyA9IHJlcXVpcmUoJ2V4YW1wbGUvTmF2aWcuanMnKTtcblx0dmFyIEV4YW1wbGVUcmFuc2l0aW9uID0gcmVxdWlyZSgnZXhhbXBsZS9FeGFtcGxlVHJhbnNpdGlvbi5qcycpO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gKHtcdFx0XHRcblx0XHRpbml0aWFsaXplIDogZnVuY3Rpb24oKXtcblx0XHRcdCQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdE5hdmlnLmluaXQoKTtcblx0XHRcdFx0RXhhbXBsZVRyYW5zaXRpb24uaW5pdCgpO1xuXHRcdFx0XHR0aGlzLmFjdGl2YXRlKFdVLmJvZHkoKSk7XG5cdFx0XHR9LmJpbmQodGhpcykpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblxuXHRcdGFjdGl2YXRlIDogZnVuY3Rpb24oY29udGV4dCkge1xuXHRcdFx0TmF2aWcuYWN0aXZhdGVDb250ZXh0KGNvbnRleHQpO1xuXHRcdH0sXG5cblx0XHRkZWFjdGl2YXRlIDogZnVuY3Rpb24oY29udGV4dCkge1xuXHRcdFx0TmF2aWcuZGVhY3RpdmF0ZUNvbnRleHQoY29udGV4dCk7XG5cdFx0fVxuXHR9KS5pbml0aWFsaXplKCk7IiwiLyohXG4gKiBNb3JlIGluZm8gYXQgaHR0cDovL2xhYi5sYS1ncmFuZ2UuY2FcbiAqIEBhdXRob3IgTWFydGluIFbDqXppbmEgPG0udmV6aW5hQGxhLWdyYW5nZS5jYT5cbiAqIEBjb3B5cmlnaHQgMjAxNCBNYXJ0aW4gVsOpemluYSA8bS52ZXppbmFAbGEtZ3JhbmdlLmNhPlxuICogXG4qL1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpOyBcblx0dmFyIEFic3RyYWN0VHJhbnNpdGlvbiA9IHJlcXVpcmUoJ2xhZ3JhbmdlL2FuaW1hdGlvbi9BYnN0cmFjdFRyYW5zaXRpb24uanMnKTtcblxuXHR2YXIgQSA9IGZ1bmN0aW9uKG5hbWUpe1xuXHR9O1xuXG5cdEEucHJvdG90eXBlID0ge1xuXHRcdGNvbnN0cnVjdG9yOiBBLFxuXHRcdHNldEFuaW1hdGlvbiA6IGZ1bmN0aW9uKHRsLCBjb250ZXh0LCBzZXRJbkVuZFRpbWUpIHtcblx0XHRcdHZhciBBID0gJCgnLnNwcml0ZUEnLCBjb250ZXh0KTtcblx0XHRcdHZhciBCID0gJCgnLnNwcml0ZUInLCBjb250ZXh0KTtcblx0XHRcdHRsLmFwcGVuZCggVHdlZW5MaXRlLmZyb20oQSwgMC40LCB7b3BhY2l0eTowLCBsZWZ0OlwiLT0xMDBweFwiLCBlYXNlOkV4cG8uZWFzZU91dH0pICk7XG5cdFx0XHR0bC5hcHBlbmQoIFR3ZWVuTGl0ZS5mcm9tKEIsIDAuNCwge29wYWNpdHk6MCwgbGVmdDpcIis9MTAwcHhcIiwgZWFzZTpFeHBvLmVhc2VPdXR9KSApO1xuXHRcdFx0dmFyIGFuaW1hdGVJbkZpbmlzaCA9IHNldEluRW5kVGltZSgpO1xuXHRcdFx0dGwuYXBwZW5kKCBUd2VlbkxpdGUudG8oQSwgMC40LCB7b3BhY2l0eTowLCBsZWZ0OlwiLT0xMDBweFwiLCBlYXNlOkV4cG8uZWFzZUlufSkgKTtcblx0XHRcdHRsLmFwcGVuZCggVHdlZW5MaXRlLnRvKEIsIDAuNCwge29wYWNpdHk6MCwgbGVmdDpcIis9MTAwcHhcIiwgZWFzZTpFeHBvLmVhc2VJbn0pICk7XG5cdFx0XHRyZXR1cm4gdGw7XG5cdFx0fSxcblx0XHR3YWtldXAgOiBmdW5jdGlvbih3aGF0KSB7XG5cdFx0XHRjb25zb2xlLmxvZyh3aGF0LCB0aGlzKTtcblx0XHR9LFxuXHRcdGRlYWN0aXZhdGUgOiBmdW5jdGlvbih3aGF0KSB7XG5cdFx0XHRjb25zb2xlLmxvZyh3aGF0LCB0aGlzKTtcblx0XHR9XG5cdH07XG5cdEEuZmFjdG9yeSA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIG5ldyBBKCk7XG5cdH07XG5cblx0QWJzdHJhY3RUcmFuc2l0aW9uLmZhY3RvcnkoQS5wcm90b3R5cGUpO1xuXG5cblxuXHR2YXIgQiA9IG5ldyBBYnN0cmFjdFRyYW5zaXRpb24oKTtcblx0Qi5mYWN0b3J5ID0gZnVuY3Rpb24obyl7XG5cdFx0cmV0dXJuICQuZXh0ZW5kKChvIHx8IHt9KSwgQik7XG5cdH07XG5cblx0Qi5zZXRBbmltYXRpb24gPSBmdW5jdGlvbih0bCwgY29udGV4dCwgc2V0SW5FbmRUaW1lKSB7XG5cdFx0dmFyIEEgPSAkKCcuc3ByaXRlQScsIGNvbnRleHQpO1xuXHRcdHZhciBCID0gJCgnLnNwcml0ZUInLCBjb250ZXh0KTtcblx0XHR0bC5hcHBlbmQoIFR3ZWVuTGl0ZS5mcm9tKEEsIDAuNCwge29wYWNpdHk6MCwgbGVmdDpcIi09MTAwcHhcIiwgZWFzZTpFeHBvLmVhc2VPdXR9KSApO1xuXHRcdHRsLmFwcGVuZCggVHdlZW5MaXRlLmZyb20oQiwgMC40LCB7b3BhY2l0eTowLCBsZWZ0OlwiKz0xMDBweFwiLCBlYXNlOkV4cG8uZWFzZU91dH0pICk7XG5cdFx0dmFyIGFuaW1hdGVJbkZpbmlzaCA9IHNldEluRW5kVGltZSgpO1xuXHRcdHRsLmFwcGVuZCggVHdlZW5MaXRlLnRvKEEsIDAuNCwge29wYWNpdHk6MCwgbGVmdDpcIi09MTAwcHhcIiwgZWFzZTpFeHBvLmVhc2VJbn0pICk7XG5cdFx0dGwuYXBwZW5kKCBUd2VlbkxpdGUudG8oQiwgMC40LCB7b3BhY2l0eTowLCBsZWZ0OlwiKz0xMDBweFwiLCBlYXNlOkV4cG8uZWFzZUlufSkgKTtcblx0XHRyZXR1cm4gdGw7XG5cdH07XG5cdEIud2FrZXVwID0gZnVuY3Rpb24od2hhdCkge1xuXHRcdGNvbnNvbGUubG9nKHdoYXQsIHRoaXMpO1xuXHR9O1xuXHRCLmRlYWN0aXZhdGUgPSBmdW5jdGlvbih3aGF0KSB7XG5cdFx0Y29uc29sZS5sb2cod2hhdCwgdGhpcyk7XG5cdH07XG5cblxuXHRtb2R1bGUuZXhwb3J0cyA9IHtcblx0XHRpbml0IDogZnVuY3Rpb24oKXtcblxuXHRcdFx0dmFyIHRlc3RzID0ge1xuXHRcdFx0XHRBIDogbmV3IEEoKSxcblx0XHRcdFx0QiA6IEIuZmFjdG9yeSgpXG5cdFx0XHR9O1xuXG5cdFx0XHR0ZXN0cy5BLnNldHVwVHJhbnNpdGlvbignI3Jvb3RBJyk7XG5cdFx0XHR0ZXN0cy5CLnNldHVwVHJhbnNpdGlvbignI3Jvb3RCJyk7XG5cblx0XHRcdC8vY29uc29sZS5kaXIoQWJzdHJhY3RUcmFuc2l0aW9uKTtcblx0XHRcdGNvbnNvbGUubG9nKCdBJyx0ZXN0cy5BKTtcblx0XHRcdGNvbnNvbGUubG9nKCdCJyx0ZXN0cy5CKTtcblx0XHRcdGNvbnNvbGUubG9nKCdBIGlzIEFic3RyYWN0VHJhbnNpdGlvbiAlcycsIHRlc3RzLkEgaW5zdGFuY2VvZiBBYnN0cmFjdFRyYW5zaXRpb24pO1xuXHRcdFx0Y29uc29sZS5sb2coJ0EgaXMgQSAlcycsIHRlc3RzLkEgaW5zdGFuY2VvZiBBKTtcblx0XHRcdGNvbnNvbGUubG9nKCdCIGlzIEFic3RyYWN0VHJhbnNpdGlvbiAlcycsIHRlc3RzLkIgaW5zdGFuY2VvZiBBYnN0cmFjdFRyYW5zaXRpb24pO1xuXHRcdFx0Y29uc29sZS5sb2coJ0IgaXMgQSAlcycsIHRlc3RzLkIgaW5zdGFuY2VvZiBBKTtcblxuXHRcdFx0dmFyIGJ0bnMgPSAkKCcuY2hlY2snKTtcblx0XHRcdFxuXHRcdFx0YnRucy5lYWNoKGZ1bmN0aW9uKGksIGVsKXtcblx0XHRcdFx0dmFyIGJ0biA9ICQoZWwpO1xuXHRcdFx0XHR2YXIgc3RhdHVzID0gZmFsc2U7XG5cdFx0XHRcdHZhciBpZCA9IGJ0bi5kYXRhKCdpZCcpO1xuXHRcdFx0XHRidG4ub24oJ2NsaWNrLnRlc3QnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciBmY24gPSBzdGF0dXMgPyAnT3V0JyA6ICdJbic7XG5cdFx0XHRcdFx0dGVzdHNbaWRdWydhbmltYXRlJytmY25dKGZjbik7XG5cdFx0XHRcdFx0c3RhdHVzID0gIXN0YXR1cztcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblxuIiwiXG5cblx0dmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblx0dmFyIFdVID0gcmVxdWlyZSgnbGFncmFuZ2UvdXRpbHMvV2luZG93VXRpbHMuanMnKTtcblx0dmFyIE1vYmlsZURldGVjdCA9IHJlcXVpcmUoJ2xhZ3JhbmdlL3V0aWxzL01vYmlsZURldGVjdC5qcycpO1xuXHR2YXIgTWVudXMgPSByZXF1aXJlKCdleGFtcGxlL21lbnVzL01lbnVzLmpzJyk7XG5cdHZhciBQYWdlRmFjdG9yeSA9IHJlcXVpcmUoJ2V4YW1wbGUvY29udGVudC9QYWdlRmFjdG9yeS5qcycpO1xuXHR2YXIgUHJlbG9hZGVyID0gcmVxdWlyZSgnZXhhbXBsZS9jb250ZW50L1ByZWxvYWRlci5qcycpO1xuXHR2YXIgVHdlZW5NYXggPSByZXF1aXJlKCdnc2FwJyk7XG5cdHZhciBIaXN0b3J5ID0gd2luZG93Lkhpc3Rvcnk7XG5cblxuXHR2YXIgY29udGFpbmVySWQgPSAnbmF2aWdXcmFwcGVyJztcblx0dmFyIGNvbnRhaW5lcjtcblx0dmFyIGNhbm9uaWNhbDtcblx0dmFyIGN1cnJlbnRQYWdlO1xuXHR2YXIgY3VycmVudEhhc2g7XG5cdHZhciBsb2FkaW5nID0gZmFsc2U7XG5cblx0dmFyIGlzQXZhaWxhYmxlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGlzTW9iaWxlID0gTW9iaWxlRGV0ZWN0LmFueSgpO1xuXHRcdHJldHVybiAoIWlzTW9iaWxlKTsvLyAmJiBIaXN0b3J5LmVuYWJsZWQpO1xuXHR9O1xuXG5cdHZhciBzZXRNZW51QWN0aXZlID0gZnVuY3Rpb24oY3VycmVudFBhZ2UsIGlzT25Jbml0KSB7XG5cdFx0TWVudXMuYWN0aXZhdGUoYmluZENsaWNrcyk7XG5cdH07XG5cblx0dmFyIGxvYWRQYWdlID0gZnVuY3Rpb24odXJsKXtcblx0XHRpZihsb2FkaW5nKSByZXR1cm47XG5cblx0XHR2YXIgbmV4dElkID0gUGFnZUZhY3RvcnkuZ2V0UGFnZUlkKHVybCk7XG5cdFx0Ly9jb25zb2xlLmxvZyhjdXJyZW50UGFnZS5nZXRJZCgpKyc9PicrbmV4dElkKTtcblx0XHRcblx0XHQvL29uIGVzdCBkZWphIHN1ciBsYSBwYWdlIHF1J29uIHJlcXVlc3QuIGRvIG5vdGhpbmdcblx0XHRpZihuZXh0SWQgPT09IGN1cnJlbnRQYWdlLmdldElkKCkpIHJldHVybjtcblxuXHRcdGxvYWRpbmcgPSBQYWdlRmFjdG9yeS5sb2FkKHVybCk7XG5cblx0XHQkLndoZW4obG9hZGluZykudGhlbihmdW5jdGlvbihuZXh0UGFnZSl7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdnbyBpbicpO1xuXHRcdFx0dHJhbnNpdFRvKG5leHRQYWdlLCBmYWxzZSk7XG5cdFx0fSk7XG5cblx0fTtcblxuXHR2YXIgdHJhbnNpdFRvID0gZnVuY3Rpb24obmV4dFBhZ2UsIGlzU3ViTmF2aWcpe1xuXG5cdFx0Ly9zd2FwIGxlcyBwYWdlcyA6IGwnYW5jaWVubmUgcydlbiB2YSwgbGEgcHJvY2hhaW5lIGRldmllbnQgbCdhY3R1ZWxsZVxuXHRcdHZhciBvbGROb2RlID0gY3VycmVudFBhZ2UuZ2V0Q29udGVudE5vZGUoKTtcblx0XHR2YXIgY3VycmVudE5vZGUgPSBuZXh0UGFnZS5nZXRDb250ZW50Tm9kZSgpO1xuXG5cdFx0Ly9maW5kcyBtZW51cyBpbiBsb2FkZWQgcGFnZVxuXHRcdC8vdmFyIGxvYWRlZE1lbnVzID0gbmV4dFBhZ2UuZmluZChcblxuXHRcdFxuXHRcdG5zLmFwcC5kZWFjdGl2YXRlKG9sZE5vZGUpO1xuXHRcdHZhciBvbGRQYWdlID0gY3VycmVudFBhZ2U7XG5cdFx0Y3VycmVudFBhZ2UgPSBuZXh0UGFnZTtcblxuXHRcdHZhciBvbk5ld0FkZGVkID0gY3VycmVudFBhZ2Uub25BZGRlZFRvRE9NKCk7XG5cdFx0Y29udGFpbmVyLmFwcGVuZChjdXJyZW50Tm9kZS5oaWRlKCkpO1xuXHRcdFxuXG5cdFx0dmFyIG9uT2xkT3V0ID0gb2xkUGFnZS5hbmltYXRlT3V0KCk7XG5cdFx0b25PbGRPdXQudGhlbihmdW5jdGlvbigpe1xuXHRcdFx0UHJlbG9hZGVyLnNob3coKTtcblx0XHR9KTtcblx0XHQkLndoZW4ob25OZXdBZGRlZCwgb25PbGRPdXQpLnRoZW4oZnVuY3Rpb24oKXtcblx0XHRcdFByZWxvYWRlci5oaWRlKCk7XG5cdFx0XHRvbGROb2RlLmRldGFjaCgpOy8vZW5sZXZlIGxhIHBhZ2UgcGFzc8OpZVxuXG5cdFx0XHRzZXRNZW51QWN0aXZlKGN1cnJlbnRQYWdlKTtcblxuXHRcdFx0SGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgY3VycmVudFBhZ2UuZ2V0VGl0bGUoKSwgJy8nK2N1cnJlbnRQYWdlLmdldElkKCkpO1xuXHRcdFx0Y3VycmVudE5vZGUuc2hvdygpO1xuXHRcdFx0Y3VycmVudFBhZ2UuYW5pbWF0ZUluKCk7XG5cdFx0XHRucy5hcHAuYWN0aXZhdGUoY3VycmVudE5vZGUpOy8vaW5pdCBsZXMgbGlzdGVuZXJzIGRlIGxhIG5vdXZlbGxlIHBhZ2VcblxuXHRcdFx0bG9hZGluZyA9IGZhbHNlO1xuXHRcdH0pO1xuXHR9XG5cblx0dmFyIG9uQWRkcmVzc0NoYW5nZSA9IGZ1bmN0aW9uKGhhc2gpIHtcblx0XHQvL3N0cmlwIC4vIG91IC8gZHUgZGVidXQgZHUgaGFzaFxuXHRcdHZhciBwYXJzZWRIYXNoID0gaGFzaC5yZXBsYWNlKC9eW1xcLlxcL10rLywgJycpO1xuXHRcdFxuXHRcdC8vbGUgLyBlc3QgbGEgcGFnZSBvcmlnaW5hbGVtZW50IGxvYWTDqWUsIGRvbnQgbGUgaWQgZXN0IGxlIGNhbm9uaWNhbFxuXHRcdGlmKHBhcnNlZEhhc2ggPT09ICcnKSByZXR1cm4gb25BZGRyZXNzQ2hhbmdlKGNhbm9uaWNhbCk7XG5cdFx0XG5cdFx0Ly9ham91dGUgbGUgc2xhc2ggZXQgZW5sZXZlIGxlIF9zdWlkXG5cdFx0cGFyc2VkSGFzaCA9ICcvJyArIHBhcnNlZEhhc2gucmVwbGFjZSgvXFw/PyZfc3VpZD1bMC05XSsvLCAnJyk7XG5cdFx0XG5cdFx0Ly9jb25zb2xlLmxvZyhoYXNoKycgPT4gJytwYXJzZWRIYXNoKycgKGN1cnJlbnQgaXMgJytjdXJyZW50UGFnZS5nZXRJZCgpKycpJyk7XG5cdFx0XG5cdFx0aWYoY3VycmVudFBhZ2UgJiYgY3VycmVudFBhZ2UuZ2V0SWQoKSA9PT0gcGFyc2VkSGFzaCkgcmV0dXJuO1xuXHRcdFxuXHRcdC8vbG9hZCBsYSBwYWdlLiBTaSBsYSBwYWdlIGxvYWRlZSBlc3QgbGEgbWVtZSBxdSdhY3R1ZWxsZW1lbnQsIMOnYSBmZXJhIHJpZW4sIG1lbWUgc2kgbGUgbm9tIGRlIGxhIHBhZ2UgZXQgbGUgaGFocyBzb250IHBhcyBwYXJlaWwgKGRhbnMgaWUpXG5cdFx0cmV0dXJuIGxvYWRQYWdlKHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIHBhcnNlZEhhc2gpO1xuXHR9O1xuXG5cdHZhciBiaW5kQ2xpY2tzID0gKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG9uTmF2aWcgPSBmdW5jdGlvbihlKXtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHZhciBfc2VsZiA9ICQodGhpcyk7XG5cdFx0XHRsb2FkUGFnZShfc2VsZi5hdHRyKCdocmVmJykpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24oZWxlbWVudHMpe1xuXHRcdFx0aWYgKCFpc0F2YWlsYWJsZSgpKSByZXR1cm47XG5cdFx0XHRlbGVtZW50cy5vZmYoXCIubmF2aWdcIikub24oJ2NsaWNrLm5hdmlnJywgb25OYXZpZyk7XG5cdFx0fTtcblx0fSgpKTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IHtcblx0XHRpbml0OiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIHBhdGggPSAkKCdsaW5rW3JlbD1cImNhbm9uaWNhbFwiXScpLmF0dHIoJ2hyZWYnKTtcblxuXHRcdFx0dmFyIHRpdGxlID0gJCgndGl0bGUnKS5odG1sKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHBhdGgsIHRpdGxlKVxuXHRcdFx0Y3VycmVudFBhZ2UgPSBQYWdlRmFjdG9yeS5jcmVhdGVPcmlnaW5hbFBhZ2UocGF0aCwgdGl0bGUpO1xuXHRcdFx0Y2Fub25pY2FsID0gY3VycmVudFBhZ2UubmFtZTtcblxuXHRcdFx0aWYoaXNBdmFpbGFibGUoKSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKEhpc3RvcnkuZ2V0U3RhdGUoKS5oYXNoKTtcblx0XHRcdFx0SGlzdG9yeS5BZGFwdGVyLmJpbmQod2luZG93LCAnc3RhdGVjaGFuZ2UnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdG9uQWRkcmVzc0NoYW5nZShIaXN0b3J5LmdldFN0YXRlKCkuaGFzaCk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRjb250YWluZXIgPSAkKCcjJytjb250YWluZXJJZCk7XG5cdFx0XHRcdGlmKGNvbnRhaW5lci5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRjdXJyZW50UGFnZS5nZXRDb250ZW50Tm9kZSgpLndyYXAoJzxkaXYgaWQ9XCInK2NvbnRhaW5lcklkKydcIj48L2Rpdj4nKTtcblx0XHRcdFx0XHRjb250YWluZXIgPSAkKCcjJytjb250YWluZXJJZCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0dmFyIGRlZiA9IGN1cnJlbnRQYWdlLm9uQWRkZWRUb0RPTSgpO1xuXHRcdFx0XG5cdFx0XHRkZWYuYWx3YXlzKGZ1bmN0aW9uKCl7XHRcblx0XHRcdFx0Y3VycmVudFBhZ2UuanVtcFRvSW5TdGF0ZSgpO1xuXHRcdFx0XHRzZXRNZW51QWN0aXZlKGN1cnJlbnRQYWdlLCB0cnVlKTtcblx0XHRcdFx0aWYgKCFpc0F2YWlsYWJsZSgpKSByZXR1cm47XG5cdFx0XHR9KTtcblxuXHRcdFx0TWVudXMuYWN0aXZhdGUoYmluZENsaWNrcyk7XG5cdFx0fSxcblxuXHRcdGFjdGl2YXRlQ29udGV4dCA6IGZ1bmN0aW9uKGNvbnRleHQpIHtcblx0XHRcdFxuXHRcdFx0aWYgKCFpc0F2YWlsYWJsZSgpKSByZXR1cm47XG5cdFx0XHRcblx0XHRcdGJpbmRDbGlja3MoY29udGV4dC5maW5kKCdhLmlubmVyJykpLyoqL1xuXG5cdFx0fSxcblxuXHRcdGRlYWN0aXZhdGVDb250ZXh0IDogZnVuY3Rpb24oY29udGV4dCkge1xuXHRcdFx0Ly9kZXNhY3RpdmUgbGEgbmF2aWcsIG1haXMgZGVzYWN0aXZlIGF1c2lzIGxlcyBsaWVucyBwb3VyIG5lIHBhcyBjbGlxdWVyIHBlbmRhbnQgbGVzIHRyYW5zaXRpb25zXG5cdFx0XHRjb250ZXh0LmZpbmQoJ2EuaW5uZXInKS5vZmYoJy5uYXZpZycpLm9uKCdjbGljay5uYXZpZycsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0XG4iLCJcclxuXHR2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpOyBcclxuXHR2YXIgQXN5bmNDb250ZW50ID0gcmVxdWlyZSgnbGFncmFuZ2UvY29udGVudC9Bc3luY0NvbnRlbnQuanMnKTtcclxuXHJcblx0dmFyIFBhZ2UgPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdHRoaXMuaW5pdFBhZ2UgPSBmdW5jdGlvbihpZCwgdGl0bGUpe1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5pbml0QXN5bmNDb250ZW50KGlkLCB0aXRsZSk7XHJcblx0XHRcdHRoaXMuc2V0dXBUcmFuc2l0aW9uKHRoaXMuZ2V0Q29udGVudE5vZGUoKSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcdFxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgb25BZGRlZFRvRG9tQ2FsbGJhY2sgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRjb25zb2xlLmxvZygnUGFnZSAgJyt0aGlzLmdldFRpdGxlKCkrJyBpcyByZWFkeScpO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0dmFyIHJlYWR5UHJvbWlzZSA7XHJcblx0XHR2YXIgYXN5bmNDb250ZW50QWRkZWRUb0RvbSA9IHRoaXMub25BZGRlZFRvRE9NLmJpbmQodGhpcyk7XHJcblx0XHRcclxuXHRcdHRoaXMub25BZGRlZFRvRE9NID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZihyZWFkeVByb21pc2UpIHtcclxuXHRcdFx0XHRyZXR1cm4gcmVhZHlQcm9taXNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vY29uc29sZS5sb2coJ2NyZWF0ZSBwYWdlJyk7XHJcblx0XHRcdHJlYWR5UHJvbWlzZSA9IGFzeW5jQ29udGVudEFkZGVkVG9Eb20oKTtcclxuXHRcdFx0cmVhZHlQcm9taXNlLnRoZW4ob25BZGRlZFRvRG9tQ2FsbGJhY2suYmluZCh0aGlzKSk7XHJcblx0XHRcdHJldHVybiByZWFkeVByb21pc2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc2V0QW5pbWF0aW9uID0gZnVuY3Rpb24odGwsIHJvb3ROb2RlLCBzZXRJbkVuZFRpbWUpIHtcclxuXHRcdFx0dmFyIGltZyA9IHJvb3ROb2RlLmZpbmQoJ2ltZycpO1xyXG5cdFx0XHR2YXIgdGl0bGUgPSByb290Tm9kZS5maW5kKCdoMScpO1xyXG5cdFx0XHR0bC5hcHBlbmQoIFR3ZWVuTGl0ZS5mcm9tKGltZywgMC41LCB7b3BhY2l0eTowLCBlYXNlOkV4cG8uZWFzZUlufSkgKTtcclxuXHRcdFx0dGwuaW5zZXJ0KCBUd2VlbkxpdGUuZnJvbSh0aXRsZSwgMC42LCB7bGVmdDo0MDAsIG9wYWNpdHk6MCwgZWFzZTpFeHBvLmVhc2VJbn0pLCAwLjMpO1xyXG5cdFx0XHR2YXIgYW5pbWF0ZUluRmluaXNoID0gc2V0SW5FbmRUaW1lKCk7XHJcblx0XHRcdHRsLmluc2VydCggVHdlZW5MaXRlLnRvKGltZywgMC44LCB7b3BhY2l0eTowLCBlYXNlOkV4cG8uZWFzZU91dH0pLCBhbmltYXRlSW5GaW5pc2gpO1xyXG5cdFx0XHR0bC5pbnNlcnQoIFR3ZWVuTGl0ZS50byh0aXRsZSwgMC42LCB7bGVmdDo0MDAsIG9wYWNpdHk6MCwgZWFzZTpFeHBvLmVhc2VPdXR9KSwgYW5pbWF0ZUluRmluaXNoKTtcclxuXHRcdFx0cmV0dXJuIHRsO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0dGhpcy53YWtldXAgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRjb25zb2xlLmxvZygnUGFnZSAgJyt0aGlzLmdldFRpdGxlKCkrJyBpcyBnb2luZyBpbicpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnNsZWVwID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Y29uc29sZS5sb2coJ1BhZ2UgICcrdGhpcy5nZXRUaXRsZSgpKycgaXMgc2xlZXBpbmcnKTtcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fTtcclxuXHJcblx0UGFnZS5mYWN0b3J5ID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHRyZXR1cm4gUGFnZS5jYWxsKEFzeW5jQ29udGVudC5mYWN0b3J5KCkpO1xyXG5cclxuXHR9O1xyXG5cdFxyXG5cdG1vZHVsZS5leHBvcnRzID0gUGFnZTtcclxuXHJcbiIsIi8qKiBcclxuXHRAYXV0aG9yIE1hcnRpbiBWw6l6aW5hLCAyMDEyLTA3XHJcblx0XHJcblx0XHJcblxyXG4qL1xyXG5cclxuXHR2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5cdHZhciBBc3luYyA9IHJlcXVpcmUoJ2xhZ3JhbmdlL2NvbnRlbnQvQXN5bmMuanMnKTtcclxuXHR2YXIgQ29udGVudEZhY3RvcnkgPSByZXF1aXJlKCdsYWdyYW5nZS9jb250ZW50L0NvbnRlbnRGYWN0b3J5LmpzJyk7XHJcblx0dmFyIE1lbnVzID0gcmVxdWlyZSgnZXhhbXBsZS9tZW51cy9NZW51cy5qcycpO1xyXG5cdHZhciBQYWdlID0gcmVxdWlyZSgnZXhhbXBsZS9jb250ZW50L1BhZ2UuanMnKTtcclxuXHJcblx0dmFyIHNlbGVjdG9yID0gJ2FydGljbGUnO1xyXG5cclxuXHR2YXIgUGFnZUZhY3RvcnkgPSBPYmplY3QuY3JlYXRlKENvbnRlbnRGYWN0b3J5KTtcclxuXHRcclxuXHQkLmV4dGVuZChQYWdlRmFjdG9yeSwge1xyXG5cdFx0XHJcblx0XHRjcmVhdGVDb250ZW50IDogZnVuY3Rpb24oY29udGV4dCwgY3JlYXRlUGFyYW1zKSB7XHJcblxyXG5cdFx0XHRNZW51cy5zZXRDdXJyZW50KGNvbnRleHQpO1xyXG5cclxuXHRcdFx0dmFyIG5vZGUgPSB0aGlzLmdldE5vZGVGcm9tU2VsZWN0b3IoY29udGV4dCwgc2VsZWN0b3IpO1xyXG5cclxuXHRcdFx0dmFyIHBhZ2UgPSBQYWdlLmZhY3RvcnkoKTtcclxuXHRcdFx0cGFnZS5zZXRDb250ZW50Tm9kZShub2RlKTtcclxuXHRcdFx0XHJcblx0XHRcdHBhZ2UuaW5pdFBhZ2UoY3JlYXRlUGFyYW1zLmlkLCBjcmVhdGVQYXJhbXMudGl0bGUpO1xyXG5cclxuXHRcdFx0Y29uc29sZS5sb2coJyoqKiogJytwYWdlLmdldFRpdGxlKCkrJyBjcmVhdGVkJywgcGFnZS5nZXRJZCgpKTtcclxuXHRcdFx0cmV0dXJuIHBhZ2U7XHJcblx0XHR9LFxyXG5cdFx0XHJcblx0XHRsb2FkIDogZnVuY3Rpb24ocGF0aCl7XHJcblx0XHRcdHJldHVybiB0aGlzLmdldExvYWRpbmdEZWZlcnJlZChwYXRoKTtcclxuXHRcdH0sXHJcblx0XHRcclxuXHRcdC8qKiBsYSBwYWdlIG9yaWdpbmFsZSBhIGF1c3NpIHVuIGJ1ZmZlcmVkIGRlZmluaXRpb24gcXVpIG5lIHNlcmEgcGFzIGFleMOpY3V0w6kgc2kgb24gbmUgcGFzc2UgcGFzIHBhciBsZSBmYWN0b3J5ICovXHJcblx0XHRjcmVhdGVPcmlnaW5hbFBhZ2UgOiBmdW5jdGlvbihjYW5vbmljYWwsIHRpdGxlKSB7XHRcdFx0XHRcclxuXHRcdFx0cmV0dXJuIHRoaXMuY3JlYXRlT3JpZ2luYWxDb250ZW50KGNhbm9uaWNhbCwgdGl0bGUpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0fSk7XHJcblxyXG5cclxuXHQvL2NvbnNvbGUuZGlyKFBhZ2VGYWN0b3J5KTtcclxuXHRtb2R1bGUuZXhwb3J0cyA9IFBhZ2VGYWN0b3J5O1xyXG4iLCJcclxuXHR2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5cclxuXHR2YXIgZ2V0UHJlbG9hZGVyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gJCgnPGRpdiBjbGFzcz1cInByZWxvYWRlclwiPjxkaXY+IDwvZGl2PjwvZGl2PicpO1xyXG5cdH07XHJcblx0XHJcblx0dmFyIG1haW5QcmVsb2FkZXI7XHJcblx0dmFyIGdldE1haW5QcmVsb2FkZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdG1haW5QcmVsb2FkZXIgPSBtYWluUHJlbG9hZGVyIHx8IGdldFByZWxvYWRlcigpLmF0dHIoJ2lkJywgJ21haW5QcmVsb2FkZXInKS5wcmVwZW5kVG8oJ2JvZHknKTtcclxuXHRcdHJldHVybiBtYWluUHJlbG9hZGVyOyBcclxuXHR9O1xyXG5cdFxyXG5cdG1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFx0c2hvdyA6IGZ1bmN0aW9uKGNvbnRhaW5lcil7XHJcblx0XHRcdFxyXG5cdFx0XHRjb250YWluZXIgPSBjb250YWluZXIgfHwgJCgnYm9keScpO1xyXG5cdFx0XHR2YXIgcCA9IGdldFByZWxvYWRlcigpO1xyXG5cdFx0XHRwLmFwcGVuZFRvKGNvbnRhaW5lcik7XHJcblx0XHRcdFxyXG5cdFx0XHRwLmNzcyh7XHJcblx0XHRcdFx0dG9wOihjb250YWluZXIub3V0ZXJIZWlnaHQoKS1wLm91dGVySGVpZ2h0KCkpIC8yLFxyXG5cdFx0XHRcdGxlZnQ6KGNvbnRhaW5lci5vdXRlcldpZHRoKCktcC5vdXRlcldpZHRoKCkpIC8yXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRwLnN0b3AoKS5oaWRlKCkuZmFkZUluKDYwMCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRcclxuXHRcdGhpZGU6ZnVuY3Rpb24oY29udGFpbmVyKSB7XHJcblx0XHRcdFxyXG5cdFx0XHRjb250YWluZXIgPSBjb250YWluZXIgfHwgJCgnYm9keScpO1xyXG5cdFx0XHR2YXIgcCA9IGNvbnRhaW5lci5maW5kKCcucHJlbG9hZGVyJyk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZihwLmxlbmd0aCApIHtcclxuXHRcdFx0XHRwLnN0b3AoKS5mYWRlT3V0KDQwMCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHAucmVtb3ZlKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRcclxuXHRcdHNob3dNYWluOmZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgcCA9IGdldE1haW5QcmVsb2FkZXIoKTtcclxuXHRcdFx0XHJcblx0XHRcdHAuY3NzKHtcclxuXHRcdFx0XHR0b3A6LTc1LFxyXG5cdFx0XHRcdGxlZnQ6KHAucGFyZW50KCkub3V0ZXJXaWR0aCgpLXAub3V0ZXJXaWR0aCgpKSAvMlxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cC5zdG9wKCkuc2hvdygpLmFuaW1hdGUoe1xyXG5cdFx0XHRcdHRvcDotMTVcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdGR1cmF0aW9uOjIwMCxcclxuXHRcdFx0XHRvbkNvbXBsZXRlOiBmdW5jdGlvbigpe31cclxuXHRcdFx0fSk7XHJcblx0XHRcdFxyXG5cdFx0fSxcclxuXHRcdFxyXG5cdFx0aGlkZU1haW46ZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHAgPSBnZXRNYWluUHJlbG9hZGVyKCk7XHJcblx0XHRcdHAuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRcdHRvcDotNzVcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdGR1cmF0aW9uOjIwMCxcclxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHAuaGlkZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fTtcclxuIiwiLyoqIFxyXG5cdEBhdXRob3IgTWFydGluIFbDqXppbmEsIDIwMTItMDdcclxuXHRcclxuXHRcclxuXHJcbiovXHJcblxyXG5cclxuXHR2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5cdHZhciBBYnN0cmFjdFRyYW5zaXRpb24gPSByZXF1aXJlKCdsYWdyYW5nZS9hbmltYXRpb24vQWJzdHJhY3RUcmFuc2l0aW9uLmpzJyk7XHJcblx0dmFyIFR3ZWVuTWF4ID0gcmVxdWlyZSgnZ3NhcCcpO1xyXG5cclxuXHR2YXIgTWVudSA9IGZ1bmN0aW9uKG5vZGUpe1xyXG5cdFx0QWJzdHJhY3RUcmFuc2l0aW9uLmZhY3RvcnkodGhpcyk7XHJcblx0XHR0aGlzLnNldHVwVHJhbnNpdGlvbihub2RlKTtcclxuXHJcblx0XHR0aGlzLmxpbmtzID0gbm9kZS5maW5kKCdhJyk7XHJcblxyXG5cdH07XHJcblxyXG5cdE1lbnUucHJvdG90eXBlLmFjdGl2ZUxpbmtDbGFzcyA9ICdhY3RpdmUnO1xyXG5cclxuXHRNZW51LnByb3RvdHlwZS5zZXRBbmltYXRpb24gPSBmdW5jdGlvbih0bCwgcm9vdE5vZGUsIHNldEluRW5kVGltZSkge1xyXG5cdFx0dmFyIGxpbmtzID0gJC5tYWtlQXJyYXkocm9vdE5vZGUuZmluZCgnYScpKTtcclxuXHRcdHRsLnN0YWdnZXJGcm9tKGxpbmtzLCAwLjUsIHtsZWZ0OlwiMzBweFwiLCBvcGFjaXR5OjAsIGVhc2U6RXhwby5lYXNlSW59LCAwLjIsIDAgKTtcclxuXHRcdHZhciBhbmltYXRlSW5GaW5pc2ggPSBzZXRJbkVuZFRpbWUoKTtcclxuXHRcdHRsLnN0YWdnZXJUbyhsaW5rcywgMC41LCB7dG9wOlwiMzBweFwiLCBvcGFjaXR5OjAsIGVhc2U6RXhwby5lYXNlSW59LCAwLjIsIGFuaW1hdGVJbkZpbmlzaCApO1xyXG5cdFx0cmV0dXJuIHRsO1xyXG5cdH07XHJcblxyXG5cdE1lbnUucHJvdG90eXBlLmFjdGl2YXRlTGluayA9IGZ1bmN0aW9uKGlkKSB7XHJcblx0XHR0aGlzLmxpbmtzLnJlbW92ZUNsYXNzKHRoaXMuYWN0aXZlTGlua0NsYXNzKTtcclxuXHRcdHRoaXMubGlua3MuZmlsdGVyKCdbZGF0YS1pZD1cIicraWQrJ1wiXScpLmFkZENsYXNzKHRoaXMuYWN0aXZlTGlua0NsYXNzKTtcclxuXHR9O1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IE1lbnU7XHJcblxyXG5cdCIsIi8qKiBcclxuXHRAYXV0aG9yIE1hcnRpbiBWw6l6aW5hLCAyMDEyLTA3XHJcblx0XHJcblx0XHJcblxyXG4qL1xyXG5cclxuXHR2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5cdHZhciBBYnN0cmFjdE1lbnVzID0gcmVxdWlyZSgnbGFncmFuZ2UvY29udGVudC9BYnN0cmFjdE1lbnVzLmpzJyk7XHJcblx0dmFyIE1lbnUgPSByZXF1aXJlKCdleGFtcGxlL21lbnVzL01lbnUuanMnKTtcclxuXHJcblx0dmFyIE1lbnVzID0gT2JqZWN0LmNyZWF0ZShBYnN0cmFjdE1lbnVzKTtcclxuXHQkLmV4dGVuZChNZW51cywge1xyXG5cdFx0c2VsZWN0b3JzIDogJC5leHRlbmQoe30sIEFic3RyYWN0TWVudXMuc2VsZWN0b3JzLCB7XHJcblx0XHRcdG1lbnVzIDonbmF2JyxcclxuXHRcdFx0YWN0aXZlIDogJy4nK01lbnUucHJvdG90eXBlLmFjdGl2ZUxpbmtDbGFzc1xyXG5cdFx0fSksXHJcblxyXG5cdFx0aW5zdGFuY2lhdGVNZW51IDogZnVuY3Rpb24oZWwpIHtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyhlbCk7XHJcblx0XHRcdHJldHVybiBuZXcgTWVudShlbCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHR9KTtcclxuXHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gTWVudXM7XHJcblxyXG4iLCIvKiFcbiAqIE1vcmUgaW5mbyBhdCBodHRwOi8vbGFiLmxhLWdyYW5nZS5jYVxuICogQGF1dGhvciBNYXJ0aW4gVsOpemluYSA8bS52ZXppbmFAbGEtZ3JhbmdlLmNhPlxuICogQGNvcHlyaWdodCAyMDE0IE1hcnRpbiBWw6l6aW5hIDxtLnZlemluYUBsYS1ncmFuZ2UuY2E+XG4gKiBcbiovXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblx0dmFyIG5zUGFydHMgPSAnbGFncmFuZ2UvYW5pbWF0aW9uL0Fic3RyYWN0VHJhbnNpdGlvbicuc3BsaXQoJy8nKTtcblx0dmFyIG5hbWUgPSBuc1BhcnRzLnBvcCgpO1xuXHR2YXIgbnMgPSBuc1BhcnRzLnJlZHVjZShmdW5jdGlvbihwcmV2LCBwYXJ0KXtcblx0XHRyZXR1cm4gcHJldltwYXJ0XSA9IChwcmV2W3BhcnRdIHx8IHt9KTtcblx0fSwgcm9vdCk7XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0ICAgIC8vIENvbW1vbkpTXG5cdCAgICBuc1tuYW1lXSA9IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSwgcmVxdWlyZSgnZ3NhcCcpKTtcbiAgXHR9IGVsc2Uge1xuXHRcdG5zW25hbWVdID0gZmFjdG9yeShyb290LiQsIHJvb3QuVHdlZW5NYXgpO1xuXHR9XG59KHRoaXMsIGZ1bmN0aW9uICgkLCBUd2Vlbk1heCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgVHdlZW5MaXRlID0gKHdpbmRvdy5HcmVlblNvY2tHbG9iYWxzIHx8IHdpbmRvdykuVHdlZW5MaXRlO1xuXHR2YXIgVGltZWxpbmVNYXggPSAod2luZG93LkdyZWVuU29ja0dsb2JhbHMgfHwgd2luZG93KS5UaW1lbGluZU1heDtcblxuXHR2YXIgSU4gPSAxO1xuXHR2YXIgT1VUID0gLTE7XG5cdHZhciBTVE9QUEVEID0gMDtcblxuXHR2YXIgbm9vcCA9IGZ1bmN0aW9uKCl7fTtcblx0XG5cdHZhciBBYnN0cmFjdFRyYW5zaXRpb24gPSBmdW5jdGlvbigpe1xuXHRcdFxuXHRcdHZhciByb290O1xuXHRcdHZhciB0bDtcblx0XHQvLyBUaW1lIGF0IHdoaWNoIHRoZSBpbiBmaW5pc2hlcyBhbmQgb3V0IHN0YXJ0c1xuXHRcdHZhciBhbmltYXRlSW5GaW5pc2hUaW1lO1xuXHRcdHZhciBhbmltYXRlT3V0U3RhcnRUaW1lO1xuXHRcdC8vIGN1cnJlbnQgYW5pbVN0YXRlICgxLy0xKVxuXHRcdHZhciBhbmltU3RhdGU7XG5cdFx0dmFyIGFuaW1EZWZlcnJlZDtcblxuXHRcdHRoaXMuc2V0dXBUcmFuc2l0aW9uID0gZnVuY3Rpb24obm9kZSkge1xuXHRcdFx0cm9vdCA9ICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycpID8gJChub2RlKSA6IG5vZGU7XG5cdFx0XHRzZXRUaW1lbGluZS5jYWxsKHRoaXMpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHRoaXMuZ2V0QW5pbWF0aW9uUm9vdCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gcm9vdDtcblx0XHR9O1xuXHRcdFxuXHRcdC8qKlxuXHRcdENyZWF0ZXMgVGltZWxpbmVNYXggZm9yIHRoZSBhbmltYXRpb25cblx0XHQqL1xuXHRcdHZhciBzZXRUaW1lbGluZSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZighVGltZWxpbmVNYXgpIHRocm93IG5ldyBFcnJvcignVGltZWxpbmVNYXggbm90IGxvYWRlZCcpO1xuXHRcdFx0XG5cdFx0XHR0bCA9IG5ldyBUaW1lbGluZU1heCh7XG5cdFx0XHRcdG9uQ29tcGxldGUgOiBhZnRlckFuaW1hdGVPdXQsXG5cdFx0XHRcdG9uQ29tcGxldGVTY29wZSA6IHRoaXNcblx0XHRcdH0pO1xuXG5cdFx0XHR0bC5zdG9wKCk7XG5cblx0XHRcdHRoaXMuc2V0QW5pbWF0aW9uKHRsLCByb290LCBzZXRBbmltSW5GaW5pc2hUaW1lKTtcblxuXHRcdFx0dGwuYWRkQ2FsbGJhY2soYWZ0ZXJBbmltYXRlSW4sIGFuaW1hdGVJbkZpbmlzaFRpbWUsIG51bGwsIHRoaXMpO1xuXG5cdFx0fTtcblxuXHRcdHZhciBhZnRlckFuaW1hdGVPdXQgPSBmdW5jdGlvbigpe1xuXHRcdFx0aWYoYW5pbVN0YXRlID09PSBPVVQpe1xuXHRcdFx0XHRhbmltRGVmZXJyZWQgJiYgYW5pbURlZmVycmVkLnJlc29sdmUoKTtcblx0XHRcdFx0YW5pbVN0YXRlID0gU1RPUFBFRDtcblx0XHRcdFx0KHRoaXMuc2xlZXAgfHwgbm9vcCkuY2FsbCh0aGlzKTtcblx0XHRcdFx0YW5pbURlZmVycmVkID0gbnVsbDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dmFyIGFmdGVyQW5pbWF0ZUluID0gZnVuY3Rpb24oKXtcblx0XHRcdGlmKGFuaW1TdGF0ZSA9PT0gSU4pe1xuXHRcdFx0XHR0bC5zdG9wKCk7XG5cdFx0XHRcdGFuaW1EZWZlcnJlZCAmJiBhbmltRGVmZXJyZWQucmVzb2x2ZSgpO1xuXHRcdFx0XHRhbmltU3RhdGUgPSBTVE9QUEVEO1xuXHRcdFx0XHQodGhpcy5hY3RpdmF0ZSB8fCBub29wKS5jYWxsKHRoaXMpO1xuXHRcdFx0XHRhbmltRGVmZXJyZWQgPSBudWxsO1xuXHRcdFx0fTtcblx0XHR9O1xuXG5cdFx0dmFyIHNldEFuaW1JbkZpbmlzaFRpbWUgPSBmdW5jdGlvbigpe1xuXHRcdFx0YW5pbWF0ZUluRmluaXNoVGltZSA9IHRsLnRvdGFsRHVyYXRpb24oKTtcblx0XHRcdHRsLmFwcGVuZCggVHdlZW5MaXRlLnRvKHt9LCAxLCB7fSkgKTtcblx0XHRcdGFuaW1hdGVPdXRTdGFydFRpbWUgPSBhbmltYXRlSW5GaW5pc2hUaW1lICsgMTtcblx0XHRcdHJldHVybiBhbmltYXRlT3V0U3RhcnRUaW1lO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHRKdW1wcyBkaXJlY3RseSB0byB0aGUgSU4gc3RhdGUgb2YgdGhlIGFuaW1hdGlvbiBpZiBpdCBleGlzdHMuXG5cdFx0Ki9cblx0XHR0aGlzLmp1bXBUb0luU3RhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuY2FuY2VsVHJhbnNpdGlvbigpO1xuXHRcdFx0aWYoYW5pbWF0ZUluRmluaXNoVGltZSAmJiB0bCkge1xuXHRcdFx0XHR0bC5nb3RvQW5kU3RvcChhbmltYXRlSW5GaW5pc2hUaW1lKTtcblx0XHRcdH1cblx0XHRcdGFuaW1TdGF0ZSA9IFNUT1BQRUQ7XG5cdFx0XHQodGhpcy5hY3RpdmF0ZSB8fCBub29wKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdH07XG5cblx0XHQvKiogXG5cdFx0RGVmYXVsdHMgdG8gZmFkZWluL2ZhZGVvdXRcblx0XHQqL1xuXHRcdHRoaXMuc2V0QW5pbWF0aW9uID0gdGhpcy5zZXRBbmltYXRpb24gfHwgZnVuY3Rpb24odGwsIHJvb3ROb2RlLCBzZXRJbkVuZFRpbWUpIHtcblx0XHRcdHRsLmFwcGVuZCggVHdlZW5MaXRlLmZyb20ocm9vdE5vZGUsIDEsIHtvcGFjaXR5OjAsIGVhc2U6RXhwby5lYXNlSW59KSApO1xuXHRcdFx0dmFyIGFuaW1hdGVJbkZpbmlzaCA9IHNldEluRW5kVGltZSgpO1xuXHRcdFx0dGwuaW5zZXJ0KCBUd2VlbkxpdGUudG8ocm9vdE5vZGUsIDEsIHtvcGFjaXR5OjAsIGVhc2U6RXhwby5lYXNlT3V0fSksIGFuaW1hdGVJbkZpbmlzaCk7XG5cdFx0XHRyZXR1cm4gdGw7XG5cdFx0fTtcblxuXHRcdHRoaXMuY2FuY2VsVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYoYW5pbURlZmVycmVkKSB7XG5cdFx0XHRcdGFuaW1EZWZlcnJlZC5yZWplY3QoKTtcblx0XHRcdFx0YW5pbURlZmVycmVkID0gbnVsbDtcblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXHRcdHRoaXMuYW5pbWF0ZUluID0gZnVuY3Rpb24oKXtcblx0XHRcdGlmKGFuaW1EZWZlcnJlZCAmJiBhbmltU3RhdGUgPT09IElOKSByZXR1cm4gYW5pbURlZmVycmVkO1xuXHRcdFx0dGhpcy5jYW5jZWxUcmFuc2l0aW9uKCk7XG5cdFx0XHQodGhpcy53YWtldXAgfHwgbm9vcCkuYXBwbHkodGhpcywgYXJndW1lbnRzKTsvL3Bhc3NlcyBhcmd1bWVudHMgdG8gdGhlIGJlZm9yZUFuaW1hdGVJbiwgaWYgYW55XG5cdFx0XHRhbmltU3RhdGUgPSBJTjtcblx0XHRcdHRsLnJlc3RhcnQoKTtcblx0XHRcdGFuaW1EZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcblx0XHRcdHJldHVybiBhbmltRGVmZXJyZWQucHJvbWlzZSgpO1xuXHRcdH07XG5cblx0XHR0aGlzLmFuaW1hdGVPdXQgPSBmdW5jdGlvbigpe1xuXHRcdFx0aWYoYW5pbURlZmVycmVkICYmIGFuaW1TdGF0ZSA9PT0gT1VUKSByZXR1cm4gYW5pbURlZmVycmVkO1xuXHRcdFx0dGhpcy5jYW5jZWxUcmFuc2l0aW9uKCk7XG5cdFx0XHQodGhpcy5kZWFjdGl2YXRlIHx8IG5vb3ApLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7Ly9wYXNzZXMgYXJndW1lbnRzIHRvIHRoZSBiZWZvcmVBbmltYXRlT3V0LCBpZiBhbnlcblx0XHRcdGFuaW1TdGF0ZSA9IE9VVDtcblx0XHRcdHRsLnBsYXkoYW5pbWF0ZU91dFN0YXJ0VGltZSk7XG5cdFx0XHRhbmltRGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XG5cdFx0XHRyZXR1cm4gYW5pbURlZmVycmVkLnByb21pc2UoKTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHRBYnN0cmFjdFRyYW5zaXRpb24uZmFjdG9yeSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG5cdFx0aW5zdGFuY2UgPSBpbnN0YW5jZSB8fCB7fTtcblx0XHRyZXR1cm4gQWJzdHJhY3RUcmFuc2l0aW9uLmNhbGwoaW5zdGFuY2UpO1xuXHR9O1xuXG5cdHJldHVybiBBYnN0cmFjdFRyYW5zaXRpb247XG5cbn0pKTtcblxuXG4iLCIvKiogXG5cblx0QGF1dGhvciBNYXJ0aW4gVsOpemluYSwgMjAxMi0wNlxuXG4qL1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cdHZhciBuc1BhcnRzID0gJ2xhZ3JhbmdlL2NvbnRlbnQvQWJzdHJhY3RNZW51cycuc3BsaXQoJy8nKTtcblx0dmFyIG5hbWUgPSBuc1BhcnRzLnBvcCgpO1xuXHR2YXIgbnMgPSBuc1BhcnRzLnJlZHVjZShmdW5jdGlvbihwcmV2LCBwYXJ0KXtcblx0XHRyZXR1cm4gcHJldltwYXJ0XSA9IChwcmV2W3BhcnRdIHx8IHt9KTtcblx0fSwgcm9vdCk7XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0ICAgIC8vIENvbW1vbkpTXG5cdCAgICBuc1tuYW1lXSA9IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSk7XG4gIFx0fSBlbHNlIHtcblx0XHRuc1tuYW1lXSA9IGZhY3Rvcnkocm9vdC4kKTtcblx0fVxufSh0aGlzLCBmdW5jdGlvbiAoJCkge1xuXG5cdHZhciBBQ1RJVkFURSA9ICdhY3RpdmF0ZSc7XG5cdHZhciBSRU1PVkUgPSAncmVtb3ZlJztcblxuXHR2YXIgcXVldWUgPSBbXTtcblxuXHR2YXIgYWN0aXZlTWVudXMgPSAoZnVuY3Rpb24oKXtcblx0XHR2YXIgbWVudXMgPSBbXTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzZXRNZW51IDogZnVuY3Rpb24obWVudSwgYmluZENsaWNrcykge1xuXHRcdFx0XHRtZW51c1ttZW51LmxldmVsXSA9IG1lbnU7XG5cdFx0XHRcdGJpbmRDbGlja3MobWVudS5lbGVtZW50LmZpbmQoJ2EnKSk7XG5cdFx0XHR9LFxuXG5cdFx0XHRnZXRNZW51IDogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdFx0XHRsZXZlbCA9IGxldmVsIHx8IDA7XG5cdFx0XHRcdHJldHVybiBtZW51c1tsZXZlbF07XG5cdFx0XHR9LFxuXG5cdFx0XHRkZWxldGVNZW51IDogZnVuY3Rpb24obGV2ZWwpIHtcblx0XHRcdFx0ZGVsZXRlIG1lbnVzW2xldmVsXTtcblx0XHRcdH0sXG5cblx0XHRcdGdldERlZmluZWRMZXZlbHMgOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4gbWVudXMucmVkdWNlKGZ1bmN0aW9uKHZhbHMsIG1lbnUsIGlkeCl7XG5cdFx0XHRcdFx0dmFscy5wdXNoKG1lbnUubGV2ZWwpO1xuXHRcdFx0XHRcdHJldHVybiB2YWxzO1xuXHRcdFx0XHR9LCBbXSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9O1xuXG5cdH0oKSk7XG5cblx0dmFyIGdldE5vZGVGcm9tU2VsZWN0b3IgPSBmdW5jdGlvbihpbnB1dCwgc2VsZWN0b3Ipe1xuXHRcdHZhciBub2RlID0gc2VsZWN0b3IgPyAkKHNlbGVjdG9yLCBpbnB1dCkgOiAkKCc8ZGl2PicpLmFwcGVuZChpbnB1dCk7XG5cdFx0Ly9zaSBsZSBub2RlIG4nZXN0IHBhcyB0cm91dsOpIGF2ZWMgbGUgc2VsZWN0b3IsIGlsIGVzdCBwb3NzaWJsZSBxdWUgbGUgbm9kZSBzb2l0IGF1IHByZW1pZXIgbml2ZWF1IGR1IGpxdWVyeSBkb25uw6lcblx0XHRpZihub2RlLmxlbmd0aCA9PSAwICYmIHNlbGVjdG9yKXtcblx0XHRcdG5vZGUgPSBpbnB1dC5maWx0ZXIoc2VsZWN0b3IpO1xuXHRcdH1cblx0XHRyZXR1cm4gbm9kZTtcblx0fTtcblxuXHR2YXIgc2V0SW5pdGlhbFN0YXRlID0gZnVuY3Rpb24oYmluZENsaWNrcyl7XG5cdFx0aWYoIWFjdGl2ZU1lbnVzLmdldE1lbnUoKSkge1xuXHRcdFx0cXVldWUuZm9yRWFjaChmdW5jdGlvbihtZW51LCBpKSB7XG5cdFx0XHRcdGFjdGl2ZU1lbnVzLnNldE1lbnUobWVudSwgYmluZENsaWNrcyk7XG5cdFx0XHRcdG1lbnUuaW5zdGFuY2UuanVtcFRvSW5TdGF0ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHRxdWV1ZS5sZW5ndGggPSAwO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdC8vZGVmYXVsdFxuXHRcdHNlbGVjdG9ycyA6IHtcblx0XHRcdG1lbnVzIDonbmF2JywvL3RoZSBhY3R1YWwgbWVudXNcblx0XHRcdGFjdGl2ZSA6ICcuYWN0aXZlJywvL2FjdGl2ZSBsaW5rcyBpbiB0aGUgbG9hZGVkIG1lbnVzLCB0byBkZXRlcm1pbmUgdGhlIHBhZ2UncyBwbGFjZSBpbiB0aGUgdHJlZVxuXHRcdFx0Y29udGFpbmVycyA6ICcjbWVudV8nIC8vY29udGFpbmVyJ3Mgc2VsZWN0b3IgZm9yIGVhY2ggbGV2ZWwuIExldmVsIHdpbGwgYmUgYXBwZW5kZWQgKDAsIDEsIDIuLi4pXG5cdFx0fSxcblxuXHRcdHNldEN1cnJlbnQgOiBmdW5jdGlvbihjb250ZXh0KSB7XG5cblx0XHRcdHF1ZXVlLmxlbmd0aCA9IDA7XG5cdFx0XHR2YXIgbWVudXMgPSBnZXROb2RlRnJvbVNlbGVjdG9yKGNvbnRleHQsIHRoaXMuc2VsZWN0b3JzLm1lbnVzKTtcblx0XHRcdHZhciBhY3RpdmVTZWxlY3RvciA9IHRoaXMuc2VsZWN0b3JzLmFjdGl2ZTtcblx0XHRcdG1lbnVzLmVhY2goZnVuY3Rpb24oaSwgZWwpe1xuXHRcdFx0XHR2YXIgX3NlbGYgPSAkKGVsKTtcblx0XHRcdFx0dmFyIGxldmVsID0gX3NlbGYuZGF0YSgnbGV2ZWwnKTtcblx0XHRcdFx0dmFyIHBhcmVudElkID0gX3NlbGYuZGF0YSgncGFyZW50Jyk7XG5cdFx0XHRcdHZhciB0aGlzTGV2ZWxBY3RpdmUgPSBhY3RpdmVNZW51cy5nZXRNZW51KGxldmVsKTtcblx0XHRcdFx0Ly9tZW51IGZvciB0aGlzIGxldmVsIGhhcyBjaGFuZ2VkXG5cdFx0XHRcdGlmKCF0aGlzTGV2ZWxBY3RpdmUgfHwgdGhpc0xldmVsQWN0aXZlLnBhcmVudCAhPT0gcGFyZW50SWQpIHtcblx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcblx0XHRcdFx0XHRcdGVsZW1lbnQgOiBfc2VsZixcblx0XHRcdFx0XHRcdC8vZXh0ZW5kZWQgb2JqZWN0IChpbiBjbGllbnQgZm9sZGVyKSBvbmx5IHNob3VsZCBiZSBhd2FyZSBvZiB0aGUgbWVudSBjb25jcmV0ZSB0eXBlcywgYXMgbG9uZyBhcyB0aGV5IGFyZSBBYnN0cmFjdFRyYW5zaXRpb25zLiBUaGlzIGZ1bmN0aW9uIGlzIHRoZXJlZm9yZSB0aGUgZmFjdG9yeSB0byBjcmVhdGUgZWFjaCBtZW51LlxuXHRcdFx0XHRcdFx0aW5zdGFuY2UgOiB0aGlzLmluc3RhbmNpYXRlTWVudShfc2VsZiksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBwYXJlbnRJZCxcblx0XHRcdFx0XHRcdGxldmVsIDogbGV2ZWxcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0Ly9tZW51IGZvciB0aGlzIGxldmVsIGhhcyBub3QgY2hhbmdlZC4gT25seSBuZWVkIHRvIGFjdGl2YXRlIGFub3RoZXIgbGluayBpbiBpdC5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKF9zZWxmKTtcblx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcblx0XHRcdFx0XHRcdGxldmVsIDogbGV2ZWwsXG5cdFx0XHRcdFx0XHRhY3Rpb24gOiBBQ1RJVkFURSxcblx0XHRcdFx0XHRcdGFjdGl2ZUlkIDogX3NlbGYuZmluZChhY3RpdmVTZWxlY3RvcikuZGF0YSgnaWQnKVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9LmJpbmQodGhpcykpO1xuXG5cdFx0XHQvL25vdyBtYWtlIHN1cmUgdGhhdCBlYWNoIGFjdGl2ZSBtZW51IGxldmVsIGlzIHRvIGJlIGFjdGl2YXRlZC9yZXBsYWNlZCBieSBhbiBpdGVtIGluIHRoZSBjdWUuIE90aGVyd2lzZSwgd2Ugd2lsbCBkZXRhY2ggdGhlIGFjdGl2ZSBtZW51Llx0XG5cdFx0XHRhY3RpdmVNZW51cy5nZXREZWZpbmVkTGV2ZWxzKCkuZm9yRWFjaChmdW5jdGlvbihsZXZlbCl7XG5cdFx0XHRcdHZhciBpc0RlZmluZWRJblF1ZXVlID0gcXVldWUucmVkdWNlKGZ1bmN0aW9uKGlzRm91bmQsIG1lbnUpe1xuXHRcdFx0XHRcdHJldHVybiBpc0ZvdW5kIHx8IG1lbnUubGV2ZWwgPT09IGxldmVsO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cdFx0XHRcdGlmKCFpc0RlZmluZWRJblF1ZXVlKXtcblx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcblx0XHRcdFx0XHRcdGxldmVsOiBsZXZlbCxcblx0XHRcdFx0XHRcdGFjdGlvbiA6IFJFTU9WRVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcblx0XHRcdC8vbWFrZSBzdXJlIHF1ZXVlIGlzIGluIHRoZSByaWdodCBvcmRlclxuXHRcdFx0cXVldWUuc29ydChmdW5jdGlvbihhLCBiKXtcblx0XHRcdFx0cmV0dXJuIGEubGV2ZWwgLSBiLmxldmVsO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdFRoaXMgbWV0aG9kLCBjYWxsZWQgYnkgdGhlIGFwcCwgYWN0aXZhdGVzIGVhY2ggbWVudSB3aGVuIGNoYW5naW5nIGZyb20gb25lIHBhZ2UgdG8gdGhlIG90aGVyLiBJdCBpcyB0aGUgbW9zdCB0cmlja3kgcGFydCwgYXMgaXQgaGFzIHRoZSByZXNwb25zYWJpbGl0eSB0byByZW1vdmUgaXJyZWxldmVudCBtZW51cyBhbmQgYXR0YWNoIHRoZSBuZXcgb25lcyBpbiB0aGUgZG9tLCBkZXBlbmRpbmcgb24gdGhlIHN0cnVjdHVyZSBvZiB0aGUgbG9hZGVkIHBhZ2UuXG5cdFx0Ki9cblx0XHRhY3RpdmF0ZSA6IGZ1bmN0aW9uKGJpbmRDbGlja3Mpe1xuXG5cdFx0XHRzZXRJbml0aWFsU3RhdGUoYmluZENsaWNrcyk7XG5cblx0XHRcdGlmKCFxdWV1ZS5sZW5ndGgpIHJldHVybjtcblx0XHRcdC8vY29uc29sZS5sb2cocXVldWUpO1xuXHRcdFx0cXVldWUuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dmFyIGFjdGl2ZU1lbnUgPSBhY3RpdmVNZW51cy5nZXRNZW51KGl0ZW0ubGV2ZWwpO1xuXG5cdFx0XHRcdC8vcmlnaHQgbWVudSBmb3IgdGhpcyBsZXZlbCBpcyBhbHJlYWR5IGluIHRoZSBkb21cblx0XHRcdFx0aWYoaXRlbS5hY3Rpb24gPT09IEFDVElWQVRFKSB7XHRcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpdGVtLmFjdGl2ZUlkICYmIGFjdGl2ZU1lbnUuaW5zdGFuY2UuYWN0aXZhdGVMaW5rKGl0ZW0uYWN0aXZlSWQpO1xuXG5cdFx0XHRcdC8vcGFnZSBkb2VzIG5vdCByZXF1aXJlIHRoaXMgbWVudSBsZXZlbFxuXHRcdFx0XHR9IGVsc2UgaWYoaXRlbS5hY3Rpb24gPT09IFJFTU9WRSkge1xuXHRcdFx0XHRcdHZhciBvbk91dCA9IGFjdGl2ZU1lbnUuaW5zdGFuY2UuYW5pbWF0ZU91dCgpO1xuXHRcdFx0XHRcdG9uT3V0LnRoZW4oZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdGFjdGl2ZU1lbnUuZWxlbWVudC5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdGFjdGl2ZU1lbnVzLmRlbGV0ZU1lbnUoaXRlbS5sZXZlbCk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly90aGlzIGxldmVsJ3MgbWVudSBuZWVkcyB0byBiZSByZXBsYWNlZFxuXHRcdFx0XHR9IGVsc2UgaWYoYWN0aXZlTWVudSkge1xuXHRcdFx0XHRcdHZhciBvbk91dCA9IGFjdGl2ZU1lbnUuaW5zdGFuY2UuYW5pbWF0ZU91dCgpO1xuXHRcdFx0XHRcdG9uT3V0LnRoZW4oZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdGFjdGl2ZU1lbnUuZWxlbWVudC5yZXBsYWNlV2l0aChpdGVtLmVsZW1lbnQpO1xuXHRcdFx0XHRcdFx0YWN0aXZlTWVudXMuc2V0TWVudShpdGVtLCBiaW5kQ2xpY2tzKTtcblx0XHRcdFx0XHRcdGl0ZW0uaW5zdGFuY2UuYW5pbWF0ZUluKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvL3RoaXMgbGV2ZWwncyBtZW51IHNpbXBseSBkb2VzIG5vdCBleGlzdCwgYWRkIGl0XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIGNvbnRhaW5lciA9ICQodGhpcy5zZWxlY3RvcnMuY29udGFpbmVycyArIGl0ZW0ubGV2ZWwpO1xuXHRcdFx0XHRcdGNvbnRhaW5lci5hcHBlbmQoaXRlbS5lbGVtZW50KTtcblx0XHRcdFx0XHRpdGVtLmluc3RhbmNlLmFuaW1hdGVJbigpO1xuXHRcdFx0XHRcdGFjdGl2ZU1lbnVzLnNldE1lbnUoaXRlbSwgYmluZENsaWNrcyk7XG5cdFx0XHRcdH1cblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0XHRxdWV1ZS5sZW5ndGggPSAwO1xuXHRcdH1cblxuXHR9O1xuXG59KSk7IiwiLyoqXHJcblxyXG5cdE5vbiByZXZ1IDIwMTQtMDQtMTQuIERldnJhIMOqdHJlIHRlc3TDqSBsb3JzIGRlIGxhIHByb2NoYWluZSB1dGlsaXNhdGlvblxyXG5cclxuKi9cclxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XHJcblx0dmFyIG5zUGFydHMgPSAnbGFncmFuZ2UvY29udGVudC9Bc3luYycuc3BsaXQoJy8nKTtcclxuXHR2YXIgbmFtZSA9IG5zUGFydHMucG9wKCk7XHJcblx0dmFyIG5zID0gbnNQYXJ0cy5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgcGFydCl7XHJcblx0XHRyZXR1cm4gcHJldltwYXJ0XSA9IChwcmV2W3BhcnRdIHx8IHt9KTtcclxuXHR9LCByb290KTtcclxuXHRcclxuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcblx0ICAgIC8vIENvbW1vbkpTXHJcblx0ICAgIG5zW25hbWVdID0gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ2pxdWVyeScpLCByZXF1aXJlKCdsYWdyYW5nZS91dGlscy9XaW5kb3dVdGlscy5qcycpKTtcclxuICBcdH0gZWxzZSB7XHJcblx0XHRuc1tuYW1lXSA9IGZhY3Rvcnkocm9vdC5qUXVlcnksIHJvb3QubGFncmFuZ2UudXRpbHMuV2luZG93VXRpbHMpO1xyXG5cdH1cclxufSh0aGlzLCBmdW5jdGlvbigkLCBXVSkge1xyXG5cdHZhciBBc3luY0V4dGVuZGVyID0gKGZ1bmN0aW9uKGFzeW5jTnMpIHtcclxuXHRcdC8qKiBcclxuXHJcblx0XHRRdWFuZCB1biBlbGVtZW50IGRlIERPTSBlc3QgbG9hZMOpIGV0IGRvaXQgZGV2ZW5pciB1biBvYmpldCwgY2VydGFpbnMgZGUgc2VzIGNvbXBvcnRlbWVudHMgc29udCBkw6lmaW5pcyBkYW5zIHVuIHRhZyBzY3JpcHRwcsOpc2VudCBkYW5zIGxlIG5vZGUgbG9hZMOpLiBBc3luY0V4dGVuZGVyIGEgbGEgcmVzcG9uc2FiaWxpdMOpIGRlIHRyb3V2ZXIgY2VzIHNjcmlwdHMgKHF1aSBkb2l2ZW50IGF2b2lyIGxhIGNsYXNzZSBhc3luYykgZXQgZCdleHRlbmRlciB1biBvYmpldCBhdmVjIGxlcyBkw6lmaW5pdGl1b25zIGNvbXByaXNlcyBkYW5zIGNlIHNjcmlwdC5cclxuXHJcblx0XHQqL1xyXG5cdFx0dmFyIHNjcmlwdFNlbGVjdG9yID0gJ3NjcmlwdC5hc3luYyc7XHJcblxyXG5cdFx0dmFyIEFzeW5jRXh0ZW5kZXIgPSBmdW5jdGlvbihqcUVsKSB7XHJcblx0XHRcdFxyXG5cdFx0XHQvL3NjcmlwdHMgbG9hZMOpcyBwYXIgYWpheCBuZSBzb250IHBhcyBleMOpY3V0w6lzIGNhciBpbHMgc29udCBkw6lwbGFjw6lzIGRhbnMgbGUgaGVhZCwgcXUnb24gbmUgcGxhY2UgcGFzIGRhbnMgbGEgcGFnZS4gT24gZG9pdCBsZXMgdHJvdXZlciDDoCBwYXJ0LiBTaSBwYXMgZGUganEgc2V0dMOpLCBvbiBjaGVyY2hlIGxlcyBzY3JpcHRzIGRhbnMgbGUgaHRtbCBnw6luw6lyYWwgKG9uIHBldXQgw6p0cmUgYXUgbG9hZCBvcmlnaW5hbCBkZSBsYSBwYWdlKVxyXG5cdFx0XHQvL1xyXG5cdFx0XHRpZihqcUVsKSB7XHJcblx0XHRcdFx0dGhpcy5zY3JpcHQgPSBqcUVsLmZpbHRlcihzY3JpcHRTZWxlY3Rvcik7XHJcblx0XHRcdFx0Ly9hcHBlbmQgbGUgc2NyaXB0IGFzeW5jIGxvYWTDqSBhdSBib2R5IHBvdXIgbCdleMOpY3V0ZXIuIElsIHNldHRlcmEgbnMuYnVmZmVyZWREZWZpbml0aW9uLCBxdWkgZXh0ZW5kIGxlIEFzeW5jQ29udGVudFRyYW5zaXRpb24gY3LDqcOpXHJcblx0XHRcdFx0V1UuYm9keSgpLmFwcGVuZCh0aGlzLnNjcmlwdCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5zY3JpcHQgPSAkKHNjcmlwdFNlbGVjdG9yKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5nZXRGaWx0ZXJlZFJlc3BvbnNlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4ganFFbCAmJiBqcUVsLm5vdCh0aGlzLnNjcmlwdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLmV4dGVuZCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR0aGlzLnNjcmlwdC5lYWNoKGZ1bmN0aW9uKGksIHNjcil7XHJcblx0XHRcdFx0XHR2YXIgaWQgPSAkKHNjcikuYXR0cignaWQnKTtcclxuXHRcdFx0XHRcdC8vZXN0LWNlIHF1ZSBjZSBzY3JpcHQgZXN0IHVuZWTDqWZpbml0aW9uIGFzeW5jPyBTaSBvdWksIGxlIHNjcmlwdCBhIHVuIElEIGV0IHNldHRlIHVuIG9iamV0IFtpZF0gZGFucyBsZSBuYW1lc3BhY2UsIHF1aSBlc3QgdW5lIGZvbmN0aW9uIHF1aSByZXRvdXJuZSBsYSBkw6lmaW5pdGlvbiBkZSBsJ29iamV0XHJcblx0XHRcdFx0XHRpZihpZCAmJiBhc3luY05zW2lkXSl7XHJcblx0XHRcdFx0XHRcdHZhciBleHRlbmREZWZpbml0aW9uID0gYXN5bmNOc1tpZF0oKTtcclxuXHRcdFx0XHRcdFx0JC5leHRlbmQoY29udGVudCwgZXh0ZW5kRGVmaW5pdGlvbik7XHJcblx0XHRcdFx0XHRcdGRlbGV0ZSBhc3luY05zW2lkXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcclxuXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gQXN5bmNFeHRlbmRlcjtcclxuXHR9KSh3aW5kb3cuZ3JhbmdlQXN5bmMgPSB3aW5kb3cuZ3JhbmdlQXN5bmMgfHwge30pO1xyXG5cdFxyXG5cdFx0XHRcdFx0XHJcblx0LyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRNQUlOIE9CSkVDVFxyXG5cdD09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblx0cmV0dXJuIHtcclxuXHRcdC8qKlxyXG5cdFx0cmV0b3VybmUgbGEgcGFydGllIFwicGFnZVwiIGRlIGwndXJsXHJcblx0XHQqL1xyXG5cdFx0Z2V0UGFnZVBhcnQgOiBmdW5jdGlvbih1cmwpIHtcclxuXHRcdFx0dmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcblx0XHRcdGEuaHJlZiA9IHVybDtcclxuXHRcdFx0dmFyIHBhcnQgPSBhLnBhdGhuYW1lO1xyXG5cdFx0XHRpZihhLnNlYXJjaCkge1xyXG5cdFx0XHRcdHBhcnQgKz0gYS5zZWFyY2g7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9jb25zb2xlLmxvZyh1cmwsIHBhcnQpO1xyXG5cdFx0XHRyZXR1cm4gcGFydDtcclxuXHRcdH0sXHJcblx0XHRcclxuXHRcdGdldEV4dGVuZGVyIDogZnVuY3Rpb24oY29udGVudCkge1xyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIG5ldyBBc3luY0V4dGVuZGVyKGNvbnRlbnQpO1x0XHRcdFx0XHJcblx0XHR9XHJcblx0XHRcclxuXHR9O1xyXG59KSk7XHJcblxyXG4iLCIvKiogXHJcblx0XHJcblx0QGF1dGhvciBNYXJ0aW4gVsOpemluYSwgMjAxMi0wNlxyXG5cclxuXHRCYXNlIGNsYXNzIGZvciBjb250ZW50IHRoYXQgaXMgaW50ZW5kZWQgdG8gYmUgbG9hZGVkIGJ5IGFuIEFqYXggY2FsbC4gV2lsbCBsb2FkIGl0cyBpbWFnZXMgYW5kIHJlc29sdmUgYSAkLkRlZmZlcmVkIHdoZW4gcmVhZHkuXHJcblxyXG4qL1xyXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcclxuXHR2YXIgbnNQYXJ0cyA9ICdsYWdyYW5nZS9jb250ZW50L0FzeW5jQ29udGVudCcuc3BsaXQoJy8nKTtcclxuXHR2YXIgbmFtZSA9IG5zUGFydHMucG9wKCk7XHJcblx0dmFyIG5zID0gbnNQYXJ0cy5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgcGFydCl7XHJcblx0XHRyZXR1cm4gcHJldltwYXJ0XSA9IChwcmV2W3BhcnRdIHx8IHt9KTtcclxuXHR9LCByb290KTtcclxuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcblx0ICAgIC8vIENvbW1vbkpTXHJcblx0ICAgIG5zW25hbWVdID0gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ2pxdWVyeScpLCByZXF1aXJlKCdsYWdyYW5nZS9hbmltYXRpb24vQWJzdHJhY3RUcmFuc2l0aW9uLmpzJyksIHJlcXVpcmUoJ2ltYWdlc2xvYWRlZCcpKTtcclxuICBcdH0gZWxzZSB7XHJcblx0XHRuc1tuYW1lXSA9IGZhY3Rvcnkocm9vdC4kLCByb290LmxhZ3JhbmdlLmFuaW1hdGlvbi5BYnN0cmFjdFRyYW5zaXRpb24sIGltYWdlc2xvYWRlZCk7XHJcblx0fVxyXG59KHRoaXMsIGZ1bmN0aW9uICgkLCBBYnN0cmFjdFRyYW5zaXRpb24sIGltYWdlc0xvYWRlZCkge1xyXG5cclxuXHJcblx0dmFyIEFzeW5jQ29udGVudCA9IGZ1bmN0aW9uKCl7XHJcblx0XHQvKiogXHJcblx0XHRJbml0aWFsaXplcyB0aGUgY29udGVudC4gQXQgdGhpcyBwb2ludCwgYnkgcmVxdWlyZW1lbnQsIHRoZSBub2RlIGhhcyBhbHJlYWR5IGJlZW4gc2V0LiBUaGUgbm9kZSBpcyBzZXQgYmVmb3JlIHRoZSBjb250ZW50IGlzIGFkZGVkIHRvIHRoZSBkb20sIGFuZCB0aGlzIGluaXQgaXMgY2FsbGVkIG9ubHkgd2hlbiBpbmplY3RlZCBpbiB0aGUgZG9tLlxyXG5cdFx0Ki9cclxuXHJcblx0XHR2YXIgbm9kZTtcclxuXHRcdHZhciBhc3luY0NvbnRlbnRQcm9taXNlO1xyXG5cdFx0dmFyIHRpdGxlO1xyXG5cdFx0dmFyIGlkO1xyXG5cclxuXHRcdHRoaXMuaW5pdEFzeW5jQ29udGVudCA9IGZ1bmN0aW9uKGlkUGFyYW0sIHRpdGxlUGFyYW0pe1xyXG5cdFx0XHRpZCA9IGlkUGFyYW07XHJcblx0XHRcdHRpdGxlID0gdGl0bGVQYXJhbTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5zZXRDb250ZW50Tm9kZSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0bm9kZSA9ICQoZGF0YSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuZ2V0Q29udGVudE5vZGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIG5vZGU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuZ2V0SWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5nZXRUaXRsZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gdGl0bGU7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR0aGlzLm9uQWRkZWRUb0RPTSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoYXN5bmNDb250ZW50UHJvbWlzZSkge1xyXG5cdFx0XHRcdHJldHVybiBhc3luY0NvbnRlbnRQcm9taXNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgaW1hZ2VzRGVmZXJyZWQgPSBub2RlLmltYWdlc0xvYWRlZCgpO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly9Tb21lIGltYWdlcyBjYW4gYmUgaW5jbHVkZWQgaW4gdGhlIGNvbnRlbnQgYmVjYXVzZSB0aGV5IGFyZSB1c2VkIGFzIGNzcyBiYWNrZ3JvdW5kcyBhbmQgd2Ugc3RpbGwgd2FudCB0byB3YWl0IGZvciB0aGVtIHRvIGJlIGxvYWRlZCBiZWZvcmUgcmVzb2x2aW5nLiBXZSBuZWVkIHRvIHJlbW92ZSB0aGVzZSBpbWFnZXMgd2hlbiB0aGV5IGFyZSBsb2FkZWQsIGFzIHRoZWlyIHB1cnBvc2UgaXMgb25seSB0byBrbm93IHdoZW4gdGhleSBhcmUgcmVhZHkuXHJcblx0XHRcdGltYWdlc0RlZmVycmVkLmFsd2F5cyhmdW5jdGlvbigpe1xyXG5cdFx0XHRcdG5vZGUuZmluZCgnaW1nLmJnTG9hZGVyJykucmVtb3ZlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHdob2xlRGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XHJcblx0XHRcdHZhciBhZnRlckRlZmVycmVkID0gdGhpcy5hZnRlckFkZGVkKCk7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgcmVzb2x2ZVdob2xlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0d2hvbGVEZWZlcnJlZC5yZXNvbHZlKCk7XHJcblx0XHRcdH07XHJcblx0XHRcdFxyXG5cdFx0XHQvL3dlIHdhbnQgdG8gcmVzb2x2ZSBldmVuIGlmIHNvbWUgaW1hZ2VzIGFyZSBicm9rZW5cclxuXHRcdFx0aW1hZ2VzRGVmZXJyZWQuZmFpbChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGFmdGVyRGVmZXJyZWQudGhlbihyZXNvbHZlV2hvbGUpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0XHJcblx0XHRcdCQud2hlbihpbWFnZXNEZWZlcnJlZCwgYWZ0ZXJEZWZlcnJlZCkudGhlbihyZXNvbHZlV2hvbGUpO1xyXG5cdFx0XHRcclxuXHRcdFx0YXN5bmNDb250ZW50UHJvbWlzZSA9IHdob2xlRGVmZXJyZWQucHJvbWlzZSgpO1xyXG5cdFx0XHRyZXR1cm4gYXN5bmNDb250ZW50UHJvbWlzZTtcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdC8vdGhpcyBmdW5jdGlvbiBjYW4gYmUgb3ZlcnJpZGRlbiBieSB0aGUgY29uY3JldGUgY2xhc3MsIGlmIHNvbWUgYWN0aW9ucyBhcmUgdG8gYmUgcGVyZm9ybWVkIGFuZCBmb3Igd2hpY2ggd2UgbWlnaHQgaGF2ZSB0byB3YWl0IGJlZm9yZSB0aGUgY29udGVudCBpcyByZWFkeVxyXG5cdFx0dGhpcy5hZnRlckFkZGVkID0gdGhpcy5hZnRlckFkZGVkIHx8IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gJC5EZWZlcnJlZCgpLnJlc29sdmUoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fTtcclxuXHJcblx0QXN5bmNDb250ZW50LmZhY3RvcnkgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG5cdFx0aW5zdGFuY2UgPSBpbnN0YW5jZSB8fCB7fTtcclxuXHRcdGluc3RhbmNlID0gQWJzdHJhY3RUcmFuc2l0aW9uLmZhY3RvcnkoaW5zdGFuY2UpO1xyXG5cdFx0cmV0dXJuIEFzeW5jQ29udGVudC5jYWxsKGluc3RhbmNlKTtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gQXN5bmNDb250ZW50O1xyXG5cclxufSkpO1xyXG4iLCIvKiogXHJcblx0QGF1dGhvciBNYXJ0aW4gVsOpemluYSwgMjAxMi0wNlxyXG5cdExvYWRzIGNvbnRlbnQgdGhyb3VnaCBBSkFYIGFuZCBjcmVhdGUgaXQgYXMgYW4gQXN5bmNDb250ZW50VHJhbnNpdGlvbi4gVGhlIGRlZmluaXRpb24gb2YgYSB0cmFuc2l0aW9uIG11c3QgYmUgaW5jbHVkZWQgaW4gYSBzY3JpcHQgd2l0aCBjbGFzcyBcImFzeW5jXCIsIHRoYXQgc2V0c1xyXG5cclxuXHRcclxuXHJcblx0VGhpcyBzY3JpcHQgd2lsbCBiZSBpbmplY3RlZCBpbiB0aGUgZG9tIGFuZCBjYWxsZWQgaW1tZWRpYXRlbHkgc28gYXMgdG8gZXh0ZW5kIHRoZSBvYmplY3Qgd2l0aCB0aGUgZGVmaW5lZCB0cmFuc2l0aW9uLlxyXG5cclxuKi9cclxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XHJcblx0dmFyIG5zUGFydHMgPSAnbGFncmFuZ2UvY29udGVudC9Db250ZW50RmFjdG9yeScuc3BsaXQoJy8nKTtcclxuXHR2YXIgbmFtZSA9IG5zUGFydHMucG9wKCk7XHJcblx0dmFyIG5zID0gbnNQYXJ0cy5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgcGFydCl7XHJcblx0XHRyZXR1cm4gcHJldltwYXJ0XSA9IChwcmV2W3BhcnRdIHx8IHt9KTtcclxuXHR9LCByb290KTtcclxuXHJcblx0aWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG5cdCAgICAvLyBDb21tb25KU1xyXG5cdCAgICBuc1tuYW1lXSA9IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSwgcmVxdWlyZSgnbGFncmFuZ2UvY29udGVudC9Bc3luYy5qcycpKTtcclxuICBcdH0gZWxzZSB7XHJcblx0XHRuc1tuYW1lXSA9IGZhY3Rvcnkocm9vdC4kLCByb290LmxhZ3JhbmdlLmNvbnRlbnQuQXN5bmMpO1xyXG5cdH1cclxufSh0aGlzLCBmdW5jdGlvbiAoJCwgQXN5bmMpIHtcclxuXHJcblxyXG5cdHZhciBjcmVhdGVMb2FkZWRDb250ZW50ID0gZnVuY3Rpb24ocmF3UmVzcG9uc2UsIGNyZWF0ZVBhcmFtcywgY3JlYXRlQ29udGVudENhbGxiYWNrKSB7XHJcblx0XHRcdFxyXG5cdFx0dmFyIHRpdGxlID0gcmF3UmVzcG9uc2UuZmlsdGVyKCd0aXRsZScpLmh0bWwoKTtcclxuXHRcdHZhciBhc3luY0V4dGVuZGVyID0gQXN5bmMuZ2V0RXh0ZW5kZXIocmF3UmVzcG9uc2UpO1xyXG5cdFx0dmFyIG5vc2NyaXB0UmVzcG9uc2UgPSBhc3luY0V4dGVuZGVyLmdldEZpbHRlcmVkUmVzcG9uc2UoKTtcclxuXHRcdFx0XHRcclxuXHRcdGNyZWF0ZVBhcmFtcy50aXRsZSA9IHRpdGxlO1xyXG5cdFx0dmFyIGNvbnRlbnQgPSBjcmVhdGVDb250ZW50Q2FsbGJhY2sobm9zY3JpcHRSZXNwb25zZSwgY3JlYXRlUGFyYW1zLCBub3NjcmlwdFJlc3BvbnNlKTtcclxuXHRcdGNvbnRlbnQgPSBhc3luY0V4dGVuZGVyLmV4dGVuZChjb250ZW50KTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XHJcblx0fTtcclxuXHJcblx0dmFyIGdldEZyb21BamF4ID0gZnVuY3Rpb24ocGF0aCwgY3JlYXRlUGFyYW1zLCBzZWxlY3RvciwgY3JlYXRlQ29udGVudENhbGxiYWNrKSB7XHJcblxyXG5cdFx0dmFyIGFqYXggPSAkLmFqYXgoe1xyXG5cdFx0XHR1cmwgOiBwYXRoLFxyXG5cdFx0XHRkYXRhVHlwZSA6J2h0bWwnXHJcblx0XHR9KTtcclxuXHRcdHZhciBzdWNjZXNzID0gZnVuY3Rpb24oZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcclxuXHRcdFx0cmV0dXJuIGNyZWF0ZUxvYWRlZENvbnRlbnQoJChkYXRhKSwgY3JlYXRlUGFyYW1zLCBzZWxlY3RvciwgY3JlYXRlQ29udGVudENhbGxiYWNrKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGZhaWwgPSBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcclxuXHRcdFx0Y29uc29sZS5sb2codGV4dFN0YXR1cywganFYSFIucmVzcG9uc2VUZXh0KTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGZpbHRlcmVkID0gYWpheC5waXBlKHN1Y2Nlc3MsIGZhaWwpO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmlsdGVyZWQucHJvbWlzZSgpO1xyXG5cdH07XHJcblxyXG5cdHZhciBnZXRQYXJhbXMgPSBmdW5jdGlvbihwYXRoLCB0aXRsZSkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aWQgOiBBc3luYy5nZXRQYWdlUGFydChwYXRoKSxcclxuXHRcdFx0cGF0aCA6IHBhdGgsXHJcblx0XHRcdHRpdGxlIDogdGl0bGVcclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHJcblx0XHRnZXROb2RlRnJvbVNlbGVjdG9yIDogZnVuY3Rpb24oaW5wdXQsIHNlbGVjdG9yKXtcclxuXHRcdFx0dmFyIG5vZGUgPSBzZWxlY3RvciA/ICQoc2VsZWN0b3IsIGlucHV0KSA6ICQoJzxkaXY+JykuYXBwZW5kKGlucHV0KTtcclxuXHRcdFx0Ly9zaSBsZSBub2RlIG4nZXN0IHBhcyB0cm91dsOpIGF2ZWMgbGUgc2VsZWN0b3IsIGlsIGVzdCBwb3NzaWJsZSBxdWUgbGUgbm9kZSBzb2l0IGF1IHByZW1pZXIgbml2ZWF1IGR1IGpxdWVyeSBkb25uw6lcclxuXHRcdFx0aWYobm9kZS5sZW5ndGggPT0gMCAmJiBzZWxlY3Rvcil7XHJcblx0XHRcdFx0bm9kZSA9IGlucHV0LmZpbHRlcihzZWxlY3Rvcik7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG5vZGU7XHJcblx0XHR9LFxyXG5cdFx0XHJcblx0XHQvL3NpIGxhIHBhZ2UgZXN0IGNlbGxlIGFmZmljaMOpZSBhdSBsb2FkIChkb25jIHBhcyBwYXIgYWpheCkgaWwgZmF1dCBxdWFuZCBtZW1lIGxhIGNyw6llciBwYXJjZSBxdSdlbGxlIGRvaXQgZXhpc3RlciBwb3VyIGxhIG5hdmlnYXRpb24uIGkuZS4gZWxsZSBkb2l0IGF2b2lyIGxlIG1lbWUgY29tcG9ydGVtZW50IHF1J3VuZSBwYWdlIHF1aSBzZXJhaXQgbG9hZMOpZSBwYXIgYWpheFxyXG5cdFx0Y3JlYXRlT3JpZ2luYWxDb250ZW50IDogZnVuY3Rpb24ocGF0aCwgdGl0bGUpIHtcclxuXHRcdFx0dmFyIGNyZWF0ZVBhcmFtcyA9IGdldFBhcmFtcyhwYXRoLCB0aXRsZSk7XHJcblx0XHRcdHZhciBjb250ZW50ID0gdGhpcy5jcmVhdGVDb250ZW50KG51bGwsIGNyZWF0ZVBhcmFtcyk7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgYXN5bmNFeHRlbmRlciA9IEFzeW5jLmdldEV4dGVuZGVyKCk7XHJcblx0XHRcdGNvbnRlbnQgPSBhc3luY0V4dGVuZGVyLmV4dGVuZChjb250ZW50KTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcclxuXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShjb250ZW50KTtcclxuXHRcdFx0cmV0dXJuIGNvbnRlbnQ7XHJcblx0XHR9LFxyXG5cclxuXHRcdGdldFBhZ2VJZCA6IGZ1bmN0aW9uKHBhdGgpe1xyXG5cdFx0XHR2YXIgY3JlYXRlUGFyYW1zID0gZ2V0UGFyYW1zKHBhdGgpO1xyXG5cdFx0XHRyZXR1cm4gY3JlYXRlUGFyYW1zLmlkO1xyXG5cdFx0fSxcclxuXHRcclxuXHRcdC8qKiBcclxuXHRcdEFCU1RSQUNUIENyw6llIGwnb2JqZXQgZGUgcGFnZS4gTGEgZm9uY3Rpb24gZG9pdCDDqnRyZSBvdmVycmlkw6llIHBhciBsZXMgc291cy1jbGFzc2VzIHBvdXIgY3JlciBkJ2F1dHJlcyB0eXBlcyBkZSBjb250ZW51cy5cclxuXHRcdCovXHJcblx0XHRjcmVhdGVDb250ZW50IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignY3JlYXRlQ29udGVudCBpcyBhYnN0cmFjdCcpO1x0XHJcblx0XHR9LFxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdEFCU1RSQUNUXHJcblx0XHQqL1xyXG5cdFx0bG9hZCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2xvYWQgaXMgYWJzdHJhY3QnKTtcdFxyXG5cdFx0fSxcclxuXHRcdFxyXG5cdFx0Z2V0TG9hZGluZ0RlZmVycmVkIDogZnVuY3Rpb24ocGF0aCl7XHJcblx0XHRcdFxyXG5cdFx0XHRjcmVhdGVQYXJhbXMgPSBnZXRQYXJhbXMocGF0aCk7XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gZ2V0RnJvbUFqYXgocGF0aCwgY3JlYXRlUGFyYW1zLCB0aGlzLmNyZWF0ZUNvbnRlbnQuYmluZCh0aGlzKSk7XHJcblxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG59KSk7IiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XHJcblx0dmFyIG5zUGFydHMgPSAnbGFncmFuZ2UvdXRpbHMvTW9iaWxlRGV0ZWN0Jy5zcGxpdCgnLycpO1xyXG5cdHZhciBuYW1lID0gbnNQYXJ0cy5wb3AoKTtcclxuXHR2YXIgbnMgPSBuc1BhcnRzLnJlZHVjZShmdW5jdGlvbihwcmV2LCBwYXJ0KXtcclxuXHRcdHJldHVybiBwcmV2W3BhcnRdID0gKHByZXZbcGFydF0gfHwge30pO1xyXG5cdH0sIHJvb3QpO1xyXG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuXHQgICAgLy8gQ29tbW9uSlNcclxuXHQgICAgbnNbbmFtZV0gPSBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcclxuICBcdH0gZWxzZSB7XHJcblx0XHRuc1tuYW1lXSA9IGZhY3RvcnkoKTtcclxuXHR9XHJcbn0odGhpcywgZnVuY3Rpb24gKCkge1xyXG5cclxuXHR2YXIgTW9iaWxlRGV0ZWN0ID0ge1xyXG5cdFx0QW5kcm9pZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0fSxcclxuXHRcdEJsYWNrQmVycnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQmxhY2tCZXJyeS9pKSA/IHRydWUgOiBmYWxzZTtcclxuXHRcdH0sXHJcblx0XHRpT1M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lfGlQYWR8aVBvZC9pKSA/IHRydWUgOiBmYWxzZTtcclxuXHRcdH0sXHJcblx0XHRXaW5kb3dzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0lFTW9iaWxlL2kpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0fSxcclxuXHRcdGFueTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vcmV0dXJuIHRydWU7XHJcblx0XHRcdHJldHVybiAoTW9iaWxlRGV0ZWN0LkFuZHJvaWQoKSB8fCBNb2JpbGVEZXRlY3QuQmxhY2tCZXJyeSgpIHx8IE1vYmlsZURldGVjdC5pT1MoKSB8fCBNb2JpbGVEZXRlY3QuV2luZG93cygpKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cdFxyXG5cdHJldHVybiBNb2JpbGVEZXRlY3Q7XHJcblx0XHJcbn0pKTsiLCIvKipcclxuXHJcblx0UmV2b2lyIDogZmFpcmUgc2Nyb2xsIGF2ZWMgZ3JlZW5zb2NrXHJcblx0XHJcblxyXG4qL1xyXG5cclxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XHJcblx0dmFyIG5zUGFydHMgPSAnbGFncmFuZ2UvdXRpbHMvV2luZG93VXRpbHMnLnNwbGl0KCcvJyk7XHJcblx0dmFyIG5hbWUgPSBuc1BhcnRzLnBvcCgpO1xyXG5cdHZhciBucyA9IG5zUGFydHMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIHBhcnQpe1xyXG5cdFx0cmV0dXJuIHByZXZbcGFydF0gPSAocHJldltwYXJ0XSB8fCB7fSk7XHJcblx0fSwgcm9vdCk7XHJcblx0aWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG5cdCAgICAvLyBDb21tb25KU1xyXG5cdCAgICBuc1tuYW1lXSA9IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSk7XHJcbiAgXHR9IGVsc2Uge1xyXG5cdFx0bnNbbmFtZV0gPSBmYWN0b3J5KHJvb3QualF1ZXJ5KTtcclxuXHR9XHJcbn0odGhpcywgZnVuY3Rpb24gKCQpIHtcclxuXHJcblx0dmFyIHBhZ2UsIGh0bWxXaW5kb3csIGh0bWxEb2N1bWVudCwgYm9keTtcclxuXHR2YXIgZ2V0UGFnZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRwYWdlID0gcGFnZSB8fCAkKFwiaHRtbCwgYm9keVwiKTtcclxuXHRcdHJldHVybiBwYWdlO1xyXG5cdH07XHJcblx0dmFyIGdldEJvZHkgPSBmdW5jdGlvbigpe1xyXG5cdFx0Ym9keSA9IGJvZHkgfHwgJChcImJvZHlcIik7XHJcblx0XHRyZXR1cm4gYm9keTtcclxuXHR9O1xyXG5cdHZhciBnZXRXaW5kb3cgPSBmdW5jdGlvbigpe1xyXG5cdFx0aHRtbFdpbmRvdyA9IGh0bWxXaW5kb3cgfHwgJCh3aW5kb3cpO1xyXG5cdFx0cmV0dXJuIGh0bWxXaW5kb3c7XHJcblx0fTtcclxuXHR2YXIgZ2V0RG9jdW1lbnQgPSBmdW5jdGlvbigpe1xyXG5cdFx0aHRtbERvY3VtZW50ID0gaHRtbERvY3VtZW50IHx8ICQoZG9jdW1lbnQpO1xyXG5cdFx0cmV0dXJuIGh0bWxEb2N1bWVudDtcclxuXHR9O1xyXG5cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGJvZHkgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRyZXR1cm4gZ2V0Qm9keSgpO1xyXG5cdFx0fSxcclxuXHRcdHNjcm9sbFRvcFBhZ2UgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0Z2V0UGFnZSgpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgNjAwLCBcImVhc2VPdXRFeHBvXCIpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzY3JvbGxCb3R0b21QYWdlIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB3aW5kb3dIZWlnaHQgPSBnZXRXaW5kb3coKS5oZWlnaHQoKTtcclxuXHRcdFx0dmFyIGRvY3VtZW50SGVpZ2h0ID0gZ2V0RG9jdW1lbnQoKS5oZWlnaHQoKTtcclxuXHRcdFx0Z2V0UGFnZSgpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IGRvY3VtZW50SGVpZ2h0IC0gd2luZG93SGVpZ2h0IH0sIDYwMCwgXCJlYXNlT3V0RXhwb1wiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRoYXNIaXRCb3R0b20gOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoZ2V0RG9jdW1lbnQoKS5oZWlnaHQoKSA9PSB3aW5kb3cucGFnZVlPZmZzZXQgKyB3aW5kb3cuaW5uZXJIZWlnaHQpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vcmV0b3VybmUgbGEgcG9zIGR1IHNjcm9sbFxyXG5cdFx0Z2V0U2Nyb2xsIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBnZXREb2N1bWVudCgpLnNjcm9sbFRvcCgpO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvL3JldG91cm5lIGxhIHBvcyBkdSBzY3JvbGxcclxuXHRcdGdldFdpbldpZHRoIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBnZXRXaW5kb3coKS53aWR0aCgpO1xyXG5cdFx0fSxcclxuXHRcdC8vcmV0b3VybmUgbGEgcG9zIGR1IHNjcm9sbFxyXG5cdFx0Z2V0V2luSGVpZ2h0IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBnZXRXaW5kb3coKS5oZWlnaHQoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly9pbmRpcXVlIHNpIHVuIGVsZW1lbnQgZXN0IHZpc2libGUgZGFucyBsYSBwYWdlIGTDqXBlbmRhbnQgZHUgc2Nyb2xsLlxyXG5cdFx0aXNFbGVtZW50VmlzaWJsZSA6IGZ1bmN0aW9uKGVsKSB7XHJcblx0XHRcdHZhciBlbFRvcCA9IGVsLnBvc2l0aW9uKCkudG9wO1xyXG5cdFx0XHR2YXIgZWxCb3QgPSBlbFRvcCArIGVsLmhlaWdodCgpO1xyXG5cdFx0XHR2YXIgbWluVmlzaWJsZSA9IHRoaXMuZ2V0U2Nyb2xsKCk7XHJcblx0XHRcdHZhciBtYXhWaXNpYmxlID0gbWluVmlzaWJsZSArIGdldFdpbmRvdygpLmhlaWdodCgpO1xyXG5cdFx0XHQvL2NvbnNvbGUubG9nKGVsVG9wLCAnPCcsIG1heFZpc2libGUsIGVsQm90LCAnPicsIG1pblZpc2libGUpO1xyXG5cdFx0XHRpZihlbFRvcCA8IG1heFZpc2libGUgJiYgZWxCb3QgPiBtaW5WaXNpYmxlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG59KSk7Il19
