import { Authorized, Body, CurrentUser, Get, InternalServerError, JsonController, Post, QueryParam, QueryParams, Req, Res } from 'routing-controllers';
import { Container, Inject, Service } from 'typedi';
import DBManager from '../../core/manager/DBManager';
import UserService from '../../core/services/UserService';
import { appendParamsToURI, resolvePathToBackendURI, resolvePathToFrontendURI } from '../../core/utils/uri';
import GoogleAPIService from '../../core/services/GoogleAPIService';
import {
	EMAIL_NOT_VERIFIED,
	EMAIL_VERIFIED_WITH_VERIFICATION_CODE,
	NO_TEAM_JOINED,
	SIGNED_UP_WITHOUT_JOINING_TEAM,
	USER_NOT_REGISTERED,
	USER_REGISTERED,
} from '../../constants';
import TeamService from '../../core/services/TeamService';
import { EmailManager } from '../../core/manager/EmailManager';
import { decodeToken, generateToken, generateVerificationCode } from '../../core/utils/auth';
import ProjectService from '../../core/services/ProjectService';
import { clearUserAuthorizationCookies, setUserAuthorizationCookies } from '../../utils/cookies';
import { Logger } from '../../utils/logger';
import { generateId } from '../../core/utils/helper';

const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	resolvePathToBackendURI('/user/authenticate/google/callback'),
);
@Service()
@JsonController('/user')
export class UserController {
	@Inject()
	private userService: UserService;
	@Inject()
	private googleAPIService: GoogleAPIService;
	@Inject()
	private teamService: TeamService;
	@Inject()
	private projectService: ProjectService;

	/**
	 * Creates new user entry. And sends a link to DB.
	 */
	@Post('/signup')
	async createUser(@Body() userInfo: any, @Res() res) {
		const { firstName, lastName, email, password } = userInfo;
		const { status, userId, token } = await this.userService.registerUser({
			firstName,
			lastName,
			email,
			password,
		});

		if (token) {
			setUserAuthorizationCookies(token, res);

			EmailManager.sendVerificationMail(email, generateVerificationCode(userId, email));
			return { status };
		}
		return { status };
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
	@Post('/login')
	async loginUser(@Body() info: any, @Res() res: any) {
		const { email, password } = info;
		const { status, token } = await this.userService.authenticateWithEmailAndPassword({
			email,
			password,
		});
		if (token) {
			setUserAuthorizationCookies(token, res);
			return { status };
		}
		return { status };
	}

	/**
	 * Endpoint to redirect to login with google.
	 * @param code
	 * @param res
	 */
	@Get('/authenticate/google/callback')
	async googleCallback(@QueryParam('code') code: string, @Res() res) {
		const { tokens } = await oauth2Client.getToken(code);
		const accessToken = tokens.access_token;
		this.googleAPIService.setAccessToken(accessToken);
		const profileInfo = await this.googleAPIService.getProfileInfo();
		const { email, family_name, given_name } = profileInfo as any;

		const userInfo = await this.userService.authenticateWithGoogleProfile({
			email,
			firstName: given_name,
			lastName: family_name,
			password: Date.now() + generateId(10),
		});

		if (userInfo.token) {
			setUserAuthorizationCookies(userInfo.token, res);

			if (userInfo.status === SIGNED_UP_WITHOUT_JOINING_TEAM || userInfo.status === NO_TEAM_JOINED) {
				res.redirect(
					appendParamsToURI(resolvePathToFrontendURI('/app/dashboard'), {
						status: userInfo.status,
					}),
				);
			} else {
				res.redirect(
					appendParamsToURI(resolvePathToFrontendURI('/app/dashboard'), {
						status: userInfo.status,
					}),
				);
			}
		} else {
			res.redirect(
				appendParamsToURI(resolvePathToFrontendURI('/'), {
					status: userInfo.status,
				}),
			);
		}
	}

	/**
	 * Redirect user to new url
	 */
	@Get('/authenticate/google')
	authenticateWithGoogle(@Res() res: any) {
		const scopes = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];
		const url = oauth2Client.generateAuthUrl({ scope: scopes });
		res.redirect(url);
	}

	@Get('/getStatus')
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

				return { status: user_id ? USER_REGISTERED : USER_NOT_REGISTERED, user_meta: userMeta };
			})
			.catch((err) => {
				return { status: USER_NOT_REGISTERED };
			});
	}

	@Post('/user/get_plans')
	async getPricingPlans(@CurrentUser({ required: false }) user, @Body() body) {
		const { user_id } = user;
		const metaArray = body;
		if (!user_id) {
			return { status: USER_NOT_REGISTERED };
		}

		return this.userService
			.addUserMeta(metaArray, user_id)
			.then(async () => {
				return { status: 'success' };
			})
			.catch((err) => {
				return new InternalServerError('Some internal error occurred');
			});
	}

	@Post('/user/start_trial')
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
				return { status: 'success' };
			})
			.catch((err) => {
				return new InternalServerError('Some internal error occurred');
			});
	}

	@Post('/meta/add')
	async addUserMeta(@CurrentUser({ required: false }) user, @Body() body) {
		const { user_id } = user;
		const metaArray = body;
		if (!user_id) {
			return { status: USER_NOT_REGISTERED };
		}

		return this.userService
			.addUserMeta(metaArray, user_id)
			.then(async () => {
				return { status: 'success' };
			})
			.catch((err) => {
				return new InternalServerError('Some internal error occured');
			});
	}

	@Authorized()
	@Get('/info')
	async getUserInfo(@CurrentUser({ required: true }) user, @Res() res) {
		const { user_id } = user;
		return this.userService.getUserInfo(user_id);
	}

	/**
	 * Check for does user already exist
	 * If not, then create user with verified tag, generate jwt and store it in session
	 * @param user
	 * @param params
	 * @param res
	 */
	@Authorized()
	@Get('/verify')
	async verify(@CurrentUser({ required: true }) user, @QueryParams() params, @Res() res) {
		const { code } = params;
		const { user_id } = decodeToken(code);
		if (user_id === user.user_id) {
			await this.userService.verify(user_id);
			res.redirect(resolvePathToFrontendURI('/'));
			return { status: EMAIL_VERIFIED_WITH_VERIFICATION_CODE };
		}

		res.redirect(resolvePathToFrontendURI('/verification'));
	}

	/**
	 * Check for does user already exist
	 * If not, then create user with verified tag, generate jwt and store it in session
	 * @param user
	 */
	@Authorized()
	@Post('/resendVerification')
	async resendVerificationLink(@CurrentUser({ required: true }) user) {
		return this.userService.resendVerification(user.user_id);
	}

	@Authorized()
	@Get('/refreshToken')
	async refreshToken(@CurrentUser({ required: true }) user, @Res() res) {
		const { user_id } = user;
		return this.userService
			.getUserInfo(user_id)
			.then((user) => {
				const token = generateToken(user.id, user.team_id);
				setUserAuthorizationCookies(token, res);
				return { status: 'REFRESHED', token: token };
			})
			.catch((err) => {
				Logger.error('UserController::refreshToken', '401 Bad request', { err });
				return { status: 'REFRESHED_TOKEN_FAILED' };
			});
	}

	@Get('/logout')
	async logout(@Req() req, @Res() res) {
		clearUserAuthorizationCookies(res);
		res.redirect(resolvePathToFrontendURI('/'));
	}
}
