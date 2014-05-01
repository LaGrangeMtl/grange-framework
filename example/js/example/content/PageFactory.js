/** 
	@author Martin Vézina, 2012-07
	
	

*/

define([
		'jquery',
		'lagrange/content/Async',
		'lagrange/content/ContentFactory',
		'example/menus/Menus',
		'example/content/Page'
	],
	function($, Async, ContentFactory, Menus, Page) {

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
		return PageFactory;

	}
);