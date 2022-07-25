import { DBManager } from "@modules/db";
import { Inject, Service } from "typedi";
import { resolvePathToFrontendURI } from "@utils/uri";
import { ICreateProjectInviteCode, ICreateTeamInviteCode, IInviteReferral, InviteReferralEnum, iProjectInviteReferral, iTeamInviteReferral } from "./interface";
import { EmailManager } from "@modules/email";
import * as ejs from "ejs";
import * as path from "path";
import { MyDecorator } from "@modules/decorators/camelizeResponse";
import { RedisManager } from "@modules/redis";
import { v4 as uuidv4 } from "uuid";

@Service()
class UserInviteService {
	@Inject()
	private dbManager: DBManager;
	@Inject()
	private emailManager: EmailManager;
	@Inject()
	private redisManager: RedisManager;

	getInviteLink(inviteCode: string, inviteType: InviteReferralEnum): string {
		const inviteLinkUrl = new URL(resolvePathToFrontendURI(`/signup`));
		inviteLinkUrl.searchParams.append("inviteType", inviteType);
		inviteLinkUrl.searchParams.append("inviteCode", inviteCode);

		return inviteLinkUrl.toString();
	}

	async createProjectInviteCode(payload: ICreateProjectInviteCode): Promise<string> {
		const inviteCode = `${payload.teamId}${payload.projectId}${uuidv4()}`;
		await this.redisManager.set(
			inviteCode,
			JSON.stringify({
				teamId: payload.teamId,
				projectId: payload.projectId,
				expiresOn: payload.expiresOn,
				isPublic: payload.isPublic ? payload.isPublic : false,
				meta: {
					...payload.meta,
					emails: payload.emails,
				},
			}),
			{ expiry: { type: "s", value: 48 * 60 * 60 } },
		);

		return inviteCode;
	}

	async createTeamInviteCode(payload: ICreateTeamInviteCode): Promise<string> {
		const inviteCode = `${payload.teamId}${uuidv4()}`;

		await this.redisManager.set(
			inviteCode,
			JSON.stringify({
				teamId: payload.teamId,
				expiresOn: payload.expiresOn,
				meta: {
					...payload.meta,
					emails: payload.emails ? payload.emails : null,
				},
			}),
			{ expiry: { type: "s", value: 48 * 60 * 60 } },
		);

		return inviteCode;
	}

	getTeamInviteCode(code: string): Promise<iTeamInviteReferral> {
		return new Promise((resolve, reject) => {
			this.redisManager
				.get(code)
				.then((res) => {
					const referralObject: iTeamInviteReferral = JSON.parse(res);
					// @TODO: Look into this. May cause timezone issue
					if (referralObject.expiresOn > new Date()) reject(new Error("The invite code has expired"));
					resolve(referralObject);
				})
				.catch((err) => reject(err));
		});
	}

	getProjectInviteCode(code: string): Promise<iProjectInviteReferral> {
		return new Promise((resolve, reject) => {
			this.redisManager
				.get(code)
				.then((res) => {
					const referralObject: iProjectInviteReferral = JSON.parse(res);
					// @TODO: Look into this. May cause timezone issue
					if (referralObject.expiresOn > new Date()) reject(new Error("The invite code has expired"));
					resolve(referralObject);
				})
				.catch((err) => reject(err));
		});
	}

	async parseInviteReferral(referralInfo: IInviteReferral): Promise<iProjectInviteReferral | iTeamInviteReferral> {
		if (referralInfo.type === InviteReferralEnum.PROJECT) {
			return this.getProjectInviteCode(referralInfo.code);
		} else {
			return this.getTeamInviteCode(referralInfo.code);
		}
	}

	async sendInvitationsToEmails(emails: Array<string>, inviteReferral: { code: string; type: InviteReferralEnum }, adminName: string) {
		return new Promise((resolve, reject) => {
			ejs.renderFile(
				path.join(
					__dirname,
					//@ts-ignore
					typeof __non_webpack_require__ !== "undefined" ? "email/templates/inviteMember.ejs" : "/../../email/templates/inviteMember.ejs",
				),
				{
					invite_link: this.getInviteLink(inviteReferral.code, inviteReferral.type),
					org_name: `${adminName}'s workspace`,
					invited_by: adminName,
				},
				async (err, html) => {
					if (err) return reject("Can't load the invite member template");
					const emailPromises = emails.map((email: string) => {
						return this.emailManager.sendEmail(email, `[Crusher.dev] Invitation for ${adminName}'s workspace`, html);
					});
					await Promise.all(emailPromises);
					resolve(true);
				},
			);
		});
	}
}

export { UserInviteService };
