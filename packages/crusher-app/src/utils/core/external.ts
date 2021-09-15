import { resolvePathToBackendURI } from "@utils/common/url";

const getGithubOAuthURL = (newInstallation = false) => {
	// if (!process.env.GITHUB_APP_CLIENT_ID) {
	// 	throw new Error("No github app client id provided");
	// }

	console.log(newInstallation);
	const CLIENT_ID = "Iv1.b94bab70cd7aad37";
	const url = new URL(newInstallation ? "https://github.com/apps/crusher-test/installations/new" : "https://github.com/login/oauth/authorize");
	url.searchParams.append("client_id", CLIENT_ID);
	url.searchParams.append("redirect_uri", resolvePathToBackendURI("/integrations/blabla/github/actions/callback"));
	return url.toString();
};

export { getGithubOAuthURL };
