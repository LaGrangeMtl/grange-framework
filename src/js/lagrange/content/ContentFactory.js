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
	if (typeof define === 'function' && define.amd) {
		define(
			'lagrange/content/ContentFactory',//must be a string, not a var
			[
				'jquery',
				'lagrange/content/Async'
			], function ($, Async) {
			return (ns[name] = factory($, Async));
		});
	} else {
		ns[name] = factory(root.$, root.lagrange.content.Async);
	}
}(this, function ($, Async) {

	var cachedDeferred = {};
	var putDeferredToCache = function(id, deferred) {
		cachedDeferred[id] = deferred;
	};

	var createLoadedContent = function(rawResponse, createParams, createContentCallback) {
			
		var title = rawResponse.filter('title').html();
		var asyncExtender = Async.getExtender(rawResponse);
		var noscriptResponse = asyncExtender.getFilteredResponse();
		
		var node = createParams.selector ? $(createParams.selector, noscriptResponse) : $('<div>').append(noscriptResponse);
		//si le node n'est pas trouvé avec le selector, il est possible que le node soit au premier niveau du jquery donné
		if(node.length == 0 && createParams.selector){
			node = noscriptResponse.filter(createParams.selector);
		}
		
		createParams.title = title;
		var content = createContentCallback(node, createParams, noscriptResponse);
		content = asyncExtender.extend(content);
		
		return content;
	};

	var getFromAjax = function(path, createParams, createContentCallback) {

		var ajax = $.ajax({
			url : path,
			dataType :'html'
		});
		var success = function(data, textStatus, jqXHR) {
			return createLoadedContent($(data), createParams, createContentCallback);
		};

		var fail = function(jqXHR, textStatus, errorThrown) {
			putDeferredToCache(createParams.id, null);
			console.log(textStatus, jqXHR.responseText);
		};

		var filtered = ajax.pipe(success, fail);
		
		putDeferredToCache(createParams.id, filtered.promise());
		return filtered.promise();
	};
	
	var getFromCache = function(id) {
		if(cachedDeferred[id]) {
			//console.log(path+' from cache');
			return cachedDeferred[id];
		}
		return false;
	};

	return {
		
		//si la page est celle affichée au load (donc pas par ajax) il faut quand meme la créer parce qu'elle doit exister pour la navigation. i.e. elle doit avoir le meme comportement qu'une page qui serait loadée par ajax
		createOriginalContent : function(createParams) {
			var content = this.createContent($(createParams.selector), createParams);
			
			var asyncExtender = Async.getExtender();
			content = asyncExtender.extend(content);
			
			var deferred = $.Deferred();
			deferred.resolve(content);
			putDeferredToCache(createParams.id, deferred.promise());
			return content;
		},

		getParams : function(path, selector, title) {
			return {
				id : Async.getPagePart(path),
				path : path,
				selector : selector,
				title : title
			};
		},

		getPageId : function(path){
			var createParams = this.getParams(path);
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
		
		getLoadingDeferred : function(path, createParams){
			
			createParams = createParams || {};
			createParams = $.extend({id:Async.getPagePart(path)}, createParams);
			
			return getFromCache(createParams.id) || getFromAjax(path, createParams, this.createContent.bind(this));

		}
	};

}));