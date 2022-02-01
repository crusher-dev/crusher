import { resolvePathToBackendURI } from "@utils/common/url";
import * as path from "path";

const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID;
const PUBLIC_LINK = process.env.NEXT_PUBLIC_GITHUB_APP_PUBLIC_LINK;

// Github new installation is
const getGithubOAuthURL = (alreadyAuthorized = false) => {

	const githubUrl = new URL(path.join(PUBLIC_LINK, "/installations/new"));
	githubUrl.searchParams.append("client_id", CLIENT_ID);
	githubUrl.searchParams.append("redirect_uri", resolvePathToBackendURI("/integrations/blabla/github/actions/callback"));
	githubUrl.searchParams.append("state", `${btoa(JSON.stringify({ type: "integration" }))}`);

	return githubUrl.toString();
};

const getGithubOAuthURLLegacy = (alreadyAuthorized = false) => {

	const githubUrl = new URL(alreadyAuthorized ? path.join(PUBLIC_LINK, "/installations/new") : "https://github.com/login/oauth/authorize");
	githubUrl.searchParams.append("client_id", CLIENT_ID);
	githubUrl.searchParams.append("redirect_uri", resolvePathToBackendURI("/integrations/blabla/github/actions/callback"));
	githubUrl.searchParams.append("state", `${btoa(JSON.stringify({ type: "integration" }))}`);

	return githubUrl.toString();
};

export const getGithubLoginURL = () => {
	const url = new URL("https://github.com/login/oauth/authorize");
	url.searchParams.append("client_id", CLIENT_ID);
	url.searchParams.append("state", `${btoa(JSON.stringify({ type: "auth" }))}`);

	return url.toString();
};

export { getGithubOAuthURL, getGithubOAuthURLLegacy };
