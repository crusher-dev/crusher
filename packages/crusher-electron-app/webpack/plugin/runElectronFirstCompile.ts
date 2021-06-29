import { exec } from "child_process";
const path = require("path");
const fs = require("fs");

const pluginName = "RunElectronOnFirstCompile";

class RunElectronOnFirstCompile {
	alreadyCompiled = false;
	apply(compiler) {
		compiler.hooks.done.tap(pluginName, (compilation) => {
			if (this.alreadyCompiled) return;

			const interval = setInterval(() => {
				if (fs.existsSync(path.resolve(__dirname, "../../../../output/crusher-electron-app/extension/manifest.json"))) {
					console.log("[Electron App] Running electron with extension now...");
					exec(`${path.resolve(__dirname, "../../bin/linux/crusher")} ${path.resolve(__dirname, "../../../../output/crusher-electron-app")}`);
					this.alreadyCompiled = true;
					clearInterval(interval);
				}
			}, 200);
		});
	}
}

module.exports = RunElectronOnFirstCompile;
