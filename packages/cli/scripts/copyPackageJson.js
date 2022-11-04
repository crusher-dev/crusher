const fs = require('fs');
const path = require('path');
const axios = require("axios");
const semver = require("semver");
const url = require("url");
const packageJSON = require("../package.json");

if (process.env.PACKAGE_NAME) {
  packageJSON.name = process.env.PACKAGE_NAME;
  packageJSON.bin = {
    [packageJSON.name]: "./src/bin/index.js",
  }
  delete packageJSON["private"];
}

const patchVersion = (versionStr) => {
  if(!process.env.IS_CRUSHER_MASTER_RELEASE) {
    return semver.inc(versionStr, "prepatch", "canary");
  }
  return semver.inc(versionStr, "patch");
};

(async () => {
  const version = await axios.get(url.resolve("https://registry.npmjs.org/", packageJSON.name)).then((res) => {
    const latestVersion = res.data["dist-tags"].latest;
    return latestVersion;
  }).catch((err) => null);

    // Patch from the current package version
  packageJSON.version = version ? patchVersion(version) : "0.0.1";
  if (fs.existsSync(path.resolve(__dirname, "../../../output/crusher-cli/package.json"))) {
    fs.unlinkSync(path.resolve(__dirname, "../../../output/crusher-cli/package.json"));
  }

  fs.writeFileSync(path.resolve(__dirname, "../../../output/crusher-cli/package.json"), JSON.stringify(packageJSON), "utf8");  
  fs.writeFileSync(path.resolve(__dirname, "../../../output/crusher-cli/package.json"), JSON.stringify(packageJSON), "utf8");  
})();


