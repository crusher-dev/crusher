import { Command } from "commander";
import inquirer from 'inquirer';
import { getProjectConfig } from "../utils/projectConfig";
import { getInviteLink, inviteProjectMembers } from "../utils/apiUtils";
import ora from 'ora';

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

  help() {
    console.log(`Logs user out from this machine`);
  }

  async init() {
    const options = this.program.opts();
    const { help } = options;
    if (help === true) {
      await this.help();
      return;
    }
  }

  async run(): Promise<any> {
    this.init();
    const projectConfig = getProjectConfig();

    if (!projectConfig || !projectConfig.project) {
      throw new Error(
        "Crusher not initialized in this project. Run `crusher-cli init` to fix this."
      );
    }
    const res = await inquirer.prompt([
      {
        name: "method",
        message: "Choose a method:",
        type: "list",
        choices: [
          { name: "Invite via email", value: 0 },
          { name: "Invite via link", value: 1 },
        ],
        default: 1,
      },
    ]);
    console.log("\n");
    const spinner = ora('Preparing a cryptic invite code').start();

    await new Promise((resolve) => setTimeout(resolve, 1000));
    spinner.stop()

    if (res.method === 0) {
      const emailsRes = await inquirer.prompt([
        {
          name: "emails",
          message: "Who should we invite (comma separated)?",
          type: "input",
        },
      ]);
      console.log("Email res is", emailsRes.emails);
      const spinner2 = ora('Sending invites').start();

      await console.log("Sending invites");

      spinner2.stop()

      console.log(
        "\nInvited your folks to use crusher!. Ask them to check there mail."
      );
    } else {
      console.log(
        "Your Invite link:",
        await getInviteLink(projectConfig.project)
      );
    }
  }
}
