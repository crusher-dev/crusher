import { Command } from "commander";

import { cli } from "cli-ux";
import { runTests } from "../../utils/apiUtils";
import { getProjectConfig } from "../../utils/projectConfig";
import { loadUserInfoOnLoad } from "../../utils/hooks";
import { getUserInfo } from "../../state/userInfo";
import localTunnel from "localtunnel";
import { createTunnel } from "../../utils/setup";
import { Cloudflare } from "../../module/cloudflare";
import { BROWSERS_MAP } from "../../constants";

const program = new Command();
program.addHelpText(
  "after",
  `
    Example call:
      $ custom-help --help`
);
program
  .option("-t, --token <string>", "Crusher user token")
  .option("-pID, --projectID <string>", "Crusher project ID")
  .option("-b, --browsers <string>", "Browsers to run test on")
  .parse(process.argv);

export default class CommandBase {
  constructor() {

  }

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

    await this.makeSureSetupIsCorrect(options);
    await this.runTests(options);
  }

  async makeSureSetupIsCorrect(options) {
    const userInfo = getUserInfo();
    const projectConfig = getProjectConfig();

    if (!projectConfig && !(options.token && options.projectID))
      throw new Error(
        "Crusher not intialized in this repo. Run 'crusher-cli init' to initialize."
      );
  }

  async runTests(flags) {
    const projectConfig = getProjectConfig();
    let host: string | undefined = undefined;

    let proxyUrls = null;
    if (projectConfig && !!projectConfig.proxy && projectConfig.proxy.length > 0) {
      proxyUrls = await Cloudflare.runTunnel();
    }

    const { testId, testGroup, browser, token } = flags;
    if (token) {
      try {
        await loadUserInfoOnLoad({ token });
      } catch (ex) {
        throw new Error("Invalid token");
      }
    }
    let _browsers = undefined;
    if(browser){
      _browsers = browser.split(",").map(b => b.trim().toUpperCase()).filter(b => !!BROWSERS_MAP[b]);
    }

    try {
      await runTests(host, proxyUrls, _browsers, testId, testGroup, flags.projectID || null );
    } catch (err) {
      console.error("Error is", err);
    } finally {

    }
  }
}
