import { Inject, Service } from "typedi";
import { Body, Get, JsonController, Post, QueryParam, QueryParams, Res, Req } from "routing-controllers";
import { iSignupUserRequest } from "../../../../../crusher-shared/types/request/signupUserRequest";
import { EmailManager } from "../../../core/manager/EmailManager";
import { decodeToken, encryptPassword, generateToken, generateVerificationCode } from "../../../core/utils/auth";
import { UserV2Service } from "../../../core/services/v2/UserV2Service";
import { USER_REGISTERED } from "../../../constants";
import { resolvePathToBackendURI, resolvePathToFrontendURI } from "../../../core/utils/uri";
import { google } from "googleapis";
import GoogleAPIService from "../../../core/services/GoogleAPIService";
import { InviteMembersService } from "../../../core/services/mongo/inviteMembers";
import { getEdition } from "../../../utils/helper";
import { clearUserAuthorizationCookies, setUserAuthorizationCookies } from "../../../utils/cookies";
import { EDITION_TYPE } from "@crusher-shared/types/common/general";
import { iUser } from "@crusher-shared/types/db/iUser";
const cookie = require("cookie");
const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	resolvePathToBackendURI("/v2/user/authenticate/google/callback"),
);

@Service()
@JsonController(`/v2/user`)
export class UserControllerV2 {
	@Inject()
	private userService: UserV2Service;
	@Inject()
	private googleAPIService: GoogleAPIService;
	@Inject()
	private inviteMembersService: InviteMembersService;

	@Get("/init")
	initUser(@Req() req: any, @Res() res: any): Promise<boolean> {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve, reject) => {
			try {
				if (getEdition() === EDITION_TYPE.OPEN_SOURCE) {
					const { token } = cookie.parse(req.headers.cookie || "");
					if (token && decodeToken(token)) {
						res.redirect(resolvePathToFrontendURI("/"));
						return resolve(res);
					}

					let user: iUser = await this.userService.getOpenSourceUser();
					if (!user) {
						user = await this.userService.createOpenSourceUser();
					}

					const generatedToken = generateToken(user.id, user.team_id);
					clearUserAuthorizationCookies(res);
					setUserAuthorizationCookies(generatedToken, res);
				}
				res.redirect(resolvePathToFrontendURI("/"));
				resolve(res);
			} catch (err) {
				reject(err);
			}
		});
	}
	/**
	 * Redirect user to new url
	 */
	@Get("/authenticate/google")
	authenticateWithGoogle(@Res() res: any, @QueryParams() params) {
		const { inviteCode, inviteType } = params;

		const scopes = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"];

		const state = inviteCode && inviteType ? Buffer.from(JSON.stringify({ inviteCode, inviteType })).toString("base64") : null;
		const url = oauth2Client.generateAuthUrl({ scope: scopes, state: state });
		res.redirect(url);
	}
	/**
	 * Creates new user entry. And sends a link to DB.
	 */
	@Post("/signup")
	async createUser(@Body() userInfo: iSignupUserRequest, @Res() res) {
		const { firstName, lastName, email, password, inviteReferral } = userInfo;

		const userId = await this.userService.createUserRecord(userInfo, false);
		const { teamId } = inviteReferral
			? await this.userService.useReferral(userId, inviteReferral)
			: await this.userService.createInitialUserWorkspace(userId, userInfo);

		const token = await this.userService.setUserAuthCookies(userId, teamId, res);

		EmailManager.sendVerificationMail(email, generateVerificationCode(userId, email));
		return { status: USER_REGISTERED, token };
	}

	/**
	 * Endpoint to redirect to login with google.
	 * @param code
	 * @param res
	 */
	@Get("/authenticate/google/callback")
	async googleCallback(@QueryParam("code") code: string, @QueryParam("state") encodedState, @Res() res) {
		const { tokens } = await oauth2Client.getToken(code);
		const accessToken = tokens.access_token;
		let inviteCode, inviteType;
		try {
			const jsonStr = Buffer.from(encodedState, "base64").toString("hex");
			const state = JSON.parse(jsonStr);
			inviteCode = state.inviteCode;
			inviteType = state.inviteType;
		} catch (err) {}

		this.googleAPIService.setAccessToken(accessToken);
		const profileInfo = await this.googleAPIService.getProfileInfo();
		const { email, family_name, given_name } = profileInfo as any;

		const user = await this.userService.getUserByEmail(email);
		let userId = user ? user.id : null;
		let teamId = user ? user.team_id : null;

		if (!user) {
			const inviteReferral = inviteType && inviteCode ? { type: inviteType, code: inviteCode } : null;

			const signUpUserInfo = {
				firstName: given_name,
				lastName: family_name,
				email: email,
				password: encryptPassword(Date.now().toString()),
				inviteReferral: inviteReferral,
			};
			userId = await this.userService.createUserRecord(signUpUserInfo, true);

			const { teamId: _teamId } = inviteReferral
				? await this.userService.useReferral(userId, inviteReferral)
				: await this.userService.createInitialUserWorkspace(userId, signUpUserInfo);
			teamId = _teamId;
		}

		const token = await this.userService.setUserAuthCookies(userId, teamId, res);
		res.redirect(resolvePathToFrontendURI("/"));
		return true;
	}
}
