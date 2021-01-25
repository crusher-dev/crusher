import { resolveToBackendPath } from "@crusher-shared/utils/url";

const getGithubOAuthURL = () => {
	if (!process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID) {
		throw new Error("No github oauth client id provided");
	}

	const url = new URL("https://github.com/login/oauth/authorize");
	console.log(process.env);
	url.searchParams.append(
		"client_id",
		process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID as string,
	);
	url.searchParams.append(
		"redirect_uri",
		resolveToBackendPath("/v2/user/connection/github/callback"),
	);
	url.searchParams.append("scope", "repo, user, admin:org");
	return url.toString();
};

export { getGithubOAuthURL };
