import { TokenAuthentication } from "@octokit/auth-oauth-app/dist-types/types";
import { UserConnections } from "../../../server/models/userConnections";
import { USER_CONNECTION_TYPE } from "../../../../../crusher-shared/types/userConnectionType";
import { iUserConnection } from "../../../../../crusher-shared/types/mongo/userConnection";
import { RestEndpointMethodTypes } from "@octokit/rest";
import { Service } from "typedi";

@Service()
export class UserConnectionsMongoService {
	async upsertGithubConnection(
		userId: number,
		githubUserInfo: RestEndpointMethodTypes["users"]["getAuthenticated"]["response"],
		tokenAuthentication: TokenAuthentication,
	) {
		return UserConnections.update(
			{ userId: userId },
			{
				userId: userId,
				service: USER_CONNECTION_TYPE.GITHUB,
				meta: {
					userId: githubUserInfo.data.id,
					loginName: githubUserInfo.data.login,
					userName: githubUserInfo.data.name,
					tokenAuthentication,
				},
			},
			{ upsert: true },
		);
	}

	getListOfUserConnections(userId: number): Promise<Array<iUserConnection>> {
		return new Promise((resolve, reject) => {
			UserConnections.find({ userId }, (err, connections) => {
				if (err) {
					return reject(err);
				}

				const userConnections: Array<iUserConnection> = connections.map((connection: any) => connection.toObject({ getters: true }) as iUserConnection);

				resolve(userConnections);
			});
		});
	}

	deleteUserConnection(connectionId: string, userId: number) {
		return new Promise((resolve, reject) => {
			UserConnections.remove({ _id: connectionId, userId: userId }, (err) => {
				if (err) {
					reject(err);
				}
				resolve(true);
			});
		});
	}
}
