import { bold, magenta } from 'chalk';
import { Command } from 'commander';
import { getLoggedInUser } from '../utils/index';

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

	async help() {
		console.log(`Logs user out from this machine`);
	}

	async run() {
		const userAccount = getLoggedInUser();
		console.log(bold(`📟  info\n`));

		console.log(`   team:     ${magenta(userAccount.teamName)}`);
		console.log(`   user:     ${magenta(userAccount.name)}`);
		console.log(`   email:    ${magenta(userAccount.email)}\n`);
	}
}
