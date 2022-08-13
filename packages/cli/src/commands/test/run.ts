import { Command } from "commander";

import { runTests } from "../../utils/apiUtils";
import { getProjectConfig } from "../../utils/projectConfig";
import { loadUserInfoOnLoad } from "../../utils/hooks";
import { getUserInfo } from "../../state/userInfo";
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
  .option("-projectid, --projectid <string>", "Crusher project ID")
  .option("-b, --browsers <string>", "Browsers to run test on")
  .option("-host, --host <string>", "Browsers to run test on")
  .option("-C, --disable-project-config", "Disable project config", false)
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
    const projectConfig = getProjectConfig();

    if (!projectConfig && !(options.token && options.projectID))
      throw new Error(
        "Crusher not intialized in this repo. Run 'crusher-cli init' to initialize."
      );
  }

  async runTests(flags) {
    const disableProjectConfig = flags["disable-project-config"];

    const projectConfig = !disableProjectConfig ? getProjectConfig() : null;
    const { testId, testGroup, browser, token,host } = flags;
    let proxyUrls = null;

    if (projectConfig  && !!projectConfig.proxy && projectConfig.proxy.length > 0) {
      if(!!host){
        console.log("Host passed, not creating a tunnel", host);
      }else{
        proxyUrls = await Cloudflare.runTunnel();
      }
  
    }

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
      await runTests(host, proxyUrls, _browsers, testId, testGroup, flags.projectid || null );
    } catch (err) {
      console.error("Error is", err);
    } finally {

    }
  }
}
