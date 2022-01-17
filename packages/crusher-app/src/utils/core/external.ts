import { resolvePathToBackendURI } from "@utils/common/url";

const CLIENT_ID = "Iv1.512a5f008eb53d2d";
// Github new installation is
const getGithubOAuthURL = (alreadyAuthorized = false) => {
	// if (!process.env.GITHUB_APP_CLIENT_ID) {
	// 	throw new Error("No github app client id provided");
	// }

	const url = new URL(alreadyAuthorized ? "https://github.com/apps/crusher-ci/installations/new" : "https://github.com/login/oauth/authorize");
	url.searchParams.append("client_id", CLIENT_ID);
	url.searchParams.append("redirect_uri", resolvePathToBackendURI("/integrations/blabla/github/actions/callback"));
	url.searchParams.append("state", `${btoa(JSON.stringify({ type: "integration" }))}`);

	return url.toString();
};

export const getGithubLoginURL = () => {
	const url = new URL("https://github.com/login/oauth/authorize");
	url.searchParams.append("client_id", CLIENT_ID);
	url.searchParams.append("state", `${btoa(JSON.stringify({ type: "auth" }))}`);

	return url.toString();
};

export { getGithubOAuthURL };
