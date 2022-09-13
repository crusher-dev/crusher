import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Post, QueryParam, QueryParams, Req, Res } from "routing-controllers";
import { Inject, Service } from "typedi";
import { UsersService } from "@modules/resources/users/service";
import { resolvePathToBackendURI, resolvePathToFrontendURI } from "@utils/uri";
import { GoogleAPIService } from "@modules/thirdParty/google/service";
import { clearUserAuthorizationCookies } from "@utils/cookies";
import { google } from "googleapis";
import { IUserAndSystemInfoResponse } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";
import { UserAuthService } from "./auth.service";
import { ICreateUserPayload } from "./interface";
import { v4 as uuidv4 } from "uuid";
import { UserInviteService } from "./invite/service";
import { InviteReferralEnum } from "./invite/interface";
import { OCTOKIT_CONFIG } from "../../../../config/github";
import { encryptPassword, generateToken } from "@utils/auth";

@Service()
@JsonController("")
export class UserController {
	@Inject()
	private usersService: UsersService;
	@Inject()
	private googleAPIService: GoogleAPIService;
	@Inject()
	private userAuthService: UserAuthService;
	@Inject()
	private userInviteService: UserInviteService;

	private oauth2Client: any | null;

	constructor() {
		if (process.env.BACKEND_URL) {
			this.oauth2Client = new google.auth.OAuth2(
				process.env.GOOGLE_CLIENT_ID,
				process.env.GOOGLE_CLIENT_SECRET,
				resolvePathToBackendURI("/users/actions/auth.google/callback"),
			);
		}
	}

	@Authorized()
	@Post("/users/actions/delete")
	async deleteUser(@CurrentUser({ required: true }) user, @Req() req, @Res() res) {
		await this.usersService.deleteUserWorkspace(user.user_id);
		clearUserAuthorizationCookies(req, res);
		return "Successful";
	}

	// @OSS
	@Get("/users/actions/oss.init")
	async initOssUser(@CurrentUser({}) user: { user_id: number; team_id: number }, @Req() req: any, @Res() res: any) {
		let userId = user.user_id;

		if (!userId) {
			const userEntry = await this.userAuthService.authOpenSourceUser(req, res);
			userId = userEntry.userId;
		}

		return {
			systemInfo: await this.usersService.getUserAndSystemInfo(userId),
		};
	}

	@Get("/users/actions/auth.google")
	async authenticateWithGoogle(@Res() res: any, @QueryParams() params) {
		if (!this.oauth2Client) {
			throw new Error("This functionality is not supported");
		}

		const { inviteCode, inviteType } = params;

		const scopes = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"];

		const state = inviteCode && inviteType ? Buffer.from(JSON.stringify({ inviteCode, inviteType })).toString("base64") : null;
		const url = this.oauth2Client.generateAuthUrl({ scope: scopes, state: state });
		return res.redirect(url);
	}


	@Get("/users/actions/auth.github")
	async authenticateWithGithub(@Res() res: any, @QueryParams() params: any) {
		const { inviteCode, inviteType, sessionInviteCode, lK } = params;
		const url = new URL("https://github.com/login/oauth/authorize");
		url.searchParams.append("client_id", OCTOKIT_CONFIG.clientId);
		let payload: any = {};
		if(inviteCode && inviteType) {
			payload.inviteCode = inviteCode;
			payload.inviteType = inviteType;
		}
		if(lK) {
			payload.lK = lK;
		}
		if(!sessionInviteCode) { throw new Error("sessionInviteCode is requered to signup"); }
		else {
			payload.sessionInviteCode = sessionInviteCode;
		}
		url.searchParams.append("state", `${btoa(JSON.stringify({ type: "auth", ...payload }))}`);
		return res.redirect(url);
	}

	@Post("/users/actions/auth")
	async authUser(@Body() userInfo: Omit<ICreateUserPayload, "name">& { inviteReferral: any, discordInviteCode: any }, @Req() req: any, @Res() res: any) {
		const userDBRecord = await this.usersService.getUserByEmail(userInfo.email);
		if(userDBRecord) {
			if(userDBRecord.password !== encryptPassword(userInfo.password)) return { status: "WRONG_CREDS" };
			
			return {
				status: "LOGGED_IN",
				token: generateToken(userDBRecord.id, userDBRecord.team_id)
			}
		}
		const userEntries = await this.userAuthService.signupUser({...userInfo, name: userInfo.email}, req, res, userInfo.inviteReferral, userInfo.discordInviteCode);

		return {
			status: "SIGNUP_SUCCESS",
			token: generateToken(userEntries.userId, userEntries.teamId)
		};
	}

