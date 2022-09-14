import { Command } from "commander";
import { loadUserInfoOnLoad } from "../utils/hooks";
import { getLoggedInUser } from "../utils/index";
import { isUserLoggedIn } from "../utils/index";
import { askUserLogin } from "../utils/setup";

export default class CommandBase {
	program: Command;
	constructor() {
		this.program = new Command();

		this.program.addHelpText(
			'after',
			`
        Example call:
          $ custom-help --help`,
		);
		this.program.parse(process.argv);
	}

	async init() {
		const options = this.program.opts();
		const { help, version } = options;
		if (help === true) {
			await this.help();
			return;
		}

		await this.run();
	}

	help() {
		console.log(`Log in as a user.`);
	}

	async run() {
		const options = this.program.opts();
		const { token } = options;

		const loggedIn = isUserLoggedIn();
		if (!loggedIn) {
			if (!token)
				await askUserLogin();
			await loadUserInfoOnLoad({ token });
		} else {
			const loggedInUser = getLoggedInUser();
			console.log(
				`You're already logged in from ${loggedInUser.email}.\nTo login from different account, run crusher-cli logout and then crusher-cli login.`
			);
		}
	}
}
