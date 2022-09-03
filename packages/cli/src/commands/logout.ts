import { Command } from "commander";
import { getAppConfig, setAppConfig } from "../utils/appConfig";

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

  help() {
    console.log(`Logs user out from this machine`);
  }

  run() {
    const appConfig = getAppConfig();
    if(appConfig) {
      if (appConfig["userInfo"]) delete appConfig["userInfo"];
      setAppConfig(appConfig);
    }
    console.log("Logged out from this machine");
  }
}
