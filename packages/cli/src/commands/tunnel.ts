import { Command } from "commander";

import { cli } from "cli-ux";
import { runTests } from "../utils/apiUtils";
import { getProjectConfig } from "../utils/projectConfig";
import { loadUserInfoOnLoad } from "../utils/hooks";
import { getUserInfo } from "../state/userInfo";
import { Cloudflare } from "../module/cloudflare";
import fs from "fs";

const program = new Command();
program.addHelpText(
  "after",
  `
    Example call:
      $ custom-help --help`
);
program
  .option("-t, --token <string>", "Crusher user token")
  .option("-c, --config <string>", "Config file of the project")
  .parse(process.argv);

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
    console.log(`Logs user out from this machine`);
  }

  async run(): Promise<any> {
    const options = program.opts();
    const { token, config } = options;
    if(!config) {
        await loadUserInfoOnLoad({ token });
    }
    await this.createTunnel(config);
  }

  async createTunnel(configFilePath) {
    try {
        const projectConfigRaw = fs.readFileSync(configFilePath, "utf8");
        const projectConfig = JSON.parse(projectConfigRaw);
        if(!projectConfig.proxy) { throw new Error("No proxy found in config file"); }
        await Cloudflare.runTunnel(projectConfig);
    } catch(err) {
        throw new Error("Error running tunnel:  " + err.message);
    }
  }
}
