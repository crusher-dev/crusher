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
		ah: {
			alias: "app-host",
			describe: "App host to identify cookie owners",
			string: true,
			default: "localhost"
		},
		bd: {
			alias: "backend-domain",
			describe: "Backend domain for server request",
			string: true,
			default: "http://localhost:8000"
		},
		fd: {
			alias: "frontend-domain",
			describe: "Frontend domain for app dashboard",
			string: true,
			default: "http://localhost:3000"
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
	if(argv.ah) {
		installOptions["ah"] = argv.ah;
	}
	if(argv.bd) {
		installOptions["bd"] = argv.bd;
	}
	if(argv.fd) {
		installOptions["fd"] = argv.fd;
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
	process.env.BACKEND_URL = installOptions.bd;
	process.env.FRONTEND_URL = installOptions.fd;
	process.env.APP_HOST = installOptions.ah;

	if(installOptions.storage_mode === "local") {
		process.env.STORAGE_PORT = installOptions.storage_port;
		process.env.BASE_STORAGE_FOLDER = installOptions.storage_dir;
	}

	require("../packages/crusher-app/setup/tsconfig");
	require("../packages/crusher-server/setup/tsconfig");
	require("../packages/test-runner/setup/tsconfig");
	require("../packages/video-processor/setup/tsconfig");
	require("../packages/crusher-electron-app/setup/");
}

init();