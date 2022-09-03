import { blue, bold, dim, green, magenta, underline } from "chalk";
import { Command } from "commander";
import { getLoggedInUser } from "../utils/index";



export default class CommandBase {
  program: Command;

  constructor() {
    this.program = new Command();

    this.program.addHelpText(
      "after",
      `
        Example call:
          $ custom-help --help`
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
    console.log(bold(magenta(`📟  Account Info\n`)));

    console.log(`  Team:     ${blue(userAccount.teamName)}`);
    console.log(`  User:     ${blue(userAccount.name)}`);
    console.log(`  Email:    ${green(userAccount.email)}\n`);
  }
}
