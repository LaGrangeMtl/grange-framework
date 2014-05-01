define(
	[
		'example/NameSpace',
		'lagrange/utils/WindowUtils',
		'lagrange/utils/MobileDetect',
		'jquery',
		'example/menus/Menus',
		'example/content/PageFactory',
		'example/content/Preloader',
		'TweenMax',
		'native.history'
	],
	function(ns, WU, MobileDetect, $, Menus, PageFactory, Preloader, TweenMax){

		var containerId = 'navigWrapper';
		var container;
		var canonical;
		var currentPage;
		var currentHash;
		var loading = false;

		var isAvailable = function() {
			var isMobile = MobileDetect.any();
			return (!isMobile && History.enabled);
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

		return {
			init: function(){
				var path = $('link[rel="canonical"]').attr('href');

				var title = $('title').html();
				//console.log(path, title)
				currentPage = PageFactory.createOriginalPage(path, title);
				canonical = currentPage.name;

				if(isAvailable()){
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
	}
);