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

	async setUserAuthCookies(userId: number, teamId: number, req: any, res: any): Promise<string> {
		const USER_DOMAIN = req.get("host") ? req.get("host") : "";
		const IS_LOALHOST = USER_DOMAIN.startsWith("localhost") || USER_DOMAIN.startsWith("127.0.0.1");

		const token = generateToken(userId, teamId);

		setUserCookie({ key: "token", value: token }, { httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000, domain: IS_LOALHOST ? "" : USER_DOMAIN }, res);
		setUserCookie({ key: "isLoggedIn", value: true }, { domain: IS_LOALHOST ? "" : USER_DOMAIN, maxAge: 365 * 24 * 60 * 60 * 1000 }, res);

		// // @TODO: Move this logic somewhere else (For gitpod)
		// setUserCookie({ key: "token", value: token }, { httpOnly: true, domain: ".gitpod.io" }, res);
		// setUserCookie({ key: "isLoggedIn", value: true }, { domain: ".gitpod.io" }, res);

		return token;
	}

	@CamelizeResponse()
	async loginWithBasicAuth(email: string, password: string, req: any, res: any): Promise<KeysToCamelCase<IUserTable>> {
		const user = await this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE email = ? AND password= ?`, [email, encryptPassword(password)]);

		if (!user) {
			throw new BadRequestError("INVALID_CREDENTIALS");
		}

		await this.setUserAuthCookies(user.id, user.team_id, req, res);

		return user;
	}

	async signupUser(
		user: Omit<ICreateUserPayload, "uuid">,
		req: any,
		res: any,
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

		await this.setUserAuthCookies(userRecordEntries.userId, userRecordEntries.teamId, req, res);

		return userRecordEntries;
	}

	// If the user is registered, login otherwise register the user
	async authWithGoogle(userPayload: Omit<ICreateUserPayload, "uuid">, req: any, res: any, encodedInviteCode: string = null) {
		const user = await this.usersService.getUserByEmail(userPayload.email);

		let inviteReferral: IInviteReferral = null;
		if (encodedInviteCode) {
			const inviteReferralCode = JSON.parse(Buffer.from(encodedInviteCode, "base64").toString("hex"));
			inviteReferral = {
				type: inviteReferralCode.inviteType,
				code: inviteReferralCode.inviteCode,
			};
		}

		if (!user) return this.signupUser(userPayload, req, res, inviteReferral);

		// Login the user
		await this.setUserAuthCookies(user.id, user.team_id, req, res);
		return true;
	}

	async authOpenSourceUser(req: any, res: Response): Promise<{ userId: number; teamId: number }> {
		const user = await this.usersService.getOpenSourceUser();
		if (!user) {
			return this.signupUser(
				{
					name: "Open Source",
					email: "open@source.com",
					password: "opensource",
				},
				req,
				res,
			);
		}

		await this.setUserAuthCookies(user.id, user.teamId, req, res);
		return { userId: user.id, teamId: user.teamId };
	}
}

export { UserAuthService };
