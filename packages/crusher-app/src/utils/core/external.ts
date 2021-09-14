import { resolvePathToBackendURI } from "@utils/common/url";

const getGithubOAuthURL = () => {
	// if (!process.env.GITHUB_APP_CLIENT_ID) {
	// 	throw new Error("No github app client id provided");
	// }

	const CLIENT_ID = "Iv1.b94bab70cd7aad37";
	const url = new URL("https://github.com/login/oauth/authorize");
	console.log(process.env);
	url.searchParams.append("client_id", CLIENT_ID);
	url.searchParams.append("redirect_uri", resolvePathToBackendURI("/user/actions/github/connect" + `?redirect_url=${window.location.origin}`));
	return url.toString();
};

export { getGithubOAuthURL };
