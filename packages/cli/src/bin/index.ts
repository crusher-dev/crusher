import chalk from 'chalk';
import "../utils/inquirer-patch";
import { execSync } from 'child_process';
import EntryCommand from '../commands/index';
import { loadUserInfoOnLoad } from '../utils/hooks';
import { Message } from '../utils/messages';
import { getProjectConfig, getProjectConfigPath } from '../utils/projectConfig';
import { askUserLogin, installCrusherRecorder, makeSureSetupIsCorrect } from '../utils/setup';
import { getRecorderDistCommand } from '../utils/utils';
const nodeVersion = process.version.match(/^v(\d+\.\d+)/)[1];

if (parseFloat(nodeVersion) >= 10.0) {
	const args = process.argv.slice(2);
	const helpArgs = ['-h', '--h', 'help', '--help', '-help'];
	const cliVersion = require('../../package.json').version;

	console.log('\n');
	Message(chalk.bgBlueBright.bold, ' crusher ', `${chalk.magenta.bold('v1.0.3')} launch sequence initiated 🦖\n`);

	// Message(chalk.bgGray.bold, '  setup  ', `Few new commands added \n`);

	const hasDiscordInveite = args && args[0]?.includes('--');

	const commandArgs = args ? args.filter((a) => !a.startsWith('-')) : [];
	const isDefaultCommand = commandArgs.length === 0 || ['open', '.'].some((x) => args && args[0] === x);
	const isHelpArg = helpArgs.includes(args[0]);
	if (['version', '--version', '-v'].includes(args[0])) {
		// Do nothing since version gets printed for every command
	} else {
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
	}
} else {
	console.error('Node version must be >= 10.0.0. You are using version: ' + nodeVersion);
}
