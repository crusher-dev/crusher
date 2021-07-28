import { resolveToBackendPath } from "@crusher-shared/utils/url";

const getGithubOAuthURL = () => {
	if (!process.env.GITHUB_APP_CLIENT_ID) {
		throw new Error("No github app client id provided");
	}

	const url = new URL("https://github.com/login/oauth/authorize");
	console.log(process.env);
	url.searchParams.append("client_id", process.env.GITHUB_APP_CLIENT_ID as string);
	url.searchParams.append("redirect_uri", resolveToBackendPath("/user/connection/github/callback"));
	return url.toString();
};

export { getGithubOAuthURL };
