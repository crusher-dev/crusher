import { CodeGenerator } from "code-generator/src/generator";
import * as fs from "fs";
import { js as beautify } from "js-beautify";
import { BrowserEnum, PlaywrightBrowserMap } from "../../crusher-shared/types/browser";
import * as path from "path";

import yargs from "yargs";

const browserChoices = ["safari", "firefox", "chrome"];

const installOptions: { file?: string; browser?: string } = {};

function preParseArgv() {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore

	const argv = yargs
		.options({
			file: {
				describe: "Path to temp address file",
				string: true,
			},
			browser: {
				describe: "Browser to run test against",
				choices: browserChoices,
				default: "chrome",
			},
		})
		.help()
		.alias("help", "h").argv;

	console.log("Argv are", argv);

	if (argv.file) {
		installOptions["file"] = argv.file;
	}
	if (argv.browser) {
		installOptions["browser"] = argv.browser;
	}
}

preParseArgv();

if (!fs.existsSync(installOptions.file)) throw new Error("Test action file doesn't exist, " + installOptions.file);

function _getBrowser(browser) {
	if (browser === "safari") {
		return BrowserEnum.SAFARI;
	}
	if (browser === "firefox") {
		return BrowserEnum.FIREFOX;
	}
	if (browser === "chrome") {
		return BrowserEnum.CHROME;
	}
	return undefined;
}

const browser = _getBrowser(installOptions.browser);

if (!browser) throw new Error("Invalid browser passed");

const codeGenerator = new CodeGenerator({
	shouldRecordVideo: true,
	defaultBrowserLaunchOptions: {
		headless: false,
		args: [],
	},
	usePlaywrightChromium: false,
	videoSavePath: "/tmp/crusher-videos/somedir",
	browser: PlaywrightBrowserMap[browser] as any,
	turnOnTracing: true,
	tracePath: path.resolve(__dirname, "../bin/trace.zip"),
	assetsDir: `/tmp/crusher/somedir/`,
});

const events = JSON.parse(fs.readFileSync(installOptions.file, "utf8"));

codeGenerator.getCode(events as any).then((jsCode: string) => {
	fs.writeFileSync(
		"bin/out.ts",
		beautify(
			`(async function() {\n` +
				`class GlobalManagerPolyfill { map; constructor(){this.map = new Map();} has(key) {return this.map.has(key); } get(key) { return this.map.get(key); } set(key,value){this.map.set(key,value);} } class LogManagerPolyfill { logStep(...args) { console.log(args[2]); }} class StorageManagerPolyfill { uploadBuffer(buffer, destionation) { return "uploadBuffer.jpg"; } upload(filePath, destination) { return "upload.jpg"; } remove(filePath) { return "remove.jpg"; }} const logManager = new LogManagerPolyfill(); const storageManager = new StorageManagerPolyfill(); const globalManager = new GlobalManagerPolyfill();` +
				jsCode +
				`})()`,
		),
	);

	console.log("Generated code for recorded actions");
});
