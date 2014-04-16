/** 
	@author Martin Vézina, 2012-07
	
	

*/

define([
		'jquery',
		'lagrange/content/Async',
		'lagrange/content/ContentFactory',
		'example/content/Page'
	],
	function($, Async, ContentFactory, Page) {
		
		var PageFactory = Object.create(ContentFactory);
		
		$.extend(PageFactory, {

			createContent : function(node, createParams) {
				var page = Page.factory();
				page.setContentNode(node);
				
				page.initPage(createParams.id, createParams.title);

				console.log('**** '+page.getTitle()+' created', page.getId());
				return page;
			},
			
			load : function(path, selector){
				var createParams = this.getParams(path, selector);
				return this.getLoadingDeferred(path, createParams);
			},
			
			/** la page originale a aussi un buffered definition qui ne sera pas aexécuté si on ne passe pas par le factory */
			createOriginalPage : function(canonical, selector, title) {
				var createParams = this.getParams(canonical, selector, title);
				
				return this.createOriginalContent(createParams);
			}
			
		});
		//console.dir(PageFactory);
		return PageFactory;

	}
);