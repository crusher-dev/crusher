import { Command } from "commander";

import { runTests } from "../../utils/apiUtils";
import { getProjectConfig } from "../../utils/projectConfig";
import { loadUserInfoOnLoad } from "../../utils/hooks";
import { getUserInfo } from "../../state/userInfo";
import { Cloudflare } from "../../module/cloudflare";
import { BROWSERS_MAP } from "../../constants";
import { ChildProcess, exec, execSync, spawn } from "child_process";
import { BlankMessage, Message } from "../../utils/cliMessages";
import chalk from "chalk";
import { getEnvironments } from "../../utils/environments";

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
      .option("-e, --env <string>", "Environment to run test on. Default <development>")
      .option("-projectid, --projectid <string>", "Crusher project ID")
      .option("-b, --browsers <string>", "Browsers to run test on")
      .option("-host, --host <string>", "Browsers to run test on")
      .option("-C, --disable-project-config", "Disable project config", false)
      .option("-p, --pre-run <string>", "Script to run before running tests")
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

  async handlePrescript(command: string): Promise<any>{
    Message(chalk.bgMagentaBright.bold, ' pre:run  ', `🔋Running pre-run script in background`, true);
    BlankMessage(`  ${chalk.gray(command)}\n`);

    return new Promise((resolve, reject) => {
      // Spawn shell command
      const process = spawn ("sh", ["-c", command], {
        detached: true,
      });
      process.stdout.on('data', (data) => {
        console.debug("[pre:run]", data.toString());
      });

      process.stderr.on('data', (data) => {
        console.debug(`[pre:run]`, data.toString());
      });

      
      resolve(process); 
    });
  }

  async runTests(flags) {
    const disableProjectConfig = flags["disable-project-config"];

    const projectConfig = !disableProjectConfig ? getProjectConfig() : null;
    const { testId, testGroup, browser, token, host, preRun, env } = flags;

    let preScriptProcess: ChildProcess | null = null;

    if (preRun) {
     preScriptProcess =  await this.handlePrescript(preRun);
    }
    let proxyUrls = null;

    if (projectConfig && !!projectConfig.proxy && projectConfig.proxy.length > 0) {
      if (!!host) {
        console.log("Host passed, not creating a tunnel", host);
      } else {
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
    if (browser) {
      _browsers = browser.split(",").map(b => b.trim().toUpperCase()).filter(b => !!BROWSERS_MAP[b]);
    }


    try {
      const environments = getEnvironments();
      const selectedEnvironment = environments.find((item) => item.name === env || "development");

      await runTests(host, proxyUrls, _browsers, testId, testGroup, flags.projectid || null, selectedEnvironment?.variables || {});
    } catch (err) {
      console.error("Error is", err);
    } finally {

      Cloudflare.killAnyProcess();
      if(preScriptProcess) {
        console.log("\n");
        Message(chalk.bgMagentaBright.bold, ' pre:run  ', `🚪Closing pre-script process`, true);
        process.kill(-preScriptProcess.pid, "SIGKILL");
      }
    }
  }
}
