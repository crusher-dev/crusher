import chalk from 'chalk';
import "../utils/inquirer-patch";
import { execSync } from 'child_process';
import EntryCommand from '../commands/index';
import { BlankMessage, Message } from '../utils/cliMessages';
import { getProjectConfig, getProjectConfigPath } from '../utils/projectConfig';
import {  askUserLogin, installCrusherRecorder, makeSureSetupIsCorrect } from '../utils/setup';
import { getRecorderDistCommand } from '../utils/utils';
import { recorderVersion } from '../constants';
import { checkIfNewUpdateAvilable, getCurrentCLIVersion, getLatestCliVersion } from '../utils';
import stringWidth from 'string-width';
import {Analytics} from '../../../crusher-shared/modules/analytics/AnalyticsManager';
import {CLI_EVENTS} from '../../../crusher-shared/modules/analytics/constants';
import { getAppConfig } from '../utils/appConfig';
import { loadUserInfoOnLoad } from '../utils/hooks';

const nodeVersion = process.version.match(/^v(\d+\.\d+)/)[1];

// only allow console.debug if DEBUG env variable is set
if (!process.env.CRUSHER_DEBUG) {
	  console.debug = () => {};
}

(async () => {
	if (parseFloat(nodeVersion) >= 10.0) {
		const args = process.argv.slice(2);
		const helpArgs = ['-h', '--h', 'help', '--help', '-help'];

		if (await checkIfNewUpdateAvilable()) {
			const currentVersion = await getCurrentCLIVersion();
			const latestVersion = await getLatestCliVersion();
	
			const lines = [
				`Crusher CLI update available: ${chalk.gray(currentVersion)} → ${chalk.greenBright(latestVersion)}`,
				`Run ${chalk.magentaBright(`npm install -g crusher.dev`)} to update`,
			];

			const padding = 3;
			const longestLineLength = Math.max(...lines.map(line => stringWidth(line)));
			const horizontalRule = `  ${'─'.repeat(longestLineLength + padding * 2)}`;
			const output = (
				`\n${horizontalRule}\n\n` +
				`${lines.map(line => `  ${' '.repeat((longestLineLength - stringWidth(line)) / 2 + padding)}${line}`).join('\n')}\n\n` +
				`${horizontalRule}\n\n`
			);

			console.log(output);
		}

		const cliVersion = await getCurrentCLIVersion();

		Message(chalk.bgBlueBright.bold, ' crusher ', `${chalk.magenta.bold('v' + cliVersion)} launch sequence initiated 🦖`);
		BlankMessage(`app version ${chalk.gray('-->')} ${chalk.magenta.bold('v' + recorderVersion)}\n`);

				
		console.log(`  Please join:        
     Our \x1b[35mDiscord\x1b[0m community at \x1b[35mhttps://discord.gg/dHZkSNXQrg\x1b[0m
     Our \x1b[1;32mGitHub\x1b[0m repository is at \x1b[1;32mhttps://github.com/crusher-dev/crusher\x1b[0m
     Our \x1b[32mDocumentation\x1b[0m is located at \x1b[32mhttps://docs.crusher.dev\x1b[0m
`);

		const commandArgs = args ? args.filter((a) => !a.startsWith('-')) : [];
		const isDefaultCommand = commandArgs.length === 0 || ['open', '.'].some((x) => args && args[0] === x);
		const isHelpArg = helpArgs.includes(args[0]);

		const appConfig = getAppConfig();
		
		Analytics.track({
			userId: appConfig?.userInfo?.id,
			event: 'RAN_CLI_COMMAND',
			properties: {
				cliVersion,
				recorderVersion,
				command: process.argv[2] || ' ',	
			}
		})

		if (isDefaultCommand && !isHelpArg) {
			new Promise(async () => {
				const { token } = await askUserLogin();
				// @Todo: Add support for flag token here
				await loadUserInfoOnLoad({ token: undefined });
				await installCrusherRecorder();
				await makeSureSetupIsCorrect(null, true);

				await installCrusherRecorder();
				await makeSureSetupIsCorrect(null, true);
				const projectConfigPath = getProjectConfigPath();
				const projectConfig = getProjectConfig();
				const customFlags = projectConfig && projectConfig.project ? `--project-config-file=${projectConfigPath} --projectId=${projectConfig.project}` : '';

				execSync(`${getRecorderDistCommand()} --crusher-cli-path=${eval('__dirname') + '/index.js'} ${customFlags} --no-sandbox`, { stdio: 'inherit' });
			});
		} else if (isHelpArg) {
			new EntryCommand().help();
		} else {
			new EntryCommand().run();
		}
	} else {
		console.error('Node version must be >= 10.0.0. You are using version: ' + nodeVersion);
	}
})();