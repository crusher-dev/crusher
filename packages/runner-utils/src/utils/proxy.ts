import { BrowserContext, Page } from "playwright";

const handleProxyBrowserContext = async (
	browserContext: BrowserContext,
	proxyUrlsMap: { [key: string]: { tunnel: string; intercept: string | { regex: string } } },
) => {
	const proxyKeys = Object.keys(proxyUrlsMap);
	console.log("proxy is", proxyUrlsMap);
	//@ts-ignore
	await Promise.all(
		proxyKeys.map(async (item) => {
			const proxyConfig = proxyUrlsMap[item];
			console.log("Regexp", eval(`new RegExp(${(proxyConfig.intercept as any).regex})`));
			return browserContext.route(
				(proxyConfig.intercept as any).regex
					? eval(`new RegExp(${(proxyConfig.intercept as any).regex})`)
					: (url) => {
							return url.toString().includes(proxyConfig.intercept as string);
					  },
				async (route) => {
					try {
						const routeUrl = route.request().url();
						const urlObject = new URL(routeUrl);

						const tunnelUrl = new URL(proxyConfig.tunnel);

						urlObject.host = tunnelUrl.host;
						urlObject.protocol = tunnelUrl.protocol;
						urlObject.port = tunnelUrl.port;

						console.log("URL IS NOW (browser) ", urlObject.toString());

						await route.continue({
							url: urlObject.toString(),
						});
					} catch (err) {
						console.error("Encountered error", err);
					}
				},
			);
		}),
	);
};

const handleProxyPage = async (page: Page, proxyUrlsMap: { [key: string]: { tunnel: string; intercept: string | { regex: string } } }) => {
	const proxyKeys = Object.keys(proxyUrlsMap);
	await Promise.all(
		proxyKeys.map(async (item) => {
			const proxyConfig = proxyUrlsMap[item];
			return page.route(
				(proxyConfig.intercept as any).regex
					? eval(`new RegExp(${(proxyConfig.intercept as any).regex})`)
					: (url) => {
							return url.toString().includes(proxyConfig.intercept as string);
					  },
				async (route) => {
					try {
						const routeUrl = route.request().url();
						const urlObject = new URL(routeUrl);

						const tunnelUrl = new URL(proxyConfig.tunnel);
						urlObject.host = tunnelUrl.host;
						urlObject.protocol = tunnelUrl.protocol;
						urlObject.port = tunnelUrl.port;

						console.log("URL IS NOW (page) ", urlObject.toString());

						await route.continue({
							url: urlObject.toString(),
						});
					} catch (err) {
						console.error("Encountered error", err);
					}
				},
			);
		}),
	);
};

export { handleProxyBrowserContext, handleProxyPage };
