import { getUserInfoFromToken } from "./apiUtils";
import { getAppConfig, initializeAppConfig, setAppConfig } from "./appConfig";
import { getUserInfo, setUserInfo } from "../state/userInfo";
import {
  resolveBackendServerUrl,
  resolveFrontendServerUrl,
} from "../utils/utils";
import axios from "axios";
import cli from "cli-ux";

const waitForUserLogin = async (): Promise<string> => {
  const loginKey = await axios
    .get(resolveBackendServerUrl("/cli/get.key"))
    .then((res) => {
      return res.data.loginKey;
    });
  await cli.log(
    "Login or create an account to create a test⚡⚡. Opening a browser for you.\nIf it doesn't open, open this link:"
  );
  await cli.log(resolveFrontendServerUrl(`/login_sucessful?lK=${loginKey}`));

  await cli.action.start("Waiting for login");

  await cli
    .open(`${resolveFrontendServerUrl(`/login_sucessful?lK=${loginKey}`)}`)
    .catch((err) => {
      console.error(err);
    });

  const token = await new Promise((resolve) => {
    const interval = setInterval(async () => {
      const loginKeyStatus = await axios
        .get(resolveBackendServerUrl(`/cli/status.key?loginKey=${loginKey}`))
        .then((res) => res.data);
      if (loginKeyStatus.status === "Validated") {
        clearInterval(interval);
        resolve(loginKeyStatus.userToken);
      }
    }, 5000);
  });

  await cli.action.stop();

  await cli.log("\nLogin completed! Let's ship high quality software fast⚡⚡");
  return token as string;
};

const loadUserInfoOnLoad = async function (options: { token?: string }) {
  initializeAppConfig();

  if (options.token) {
    // Verify the new token and save it if valid
    try {
      await getUserInfoFromToken(options.token).then((userInfo) => {
        setUserInfo(userInfo);
      });
    } catch (e) {
      const userToken = await waitForUserLogin();
      await getUserInfoFromToken(userToken).then((userInfo) => {
        setUserInfo(userInfo);
      });
    }
  } else {
    const appConfig = getAppConfig();
    // Login user to set default auth token
    if (!appConfig.userInfo || !appConfig.userInfo.token) {
      const userToken = await waitForUserLogin();
      await getUserInfoFromToken(userToken).then((userInfo) => {
        setUserInfo(userInfo);
        setAppConfig({
          ...getAppConfig(),
          userInfo: getUserInfo(),
        });
      });
    }
  }
};

export { loadUserInfoOnLoad };
