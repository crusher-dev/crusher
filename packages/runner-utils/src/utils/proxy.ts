import { BrowserContext, Page, Route } from "playwright";

const handleProxy = async (context: Page | BrowserContext, tunnelUrl: URL, route: Route) => {
	try {
		const urlObj = new URL(route.request().url());
		Object.assign(urlObj, { host:  tunnelUrl.host, protocol: tunnelUrl.protocol, port: tunnelUrl.port });
		(route.request() as any)._initializer.url = urlObj.toString();

		const response = await context.request.fetch(route.request());
		const responseHeaders = response.headers();
		delete responseHeaders["content-security-policy"];


		return route.fulfill({response, headers: responseHeaders });
	} catch(err) {
		console.error("[ProxyMiddleware] Encountered error while intercepting urls", err);
	}
}

const setupProxyMiddleware = async (context: Page | BrowserContext, tunnelConfigMap: { [key: string]: { tunnel: string; intercept: { regex: string } & string} }) => {
	const findTunnelWithPort = (port: number) => {
		return Object.values(tunnelConfigMap).find(tunnel => tunnel.intercept.includes(`:${port}`));
	}

	for (let [tunnelName, tunnelConfig] of Object.entries(tunnelConfigMap)) {
		const matchUrl = !!tunnelConfig.intercept.regex ? eval(`new RegExp(${tunnelConfig.intercept.regex})`)
						 : (url) => (url.toString().includes(tunnelConfig.intercept));
		await context.route(
			matchUrl,
			handleProxy.bind(this, context, new URL(tunnelConfig.tunnel)),
		);

		await context.route((url) => (!!url.toString().match(new RegExp(/trycloudflare\.com\:(\d+)/gm))), (route) => {
			const matches = route.request().url().matchAll(/trycloudflare\.com\:(\d+)/gm);
			const port = matches.next().value[1];
			if(port == 80 || port == 443) return route.continue();
			const matchingTunnel = findTunnelWithPort(port);

			return handleProxy(context, new URL(matchingTunnel.tunnel), route);
		})
	}
};

const handleProxyBrowserContext = async (
	browserContext: BrowserContext,
	tunnelConfigMap: { [key: string]: { tunnel: string; intercept: { regex: string } & string} }
) => {
	return setupProxyMiddleware(browserContext, tunnelConfigMap);
};

const handleProxyPage = async (
	page: Page,
	tunnelConfigMap: { [key: string]: { tunnel: string; intercept: { regex: string } & string} }
) => {
	return setupProxyMiddleware(page, tunnelConfigMap);
};

export { handleProxyBrowserContext, handleProxyPage };
