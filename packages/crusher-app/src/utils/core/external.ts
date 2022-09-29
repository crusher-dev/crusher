import { resolvePathToBackendURI } from "@utils/common/url";
import * as path from "path";

const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID;
const PUBLIC_LINK = process.env.NEXT_PUBLIC_GITHUB_APP_PUBLIC_LINK || "https://github.com/apps/crusher-test";

// Github new installation is
const getGithubOAuthURL = () => {
	const githubUrl = new URL(path.join(PUBLIC_LINK, "/installations/new"));
	githubUrl.searchParams.append("client_id", CLIENT_ID);
	githubUrl.searchParams.append("redirect_uri", resolvePathToBackendURI("/integrations/blabla/github/actions/callback"));
	githubUrl.searchParams.append("state", String(btoa(JSON.stringify({ type: "integration" }))));

	return githubUrl.toString();
};

const getGithubOAuthURLLegacy = (alreadyAuthorized = false) => {
	console.log("Public link");
	const githubUrl = new URL(alreadyAuthorized ? path.join(PUBLIC_LINK, "/installations/new") : "https://github.com/login/oauth/authorize");
	githubUrl.searchParams.append("client_id", CLIENT_ID);
	githubUrl.searchParams.append("redirect_uri", resolvePathToBackendURI("/integrations/blabla/github/actions/callback"));
	githubUrl.searchParams.append("state", String(btoa(JSON.stringify({ type: "integration" }))));

	return githubUrl.toString();
};

export const getGithubLoginURL = (inviteType, inviteCode, sessionInviteCode) => {
	const url = new URL(resolvePathToBackendURI("/users/actions/auth.github"));
	if(inviteCode && inviteType) {
		url.searchParams.append("inviteCode", inviteCode);
		url.searchParams.append("inviteType", inviteType);
	}
	if(sessionInviteCode) {
		url.searchParams.append("sessionInviteCode", sessionInviteCode);
	}
	return url.toString();
};

export { getGithubOAuthURL, getGithubOAuthURLLegacy };
