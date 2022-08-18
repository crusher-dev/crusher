import { blue, bold, dim, green, magenta, underline } from "chalk";
import { Command } from "commander";
const program = new Command();
import { getLoggedInUser } from "../utils/index";

program.addHelpText(
  "after",
  `
    Example call:
      $ custom-help --help`
);
program.parse(process.argv);

export default class CommandBase {
  constructor() {

  }

  async init() {
    const options = program.opts();
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
