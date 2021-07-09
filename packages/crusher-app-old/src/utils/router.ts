import Router from "next/router";
import { resolvePathToBackendURI, resolvePathToFrontendURI } from "./url";
import { NextApiResponse } from "next";

export function redirectToFrontendPath(path: string, res?: NextApiResponse) {
	if (!res) {
		// req ans res objects are only provided when on server.
		return Router.replace(path);
	}

	return new Promise((resolve) => {
		res.writeHead(302, {
			Location: resolvePathToFrontendURI(path),
			// Add the content-type for SEO considerations
			"Content-Type": "text/html; charset=utf-8",
		});

		res.end();
		resolve(true);
	});
}

export function redirectToBackendURI(path, res?: NextApiResponse) {
	if (!res) {
		return (window.location.href = resolvePathToBackendURI(path));
	}

	res.writeHead(302, {
		Location: resolvePathToBackendURI(path),
	});

	res.end();
}
