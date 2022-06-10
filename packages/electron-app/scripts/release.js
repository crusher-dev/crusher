const process = require("process");
const cp = require("child_process");

switch(process.platform) {
    case "darwin":
        process.env.ELECTRON_BUILD = "../../output/crusher-electron-app";
        process.env.DIST_DIR = "../../output/crusher-electron-app-release/darwin";
        process.env.APP_RESOURCE_DIR =`${process.env.DIST_DIR}/Electron.app/Contents/Resources`;
        
        cp.execSync(`mkdir -p ../../output/crusher-electron-app-release`);
        require("./pack-mac");
        break;
    case "linux":
        process.env.ELECTRON_BUILD = "../../output/crusher-electron-app";
        process.env.DIST_DIR = "../../output/crusher-electron-app-release/darwin";

        cp.execSync(`mkdir -p ../../output/crusher-electron-app-release`);
        require("./pack-linux");
        break;
    default:
        console.error("Unsupported platform: " + process.platform);
        process.exit(1);
}