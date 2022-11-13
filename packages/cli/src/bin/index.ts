import chalk from 'chalk';
import "../utils/inquirer-patch";
import { execSync } from 'child_process';
import EntryCommand from '../commands/index';
import { loadUserInfoOnLoad } from '../utils/hooks';
import { BlankMessage, Message } from '../utils/cliMessages';
import { getProjectConfig, getProjectConfigPath } from '../utils/projectConfig';
import { askUserLogin, installCrusherRecorder, makeSureSetupIsCorrect } from '../utils/setup';
import { getRecorderDistCommand } from '../utils/utils';
import { recorderVersion } from '../constants';
import { checkIfNewUpdateAvilable, getCurrentCLIVersion, getLatestCliVersion } from '../utils';
import stringWidth from 'string-width';

import {Analytics} from '../../../crusher-shared/modules/analytics/AnalyticsManager';
import {CLI_EVENTS} from '../../../crusher-shared/modules/analytics/constants';

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

			Analytics.track({
				event:  CLI_EVENTS.RAN_CLI_COMMAND,
				properties: {
					currentVersion,
					latestVersion
				}
			})
		
			const lines = [
				`Crusher CLI update available: ${chalk.gray(currentVersion)} → ${chalk.greenBright(latestVersion)}`,
				`Run ${chalk.magentaBright(`npm install -g crusher.dev`)} to update`,
			];

			// TODO: Pull this into utils/format

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


		await new Promise((res)=>{
			setTimeout(res,10000)
		})
		
		const cliVersion = await getCurrentCLIVersion();
		
		Message(chalk.bgBlueBright.bold, ' crusher ', `${chalk.magenta.bold('v' + cliVersion)} launch sequence initiated 🦖`);
		BlankMessage(`app version ${chalk.gray('-->')} ${chalk.magenta.bold('v' + recorderVersion)}\n`);

		const commandArgs = args ? args.filter((a) => !a.startsWith('-')) : [];
		const isDefaultCommand = commandArgs.length === 0 || ['open', '.'].some((x) => args && args[0] === x);
		const isHelpArg = helpArgs.includes(args[0]);

		Analytics.track({
			event: 'RAN_CLI_COMMAND',
			properties: {
				cliVersion,
				recorderVersion
			}
		})

		if (isDefaultCommand && !isHelpArg) {
				new Promise(async () => {
					const { token } = await askUserLogin();
					// @Todo: Add support for flag token here
					await loadUserInfoOnLoad({ token: undefined });
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