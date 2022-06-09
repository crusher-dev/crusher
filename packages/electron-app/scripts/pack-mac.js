const builder = require("electron-builder");
const Platform = builder.Platform;
const path = require("path");
const shell = require("shelljs");
const { notarize } = require("electron-notarize");

shell.exec(`cd ${path.resolve("../../output/crusher-electron-app/playwright")} && yarn install`);

// Promise is returned
builder
	.build({
		targets: Platform.MAC.createTarget(),
		publish: process.env.PUBLISH_RELEASE ? process.env.PUBLISH_RELEASE : "never",
		config: {
			productName: "Crusher Recorder",
			extraResources: [{ from: path.resolve("../../output/crusher-electron-app", "playwright/node_modules"), to: "app/playwright/node_modules" }],
			executableName: "Crusher Recorder",
			defaultArch: "arm64",
			publish:
				process.env.PUBLISH_RELEASE !== "always"
					? [
							{
								provider: "github",
								repo: "crusher-downloads",
								owner: "crusherdev",
								vPrefixedTagName: true,
								token: process.env.GITHUB_TOKEN,
								releaseType: "draft",
								private: false,
							},
					  ]
					: null,
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
			electronDist: path.resolve(__dirname, "../bin/darwin-arm64"),
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
	});
