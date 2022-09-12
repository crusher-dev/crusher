import chalk from 'chalk';
import { Command } from 'commander';
import { loadUserInfoOnLoad } from '../utils/hooks';
import { getLoggedInUser, isUserLoggedIn } from '../utils/index';

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
			await loadUserInfoOnLoad({ token });
		} else {
			const loggedInUser = getLoggedInUser();
			console.log(
				`already logged in with ${chalk.cyan.bold(loggedInUser.email)}.\nuse another account, run ${chalk.magenta('logout')} and then ${chalk.magenta(
					'login',
				)}\n`,
			);
		}
	}
}
