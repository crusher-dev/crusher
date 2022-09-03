const fs = require('fs');
const path = require('path');
const semver = require("semver");
const { Octokit } = require("@octokit/rest");

const ELECTRON_PATH = path.resolve(process.cwd(), "./packages/electron-app");
const IS_CRUSHER_MASTER_RELEASE = process.env.github?.event === "release";

function updatePackageJsonVersion(version, path) {
    const package = JSON.parse(fs.readFileSync(path, "utf-8"));
    package.version = version;

    fs.writeFileSync(path, JSON.stringify(package, null, 2), "utf-8");
}
async function getLatestVersion(tag) {
   console.time("Calculating latest version");
   const octokit = new Octokit({ auth: process.env.CRUSHER_GIT_RELEASE_TOKEN });
   const release = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
        owner: 'crusher-dev',
        repo: IS_CRUSHER_MASTER_RELEASE? 'crusher-downloads': 'crusher-debug-downloads'
    });

    const releaseName = release.data.name;
    const releaseVersion = releaseName.substr(1);
    const newVersion = semver.inc(releaseVersion, "patch");
    console.timeEnd("Calculating latest version");
    return newVersion;
}

(async () => {
    const version = await getLatestVersion();
    console.log("Recorder version: v" + version);
    updatePackageJsonVersion(version, path.resolve(ELECTRON_PATH, "package.json"));
    updatePackageJsonVersion(version, path.resolve(ELECTRON_PATH, "package.release.json"));
})();