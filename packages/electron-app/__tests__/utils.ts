import * as path from "path";
import { execSync } from "child_process";

// See https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment.
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
    let executableConfig: any = null;
    switch(platform) {
        case "darwin":
                executableConfig = {
                    executablePath: process.env.VARIANT === "release" ? path.resolve(__dirname, `../../../output/crusher-electron-app-release/darwin/mac-${getIsArm() ? "arm64" : "x64"}/Crusher Recorder.app/Contents/MacOS/Crusher Recorder`) :  path.resolve(__dirname, `../bin/darwin-${getIsArm() ? "arm64" : "x64"}/Electron.app/Contents/MacOS/Electron`),
                    args: process.env.VARIANT === "release" ? undefined : [path.resolve(__dirname, "../../../output/crusher-electron-app"), "--open-recorder"],
                };
            break;
        case "linux":
                executableConfig = {
                    executablePath: process.env.VARIANT === "release" ? path.resolve(__dirname, `../../../output/crusher-electron-app-release/linux/linux-unpacked/electron-app`) :  path.resolve(__dirname, `../bin/linux/electron`),
                    args: process.env.VARIANT === "release" ? undefined : [path.resolve(__dirname, "../../../output/crusher-electron-app"), "--open-recorder"],
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

