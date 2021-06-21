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
		be: {
			alias: "backend-domain",
			describe: "Backend domain for server request",
			string: true,
			default: "localhost:8000"
		},
		fe: {
			alias: "frontend-domain",
			describe: "Frontend domain for app dashboard",
			string: true,
			default: "localhost:3000"
		},
		s: {
			alias: "storage",
			describe: "Local path to server as storage",
			string: true,
			default: "/tmp/"
		},
		sp: {
			alias: "storage-port",
			describe: "Port to serve storage files on",
			string: true,
			default: 3001
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

	require("../packages/crusher-app/setup/tsconfig");
	require("../packages/crusher-server/setup/tsconfig");
	require("../packages/test-runner/setup/tsconfig");
	require("../packages/video-processor/setup/tsconfig");
}

init();