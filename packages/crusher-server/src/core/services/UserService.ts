import { Container, Service } from "typedi";
import DBManager from "../manager/DBManager";
import {
	EMAIL_NOT_VERIFIED,
	ERROR_OCCURED_IN_AUTHENTICATION,
	NO_TEAM_JOINED,
	SIGNED_IN,
	SIGNED_UP_WITHOUT_JOINING_TEAM,
	USER_ALREADY_REGISTERED,
	USER_NOT_REGISTERED,
	USER_REGISTERED,
	VERIFICATION_MAIL_SENT,
} from "../../constants";
import { clearAuthCookies, encryptPassword, generateToken, generateVerificationCode } from "../utils/auth";
import { EmailManager } from "../manager/EmailManager";
import { AuthenticationByCredentials } from "../interfaces/services/user/AuthenticationByCredentials";
import { iUser } from "../../../../crusher-shared/types/db/iUser";
import { RegisterUserRequest } from "../interfaces/services/user/RegisterUserRequest";
import { UserProviderConnection } from "../interfaces/db/UserProviderConnection";
import { GithubAppInstallation } from "../interfaces/db/GithubAppInstallation";
import { Logger } from "../../utils/logger";
import ProjectService from "./ProjectService";
import TeamService from "./TeamService";
import StripeManager from "../manager/StripeManager";
import userProjectRoleService from "./UserProjectRoleService";
import userTeamRoleService from "./UserTeamRoleService";
import { TEAM_ROLE_TYPES } from "../../../../crusher-shared/types/db/teamRole";
import { PROJECT_ROLE_TYPES } from "../../../../crusher-shared/types/db/projectRole";
import { iInviteReferral, INVITE_REFERRAL_TYPES } from "../../../../crusher-shared/types/inviteReferral";
import { InviteMembersService } from "./mongo/inviteMembers";
import { iProjectInviteReferral } from "../../../../crusher-shared/types/mongo/projectInviteReferral";
import { isOpenSourceEdition } from "../../utils/helper";
import { setUserCookie } from "../../utils/cookies";
import { extractHostname } from "../../utils/url";
import { iSignupUserRequest } from "@crusher-shared/types/request/signupUserRequest";
import { TierPlan } from "../interfaces/TierPlan";
import { RedisManager } from "@manager/redis";
import MongoManager from "@manager/MongoManager";
import { IUserAndSystemInfoResponse } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";

@Service()
export default class UserService {
	private dbManager: DBManager;
	private mongoManager: MongoManager;
	private projectService: ProjectService;
	private teamService: TeamService;
	private inviteMembersService: InviteMembersService;

	private userTeamRoleService: userTeamRoleService;
	private userProjectRoleService: userProjectRoleService;
	private stripeManager: StripeManager | undefined;

	constructor() {
		this.dbManager = Container.get(DBManager);
		this.projectService = Container.get(ProjectService);
		this.teamService = Container.get(TeamService);
		this.userProjectRoleService = Container.get(userProjectRoleService);
		this.userTeamRoleService = Container.get(userTeamRoleService);
		this.inviteMembersService = Container.get(InviteMembersService);
		this.mongoManager = Container.get(MongoManager);

		if (!isOpenSourceEdition() && process.env.STRIPE_SECRET_API_KEY) {
			this.stripeManager = Container.get(StripeManager);
		}
	}

