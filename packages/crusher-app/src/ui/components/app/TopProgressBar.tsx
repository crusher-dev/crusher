import Router from "next/router";
import NProgress from "nprogress";

let timer;
let state;
let activeRequests = 0;
NProgress.configure({ trickleRate: 0.33, trickleSpeed: 600 });
NProgress.configure({ easing: "ease", speed: 600 });

function load() {
	if (state === "loading") {
		return;
	}

	state = "loading";

	NProgress.start();
}

function stop() {
	if (activeRequests > 0) {
		return;
	}

	state = "stop";

	clearTimeout(timer);
	NProgress.done();
}

Router.events.on("routeChangeStart", load);
Router.events.on("routeChangeComplete", stop);
Router.events.on("routeChangeError", stop);

const originalFetch = window.fetch;
window.fetch = async function (...args) {
	if (activeRequests === 0) {
		load();
	}

	activeRequests++;

	try {
		const response = await originalFetch(...args);
		return response;
	} catch (error) {
        throw error;
    } finally {
		--activeRequests;
		if (activeRequests === 0) {
			stop();
		}
	}
};

export default function TopProgressBar() {
	return null;
}
