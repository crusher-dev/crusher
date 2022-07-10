import { Command } from "commander";

import { loadUserInfoOnLoad } from "../../utils/hooks";
import { getUserInfo } from "../../state/userInfo";
import { getRecorderDistCommand, resolvePathToAppDirectory } from "../../utils/utils";
import cli from "cli-ux";
import { getProjectConfig, getProjectConfigPath } from "../../utils/projectConfig";
import { execSync } from "child_process";
import localTunnel from "localtunnel";
import chalk from "chalk";
import {
  createTunnel,
  installCrusherRecorder,
  makeSureSetupIsCorrect,
} from "../../utils/setup";

const program = new Command();

program.addHelpText(
  "after",
  `
    Example call:
      $ crusher-cli test:create --help`
);

// // If custom help write code here
// if (process.argv.includes("-h")) {
//     console.log("Custom help")
//     process.exit()
// }

program
  .option("-p, --port <number>", "port number")
  .option("-t, --token <string>", "Crusher user token")
  .option("-pID, --projectID <string>", "Crusher project ID")
  .parse(process.argv);

export default class CommandBase {
  options;
  constructor() {}
  
  help() {
    console.log(`Create a new test`);
  }

  async init() {
    this.options = program.opts();
    const { help, version } = this.options;
    if (help === true) {
      await this.help();
      return;
    }

    await this.run();
  }

  async run(): Promise<any> {
    const { token } = this.options;
    console.log("Token is " + token);
    await loadUserInfoOnLoad({ token: token });
    await installCrusherRecorder();
    await makeSureSetupIsCorrect(this.options.projectID);

    await this.createTest(this.options);
  }

  async createTest(flags) {
    let tunnel: localTunnel.Tunnel | undefined;
    if (flags.port) {
      const port = flags.port;
      tunnel = await createTunnel(port);
      const host = tunnel.url;

      await cli.log("\nServing at " + host + " now \n");
    }

    const projectConfig = getProjectConfig();
    const userInfo = getUserInfo();
    const projectConfigPath = getProjectConfigPath();
    
    const customFlags = projectConfig && projectConfig.project ? `--project-config-file=${projectConfigPath}` : "";
    const projectId = flags.projectID ? flags.projectID : projectConfig.project;
    const userToken = flags.token ? flags.token : userInfo?.token;
  
    execSync(`${getRecorderDistCommand()} ${customFlags} --no-sandbox --open-recorder --projectId=${projectId} --token=${userToken}`, {stdio: "ignore"});

    cli.log("Created your test. Few command that might be helpful\n");
    cli.log("1.) Run all tests in your project");
    cli.log(`${chalk.hex("9A4AFF")(`npx crusher-cli test:run`)}`);

    cli.log("2.) Invite team members to the project");
    cli.log(`${chalk.hex("9A4AFF")(`npx crusher-cli invite`)}`);
  }
}
