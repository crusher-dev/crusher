const fs = require('fs');
const path = require('path');
const child_process = require("child_process");
const ARTIFACTS_PATH = path.resolve(process.cwd(), "./packages/electron-app/bin");

(async () => {
    const artifacts = fs.readdirSync(ARTIFACTS_PATH);
    
    for(let artifact of artifacts)
        child_process.execSync("unzip " = artifact);
})();