// eslint-disable-next-line unicorn/filename-case
import * as fs from "fs";
import { APP_DIRECTORY } from "../constants";
import { createDirIfNotExist } from "../utils/utils";
import * as path from "path";
import chalk from "chalk";

export function findCrusherProjectConfig(_start = null) {
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
  const fullPath = path.join(dir, ".crusher");
  if (
    fs.existsSync(fullPath) &&
    path.resolve(fullPath) !== path.resolve(APP_DIRECTORY)
  ) {
    if (fs.lstatSync(fullPath).isDirectory()) {
      return path.normalize(fullPath);
    }
  }
  return findCrusherProjectConfig(start);
}

const PROJECT_CONFIG_PATH = path.resolve(process.cwd(), ".crusher");

export const setProjectConfig = (config) => {
  createDirIfNotExist(".crusher");
  fs.writeFileSync(
    path.resolve(PROJECT_CONFIG_PATH, "./config.js"),
    `module.exports = ${JSON.stringify(config, null, 2)}`
  );
};

export const getProjectConfigPath = () => {
  const existingProjectConfig = findCrusherProjectConfig();
  if(fs.existsSync(path.resolve(existingProjectConfig || PROJECT_CONFIG_PATH, "./config.js"))) {
    return path.resolve(existingProjectConfig || PROJECT_CONFIG_PATH, "./config.js");
  }
  const configPath = path.resolve(existingProjectConfig || PROJECT_CONFIG_PATH, "./config.json");
  if(!fs.existsSync(configPath)) return null;

  return configPath;
}

let hasLoggedProjectConfig = false;
export const getProjectConfig = (verbose: boolean = true) => {
  const configPath = getProjectConfigPath();
  if(!fs.existsSync(configPath)) { if(!hasLoggedProjectConfig) { if(verbose) 
    console.log(`Project config not found`);
     hasLoggedProjectConfig=true;} return null; }

  if(!hasLoggedProjectConfig) {
    hasLoggedProjectConfig = true;
    console.log(chalk.green("Project config: ") + configPath);
  }
  hasLoggedProjectConfig = true;
  if(configPath.endsWith(".js")) { const requireOriginal = eval("require"); const config = requireOriginal(configPath); return config; }
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
};
