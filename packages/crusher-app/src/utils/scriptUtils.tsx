import React from "react";

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