	// For Oss
	async getOpenSourceUser(): Promise<iUser | null> {
		return this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE is_oss = ?`, [true]);
	}

	// For oss
	async createOpenSourceUser(): Promise<iUser> {
		const signupRequestPayload = {
			firstName: "Open",
			lastName: "Source",
			email: "open@source.com",
			password: "opensource",
		};

		const userId = await this.createUserRecord(signupRequestPayload, true, true);

		await this.createInitialUserWorkspace(userId, signupRequestPayload, false);

		return this.getOpenSourceUser();
	}

	async getUserByEmail(email: string): Promise<iUser | null> {
		return this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE email = ?`, [email]);
	}

	async updateTeam(userId: number, teamId: number) {
		return this.dbManager.fetchSingleRow(`UPDATE users SET ? WHERE id = ?`, [{ team_id: teamId }, userId]);
	}

	async createUserRecord(user: iSignupUserRequest, isVerified = false, isOss = false): Promise<number> {
		const _user: iUser = await this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE email = ?`, [user.email]);

		if (_user) {
			throw new Error("User already registered");
		}

		const encryptedPassword = encryptPassword(user.password);

		const userRecord = await this.dbManager.insertData(`INSERT INTO users SET ?`, {
			first_name: user.firstName,
			last_name: user.lastName,
			email: user.email,
			password: encryptedPassword,
			verified: isVerified,
			is_oss: isOss,
		});

		return userRecord.insertId;
	}

	async createInitialUserWorkspace(userId: number, user: iSignupUserRequest, shouldInitializeStripe = true): Promise<{ teamId: number; projectId: number }> {
		const stripeCustomerId =
			shouldInitializeStripe && this.stripeManager ? await this.stripeManager.createCustomer(`${user.firstName} ${user.lastName}`, user.email) : null;

		const teamId = await this.teamService.createTeamWithArgs(userId, `${user.firstName}'s Team`, user.email, TierPlan.FREE, stripeCustomerId);
		await this.updateTeam(userId, teamId);
		await this.userTeamRoleService.create(userId, teamId, TEAM_ROLE_TYPES.ADMIN);
		const projectId = (await this.projectService.createProject(`Default`, teamId)).insertId;
		await this.userProjectRoleService.create(userId, projectId, PROJECT_ROLE_TYPES.ADMIN);

		return { teamId, projectId };
	}

	async useReferral(userId: number, referral: iInviteReferral): Promise<{ teamId: number }> {
		const referralObject = await this.inviteMembersService.parseInviteReferral(referral);

		await this.updateTeam(userId, referralObject.teamId);
		const role = referralObject.meta && referralObject.meta.role ? referralObject.meta.role : null;

		await this.userTeamRoleService.create(userId, referralObject.teamId, role ? role : TEAM_ROLE_TYPES.ADMIN);

		if (referral.type === INVITE_REFERRAL_TYPES.TEAM) {
			const projects = await this.projectService.getAllProjectsOfTeam(referralObject.teamId);
			const projectIdList = projects.map((project) => project.id);
			await this.userProjectRoleService.createForProjects(userId, projectIdList, role ? role : PROJECT_ROLE_TYPES.ADMIN);
		} else {
			await this.userProjectRoleService.create(userId, (referralObject as iProjectInviteReferral).projectId, role ? role : PROJECT_ROLE_TYPES.ADMIN);
		}
		return { teamId: referralObject.teamId };
	}

	async setUserAuthCookies(userId: number, teamId: number, res: Response): Promise<string> {
		const USER_DOMAIN = process.env.FRONTEND_URL ? extractHostname(process.env.FRONTEND_URL) : "";
		const token = generateToken(userId, teamId);

		setUserCookie({ key: "token", value: token }, { httpOnly: true, domain: USER_DOMAIN }, res);
		setUserCookie({ key: "isLoggedIn", value: true }, { domain: USER_DOMAIN }, res);

		return token;
	}

	async authenticateWithEmailAndPassword(details: AuthenticationByCredentials) {
		const { email, password } = details;

		const encryptedPassword = encryptPassword(password);
		const user: iUser = await this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE email = ? AND password= ?`, [email, encryptedPassword]);

		if (!user) {
			return { status: USER_NOT_REGISTERED };
		} else {
			if (!user.verified) {
				return {
					status: EMAIL_NOT_VERIFIED,
					email,
					token: generateToken(user.id, user.team_id),
					userId: user.id,
				};
			} else {
				if (user.team_id) {
					return { status: SIGNED_IN, token: generateToken(user.id, user.team_id), userId: user.id };
				} else {
					return { status: NO_TEAM_JOINED, token: generateToken(user.id, null), userId: user.id };
				}
			}
		}
		return { status: ERROR_OCCURED_IN_AUTHENTICATION };
	}

	async registerUser(userData: RegisterUserRequest, inviteReferral: iInviteReferral | null = null): Promise<any> {
		const { email, firstName, lastName, password } = userData;

		const _user: iUser = await this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE email = ?`, [email]);

		if (!firstName || !email || !password) {
			return { status: USER_NOT_REGISTERED };
		}

		const referralObject = await this.inviteMembersService.parseInviteReferral(inviteReferral);

		if (!_user) {
			const registeredUser = await this.createdUserProfile(
				password,
				firstName,
				lastName,
				email,
				referralObject ? referralObject.teamId : null,
				referralObject ? (referralObject as iProjectInviteReferral).projectId : null,
			);
			await this.userTeamRoleService.create(registeredUser.userId, registeredUser.teamId, TEAM_ROLE_TYPES.ADMIN);
			await this.userProjectRoleService.create(registeredUser.userId, registeredUser.projectId, PROJECT_ROLE_TYPES.ADMIN);
			return registeredUser;
		}
		return { status: USER_ALREADY_REGISTERED };
	}

	private async createdUserProfile(
		password: string,
		firstName: string,
		lastName: string,
		email: string,
		referralTeamId: number = null,
		referralProjectId: number = null,
	) {
		const encryptedPassword = encryptPassword(password);

		const insertedUser = await this.dbManager.insertData(`INSERT INTO users SET ?`, {
			first_name: firstName,
			last_name: lastName,
			email: email,
			password: encryptedPassword,
			team_id: referralTeamId ? referralTeamId : null,
			verified: false,
		});
		if (insertedUser.insertId) {
			const stripeName = `${firstName} ${lastName}`;
			const teamName = `${firstName}'s team`;
			let teamId = referralTeamId;
			if (!referralTeamId) {
				const stripeCustomerId = await this.stripeManager.createCustomer(stripeName, email);
				teamId = (
					await this.teamService.createTeam({
						teamName,
						userId: insertedUser.insertId,
						stripeCustomerId,
					})
				).teamId;
			}
			const projectId = referralProjectId
				? referralProjectId
				: (await this.projectService.createDefaultProject(teamId, `${firstName}'s project`)).insertId;
			return {
				status: USER_REGISTERED,
				userId: insertedUser.insertId,
				teamId: teamId,
				projectId: projectId,
				token: generateToken(insertedUser.insertId, teamId),
			};
		}
	}

	async authenticateWithGoogleProfile(profileInfo: RegisterUserRequest, referralTeamId: number = null, referralProjectId: number = null) {
		const { email, firstName, lastName, password } = profileInfo;
		const user: iUser = await this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE email='${email}'`);
		if (!user) {
			// User not registered
			const inserted_user = await this.dbManager.insertData(`INSERT INTO users SET ?`, {
				first_name: firstName,
				last_name: lastName,
				email: email,
				verified: true,
				password: encryptPassword(password),
			});
			const teamId = referralTeamId
				? referralTeamId
				: (
						await this.teamService.createTeam({
							teamName: "Default",
							userId: inserted_user.insertId,
						})
				  ).teamId;
			const projectId = referralProjectId ? referralProjectId : (await this.projectService.createDefaultProject(teamId)).insertId;

			const user_id = inserted_user.insertId;

			if (user_id) {
				await this.userTeamRoleService.create(user_id, teamId, TEAM_ROLE_TYPES.ADMIN);
				await this.userProjectRoleService.create(user_id, projectId, PROJECT_ROLE_TYPES.ADMIN);

				return {
					status: SIGNED_UP_WITHOUT_JOINING_TEAM,
					token: generateToken(user_id, teamId),
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
		const user: iUser = await this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE id=?`, [userId]);
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
		const user: iUser = await this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE id=?`, [userId]);
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

	async getUserMetaInfo(userId: string): Promise<iUser> {
		return this.dbManager.fetchData("SELECT `key` as key_name , value FROM user_meta WHERE user_id = ?", [userId]);
	}

	async getUserInfo(userId: string): Promise<iUser> {
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
			await this.dbManager.fetchSingleRow(`UPDATE user_provider_connections SET access_token = ? WHERE user_id = ? AND provider = ?`, [
				access_token,
				user_id,
				provider,
			]);
			return { id: providerRecord.id };
		}
		const insertedRecord = await this.dbManager.insertData("INSERT INTO user_provider_connections SET ? ", {
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
		const repoNameArr = fullRepoName.split("/");
		if (repoNameArr && repoNameArr.length === 2) {
			const record = await this.getInstallationIdOfRepo(fullRepoName);
			if (record) {
				return this.dbManager.fetchSingleRow(`UPDATE github_app_installations SET ? WHERE owner_name = ? AND repo_name = ?`, [
					installation_id,
					repoNameArr[0],
					repoNameArr[1],
				]);
			} else {
				return this.dbManager.insertData(`INSERT INTO github_app_installations SET ? `, {
					owner_name: repoNameArr[0],
					repo_name: repoNameArr[1],
					installation_id,
				});
			}
		} else {
			Logger.error(`UserService::addOrUpdateGithubInstallation`, "Bad repo name", {
				fullRepoName,
			});
			return null;
		}
	}

	async getInstallationIdOfRepo(fullRepoName: string): Promise<GithubAppInstallation> {
		const repoNameArr = fullRepoName.split("/");
		if (repoNameArr && repoNameArr.length === 2) {
			return this.dbManager.fetchSingleRow(`SELECT * FROM github_app_installations WHERE owner_name = ? AND repo_name = ?`, [
				repoNameArr[0],
				repoNameArr[1],
			]);
		} else {
			Logger.error(`UserService::getInstallationIdOfRepo`, "Bad repo name", {
				fullRepoName,
			});
			return null;
		}
	}

	getFullName(firstName: string, lastName: string) {
		return [firstName, lastName].filter((name) => !!name).join(" ");
	}

	async getUserAndSystemInfo(user_id: any): Promise<IUserAndSystemInfoResponse> {

		// @Note: Remove the next line after development of this API
		const userInfo = user_id ? await this.getUserInfo(user_id) : null;
		const teamInfo = userInfo ? await this.teamService.getTeamInfo(userInfo.team_id!.toString()) : null;
		const teamProjects = userInfo && teamInfo ? await this.projectService.getAllProjects(teamInfo.id) : null;

		return {
			userId: userInfo ? userInfo.id : null,
			isUserLoggedIn: !!userInfo,
			userData: userInfo
				? {
						name: this.getFullName(userInfo.first_name, userInfo.last_name),
						avatar: "https://avatars.githubusercontent.com/u/6849438?v=4",
						// @NOTE: Remove hardcoding from the next 3 fields
						lastVisitedURL: null,
						lastProjectSelectedId: null,
						onboardingSteps: {
							INITIAL_ONBOARDING: true,
							CREATED_TEST: false,
							WATCHED_VIDEO: false,
							ADDED_ALERT: false,
						},
				  }
				: null,
			team: teamInfo
				? {
						id: teamInfo.id,
						name: teamInfo.name,
						plan: teamInfo.tier,
				  }
				: null,
			projects: teamProjects,
			system: {
				REDIS_OPERATION: {
					working: RedisManager.isAlive(),
					message: null,
				},
				MYSQL_OPERATION: {
					working: await this.dbManager.isAlive(),
					message: null,
				},
				MONGO_DB_OPERATIONS: {
					working: this.mongoManager.isAlive(),
					message: null,
				},
			},
		};
	}
}
