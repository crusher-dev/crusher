import { encryptPassword, generateToken } from "@utils/auth";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { setUserCookie } from "@utils/cookies";
import { extractHostname } from "@utils/url";
import { BadRequestError, State } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ICreateUserPayload, IUserTable } from "./interface";
import { IInviteReferral } from "./invite/interface";
import { UserInviteService } from "./invite/service";
import { UsersService } from "./service";

@Service()
class UserAuthService {
	@Inject()
	private dbManager: DBManager;
	@Inject()
	private usersService: UsersService;
	@Inject()
	private userInviteService: UserInviteService;

	async setUserAuthCookies(userId: number, teamId: number, res: any): Promise<string> {
		const USER_DOMAIN = "";
		const token = generateToken(userId, teamId);

		setUserCookie({ key: "token", value: token }, { httpOnly: true, domain: USER_DOMAIN }, res);
		setUserCookie({ key: "isLoggedIn", value: true }, { domain: USER_DOMAIN }, res);

		// // @TODO: Move this logic somewhere else (For gitpod)
		// setUserCookie({ key: "token", value: token }, { httpOnly: true, domain: ".gitpod.io" }, res);
		// setUserCookie({ key: "isLoggedIn", value: true }, { domain: ".gitpod.io" }, res);

		return token;
	}

	@CamelizeResponse()
	async loginWithBasicAuth(email: string, password: string, res: any): Promise<KeysToCamelCase<IUserTable>> {
		const user = await this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE email = ? AND password= ?`, [email, encryptPassword(password)]);

		if (!user) {
			throw new BadRequestError("INVALID_CREDENTIALS");
		}

		await this.setUserAuthCookies(user.id, user.team_id, res);

		return user;
	}

	async signupUser(
		user: ICreateUserPayload,
		res: Response,
		inviteReferral: IInviteReferral = null,
	): Promise<{ userId: number; projectId: number; teamId: number }> {
		const referralObject = inviteReferral ? await this.userInviteService.parseInviteReferral(inviteReferral) : null;

		const userRecord = await this.usersService.createUserRecord({
			name: user.name,
			email: user.email,
			password: user.password,
		});
		const userRecordEntries = await this.usersService.setupInitialUserWorkspace({
			id: userRecord.insertId,
			name: user.name,
			email: user.email,
			teamId: referralObject ? referralObject.teamId : null,
			projectId: referralObject ? (referralObject as any).projectId : null,
		});

		await this.setUserAuthCookies(userRecordEntries.userId, userRecordEntries.teamId, res);

		return userRecordEntries;
	}

	// If the user is registered, login otherwise register the user
	async authWithGoogle(userPayload: ICreateUserPayload, res: Response, encodedInviteCode: string = null) {
		const user = await this.usersService.getUserByEmail(userPayload.email);

		let inviteReferral: IInviteReferral = null;
		if (encodedInviteCode) {
			const inviteReferralCode = JSON.parse(Buffer.from(encodedInviteCode, "base64").toString("hex"));
			inviteReferral = {
				type: inviteReferralCode.inviteType,
				code: inviteReferralCode.inviteCode,
			};
		}

		if (!user) return this.signupUser(user, res, inviteReferral);

		// Login the user
		await this.setUserAuthCookies(user.id, user.team_id, res);
		return true;
	}

	async authOpenSourceUser(res: Response): Promise<{ userId: number; teamId: number }> {
		const user = await this.usersService.getOpenSourceUser();
		if (!user) {
			return this.signupUser(
				{
					name: "Open Source",
					email: "open@source.com",
					password: "opensource",
				},
				res,
			);
		}

		await this.setUserAuthCookies(user.id, user.teamId, res);
		return { userId: user.id, teamId: user.teamId };
	}
}

export { UserAuthService };
