import { getUserInfoFromToken } from "./apiUtils";
import { getAppConfig, initializeAppConfig, setAppConfig } from "./appConfig";
import { getUserInfo, setUserInfo } from "../state/userInfo";
import {
  resolveBackendServerUrl,
  resolveFrontendServerUrl,
} from "../utils/utils";
import axios from "axios";
import cli from "cli-ux";
import chalk from "chalk";
import { isUserLoggedIn } from ".";

/*
    Crusher secret invite code. Don't share it with anyone🤫
*/
const secretInviteCode = "crush"

/*
  Remove this after beta
*/
const checkForDiscord = async()=>{
  const isCodeInCommandLine = process.argv.some((e)=>{
    return e.includes("--") || e === secretInviteCode
  })


  if(isUserLoggedIn() || isCodeInCommandLine) return;

  if(!isCodeInCommandLine){
    await cli.log(chalk.green(`New to crusher?`))

    await cli.log(`Get access code - ${chalk.green("https://discord.com/")}`)
  await cli.log(`1.) Get access code on home screen`)
  await cli.log(`2.) Run command with access code`)

    await cli.log(`\n${chalk.yellow('Already have an account?')}
    run npx crusher-cli --login \n`)

  process.exit(0)
  }
}

const waitForUserLogin = async (): Promise<string> => {
  await checkForDiscord();

  const discordCode = process.argv.find((i)=>{
    return i.includes("--") || i===secretInviteCode
  });

  const loginKey = await axios
    .get(resolveBackendServerUrl("/cli/get.key"))
    .then((res) => {
      return res.data.loginKey;
    });

  await cli.log(
    "Login or create an account to create/sync tests⚡⚡. Opening a browser to sync test.\nOr open this link:"
  );
  await cli.log(`${resolveFrontendServerUrl(`/login_sucessful?lK=${loginKey}&code=${discordCode}`)} \n`);
  await cli.action.start("Waiting for login");

  await cli
    .open(`${resolveFrontendServerUrl(`/login_sucessful?lK=${loginKey}&code=${discordCode}`)}`)
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
