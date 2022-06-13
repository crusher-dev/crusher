import { resolvePathToBackendURI, resolvePathToFrontendURI } from "@utils/uri";
import { emailType } from "@constants";
import * as sgMail from "@sendgrid/mail";
import * as ejs from "ejs";
import { iInviteReferral } from "@crusher-shared/types/inviteReferral";

const getWelcomEmailContent = (...args) => {
	return "Nothing";
};

if (!process.env.SENDGRID_API_KEY) {
	console.error("PLEASE PROVIDE SEND_GRID_API Key, otherwise the email verification functionality won't work");
} else {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const serverEmailInfo = {
	name: "Crusher",
	email: "welcome@crusher.dev",
};

export class EmailManager {
	public static sendEmailToUsers(users, subject, html) {
		users.map((user) => {
			if (user.email) {
				this.sendEmail(user.email, serverEmailInfo, subject, html);
			}
		});
	}

	public static sendEmail(to, from: emailType, subject, html) {
		const { email: serverEmail, name: serverName } = from;

		const msg = {
			to: to,
			from: {
				email: serverEmail,
				name: serverName,
			},
			subject,
			html: html,
		};
		sgMail.send(msg);
		console.info("EmailManager::sendEmail", `Email Sent... [Verification] - to ${to}`);
	}

	public static sendVerificationMail(to, code) {
		const link = resolvePathToBackendURI(`/user/verify?code=${code}`);
		const emailHTML = getWelcomEmailContent(link);
		EmailManager.sendEmail(to, serverEmailInfo, "[Crusher.dev] Verify your account", emailHTML);
	}

	public static sendInvitations(members: Array<string>, inviteReferral: iInviteReferral, metaInfo: { orgName: string; adminName: string }) {
		const { orgName, adminName } = metaInfo;
		return new Promise((resolve, reject) => {
			const inviteLinkUrl = new URL(resolvePathToFrontendURI(`/get-started`));
			inviteLinkUrl.searchParams.append("inviteType", inviteReferral.type);
			inviteLinkUrl.searchParams.append("inviteCode", inviteReferral.code);

			ejs.renderFile(
				typeof __non_webpack_require__ !== "undefined" ? "/email/templates/inviteMember.ejs" : "/../../email/templates/inviteMember.ejs",
				{
					invite_link: inviteLinkUrl.toString(),
					org_name: `${adminName}'s workspace`,
					invited_by: adminName,
				},
				(err, str) => {
					if (err) return reject("Can't load the invite member template");
					for (let i = 0; i < members.length; i++) {
						console.log("Sending mail to: ", members[i]);
						this.sendEmail(members[i], serverEmailInfo, `[Crusher.dev] Invitation for ${adminName}'s workspace`, str);
					}
					resolve(true);
				},
			);
		});
	}
}
