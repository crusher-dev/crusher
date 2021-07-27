import Router from "next/router";
import { NextApiResponse } from "next";
import path from "path";

export function redirectToFrontendPath(relativePath: string, res?: NextApiResponse) {
	if (!res) {
		// req ans res objects are only provided when on server.
		return Router.replace(relativePath[0] !== "/" ? path.join("/", relativePath) : relativePath);
	}

	return new Promise((resolve) => {
		res.writeHead(302, {
			Location: path.join("/", relativePath),
			// Add the content-type for SEO considerations
			"Content-Type": "text/html; charset=utf-8",
		});

		res.end();
		resolve(true);
	});
}

export function redirectToBackendURI(relativePath: string, res?: NextApiResponse) {
	if (!res) {
		return (window.location.href = path.join("/server/", relativePath));
	}

	res.writeHead(302, {
		Location: path.join("/server/", relativePath),
	});

	res.end();
}
