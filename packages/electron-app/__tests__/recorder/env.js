// my-custom-environment
const NodeEnvironment = require('jest-environment-node');
const playwright = require("playwright");
const path = require("path");
export const getIsArm = () => {
  try {
    const isCurrentlyTranslated = execSync('sysctl sysctl.proc_translated', { stdio: 'pipe' });

    return true;
  } catch (e) {
    // On non-ARM macs `sysctl sysctl.proc_translated` throws with
    // sysctl: unknown oid 'sysctl.proc_translated'
    return false;
  }
};
export function getLaunchOptions() {
  const platform = process.platform;
  let executableConfig = null;
  switch(platform) {
      case "darwin":
              executableConfig = {
                  executablePath: process.env.VARIANT === "release" ? path.resolve(__dirname, `../../../../output/crusher-electron-app-release/darwin/mac-${getIsArm() ? "arm64" : "x64"}/Crusher Recorder.app/Contents/MacOS/Crusher Recorder`) :  path.resolve(__dirname, `../../bin/darwin-${getIsArm() ? "arm64" : "x64"}/Electron.app/Contents/MacOS/Electron`),
                  args: process.env.VARIANT === "release" ? undefined : [path.resolve(__dirname, "../../../../output/crusher-electron-app"), "--open-recorder"],
              };
          break;
      case "linux":
              executableConfig = {
                  executablePath: process.env.VARIANT === "release" ? path.resolve(__dirname, `../../../../output/crusher-electron-app-release/linux/linux-unpacked/electron-app`) :  path.resolve(__dirname, `../../bin/linux-x64/electron`),
                  args: process.env.VARIANT === "release" ? undefined : [path.resolve(__dirname, "../../../../output/crusher-electron-app"), "--no-sandbox", "--open-recorder"],
              };
          break;
      default:
          throw new Error(`Unsupported platform: ${platform}`);
  }
  return {
      executablePath: executableConfig.executablePath,
      args: executableConfig.args,
  };
}



class CustomEnvironment extends NodeEnvironment {
  electronApp;
  appWindow;

  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

	async init(ignoreOnboarding = true) {
		this.electronApp = await playwright["_electron"].launch(getLaunchOptions());
		this.appWindow = await this.electronApp.firstWindow();
		await this.appWindow.waitForURL((url) => { if (!url.toString().includes("splash.html")) return true; });

    if(ignoreOnboarding) {
      const onboarding = await this.appWindow.$("#onboarding-overlay");
      if (onboarding) {
        await this.appWindow.click("text=Skip Onboarding");
      }
    }
		await this.appWindow.waitForLoadState();
	}

  async setup() {
    await super.setup();
    this.global.recorder = { init: this.init, electronApp: this.electronApp, appWindow: this.appWindow };

    // Will trigger if docblock contains @my-custom-pragma my-pragma-value
    if (this.docblockPragmas['my-custom-pragma'] === 'my-pragma-value') {
      // ...
    }
  }

  async teardown() {
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

module.exports = CustomEnvironment;