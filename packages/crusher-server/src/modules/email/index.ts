
import * as sgMail from "@sendgrid/mail";
import { MailService } from "@sendgrid/mail";
import { Service } from "typedi";

@Service()
export class EmailManager {
	emailClient: MailService | null;

	constructor() {
		if (!process.env.SENDGRID_API_KEY) {
			console.error("No Sendgrid API key available, email functionality won't work");
			return;
		}

		this.emailClient = sgMail;
		this.emailClient.setApiKey(process.env.SENDGRID_API_KEY);
	}

	async sendEmail(to: string, subject: string, html: string) {
		if (!this.emailClient) throw new Error("No email client available to send emails...");

		return this.emailClient.send({
			to: to,
			from: {
				name: "Crusher",
				email: "utkarsh@crusher.dev",
			},
			subject: subject,
			html: html,
		});
	}
}
