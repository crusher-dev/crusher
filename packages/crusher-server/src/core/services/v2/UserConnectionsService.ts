import { Service, Container } from "typedi";
import DBManager from "../../manager/DBManager";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
import { Authentication, TokenAuthentication } from "@octokit/auth-oauth-app/dist-types/types";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { UserConnectionsMongoService } from "../mongo/userConnections";
import { iUserConnection } from "@crusher-shared/types/mongo/userConnection";
import { iGithubUserConnection } from "@crusher-shared/types/mongo/githubUserConnection";

@Service()
export default class UserConnectionsService {
	private dbManager: DBManager;
	private userConnectionsMongoService: UserConnectionsMongoService;
	private oAuthApp: any;

	constructor() {
		this.dbManager = Container.get(DBManager);
		this.userConnectionsMongoService = Container.get(UserConnectionsMongoService);
	}

	async parseGithubAccessToken(code: string): Promise<Authentication> {
		const auth = createOAuthAppAuth({
			clientId: process.env.GITHUB_APP_CLIENT_ID,
			clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
		});

		const tokenAuthentication = await auth({
			type: "token",
			code: code,
		});

		return tokenAuthentication;
	}

	async upsertGithubConnection(userId: number, tokenAuthentication: TokenAuthentication) {
		const octokit = new Octokit({ auth: tokenAuthentication.token });
		const githubUserInfo = await octokit.users.getAuthenticated();

		return this.userConnectionsMongoService.upsertGithubConnection(userId, githubUserInfo, tokenAuthentication);
	}

	async getListOfUserConnections(userId: number): Promise<Array<iUserConnection>> {
		return this.userConnectionsMongoService.getListOfUserConnections(userId);
	}

	async deleteUserConnection(connectionId: string, userId: number) {
		return this.userConnectionsMongoService.deleteUserConnection(connectionId, userId);
	}
}
