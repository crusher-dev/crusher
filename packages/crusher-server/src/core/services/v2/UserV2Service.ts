import { Container, Service } from "typedi";
import DBManager from "../../manager/DBManager";
import { iInviteReferral, INVITE_REFERRAL_TYPES } from "../../../../../crusher-shared/types/inviteReferral";
import { encryptPassword, generateToken } from "../../utils/auth";
import { InviteMembersService } from "../mongo/inviteMembers";
import UserTeamRoleV2Service from "./UserTeamRoleV2Service";
import UserProjectRoleV2Service from "./UserProjectRoleV2Service";
import { ProjectV2Service } from "./ProjectV2Service";
import { TEAM_ROLE_TYPES } from "../../../../../crusher-shared/types/db/teamRole";
import { PROJECT_ROLE_TYPES } from "../../../../../crusher-shared/types/db/projectRole";
import { iProjectInviteReferral } from "../../../../../crusher-shared/types/mongo/projectInviteReferral";
import { iSignupUserRequest } from "../../../../../crusher-shared/types/request/signupUserRequest";
import { TeamV2Service } from "./TeamV2Service";
import { TierPlan } from "../../interfaces/TierPlan";
import StripeManager from "../../manager/StripeManager";
import { Response } from "express";
import { setUserCookie } from "../../../utils/cookies";
import { extractHostname } from "../../../utils/url";
import { iUser } from "../../../../../crusher-shared/types/db/iUser";
import { project } from "gcp-metadata";

const USER_DOMAIN = extractHostname(process.env.FRONTEND_URL);

@Service()
export class UserV2Service {
	private dbManager: DBManager;
	private inviteMembersService: InviteMembersService;
	private userTeamRoleService: UserTeamRoleV2Service;
	private userProjectRoleService: UserProjectRoleV2Service;
	private projectService: ProjectV2Service;
	private teamService: TeamV2Service;
	private stripeManager: StripeManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
		this.inviteMembersService = Container.get(InviteMembersService);
		this.projectService = Container.get(ProjectV2Service);
		this.teamService = Container.get(TeamV2Service);
		this.userTeamRoleService = Container.get(UserTeamRoleV2Service);
		this.userProjectRoleService = Container.get(UserProjectRoleV2Service);
		this.stripeManager = Container.get(StripeManager);
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

		await this.createInitialUserWorkspace(userId, signupRequestPayload);

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

	async createInitialUserWorkspace(userId: number, user: iSignupUserRequest): Promise<{ teamId: number; projectId: number }> {
		const stripeCustomerId = await this.stripeManager.createCustomer(`${user.firstName} ${user.lastName}`, user.email);

		const teamId = await this.teamService.createTeam(userId, `${user.firstName}'s Team`, user.email, TierPlan.FREE, stripeCustomerId);
		await this.updateTeam(userId, teamId);
		await this.userTeamRoleService.create(userId, teamId, TEAM_ROLE_TYPES.ADMIN);
		const projectId = await this.projectService.createProject(`Default`, teamId);
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
		const token = generateToken(userId, teamId);

		setUserCookie({ key: "token", value: token }, { httpOnly: true, domain: USER_DOMAIN }, res);
		setUserCookie({ key: "isLoggedIn", value: true }, { domain: USER_DOMAIN }, res);

		return token;
	}

	async authenticateWithGoogleProfile() {
		return true;
	}
}
