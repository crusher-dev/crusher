import { resolvePathToBackendURI } from "@utils/common/url";

// Github new installation is
const getGithubOAuthURL = (alreadyAuthorized = false) => {
	// if (!process.env.GITHUB_APP_CLIENT_ID) {
	// 	throw new Error("No github app client id provided");
	// }

	const CLIENT_ID = "Iv1.512a5f008eb53d2d";
	const url = new URL(alreadyAuthorized ? "https://github.com/apps/crusher-ci/installations/new" : "https://github.com/login/oauth/authorize");
	url.searchParams.append("client_id", CLIENT_ID);
	url.searchParams.append("redirect_uri", resolvePathToBackendURI("/integrations/blabla/github/actions/callback"));
	return url.toString();
};

export { getGithubOAuthURL };
