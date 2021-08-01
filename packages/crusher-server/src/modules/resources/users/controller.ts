import { Authorized, Body, CurrentUser, Get, InternalServerError, JsonController, OnNull, Post, QueryParam, QueryParams, Req, Res } from "routing-controllers";
import { Inject, Service } from "typedi";
import { UserService } from "@modules/resources/users/service";
import { resolvePathToBackendURI, resolvePathToFrontendURI } from "@utils/uri";
import GoogleAPIService from "@core/services/GoogleAPIService";
import { EMAIL_VERIFIED_WITH_VERIFICATION_CODE, NO_TEAM_JOINED, USER_NOT_REGISTERED, USER_REGISTERED } from "@constants";
import { clearUserAuthorizationCookies, setUserAuthorizationCookies } from "@utils/cookies";
import { Logger } from "@utils/logger";
import { iUserInfoResponse } from "@crusher-shared/types/response/userInfoResponse";
import { getEdition } from "@utils/helper";
import { EDITION_TYPE } from "@crusher-shared/types/common/general";
import { iUser } from "@crusher-shared/types/db/iUser";
import { EmailManager } from "@manager/EmailManager";
import { decodeToken, encryptPassword, generateToken, generateVerificationCode } from "@utils/auth";
import { google } from "googleapis";
import { iSignupUserRequest } from "@crusher-shared/types/request/signupUserRequest";
import { IUserAndSystemInfoResponse } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";
import * as cookie from "cookie";

let oauth2Client = null;

if (process.env.BACKEND_URL) {
	oauth2Client = new google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		resolvePathToBackendURI("/v2/user/authenticate/google/callback"),
	);
}
@Service()
@JsonController("/user")
export class UserController {
	@Inject()
	private userService: UserService;
	@Inject()
	private googleAPIService: GoogleAPIService;

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
	async authenticateWithGoogle(@Res() res: any, @QueryParams() params) {
		if (!oauth2Client) {
			throw new Error("This functionality is not supported");
		}

		const { inviteCode, inviteType } = params;

		const scopes = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"];

		const state = inviteCode && inviteType ? Buffer.from(JSON.stringify({ inviteCode, inviteType })).toString("base64") : null;
		const url = oauth2Client.generateAuthUrl({ scope: scopes, state: state });
		return res.redirect(url);
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
		const systemInfo = await this.userService.getUserAndSystemInfo(userId);

		EmailManager.sendVerificationMail(email, generateVerificationCode(userId, email));
		return {
			status: USER_REGISTERED,
			token,
			systemInfo,
		};
	}

