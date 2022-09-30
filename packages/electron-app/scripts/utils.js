const fs = require("fs");
const path = require("path");

const DIST_DIR = path.resolve("../../output/crusher-electron-app-release/darwin");

// platfrom = mac | linux
function checkIfBuildPresent(platform, arch) {
	const dirContents = fs.readdirSync(DIST_DIR);
	const build = dirContents.find((item) => item.endsWith(`-${platform}-${arch}.zip`));
	if (!build) return null;
	return path.resolve(DIST_DIR, build);
}

module.exports = { checkIfBuildPresent };
