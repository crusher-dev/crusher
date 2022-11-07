import { Command } from "commander";

import { getProjectConfig } from "../utils/projectConfig";
import { loadUserInfoOnLoad } from "../utils/hooks";
import { Cloudflare } from "../module/cloudflare";
import fs from "fs";


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
    this.program
      .option("-t, --token <string>", "Crusher user token")
      .option("-c, --config <string>", "Config file of the project")
      .option("-c, --colors", "Enable colors for this")
      .parse(process.argv);

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
    console.log(`Logs user out from this machine`);
  }

  async run(): Promise<any> {
    const options = this.program.opts();
    const { token, config } = options;
    if(!config) {
        await loadUserInfoOnLoad({ token });
    }
    await this.createTunnel(config);
  }

  private getProjectConifg(path: string) {
    if(!path) return getProjectConfig();
    if(path.endsWith(".js")) {
      return eval("require")(path);
    }

    const projectConfigRaw = fs.readFileSync(path, "utf8");
    const projectConfig = JSON.parse(projectConfigRaw);

    return projectConfig;
  }

  async createTunnel(configFilePath) {
    try {
        const projectConfig = this.getProjectConifg(configFilePath);
        if(!projectConfig.proxy) { throw  Error("No proxy found in config file"); }
        await Cloudflare.runTunnel(projectConfig);
    } catch(err) {
        throw new Error("Error running tunnel:  " + err.message);
    }
  }
}
