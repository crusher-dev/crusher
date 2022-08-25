import { TeamsService } from "@modules/resources/teams/service";
import { encryptPassword } from "@utils/auth";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { StripeManager } from "@modules/stripe";
import { Inject, Service } from "typedi";
import { IUserTable, ICreateUserPayload } from "./interface";
import { ITeamsTable, PlanTierEnum } from "../teams/interface";
import { UserProjectRolesService } from "./roles/project/service";
import { UserTeamRolesService } from "./roles/team/service";
import { UserTeamRoleEnum } from "./roles/team/interface";
import { ProjectsService } from "../projects/service";
import { UserProjectRoleEnum } from "./roles/project/interface";
import { isOpenSourceEdition } from "@utils/helper";
import { RedisManager } from "@modules/redis";
import { IUserAndSystemInfoResponse, TSystemInfo } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";
import { v4 as uuidv4 } from "uuid";
import { EditionTypeEnum, HostingTypeEnum } from "@crusher-shared/types/common/general";
@Service()
class UsersService {
	@Inject()
	private dbManager: DBManager;
	@Inject()
	private stripeManager: StripeManager;
	@Inject()
	private teamService: TeamsService;
	@Inject()
	private userProjectRolesService: UserProjectRolesService;
	@Inject()
	private userTeamRolesService: UserTeamRolesService;
	@Inject()
	private projectsService: ProjectsService;
	@Inject()
	private teamsService: TeamsService;
	@Inject()
	private redisManager: RedisManager;
	// @TODO: Shift this to a new module

	@CamelizeResponse()
	async getOpenSourceUser(): Promise<KeysToCamelCase<IUserTable> | null> {
		return this.dbManager.fetchSingleRow(`SELECT * FROM public.users WHERE is_oss = ?`, [true]);
	}

