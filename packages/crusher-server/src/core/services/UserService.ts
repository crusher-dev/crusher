import { Service, Container, Inject } from 'typedi';
import DBManager from '../manager/DBManager';
import {
	EMAIL_NOT_VERIFIED,
	ERROR_OCCURED_IN_AUTHENTICATION,
	NO_TEAM_JOINED,
	SIGNED_IN, SIGNED_UP_WITHOUT_JOINING_TEAM,
	USER_ALREADY_REGISTERED,
	USER_FAILED_TO_REGISTERED,
	USER_NOT_REGISTERED,
	USER_REGISTERED,
	VERIFICATION_MAIL_SENT,
} from '../../constants';
import { clearAuthCookies, encryptPassword, generateToken, generateVerificationCode } from '../utils/auth';
import { EmailManager } from '../manager/EmailManager';
import { AuthenticationByCredentials } from '../interfaces/services/user/AuthenticationByCredentials';
import { User } from '../interfaces/db/User';
import { RegisterUserRequest } from '../interfaces/services/user/RegisterUserRequest';
import { UserProviderConnection } from '../interfaces/db/UserProviderConnection';
import { GithubAppInstallation } from '../interfaces/db/GithubAppInstallation';
import { Logger } from '../../utils/logger';
import ProjectService from './ProjectService';
import TeamService from './TeamService';
import StripeManager from '../manager/StripeManager';

