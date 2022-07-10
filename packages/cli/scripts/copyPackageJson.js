const fs = require('fs');
const path = require('path');

const packageJSON = require("../package.json");

if (process.env.PACKAGE_NAME) {
  packageJSON.name = process.env.PACKAGE_NAME;
}

if (fs.existsSync(path.resolve(__dirname, "../../../output/crusher-cli/package.json"))) {
  fs.unlinkSync(path.resolve(__dirname, "../../../output/crusher-cli/package.json"));
}

fs.writeFileSync(path.resolve(__dirname, "../../../output/crusher-cli/package.json"), JSON.stringify(packageJSON), "utf8");