	/**
	 * Endpoint to redirect to login with google.
	 * @param code
	 * @param res
	 */
	@Get("/authenticate/google/callback")
	async googleCallback(@QueryParam("code") code: string, @QueryParam("state") encodedState, @Res() res) {
		if (!oauth2Client) {
			throw new Error("This functionality is not supported");
		}

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

	/**
	 * Tries to login user
	 *  | If successful, generate jwt and store it in session
	 * 	| Else
	 * 	  | If Not verified, throw error for validation and send link to user.
	 * 	  | Throw 401
	 * @param info
	 * @param res
	 */
	@Post("/login")
	async loginUser(@Body() info: any, @Res() res: any) {
		const { email, password } = info;
		const { status, token, userId } = await this.userService.authenticateWithEmailAndPassword({
			email,
			password,
		});

		const systemInfo = await this.userService.getUserAndSystemInfo(userId);

		if (token) {
			setUserAuthorizationCookies(token, res);
			return {
				status,
				systemInfo,
			};
		}
		return { status, systemInfo };
	}

	@Get("/getUserAndSystemInfo")
	async getUserAndSystemInfo(@CurrentUser() user): Promise<IUserAndSystemInfoResponse> {
		const { user_id } = user;

		return this.userService.getUserAndSystemInfo(user_id);
	}

	@Get("/getStatus")
	async getStatus(@CurrentUser({ required: false }) user, @Res() res) {
		const { user_id } = user;
		if (!user_id) {
			return { status: USER_NOT_REGISTERED, data: user };
		}

		return this.userService
			.getUserInfo(user_id)
			.then(async (info) => {
				const { id: user_id, team_id } = info;
				if (user_id && !team_id) {
					return { status: NO_TEAM_JOINED };
				}

				const userMeta = await this.userService.getUserMetaInfo(String(user_id));

				return {
					status: user_id ? USER_REGISTERED : USER_NOT_REGISTERED,
					user_meta: userMeta,
				};
			})
			.catch((err) => {
				return { status: USER_NOT_REGISTERED };
			});
	}

	@Post("/user/get_plans")
	async getPricingPlans(@CurrentUser({ required: false }) user, @Body() body) {
		const { user_id } = user;
		const metaArray = body;
		if (!user_id) {
			return { status: USER_NOT_REGISTERED };
		}

		return this.userService
			.addUserMeta(metaArray, user_id)
			.then(async () => {
				return { status: "success" };
			})
			.catch((err) => {
				return new InternalServerError("Some internal error occurred");
			});
	}

	@Post("/user/start_trial")
	async startUserTrial(@CurrentUser({ required: false }) user, @Body() body) {
		const { user_id } = user;

		// Update stripe

		// Start team_pricing_log

		const metaArray = body;
		if (!user_id) {
			return { status: USER_NOT_REGISTERED };
		}

		return this.userService
			.addUserMeta(metaArray, user_id)
			.then(async () => {
				return { status: "success" };
			})
			.catch((err) => {
				return new InternalServerError("Some internal error occurred");
			});
	}

	@Authorized()
	@Post("/meta/add")
	async addUserMeta(@CurrentUser({ required: true }) user, @Body() body) {
		const { user_id } = user;
		const metaArray = body;

		return this.userService
			.addUserMeta(metaArray, user_id)
			.then(async () => {
				return { status: "success" };
			})
			.catch((err) => {
				return new InternalServerError("Some internal error occurred");
			});
	}

	@Authorized()
	@OnNull(500)
	@Get("/info")
	async getUserInfo(@CurrentUser({ required: true }) user, @Req() req, @Res() res): Promise<iUserInfoResponse | any> {
		const { user_id } = user;
		const info = await this.userService.getUserInfo(user_id);
		if (info) {
			const userMeta = await this.userService.getUserMetaInfo(String(user_id));

			return {
				...info,
				name: info.first_name + " " + info.last_name,
				user_meta: userMeta,
			};
		}
		return null;
	}

	/**
	 * Check for does user already exist
	 * If not, then create user with verified tag, generate jwt and store it in session
	 * @param user
	 * @param params
	 * @param res
	 */
	@Authorized()
	@Get("/verify")
	async verify(@CurrentUser({ required: true }) user, @QueryParams() params, @Res() res) {
		const { code } = params;
		const { user_id } = decodeToken(code);
		if (user_id === user.user_id) {
			await this.userService.verify(user_id);
			res.redirect(resolvePathToFrontendURI("/"));
			return { status: EMAIL_VERIFIED_WITH_VERIFICATION_CODE };
		}

		res.redirect(resolvePathToFrontendURI("/"));
	}

	/**
	 * Check for does user already exist
	 * If not, then create user with verified tag, generate jwt and store it in session
	 * @param user
	 */
	@Authorized()
	@Post("/resendVerification")
	async resendVerificationLink(@CurrentUser({ required: true }) user) {
		return this.userService.resendVerification(user.user_id);
	}

	@Authorized()
	@Get("/refreshToken")
	async refreshToken(@CurrentUser({ required: true }) user, @Res() res) {
		const { user_id } = user;
		return this.userService
			.getUserInfo(user_id)
			.then((user) => {
				const token = generateToken(user.id, user.team_id);
				setUserAuthorizationCookies(token, res);
				return { status: "REFRESHED", token: token };
			})
			.catch((err) => {
				Logger.error("UserController::refreshToken", "401 Bad request", { err });
				return { status: "REFRESHED_TOKEN_FAILED" };
			});
	}

	@Get("/logout")
	async logout(@Req() req, @Res() res) {
		clearUserAuthorizationCookies(res);
		res.redirect(resolvePathToFrontendURI("/"));
	}
}