@Service()
export default class UserService {
	private dbManager: DBManager;
	private projectService: ProjectService;
	private teamService: TeamService;
	@Inject()
	private stripeManager: StripeManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
		this.projectService = Container.get(ProjectService);
		this.teamService = Container.get(TeamService);
	}

	async authenticateWithEmailAndPassword(details: AuthenticationByCredentials) {
		const { email, password } = details;

		let encryptedPassword = encryptPassword(password);
		const user: User = await this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE email = ? AND password= ?`, [
			email,
			encryptedPassword,
		]);

		if (!user) {
			return { status: USER_NOT_REGISTERED };
		} else {
			if (!user.verified) {
				return {
					status: EMAIL_NOT_VERIFIED,
					email,
					token: generateToken(user.id, user.team_id),
				};
			} else {
				if (user.team_id) {
					return { status: SIGNED_IN, token: generateToken(user.id, user.team_id) };
				} else {
					return { status: NO_TEAM_JOINED, token: generateToken(user.id, null) };
				}
			}
		}
		return { status: ERROR_OCCURED_IN_AUTHENTICATION };
	}

	async registerUser(userData: RegisterUserRequest) : Promise<any> {
		const { email, firstName, lastName, password } = userData;

		const _user: User = await this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE email = ?`, [email]);

		if (!firstName || !email || !password) {
			return { status: USER_NOT_REGISTERED };
		}

		if (!_user) {
			return await this.createdUserProfile(password, firstName, lastName, email);
		}
		return { status: USER_ALREADY_REGISTERED };
	}

	private async createdUserProfile(password: string, firstName: string, lastName: string, email: string) {
		let encryptedPassword = encryptPassword(password);

		const insertedUser = await this.dbManager.insertData(`INSERT INTO users SET ?`, {
			first_name: firstName,
			last_name: lastName,
			email: email,
			password: encryptedPassword,
			verified: false,
		});
		if (insertedUser.insertId) {
			const stripeName = `${firstName} ${lastName}`;
			const stripeCustomerId = await this.stripeManager.createCustomer(stripeName, email);
			const teamName = `${firstName}'s team`;
			const team = await this.teamService.createTeam({
				teamName,
				userId: insertedUser.insertId,
				stripeCustomerId,
			});
			const projectName = `${firstName}'s project`;
			await this.projectService.createDefaultProject(team.teamId, projectName);
			return {
				status: USER_REGISTERED,
				userId: insertedUser.insertId,
				token: generateToken(insertedUser.insertId, team && team.teamId ? team.teamId : null)
			}
		}
	}

	async authenticateWithGoogleProfile(profileInfo: RegisterUserRequest) {
		const { email, firstName, lastName, password } = profileInfo;
		const user: User = await this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE email='${email}'`);
		if (!user) {
			// User not registered
			const inserted_user = await this.dbManager.insertData(`INSERT INTO users SET ?`, {
				first_name: firstName,
				last_name: lastName,
				email: email,
				verified: true,
				password: encryptPassword(password),
			});
			const team = await this.teamService.createTeam({
				teamName: 'Default',
				userId: inserted_user.insertId,
			});
			const project = team && team.teamId && (await this.projectService.createDefaultProject(team.teamId));

			const user_id = inserted_user.insertId;
			if (user_id) {
				return {
					status: SIGNED_UP_WITHOUT_JOINING_TEAM,
					token: generateToken(user_id, null),
				};
			}
		} else {
			if (!user.verified) {
				return {
					status: EMAIL_NOT_VERIFIED,
					token: generateToken(user.id, user.team_id),
				};
			} else {
				if (user.team_id) {
					return { status: SIGNED_IN, token: generateToken(user.id, user.team_id) };
				} else {
					return { status: NO_TEAM_JOINED, token: generateToken(user.id, null) };
				}
			}
		}

		return { status: ERROR_OCCURED_IN_AUTHENTICATION };
	}

	async verify(userId: number) {
		return this.dbManager.insertData(`UPDATE users SET verified=1 WHERE id=?`, [userId]);
	}

	async resendVerification(userId: string) {
		const user: User = await this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE id=?`, [userId]);
		if (!user) {
			return { status: USER_NOT_REGISTERED };
		} else {
			EmailManager.sendVerificationMail(user.email, generateVerificationCode(user.id, user.email));
			return { status: VERIFICATION_MAIL_SENT };
		}
	}

	async addUserMeta(meta: [{ key: string; value: string }], user_id) {
		const queryPromise = meta.map(({ key, value }) => {
			this.dbManager.insertData(`INSERT INTO user_meta SET ?`, {
				user_id,
				key,
				value,
			});
		});
		return Promise.all(queryPromise);
	}

	async getStatus(userId: string, res: any) {
		const user: User = await this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE id=?`, [userId]);
		if (!user) {
			clearAuthCookies(res);
			return { status: USER_NOT_REGISTERED };
		} else {
			if (!user.verified) {
				return { status: EMAIL_NOT_VERIFIED };
			} else {
				if (user.team_id) {
					return { status: SIGNED_IN };
				} else {
					return { status: NO_TEAM_JOINED };
				}
			}
		}
	}

	async getUserMetaInfo(userId: string): Promise<User> {
		return this.dbManager.fetchData('SELECT `key` as key_name , value FROM user_meta WHERE user_id = ?', [userId]);
	}

	async getUserInfo(userId: string): Promise<User> {
		return this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE id = ?`, [userId]);
	}

	async canAccessTestWithID(testId: number, userId: number): Promise<boolean> {
		const userWithTest = this.dbManager.fetchSingleRow(
			`SELECT * FROM users, projects, tests WHERE ` +
				`users.id = ? AND projects.team_id = users.team_id ` +
				`AND projects.id = tests.project_id ` +
				`AND tests.id = ?`,
			[userId, testId],
		);
		return !!userWithTest;
	}

	async canAccessTestInstanceWithId(testInstanceID: number, userId: number): Promise<boolean> {
		const userWithTestInstance = this.dbManager.fetchSingleRow(
			`SELECT * FROM users, projects, test_instances, tests` +
				` WHERE users.id = ? AND` +
				` projects.team_id = users.team_id AND` +
				` tests.id = test_instances.test_id AND` +
				` tests.project_id = projects.id AND` +
				` test_instances.id = ?`,
			[userId, testInstanceID],
		);
		return !!userWithTestInstance;
	}

	async canAccessProjectId(projectId, userId): Promise<boolean> {
		const user = await this.dbManager.fetchSingleRow(
			`SELECT * FROM users, projects WHERE projects.id = ? AND projects.team_id = users.team_id AND users.id = ?`,
			[projectId, userId],
		);
		return !!user;
	}

	async addOrUpdateServiceProvider(details: UserProviderConnection): Promise<{ id: number }> {
		const { user_id, provider, access_token, provider_user_id } = details;

		const providerRecord: UserProviderConnection = await this.dbManager.fetchSingleRow(
			`SELECT * FROM user_provider_connections WHERE provider = ? AND user_id + ?`,
			[provider, user_id],
		);
		if (providerRecord) {
			await this.dbManager.fetchSingleRow(
				`UPDATE user_provider_connections SET access_token = ? WHERE user_id = ? AND provider = ?`,
				[access_token, user_id, provider],
			);
			return { id: providerRecord.id };
		}
		const insertedRecord = await this.dbManager.insertData('INSERT INTO user_provider_connections SET ? ', {
			user_id,
			provider,
			access_token,
			provider_user_id,
		});
		return { id: insertedRecord.id };
	}

	async getServiceProviderAccessToken(user_id: number, provider: string): Promise<string> {
		const providerRecord: UserProviderConnection = await this.dbManager.fetchSingleRow(
			`SELECT * FROM user_provider_connections WHERE user_id = ? AND provider = ?`,
			[user_id, provider],
		);
		return providerRecord ? providerRecord.access_token : null;
	}

	async addOrUpdateGithubInstallation(fullRepoName: string, installation_id: string) {
		const repoNameArr = fullRepoName.split('/');
		if (repoNameArr && repoNameArr.length === 2) {
			const record = await this.getInstallationIdOfRepo(fullRepoName);
			if (record) {
				return this.dbManager.fetchSingleRow(
					`UPDATE github_app_installations SET ? WHERE owner_name = ? AND repo_name = ?`,
					[installation_id, repoNameArr[0], repoNameArr[1]],
				);
			} else {
				return this.dbManager.insertData(`INSERT INTO github_app_installations SET ? `, {
					owner_name: repoNameArr[0],
					repo_name: repoNameArr[1],
					installation_id,
				});
			}
		} else {
			Logger.error(`UserService::addOrUpdateGithubInstallation`, 'Bad repo name', {
				fullRepoName,
			});
			return null;
		}
	}

	async getInstallationIdOfRepo(fullRepoName: string): Promise<GithubAppInstallation> {
		const repoNameArr = fullRepoName.split('/');
		if (repoNameArr && repoNameArr.length === 2) {
			return this.dbManager.fetchSingleRow(
				`SELECT * FROM github_app_installations WHERE owner_name = ? AND repo_name = ?`,
				[repoNameArr[0], repoNameArr[1]],
			);
		} else {
			Logger.error(`UserService::getInstallationIdOfRepo`, 'Bad repo name', {
				fullRepoName,
			});
			return null;
		}
	}
}
