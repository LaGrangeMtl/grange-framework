function x(t,n,e,a,i,o,r){var c,d,u,f="navigWrapper",v=!1,l=function(){var t=e.any();return!t},h=function(){i.activate(w)},g=function(t){if(!v){var n=o.getPageId(t);n!==u.getId()&&(v=o.load(t),a.when(v).then(function(t){p(t,!1)}))}},p=function(n){var e=u.getContentNode(),i=n.getContentNode();t.app.deactivate(e);var o=u;u=n;var d=u.onAddedToDOM();c.append(i.hide());var f=o.animateOut();f.then(function(){r.show()}),a.when(d,f).then(function(){r.hide(),e.detach(),h(u),History.pushState(null,u.getTitle(),"/"+u.getId()),i.show(),u.animateIn(),t.app.activate(i),v=!1})},s=function(t){var n=t.replace(/^[\.\/]+/,"");return""===n?s(d):(n="/"+n.replace(/\??&_suid=[0-9]+/,""),u&&u.getId()===n?void 0:g(window.location.protocol+"//"+window.location.host+n))},w=function(){var t=function(t){t.preventDefault();var n=a(this);return g(n.attr("href")),!1};return function(n){l()&&n.off(".navig").on("click.navig",t)}}();return{init:function(){var t=a('link[rel="canonical"]').attr("href"),n=a("title").html();u=o.createOriginalPage(t,n),d=u.name,l()&&(console.log(History.getState().hash),History.Adapter.bind(window,"statechange",function(){return s(History.getState().hash),!1}),c=a("#"+f),0===c.length&&(u.getContentNode().wrap('<div id="'+f+'"></div>'),c=a("#"+f)));var e=u.onAddedToDOM();e.always(function(){u.jumpToInState(),h(u,!0),!l()}),i.activate(w)},activateContext:function(t){l()&&w(t.find("a.inner"))},deactivateContext:function(t){t.find("a.inner").off(".navig").on("click.navig",function(t){t.preventDefault()})}}}