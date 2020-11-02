import { resolvePathToBackendURI } from '../utils/uri';
import { emailType, VERIFICATION_TYPE_EMAIL } from '../../constants';
import { getWelcomEmailContent } from '../template/email/welcome';
import { Logger } from '../../utils/logger';
const sgMail = require('@sendgrid/mail');
if (!process.env.SENDGRID_API_KEY) {
	console.error("PLEASE PROVIDE SEND_GRID_API Key, otherwise the email verification functionality won't work");
} else {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export class EmailManager {
	public static sendEmailToUsers(users, subject, html) {
		users.map((user) => {
			if (user.email) {
				this.sendEmail(user.email, VERIFICATION_TYPE_EMAIL, subject, html);
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
			text: 'hoo',
			html: html,
		};
		sgMail.send(msg);
		Logger.info('EmailManager::sendEmail', `Email Sent... [Verification] - to ${to}`);
	}

	public static sendVerificationMail(to, code) {
		const link = resolvePathToBackendURI(`/user/verify?code=${code}`);
		const emailHTML = getWelcomEmailContent(link);
		EmailManager.sendEmail(to, VERIFICATION_TYPE_EMAIL, '[Crusher.dev] Verify your account', emailHTML);
	}
}
