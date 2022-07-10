// eslint-disable-next-line unicorn/filename-case
import * as fs from "fs";
import { APP_DIRECTORY, recorderVersion } from "../constants";
import { setUserInfo } from "../state/userInfo";
import { resolvePathToAppDirectory } from "../utils/utils";
import * as path from "path";

const CRUSHER_CONFIG_FILE = resolvePathToAppDirectory("crusher.json");

export const initializeAppConfig = () => {
  if (!fs.existsSync(APP_DIRECTORY)) {
    fs.mkdirSync(APP_DIRECTORY);
    fs.mkdirSync(resolvePathToAppDirectory("bin"));
  }

  if (!fs.existsSync(path.resolve(APP_DIRECTORY, "crusher.json"))) {
    setAppConfig({ recorderVersion: recorderVersion });
  }

  const config = getAppConfig();
  setUserInfo(config.userInfo);
};

export const setAppConfig = (config) => {
  fs.writeFileSync(CRUSHER_CONFIG_FILE, JSON.stringify(config));
};

export const getAppConfig = () => {
  return isCrusherConfigured()
    ? JSON.parse(fs.readFileSync(CRUSHER_CONFIG_FILE, "utf8"))
    : null;
};

export const isCrusherConfigured = () => {
  return fs.existsSync(CRUSHER_CONFIG_FILE);
};
