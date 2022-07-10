import { Command } from "commander";

import { loadUserInfoOnLoad } from "../utils/hooks";

import { installCrusherRecorder, makeSureSetupIsCorrect } from "../utils/setup";

const program = new Command();
program.addHelpText(
  "after",
  `
    Example call:
      $ custom-help --help`
);
program.option("-t, --token", "Crusher user token").parse(process.argv);

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
    const { token } = options;
    await loadUserInfoOnLoad({ token });

    await installCrusherRecorder();
    await makeSureSetupIsCorrect();
  }
}
