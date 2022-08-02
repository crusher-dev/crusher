const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BIN_DIR = path.resolve(__dirname, "../bin");
const celectronRegExp = new RegExp(/^celectron-v([\d.]+)-(linux|darwin)-(x64|arm64).zip/);

function extractZipIfNotThere(binaryZipInfoArr) {
	const platforms = Object.keys(binaryZipInfoArr);

	console.log("Extracting binaries now...");
	
	for (let platform of platforms) {
		if (fs.existsSync(path.resolve(BIN_DIR, platform))) {
			console.log(`Binaries already extracted for ${platform}. Skipping...`);
			break;
		}
		const zipPath = binaryZipInfoArr[platform].path;
		console.log(`Running ` + `cd ${path.dirname(zipPath)} && unzip ${path.basename(zipPath)} -d ${platform}`);
		const output = execSync(`cd ${path.dirname(zipPath)} && unzip ${path.basename(zipPath)} -d ${platform}`);
		console.log("output is", output.toString());
		fs.unlinkSync(binaryZipInfoArr[platform].path);
	}
}

function init() {
	if (fs.existsSync(path.resolve(BIN_DIR, "linux")) && fs.existsSync(path.resolve(BIN_DIR, "darwin"))) {
		console.log("Binaries are already downloaded and extracted. Skipping...");
		return;
	}

	fs.mkdirSync(BIN_DIR, { recursive: true });

	const entries = fs.readdirSync(BIN_DIR, { withFileTypes: true });
	const binaryZipEntries = entries.filter((entry) => entry.isFile() && entry.name.match(celectronRegExp));
	const binaryZipsInfo = binaryZipEntries.reduce((prev, zipEntry) => {
		const regexGroups = zipEntry.name.match(celectronRegExp);
		const platformName = regexGroups[2] + "-" + regexGroups[3];
		return { ...prev, [platformName]: { path: path.resolve(BIN_DIR, regexGroups[0]), version: regexGroups[1], platform: platformName } };
	}, {});

	extractZipIfNotThere(binaryZipsInfo);
}

init();
