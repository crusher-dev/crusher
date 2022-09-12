import axios from 'axios';
import chalk from 'chalk';
import { isUserLoggedIn } from '.';
import { getUserInfo, setUserInfo } from '../state/userInfo';
import { resolveBackendServerUrl, resolveFrontendServerUrl } from '../utils/utils';
import { getUserInfoFromToken } from './apiUtils';
import { getAppConfig, initializeAppConfig, setAppConfig } from './appConfig';
const open = require('open');

import ora from 'ora';

/*
    Crusher secret invite code. Don't share it with anyone🤫
*/
const secretInviteCode = 'crush';

/*
  Remove this after beta
*/
const checkForDiscord = async () => {
	const isCodeInCommandLine = process.argv.some((e) => {
		return e.includes('--code=') && !['help', '--help', '-h'].includes(e);
	});
	const hasLoginFlag = process.argv.some((e) => e.includes('login'));

	if (isUserLoggedIn() || isCodeInCommandLine) return;

	if (!isCodeInCommandLine && !hasLoginFlag) {
		await console.log(chalk.green(`New to crusher?`));

		await console.log(`Get access code - ${chalk.green('https://discord.gg/dHZkSNXQrg')}`);
		await console.log(`1.) Get access code on home screen`);
		await console.log(`2.) Run command with access code`);

		await console.log(`\n${chalk.yellow('Already have an account?')}
    run npx crusher-cli login \n`);

		process.exit(0);
	}
};

const parseDiscordFlag = (flag: string) => {
	if (!flag) return null;
	return flag.split('--code=')[1];
};

const waitForUserLogin = async (): Promise<string> => {
	await checkForDiscord();

	// ask for discord code here?

	const discordCode = parseDiscordFlag(
		process.argv.find((i) => {
			return i.includes('--code=');
		}),
	);

	const loginKey = await axios.get(resolveBackendServerUrl('/cli/get.key')).then((res) => {
		return res.data.loginKey;
	});
	const loginUrl = resolveFrontendServerUrl(`/login_sucessful?lK=${loginKey}&inviteCode=${discordCode}`);

	await console.log('Login or create an account to create/sync tests⚡⚡. Opening a browser to sync test.\nOr open this link:');
	await console.log(`${loginUrl} \n`);

	const spinner = ora('Waiting for login').start();

	await open(loginUrl).catch((err) => {
		console.error(err);
	});

	const token = await new Promise((resolve) => {
		const interval = setInterval(async () => {
			const loginKeyStatus = await axios.get(resolveBackendServerUrl(`/cli/status.key?loginKey=${loginKey}`)).then((res) => res.data);
			if (loginKeyStatus.status === 'Validated') {
				clearInterval(interval);
				resolve(loginKeyStatus.userToken);
			}
		}, 5000);
	});

	spinner.stop();

	await console.log('\nLogin done!');
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
