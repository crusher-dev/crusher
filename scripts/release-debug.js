/**
 * Extract the same code for production build, when new release is built.
 * Create release every 7 days, upload it to crusher-downloads. bump a version.
 */
const fs = require('fs');
const path = require('path');
const child_process = require("child_process");
const ARTIFACTS_PATH = path.resolve(process.cwd(), "./artifacts");
const DIST_PATH = path.resolve(ARTIFACTS_PATH, "dist");
const { Octokit } = require("@octokit/rest");

const IS_CRUSHER_MASTER_RELEASE = process.env.github?.event === "release";

async function createRelease(tag) {
    const octokit = new Octokit({ auth: process.env.CRUSHER_GIT_RELEASE_TOKEN });

    const release = await octokit.request('POST /repos/{owner}/{repo}/releases', {
        owner: 'crusher-dev',
        repo: IS_PRODUCTION? 'crusher-downloads': 'crusher-debug-downloads',
        tag_name: tag,
        target_commitish: 'main',
        name: tag,
        body: tag,
        draft: false,
        prerelease: false,
        generate_release_notes: false
    });
    const releaseId = release && release.data && release.data.id ? release.data.id : null;
    if(!releaseId) throw new Error('Failed to create release');

    const dists = fs.readdirSync(DIST_PATH);
    
    console.time("Uploading release assets");
    const uploadPromises = [];
    for(let distFile of dists) {
        uploadPromises.push(octokit.request({
            method: "POST",
            url: release.data.upload_url,
            headers: {
              "content-type": "application/zip",
            },
            data: fs.readFileSync(path.resolve(DIST_PATH, distFile)),
            name: distFile,
            label: distFile,
        }));
    }
    await Promise.all(uploadPromises);
    console.timeEnd("Uploading release assets");
}
(async () => {
    if(fs.existsSync(DIST_PATH)) {
        fs.rmdirSync(DIST_PATH, {recursive: true});
    }
    const artifacts = fs.readdirSync(ARTIFACTS_PATH);
    // Create dist directory now
    fs.mkdirSync(DIST_PATH);

    process.chdir(ARTIFACTS_PATH);

    for(let artifact of artifacts) {
        const files = fs.readdirSync(path.resolve(ARTIFACTS_PATH, artifact));
        console.time("Moving " + files[0] + " to ../dist");
        child_process.execSync(`cd ${artifact} && cp ` + files[0] + ` ../dist`);
        console.timeEnd("Moving " + files[0] + " to ../dist");
    }

    const dists = fs.readdirSync(DIST_PATH);
    const [_, version] = new RegExp(/Crusher\.Recorder\-([\d.]*)\-/gm).exec(dists[0]);

    await createRelease("v" + version);
    process.chdir(path.resolve(ARTIFACTS_PATH, '../'));

    child_process.execSync(`cd packages/cli && RECORDER_VERSION=${version} pnpm ${IS_CRUSHER_MASTER_RELEASE? 'build': 'build:debug'}`);
    const dir = fs.readdirSync(path.resolve(process.cwd(), "output/crusher-cli"));
    console.log("Dir is", dir);
})();