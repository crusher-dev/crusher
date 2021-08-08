import { DBManager } from "@modules/db";
import { Inject, Service } from "typedi";
import { ProjectInviteReferrals } from "@modules/resources/users/invite/mongo/userProjectInviteReferrals";
import { TeamInviteReferrals } from "@modules/resources/users/invite/mongo/userTeamInviteReferrals";
import { resolvePathToFrontendURI } from "@utils/uri";
import { ICreateProjectInviteCode, ICreateTeamInviteCode, IInviteReferral, InviteReferralEnum, iProjectInviteReferral, iTeamInviteReferral } from "./interface";
import { EmailManager } from "@modules/email";
import * as ejs from "ejs";
import * as path from "path";

@Service()
class UserInviteService {
	@Inject()
	private dbManager: DBManager;
	@Inject()
	private emailManager: EmailManager;

	getInviteLink(inviteCode: string, inviteType: InviteReferralEnum): string {
		const inviteLinkUrl = new URL(resolvePathToFrontendURI(`/signup`));
		inviteLinkUrl.searchParams.append("inviteType", inviteType);
		inviteLinkUrl.searchParams.append("inviteCode", inviteCode);

		return inviteLinkUrl.toString();
	}

	fetchPublicProjectInviteCode(projectId: number, teamId: number, expiresOn: Date | null) {
		return new Promise((resolve, reject) => {
			ProjectInviteReferrals.findOne(
				{
					projectId: { $eq: projectId },
					isPublic: { $eq: true },
					$or: [{ expiresOn: { $eq: null } }, { expiresOn: { $gt: new Date() } }],
				},
				async (err, referral: iProjectInviteReferral & { id: string }) => {
					if (err) return reject(err);

					let refferalCode = referral?.id;

					if (!refferalCode) {
						refferalCode = await this.createProjectInviteCode({
							teamId: teamId,
							projectId: projectId,
							expiresOn: expiresOn,
							meta: {},
							isPublic: true,
						});
					}

					resolve(this.getInviteLink(refferalCode, InviteReferralEnum.PROJECT));
				},
			);
		});
	}

	createProjectInviteCode(payload: ICreateProjectInviteCode): Promise<string> {
		return new Promise((resolve, reject) => {
			new ProjectInviteReferrals({
				teamId: payload.teamId,
				projectId: payload.projectId,
				expiresOn: payload.expiresOn,
				isPublic: payload.isPublic ? payload.isPublic : false,
				meta: {
					...payload.meta,
					emails: payload.emails,
				},
			}).save((err, referral) => {
				if (err) return reject(err);
				resolve(referral.id);
			});
		});
	}

	createTeamInviteCode(payload: ICreateTeamInviteCode): Promise<string> {
		return new Promise((resolve, reject) => {
			new TeamInviteReferrals({
				teamId: payload.teamId,
				expiresOn: payload.expiresOn,
				meta: {
					...payload.meta,
					emails: payload.emails ? payload.emails : null,
				},
			}).save((err, referral) => {
				if (err) return reject(err);
				resolve(referral.id);
			});
		});
	}

	getTeamInviteCode(code: string): Promise<iTeamInviteReferral> {
		return new Promise((resolve, reject) => {
			TeamInviteReferrals.findById(code, (err, referral) => {
				if (err) return reject(err);
				const referralObject: iTeamInviteReferral = referral.toObject({
					getters: true,
				});

				// @TODO: Look into this. May cause timezone issue
				if (referralObject.expiresOn > new Date()) reject(new Error("The invite code has expired"));
				resolve(referralObject);
			});
		});
	}

	getProjectInviteCode(code: string): Promise<iProjectInviteReferral> {
		return new Promise((resolve, reject) => {
			ProjectInviteReferrals.findById(code, (err, referral) => {
				if (err) return reject(err);
				const referralObject: iProjectInviteReferral = referral.toObject({
					getters: true,
				});

				// @TODO: Look into this. May cause timezone issue
				if (referralObject.expiresOn > new Date()) reject(new Error("The invite code has expired"));
				resolve(referralObject);
			});
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
				path.resolve(__dirname, "./templates/inviteMember.ejs"),
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
