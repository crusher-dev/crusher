const fs = require('fs');
const path = require('path');

const packageJSON = require("../package.json");

if (process.env.PACKAGE_NAME) {
  packageJSON.name = process.env.PACKAGE_NAME;
}

if (fs.existsSync("./dist/package.json")) {
  fs.unlinkSync("./dist/package.json");
}

fs.writeFileSync("./dist/package.json", JSON.stringify(packageJSON), "utf8");