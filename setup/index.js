const { Select } = require('enquirer');
const yargs = require('yargs');

const installOptions = {};
const modeChoices = ["open-source", "enterprise"];

function preParseArgv() {
	const argv = yargs.options({
		m: {
			alias: "mode",
			describe: "Version of crusher to be used",
			choices: modeChoices
		},
		bdomain: {
			alias: "backend-domain",
			describe: "Backend domain for server request",
			string: true,
			default: "localhost:8000"
		},
		fdomain: {
			alias: "frontend-domain",
			describe: "Frontend domain for app dashboard",
			string: true,
			default: "localhost:3000"
		}
	})
		.help()
		.alias('help', 'h')
		.argv;

	if(argv.mode) {
		installOptions["mode"] = argv.mode;
	}
	if(argv.bdomain) {
		installOptions["bdomain"] = argv.bdomain;
	}
	if(argv.fdomain) {
		installOptions["fdomain"] = argv.fdomain;
	}
}

async function init() {
	preParseArgv();

	if(!installOptions["mode"]) {
		const modePrompt = new Select({
			name: 'mode',
			message: 'Which version of crusher do you want to use?',
			choices: modeChoices
		});

		installOptions["mode"] = await modePrompt.run();
	}

	process.env.CRUSHER_MODE = installOptions.mode;
	require("packages/crusher-app/setup/tsconfig");
}

init();