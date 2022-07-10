import { Command } from "commander";
import { loadUserInfoOnLoad } from "../utils/hooks";
import { getLoggedInUser } from "../utils/index";
import { isUserLoggedIn } from "../utils/index";
const program = new Command();

program.addHelpText(
  "after",
  `
    Example call:
      $ custom-help --help`
);
program.parse(process.argv);

export default class CommandBase {
  constructor() {}

  async init() {
    const options = program.opts();
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
    const options = program.opts();
    const { token } = options;

    const loggedInUser = getLoggedInUser();
    console.log(`\n${loggedInUser.token}\n`);
  }
}
