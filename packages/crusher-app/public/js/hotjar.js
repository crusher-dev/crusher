(function (h, o, t, j, a, r) {
	h.hj =
		h.hj ||
		function (...args) {
			(h.hj.q = h.hj.q || []).push(args);
		};
	h._hjSettings = { hjid: 1, hjsv: 5 };
	[a] = o.getElementsByTagName("head");
	r = o.createElement("script");
	r.async = 1;
	r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
	a.appendChild(r);
})(window, document, "//static.hotjar.com/c/hotjar-", ".js?sv=");
