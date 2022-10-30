const builder = require("electron-builder");
const Platform = builder.Platform;
const path = require("path");
const shell = require("shelljs");
const { notarize } = require("electron-notarize");
const { execSync } = require("child_process");
const { checkIfBuildPresent } = require("./utils");
const fs = require("fs");
// shell.exec(`cd ${path.resolve("../../output/crusher-electron-app/playwright")} && pnpm install`);

const getIsArm = () => {
	try {
		const isCurrentlyTranslated = execSync("sysctl sysctl.proc_translated", { stdio: "pipe" });

		return true;
	} catch (e) {
		// On non-ARM macs `sysctl sysctl.proc_translated` throws with
		// sysctl: unknown oid 'sysctl.proc_translated'
		return false;
	}
};

const IS_ARM = true || getIsArm();
// Promise is returned
builder
	.build({
		targets: Platform.MAC.createTarget(["zip"], "arm64", "x64"),
		// targets: Platform.MAC.createTarget(["zip"], "x64"),
		publish: process.env.PUBLISH_RELEASE ? process.env.PUBLISH_RELEASE : "never",
		config: {
			productName: "Crusher Recorder",
			extraResources: [{ from: path.resolve("../../output/crusher-electron-app", "playwright/node_modules"), to: "app/playwright/node_modules" }],
			executableName: "Crusher Recorder",
			artifactName: "Crusher.Recorder-${version}-mac-${arch}.${ext}",
			publish: null,
			afterSign: async (context) => {
				if (process.env.PUBLISH_RELEASE !== "always") return;

				const { electronPlatformName, appOutDir } = context;
				if (electronPlatformName !== "darwin") {
					return;
				}

				const appName = context.packager.appInfo.productFilename;

				return await notarize({
					appBundleId: "com.crusher.electron",
					appPath: `${appOutDir}/${appName}.app`,
					appleId: process.env.APPLE_ID,
					appleIdPassword: process.env.APPLE_ID_PASSWORD,
				});
			},
			appId: "com.crusher.electron",
			mac: {
				icon: "static/assets/icons/app.icns",
				category: "public.app-category.developer-tools",
				hardenedRuntime: true,
				entitlements: path.resolve(__dirname, "./entitlements.mac.plist"),
				entitlementsInherit: path.resolve(__dirname, "./entitlements.mac.plist"),
			},
			directories: {
				buildResources: path.resolve(__dirname, "../../../output/crusher-electron-app/"),
				app: path.resolve(__dirname, "../../../output/crusher-electron-app/"),
				output: path.resolve(__dirname, "../../../output/crusher-electron-app-release/darwin"),
			},
			electronDist: (options) => {
				if (options.arch === builder.Arch.arm64) {
					console.log("Choosing arm64");
					return path.resolve(__dirname, "../bin/darwin-arm64");
				}
				console.log("Choosing x64");
				return path.resolve(__dirname, "../bin/darwin-x64");
			},
			electronVersion: "13.1.6",
			asar: false,
			protocols: {
				name: "electron-deep-linking",
				schemes: ["crusher"],
			},
		},
	})
	.then((a) => {
		console.log("Completed", a);
		// handle result
	})
	.catch((error) => {
		console.error("Failed", error);
		// handle error
	})
	.finally((a) => {
		let distPath = null;
		if ((distPath = checkIfBuildPresent("mac", builder.Arch.x64))) {
			fs.renameSync(distPath, distPath.replace(`-${builder.Arch.x64}.zip`, `-x64.zip`));
		}
		if ((distPath = checkIfBuildPresent("mac", builder.Arch.arm64))) {
			fs.renameSync(distPath, distPath.replace(`-${builder.Arch.arm64}.zip`, `-arm64.zip`));
		}
	});
