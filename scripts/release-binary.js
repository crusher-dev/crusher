const fs = require('fs');
const path = require('path');
const child_process = require("child_process");
const ARTIFACTS_PATH = path.resolve(process.cwd(), "./artifacts");

(async () => {
    const distPath = path.resolve(ARTIFACTS_PATH, "dist");
    if(fs.existsSync(distPath)) {
        fs.rmdirSync(distPath, {recursive: true});
    }

    const artifacts = fs.readdirSync(ARTIFACTS_PATH);
    process.chdir(ARTIFACTS_PATH);

    for(let artifact of artifacts) {
        console.time("Extracting " + artifact);
        child_process.execSync("unzip " + artifact + " -d dist");
        console.timeEnd("Extracting " + artifact);
    }
})();