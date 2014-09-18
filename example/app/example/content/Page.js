
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

