import * as path from "path";
import * as url from "url";
import { getIsArm, getRuntimeEnv } from "./utils/utils";

export const BACKEND_SERVER_URL = "http://localhost:8000";
export const FRONTEND_SERVER_URL = "http://localhost:3000";

export const APP_DIRECTORY =
  getRuntimeEnv().CRUSHER_GLOBAL_DIR ||
  `/${getRuntimeEnv().HOME}/.crusher`;

export const recorderVersion = process.env.RECORDER_VERSION || `1.0.33`;

const repoDownloadURL = "https://github.com/crusher-dev/crusher-debug-downloads/"
export const RECORDER_MAC_BUILD = url.resolve(process.env.DOWNLOADS_REPO_URL || repoDownloadURL, `./releases/download/v${recorderVersion}/Crusher.Recorder-${recorderVersion}-mac-x64.zip`);
export const RECORDER_MAC_ARM64_BUILD = url.resolve(process.env.DOWNLOADS_REPO_URL || repoDownloadURL, `./releases/download/v${recorderVersion}/Crusher.Recorder-${recorderVersion}-mac-arm64.zip`);
export const RECORDER_LINUX_BUILd = url.resolve(process.env.DOWNLOADS_REPO_URL || repoDownloadURL, `./releases/download/v${recorderVersion}/Crusher.Recorder-${recorderVersion}-linux.zip`);

export const CLOUDFLARED_URL = {
  MAC: "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-amd64.tgz",
  LINUX: "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64"
}
export const getRecorderBuildForPlatfrom = () => {
  if (process.platform === "linux")
    return {
      url: RECORDER_LINUX_BUILd,
      name: path.basename(RECORDER_LINUX_BUILd),
      platform: "linux",
      version: RECORDER_LINUX_BUILd.split("/").reverse()[1],
    };
  if (process.platform === "darwin") {
    const buildUrl = getIsArm() ? RECORDER_MAC_ARM64_BUILD : RECORDER_MAC_BUILD;
    return {
      url: buildUrl,
      name: path.basename(RECORDER_MAC_BUILD),
      platform: "mac",
      version: RECORDER_MAC_BUILD.split("/").reverse()[1],
    };

  }

  throw new Error("Recorder not available for your platfrom yet");
};

export const BROWSERS_MAP = {"CHROME": 1, "FIREFOX": 1, "SAFARI": 1};