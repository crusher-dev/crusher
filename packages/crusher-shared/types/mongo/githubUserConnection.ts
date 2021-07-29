import { iUserConnection } from "./userConnection";
import { TokenAuthentication } from "@octokit/auth-oauth-app/dist-types/types";

export interface iGithubUserConnection extends iUserConnection {
	meta: {
		userId: string;
		loginName: string;
		userName: string;
		tokenAuthentication: TokenAuthentication;
	};
}
