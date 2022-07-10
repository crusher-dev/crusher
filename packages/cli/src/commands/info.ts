import { Command } from "commander";
import { getProjectInfo, getTotalTestsInProject } from "../utils/apiUtils";
import {
  findCrusherProjectConfig,
  getProjectConfig,
} from "../utils/projectConfig";

import { getLoggedInUser } from "../utils/index";

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

    console.log(projectConfig);
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

    console.log("-----------");
    console.log("Team:", userAccount.teamName);
    console.log("Name:", userAccount.name);
    console.log("Login:", userAccount.email);
    console.log("-----------");
    console.log("Project name: ", projectInfo.name);
    console.log("Tests in the project:", testsCountInProject);
    console.log("Project config path: ", findCrusherProjectConfig());
  }
}
