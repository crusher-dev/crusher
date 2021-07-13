import Router from "next/router";
import { resolvePathToBackendURI, resolvePathToFrontendURI } from "./url";
import { NextApiResponse } from "next";

export function redirectToFrontendPath(path: string, res?: NextApiResponse) {
	// req ans res objects are only provided when on server.
	return Router.replace(path);
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
