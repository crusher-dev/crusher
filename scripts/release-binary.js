const fs = require('fs');
const path = require('path');

const ARTIFACTS_PATH = path.resolve(process.cwd(), "./packages/electron-app/bin");

(async () => {
    const artifacts = fs.readdirSync(ARTIFACTS_PATH);
    console.log(artifacts);
})();