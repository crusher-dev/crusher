const fs = require('fs');
const path = require('path');
const axios = require("axios");
const semver = require("semver");
const url = require("url");
const packageJSON = require("../package.json");

if (process.env.PACKAGE_NAME) {
  packageJSON.name = process.env.PACKAGE_NAME;
  delete packageJSON["private"];
}

const patchVersion = (versionStr) => {
  return semver.inc(versionStr, "patch");
};

(async () => {
  axios.get(url.resolve("https://registry.npmjs.org/", packageJSON.name)).then((res) => {
    const latestVersion = res.data["dist-tags"].latest;
    // Patch from the current package version
    packageJSON.version = patchVersion(latestVersion);
    if (fs.existsSync(path.resolve(__dirname, "../../../output/crusher-cli/package.json"))) {
      fs.unlinkSync(path.resolve(__dirname, "../../../output/crusher-cli/package.json"));
    }
    
    fs.writeFileSync(path.resolve(__dirname, "../../../output/crusher-cli/package.json"), JSON.stringify(packageJSON), "utf8");  
  }).catch((err) => {
    console.error("Error making request to npm registy");
  })
})();