	async getUserByEmail(email: string): Promise<IUserTable | null> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.users WHERE email = ?", [email]);
	}

	async addUserToTeam(userId: number, teamId: number) {
		return this.dbManager.update(`UPDATE public.users SET team_id = ? WHERE id = ?`, [teamId, userId]);
	}

	async updatePassword(id: string, password: string) {
		return this.dbManager.update(`UPDATE public.users SET password = ? WHERE id = ?`, [encryptPassword(password), id]);
	}

	async setupInitialUserWorkspace(
		user: Omit<ICreateUserPayload, "password" | "uuid"> & { id: number; teamId?: number; projectId?: number },
	): Promise<{ userId: number; teamId: number; projectId?: number }> {
		const stripeCustomerId = this.stripeManager.isAvailable() ? await this.stripeManager.createCustomer(`${user.name}`, user.email) : null;

		let userTeamId = user.teamId;
		// Create and setup team
		if (!userTeamId) {
			const teamRecord = await this.teamService.createTeam({
				name: `${user.name}'s Workspace`,
				teamEmail: user.email,
				stripeCustomerId,
				// @TODO: Make this customiazable
				tier: PlanTierEnum.FREE,
			});
			userTeamId = teamRecord.insertId;
		}

		await this.addUserToTeam(user.id, userTeamId);
		await this.userTeamRolesService.create({
			userId: user.id,
			teamId: userTeamId,
			role: UserTeamRoleEnum.ADMIN,
		});

		// Create and setup project
		// let userProjectId = user.projectId;
		// if (!userProjectId) {
		// 	const projectRecord = await this.projectsService.createProject({
		// 		name: `Default`,
		// 		teamId: userTeamId,
		// 	});
		// 	userProjectId = projectRecord.insertId;
		// }
		// await this.userProjectRolesService.create({
		// 	userId: user.id,
		// 	projectId: userProjectId,
		// 	role: UserProjectRoleEnum.ADMIN,
		// });

		return { userId: user.id, teamId: userTeamId };
	}

	async createUserRecord(user: Omit<ICreateUserPayload, "uuid">): Promise<{ insertId: number }> {
		return this.dbManager.insert("INSERT INTO public.users (name, email, password, verified, is_oss, uuid, meta) VALUES (?, ?, ?, ?, ?, ?, ?)", [
			user.name,
			user.email,
			encryptPassword(user.password),
			false,
			isOpenSourceEdition(),
			uuidv4() + "_" + Date.now(),
			user.meta ? user.meta : null,
		]);
	}

	async deleteUserWorkspace(userId: number) {
		const userRecord = await this.getUserInfo(userId);
		await this.dbManager.delete("DELETE FROM public.user_meta WHERE user_id = ?", [userRecord.id]);
		await this.dbManager.delete("DELETE FROM public.user_project_roles WHERE user_id = ?", [userRecord.id]);
		await this.dbManager.delete("DELETE FROM public.projects WHERE team_id = ?", [userRecord.teamId]);
		await this.dbManager.delete("DELETE FROM public.user_team_roles WHERE user_id = ?", [userRecord.id]);
		await this.dbManager.delete("DELETE FROM public.users WHERE id = ?", [userRecord.id]);
		await this.dbManager.delete("DELETE FROM public.teams WHERE id = ?", [userRecord.teamId]);
	}

	// Prod
	async deleteAllTestUsers() {
		const users = await this.dbManager.fetchAllRows(
			"SELECT * FROM public.users WHERE email LIKE 'testing-%@public.dev' AND EXTRACT(EPOCH FROM (NOW() - users.created_at)) >  60 * 60",
		);
		return users.map((user) => this.deleteUserWorkspace(user.id));
	}

	@CamelizeResponse()
	async getUserInfo(userId: number): Promise<KeysToCamelCase<IUserTable>> {
		return this.dbManager.fetchSingleRow(`SELECT * FROM public.users WHERE id = ?`, [userId]);
	}

	async getUserAndSystemInfo(userId: number): Promise<IUserAndSystemInfoResponse> {
		// @Note: Remove the next line after development of this API
		const userInfo = userId ? await this.getUserInfo(userId) : null;

		const teamInfo = userInfo ? await this.teamsService.getTeam(userInfo.teamId) : null;
		const teamProjects = userInfo && teamInfo ? await this.projectsService.getProjects(teamInfo.id) : null;

		const getUserData = (userInfo: KeysToCamelCase<IUserTable>) => {
			return {
				userId: userInfo.id,
				name: userInfo.name,
				email: userInfo.email,
				uuid: userInfo.uuid,
				avatar: null,
				// @NOTE: Remove hardcoding from the next 3 fields
				meta: userInfo.meta ? JSON.parse(userInfo.meta) : {},
			};
		};

		const getTeamData = (teamInfo: KeysToCamelCase<ITeamsTable>) => {
			return {
				id: teamInfo.id,
				uuid: teamInfo.uuid,
				name: teamInfo.name,
				meta: teamInfo.meta ? JSON.parse(teamInfo.meta) : {},
				plan: teamInfo.tier,
			};
		};

		const projectsDataArr = teamProjects
			? teamProjects.map((project) => {
					return { ...project, meta: project.meta ? JSON.parse(project.meta) : {}, visualBaseline: project.visualBaseline };
			  })
			: null;

		const out = {
			userId: userInfo ? userInfo.id : null,
			isUserLoggedIn: !!userInfo,
			userData: userInfo ? getUserData(userInfo) : null,
			team: teamInfo ? getTeamData(teamInfo) : null,
			projects: projectsDataArr,
			crusherMode: process.env.CRUSHER_MODE as EditionTypeEnum,
			hostingType: process.env.HOST_MODE as HostingTypeEnum,
			system: {
				REDIS_OPERATION: {
					working: this.redisManager.isAlive(),
					message: null,
				},
				MYSQL_OPERATION: {
					working: await this.dbManager.isConnectionAlive(),
					message: null,
				},
			},
		};

		if (isOpenSourceEdition()) {
			(out.system as TSystemInfo).OPEN_SOURCE = {
				initialized: !!userInfo,
			};
		}

		return out;
	}

	async updateMeta(meta: string, userId: number) {
		return this.dbManager.update("UPDATE public.users SET meta = ? WHERE id = ?", [meta, userId]);
	}

	@CamelizeResponse()
	async getUsersInProject(projectId: number): Promise<Array<KeysToCamelCase<IUserTable>>> {
		return this.dbManager.fetchAllRows(
			"SELECT users.* FROM public.users, public.user_project_roles WHERE project_id = ? AND users.id = user_project_roles.user_id",
			[projectId],
		);
	}

	async setGithubUserId(githubUserId: string, userId: number) {
		return this.dbManager.update("UPDATE public.users SET github_user_id = ? WHERE id = ?", [githubUserId, userId]);
	}

	@CamelizeResponse()
	async getUserByGithubUserId(githubUserId: string): Promise<KeysToCamelCase<IUserTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.users WHERE github_user_id = ?", [githubUserId]);
	}
}

export { UsersService };
