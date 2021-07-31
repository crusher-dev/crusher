import React from "react";

export const GTMTag = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TCM8227');`;

export const GTMNoScriptTag = () => (
	<>
		<noscript>
			<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TCM8227" height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
		</noscript>
	</>
);

export const SegmentTag = `
  !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.13.1";
  analytics.load("fdxdLIYSKKGGNTndKZleMd0q8TU8Tolj");
  analytics.page();
  }}();`;

export function addScript(id, attribute, text, callback) {
	const s = document.createElement("script");
	for (const attr in attribute) {
		s.setAttribute(attr, attribute[attr] ? attribute[attr] : null);
	}
	s.id = id;
	s.innerHTML = text;
	s.onload = callback;
	document.body.appendChild(s);
}

export const loadUserLeap = () => {
	addScript(
		"userLeap",
		{},
		`
  (function(l,e,a,p) {
    if (window.UserLeap) return;
    window.UserLeap = function(){U._queue.push(arguments)}
    var U = window.UserLeap;U.appId = a;U._queue = [];
    a=l.createElement('script');
    a.async=1;a.src=e+'?id='+U.appId;
    p=l.getElementsByTagName('script')[0];
    p.parentNode.insertBefore(a, p);
  })(document, 'https://cdn.userleap.com/shim.js', 'msgT5Gz9W');
		`,
	);

	setTimeout(() => {}, 5000);
};

export const addChat = (callback) => {
	addScript(
		"crisp",
		{},
		`
	window.$crisp=[];window.CRISP_WEBSITE_ID="5461094b-aec0-4aef-a7dc-d92a0a9dc236";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
	`,
		callback,
	);
};

export const addPosthog = () => {
	addScript(
		"posthog",
		{},
		`window['_fs_debug'] = false;
window['_fs_host'] = 'fullstory.com';
window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
window['_fs_org'] = 'QA1VE';
window['_fs_namespace'] = 'FS';
(function(m,n,e,t,l,o,g,y){
    if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
    g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
    o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;
    y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
    g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
    g.anonymize=function(){g.identify(!!0)};
    g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
    g.log = function(a,b){g("log",[a,b])};
    g.consent=function(a){g("consent",!arguments.length||a)};
    g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
    g.clearUserCookie=function(){};
    g.setVars=function(n, p){g('setVars',[n,p]);};
    g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
    if(m[y])m[y]=function(){return g._w[y].apply(this,arguments)};
    g._v="1.3.0";
})(window,document,window['_fs_namespace'],'script','user');`,
	);
};

export const openChatBox = () => {
	window["$crisp"].push(["do", "chat:open"]);
};
