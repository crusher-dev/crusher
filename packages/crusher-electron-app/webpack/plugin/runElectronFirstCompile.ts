import { exec } from "child_process";
const path = require("path");
const fs = require("fs");

const pluginName = "RunElectronOnFirstCompile";

class RunElectronOnFirstCompile {
	alreadyCompiled = false;

	runElectronApp(platform){
		switch(platform) {
			case "linux":
				exec(`${path.resolve(__dirname, "../../bin/linux/crusher")} ${path.resolve(__dirname, "../../../../output/crusher-electron-app")}`);
				break;
			case "darwin":
				exec(`${path.resolve(__dirname, "../../bin/darwin/Electron.app/Contents/MacOS/Electron")} ${path.resolve(__dirname, "../../../../output/crusher-electron-app")}`);
				break;
			default:
				throw new Error("This OS is not supported. Only linux and darwin are supported...");
		}
	}

	apply(compiler) {
		compiler.hooks.done.tap(pluginName, (compilation) => {
			if (this.alreadyCompiled) return;

			const interval = setInterval(() => {
				if (fs.existsSync(path.resolve(__dirname, "../../../../output/crusher-electron-app/extension/manifest.json"))) {
					console.log("[Electron App] Running electron with extension now...");
					this.runElectronApp(process.platform);
					this.alreadyCompiled = true;
					clearInterval(interval);
				}
			}, 200);
		});
	}
}

module.exports = RunElectronOnFirstCompile;
