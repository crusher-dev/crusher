const { Select } = require('enquirer');
const yargs = require('yargs');

const installOptions = {};
const modeChoices = ["open-source", "enterprise"];
const storageModeChoices = ["local", "aws"];

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
		sm: {
			alias: "storage-mode",
			describe: "Storage mode for file storage",
			choices: storageModeChoices,
			default: "local"
		},
		sd: {
			alias: "storage-dir",
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
	if(argv.sm) {
		installOptions["storage_mode"] = argv.sm;
	}
	if(argv.sd){
		installOptions["storage_dir"] = argv.sd;
	}
	if(argv.sp){
		installOptions["storage_port"] = argv.sp;
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
	process.env.STORAGE_MODE = installOptions.storage_mode;
	if(installOptions.storage_mode === "local") {
		process.env.STORAGE_PORT = installOptions.storage_port;
		process.env.BASE_STORAGE_FOLDER = installOptions.storage_dir;
	}

	require("../packages/crusher-app/setup/tsconfig");
	require("../packages/crusher-server/setup/tsconfig");
	require("../packages/test-runner/setup/tsconfig");
	require("../packages/video-processor/setup/tsconfig");
}

init();