	@Post("/users/actions/signup")
	async createUser(@Body() userInfo: ICreateUserPayload & { inviteReferral: any, discordInviteCode: any }, @Req() req: any, @Res() res) {
		const userDBRecord = await this.usersService.getUserByEmail(userInfo.email);
		if (userDBRecord) throw new BadRequestError("USER_EMAIL_NOT_AVAILABLE");

		const userEntries = await this.userAuthService.signupUser(userInfo, req, res, userInfo.inviteReferral, userInfo.discordInviteCode);
		// @TODO: Send verification mail
		// EmailManager.sendVerificationMail(userInfo.email, generateVerificationCode(userEntries.userId, userInfo.email));

		return {
			status: "Successful",
			userEntries: userEntries,
			systemInfo: await this.usersService.getUserAndSystemInfo(userEntries.userId),
		};
	}

	@Get("/users/actions/auth.google/callback")
	async googleCallback(@QueryParam("code") code: string, @QueryParams() params, @Req() req: any, @Res() res) {
		const { state: encodedState } = params;
		const { tokens } = await this.oauth2Client.getToken(code);

		this.googleAPIService.setAccessToken(tokens.access_token);
		const profileInfo = await this.googleAPIService.getProfileInfo();

		await this.userAuthService.authUser(
			{
				name: [profileInfo.given_name, profileInfo.family_name].filter((n) => !!n).join(" "),
				email: profileInfo.email,
				password: uuidv4(),
			},
			req,
			res,
			encodedState,
		);

		return res.redirect(resolvePathToFrontendURI("/"));
	}

	@Post("/users/actions/login")
	async loginUser(@Body() body: { email: string; password: string }, @Req() req: any, @Res() res: any) {
		const user = await this.userAuthService.loginWithBasicAuth(body.email, body.password, req, res);

		const systemInfo = await this.usersService.getUserAndSystemInfo(user.id);

		return {
			status: "Successful",
			systemInfo: systemInfo,
		};
	}

	@Post("/users/actions/forgot_password")
	async forgotPassword(@Body() body: { email: string }, @Req() req: any, @Res() res: any) {
		const status = await this.userAuthService.forgotPassword(body.email);
		return {
			status,
		};
	}

	@Post("/users/actions/reset_password")
	async resetPassword(@Body() body: { token: string; password: string }, @Req() req: any, @Res() res: any) {
		const user = await this.userAuthService.resetPassword(body.token, body.password, req, res);
		const systemInfo = await this.usersService.getUserAndSystemInfo(user.id);

		return {
			status: "Successful",
			systemInfo: systemInfo,
		};
	}

	@Get("/users/actions/getUserAndSystemInfo")
	async getUserAndSystemInfo(@CurrentUser() user): Promise<IUserAndSystemInfoResponse> {
		const { user_id } = user;
		return this.usersService.getUserAndSystemInfo(user_id);
	}

	@Authorized()
	@Get("/users/actions/logout")
	async logout(@Req() req: any, @Res() res: any) {
		clearUserAuthorizationCookies(req, res);
	}

	@Authorized()
	@Post("/users/actions/update.meta")
	async updateMeta(@CurrentUser({ required: true }) user, @Body() body: { meta: any }) {
		if (typeof body.meta !== "object") throw new BadRequestError("meta is not JSON compatible");
		const userRecord = await this.usersService.getUserInfo(user.user_id);
		const finalMeta = userRecord.meta ? { ...JSON.parse(userRecord.meta), ...body.meta } : body.meta;

		await this.usersService.updateMeta(JSON.stringify(finalMeta), user.user_id);
		return "Successful";
	}

	@Authorized()
	@Get("/users/invite.link")
	async getUserProjectInviteLink(@CurrentUser({ required: true }) user, @QueryParams() params: { projectId: number }) {
		const { projectId } = params;
		if (!projectId) throw new Error("Invite link to team is not supported yet. Need project_id to work");

		const { team_id } = user;
		const inviteCode = await this.userInviteService.createProjectInviteCode({
			teamId: team_id,
			projectId: projectId,
			expiresOn: null,
			meta: {},
			isPublic: true,
		});

		return this.userInviteService.getInviteLink(inviteCode, InviteReferralEnum.PROJECT);
	}

	@Authorized()
	@Post("/users/actions/invite.project.members")
	async inviteMembersToProject(@CurrentUser({ required: true }) user, @Body() body: { projectId: number; emails: Array<string> }) {
		const userRecord = await this.usersService.getUserInfo(user.user_id);

		const referralCode = await this.userInviteService.createProjectInviteCode({
			teamId: user.team_id,
			projectId: body.projectId,
			emails: body.emails,
			// Expire after one day
			expiresOn: new Date(Date.now() + 1440000),
			isPublic: false,
		});

		await this.userInviteService.sendInvitationsToEmails(body.emails, { code: referralCode, type: InviteReferralEnum.PROJECT }, userRecord.name);

		return "Successful";
	}
}
