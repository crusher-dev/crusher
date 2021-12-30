const builder = require("electron-builder");
const { Platform } = builder;
const path = require("path");
const shell = require("shelljs");

shell.exec(`cd ${path.resolve("../../output/crusher-electron-app/playwright")} && yarn install`);

// Promise is returned
builder
	.build({
		targets: Platform.LINUX.createTarget(["appimage", "deb"]),
		publish: process.env.PUBLISH_RELEASE || "never",
		config: {
			productName: "Crusher Recorder",
			extraResources: [{ from: path.resolve("../../output/crusher-electron-app", "playwright/node_modules"), to: "app/playwright/node_modules" }],
			executableName: "Crusher Recorder",
			appId: "com.crusher.electron",
			publish: [
				{
					provider: "github",
					repo: "crusher-downloads",
					owner: "crusherdev",
					vPrefixedTagName: true,
					token: process.env.GITHUB_TOKEN,
					releaseType: "draft",
				},
			],
			linux: {
				icon: "icons/app.icns",
			},
			mac: {
				category: "public.app-category.developer-tools",
			},
			directories: {
				buildResources: path.resolve(__dirname, "../../../output/crusher-electron-app/"),
				app: path.resolve(__dirname, "../../../output/crusher-electron-app/"),
				output: path.resolve(__dirname, "../../../output/crusher-electron-app-release/linux"),
			},
			electronDist: path.resolve(__dirname, "../bin/linux"),
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
