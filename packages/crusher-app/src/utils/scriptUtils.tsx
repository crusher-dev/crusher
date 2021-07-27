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
	const s = document.createElement('script');
	for (const attr in attribute) {
		s.setAttribute(attr, attribute[attr] ? attribute[attr] : null)
	}
	s.id=id;
	s.innerHTML = text;
	s.onload = callback;
	document.body.appendChild(s);
}

export const handleUserFeedback = ()=>{
	addScript("userLeap",{},`
  (function(l,e,a,p) {
    if (window.UserLeap) return;
    window.UserLeap = function(){U._queue.push(arguments)}
    var U = window.UserLeap;U.appId = a;U._queue = [];
    a=l.createElement('script');
    a.async=1;a.src=e+'?id='+U.appId;
    p=l.getElementsByTagName('script')[0];
    p.parentNode.insertBefore(a, p);
  })(document, 'https://cdn.userleap.com/shim.js', 'msgT5Gz9W');
		`)

	setTimeout(()=>{


	},5000)
}

export const addChat = (callback)=>{
	addScript('crisp',{},`
	window.$crisp=[];window.CRISP_WEBSITE_ID="5461094b-aec0-4aef-a7dc-d92a0a9dc236";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
	`,callback)
}

export const openChatBox = ()=>{
	addChat()
	setTimeout(()=>{
		window["$crisp"].push(['do', 'chat:open']);
	},1000)
}