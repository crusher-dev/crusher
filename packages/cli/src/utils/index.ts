import { getAppConfig, isCrusherConfigured } from "../utils/appConfig";
import { IUserInfo } from "../state/userInfo";
import * as path from "path";
import * as fs from "fs";
import * as ini from "ini";

const getLoggedInUser = (): IUserInfo => {
  if (!isCrusherConfigured()) {
    throw new Error("No user logged in.  Try login with crusher-cli login.");
  }
  const config = getAppConfig();
  if (!config.userInfo) {
    throw new Error("No user logged in.  Try login with crusher-cli login.");
  }
  return config.userInfo;
};

const isUserLoggedIn = () => {
  if (!isCrusherConfigured()) {
    return false;
  }
  const config = getAppConfig();
  return Boolean(config.userInfo);
};

function findGitRoot(_start = null) {
  let start: any = _start || process.cwd();
  if (typeof start === "string") {
    if (start[start.length - 1] !== path.sep) {
      start += path.sep;
    }
    start = path.normalize(start);
    start = start.split(path.sep);
  }
  if (!start.length) {
    return null;
  }
  start.pop();
  const dir = start.join(path.sep);
  const fullPath = path.join(dir, ".git");
  if (fs.existsSync(fullPath)) {
    if (!fs.lstatSync(fullPath).isDirectory()) {
      const content = fs.readFileSync(fullPath, { encoding: "utf-8" });
      const match = /^gitdir: (.*)\s*$/.exec(content);
      if (match) {
        return path.normalize(match[1]);
      }
    }
    return path.normalize(fullPath);
  }
  return findGitRoot(start);
}

const getProjectNameFromGitInfo = () => {
  try {
    if (!findGitRoot()) return null;

    const config = fs.readFileSync(findGitRoot() + "/config", "utf-8");
    const configFile = ini.parse(config);
    const remotes = Object.keys(configFile)
      .filter((key) => key.startsWith("remote"))
      .map((key) => configFile[key]);
    if (remotes.length === 0) return null;
    return remotes.map((remote) =>
      remote.url.split("/").pop().replace(".git", "")
    )[0];
  } catch (error) {
    return null;
  }
};

export {
  getLoggedInUser,
  isUserLoggedIn,
  findGitRoot,
  getProjectNameFromGitInfo,
};
