export function addScript(id, attribute, text, callback) {
	const s = document.createElement("script");
	for (const attr in attribute) {
		s.setAttribute(attr, attribute[attr] || null);
	}
	s.id = id;
	s.innerHTML = text;
	s.onload = callback;
	document.body.appendChild(s);
}

const DEV_SEGMENT_KEY = "N37AcGJzsY7gUkuE0kaaoxgJeunzilx1";
const SEGMENT_KEY = process.env.NEXT_PUBLIC_SEGMENT_KEY || DEV_SEGMENT_KEY;
export const loadSegment = () => {
	addScript(
		"track",
		{},
		`
  !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="${SEGMENT_KEY}";;analytics.SNIPPET_VERSION="4.15.3";
  analytics.load("${SEGMENT_KEY}");
  analytics.page();
  }}();
	`,
		() => {},
	);
};

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
};

export const GA_ID = process.env.GA_ID || "UA-51192281-1";

// Hate to use GA, but other user activity tool aren't reliable.
// Might switch to plausible soon. Anyways, if you're not comfortable you can switch off tracking completely.
export const loadGA = () => {
	addScript(
		"ga",
		{},
		`
	(function(e,t,n,i,s,a,c){e[n]=e[n]||function(){(e[n].q=e[n].q||[]).push(arguments)}
	;a=t.createElement(i);c=t.getElementsByTagName(i)[0];a.async=true;a.src=s
	;c.parentNode.insertBefore(a,c)
	})(window,document,"galite","script","https://cdn.jsdelivr.net/npm/ga-lite@2/dist/ga-lite.min.js");
	
	galite('create', '${GA_ID}', 'auto');
	galite('send', 'pageview');
		`,
	);
};

export const loadCrisp = (callback = () => {}) => {
	addScript(
		"crisp",
		{},
		`
	window.$crisp=[];window.CRISP_WEBSITE_ID="5461094b-aec0-4aef-a7dc-d92a0a9dc236";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
	`,
		callback,
	);
};

export const openChatBox = () => {
	window["$crisp"].push(["do", "chat:open"]);
};
