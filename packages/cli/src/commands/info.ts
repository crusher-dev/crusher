import { Command } from "commander";
import { getProjectInfo, getTotalTestsInProject } from "../utils/apiUtils";
import {
  findCrusherProjectConfig,
  getProjectConfig,
} from "../utils/projectConfig";

import { getLoggedInUser } from "../utils/index";
import { blue, bold, dim, green, magenta, underline } from "chalk";

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
    }
    await this.run();
  }

  help() {
    console.log(`Logs user out from this machine`);
  }

  async run(): Promise<any> {
    const projectConfig = getProjectConfig();

    if (!projectConfig || !projectConfig.project) {
      throw new Error(
        "Crusher not initialized in this project. Run `crusher-cli init` to fix this."
      );
    }
    const userAccount = getLoggedInUser();
    const projectInfo = await getProjectInfo(projectConfig.project);
    const testsCountInProject = await getTotalTestsInProject(
      projectConfig.project
    );
    console.log(bold(magenta(`📟  Project info\n`)));
    
    console.log('  Details 🗺️');
    console.log(`  Project:      ${blue(projectInfo.name)} | #${projectInfo.id}`);
    console.log(`  Config File:  ${green(findCrusherProjectConfig())}`);
    console.log(`  Team:         ${userAccount.teamName}`);
    
    console.log(`\n\n> to create new project?\nrun crusher-cli --blank`);
    console.log(
      `\n\n> ${dim(underline('View docs'))} | ${magenta('or use --help')}\n`
    );
  }
}
