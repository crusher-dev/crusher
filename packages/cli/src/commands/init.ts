import { Command } from "commander";

import { loadUserInfoOnLoad } from "../utils/hooks";

import { installCrusherRecorder, makeSureSetupIsCorrect } from "../utils/setup";

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
    this.program.option("-t, --token", "Crusher user token").parse(process.argv);
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
    const { token } = options;
    await loadUserInfoOnLoad({ token });

    await installCrusherRecorder();
    await makeSureSetupIsCorrect();
  }
}
