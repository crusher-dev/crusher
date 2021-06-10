import { emailType } from "../../constants";
import { iInviteReferral } from "../../../../crusher-shared/types/inviteReferral";

export class EmailManager {
	public static sendEmailToUsers(users, subject, html) {
		console.info("Email Manager is disabled");
	}

	public static sendEmail(to, from: emailType, subject, html) {
		console.info("Email Manager is disabled");
	}

	public static sendVerificationMail(to, code) {
		console.info("Email Manager is disabled");
	}

	public static sendInvitations(members: Array<string>, inviteReferral: iInviteReferral, metaInfo: { orgName: string; adminName: string }) {
		console.info("Email Manager is disabled");
	}
}
