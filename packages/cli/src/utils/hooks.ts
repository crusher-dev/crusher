import { getUserInfoFromToken } from "./apiUtils";
import { getAppConfig, initializeAppConfig, setAppConfig } from "./appConfig";
import { getUserInfo, setUserInfo } from "../state/userInfo";
import {
	resolveBackendServerUrl,
	resolveFrontendServerUrl,
} from "../utils/utils";
import axios from "axios";
import chalk from "chalk";
import { isUserLoggedIn } from ".";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const open = require('open');

import ora from 'ora';

/*
	Crusher secret invite code. Don't share it with anyone🤫
*/
const secretInviteCode = 'crush';

export const getDiscordInviteCode = () => {
	const argv = yargs(hideBin(process.argv)).help(false).argv;
	const commandsArr: Array<string> = argv["_"];

	const shouldIgnoreParsing = argv["help"] || argv["h"] || commandsArr.some((cmd) => (["help", "login"].includes(cmd)));
	if (shouldIgnoreParsing) return { shouldIgnore: true };
	if (!argv["code"]) return;

	return { code: argv["code"] };
}

/*
  Remove this after beta
*/
export const checkForDiscord = async (shouldCheckForDiscord = true) => {
	if (isUserLoggedIn()) return;

	const discordArgv = getDiscordInviteCode();
	if (discordArgv?.shouldIgnore) return;
	
	await console.log(chalk.green(`New to crusher?`))
	await console.log(`Join discord community ${chalk.green("https://discord.gg/dHZkSNXQrg")} \n`)

	return { code: "CRU-TEST" };
	// if (!discordArgv?.code && shouldCheckForDiscord) {
	// 	await console.log(chalk.green(`New to crusher?`))
	// 	await console.log(`Join discord community ${chalk.green("https://discord.gg/dHZkSNXQrg")}`)
	
	// 	await console.log(`Get access code - ${chalk.green("https://discord.gg/dHZkSNXQrg")}`)
	// 	await console.log(`1.) Get access code on home screen`)
	// 	await console.log(`2.) Run command with access code`)

	// 	await console.log(`\n${chalk.yellow('Already have an account?')}
    // run npx crusher-cli login \n`);

	// 	process.exit(0)
	// } else {
	// 	return discordArgv;
	// }
}

const parseDiscordFlag = (flag: string) => {
	if (!flag) return null;
	return flag.split('--code=')[1];
};

const waitForUserLogin = async (): Promise<string> => {
	await checkForDiscord();

	// ask for discord code here?

	const discordCode = parseDiscordFlag(process.argv.find((i) => {
		return i.includes("--code=");
	}));


	const loginKey = await axios
		.get(resolveBackendServerUrl("/cli/get.key"))
		.then((res) => {
			return res.data.loginKey;
		});
	const loginUrl = resolveFrontendServerUrl(`/login_sucessful?lK=${loginKey}&inviteCode=${discordCode}`);
	await open(loginUrl)
		.catch((err) => {
			console.error(err);
		});

	const { token } = await waitForLogin(loginKey);
	await console.log(
		"Login or create an account to create/sync tests⚡⚡. Opening a browser to sync test.\nOr open this link:"
	);
	await console.log(`${loginUrl} \n`);

	return token as string;
};

const waitForLogin = async (loginKey) => {
	const spinner = ora('Waiting for login').start();

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

	spinner.stop()

	await console.log("\nLogin completed! Let's ship high quality software fast⚡⚡");

	return { token };
}
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

export { loadUserInfoOnLoad, waitForLogin };
