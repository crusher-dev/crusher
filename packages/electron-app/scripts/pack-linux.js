const builder = require("electron-builder");
const Platform = builder.Platform;
const path = require("path");
const shell = require("shelljs");
const { execSync } = require("child_process");
console.log(`Path is ${path.resolve("../../node_modules/playwright-core")}`);
// execSync(`cd ${path.resolve("../../output/crusher-electron-app/playwright")} && cp -R ${path.resolve(__dirname, "../node_modules/playwright-core")} ./node_modules/playwright-core/`);

// Promise is returned
builder
	.build({
		targets: Platform.LINUX.createTarget(["zip"]),
		publish: process.env.PUBLISH_RELEASE ? process.env.PUBLISH_RELEASE : "never",
		config: {
			productName: "Crusher Recorder",
			extraResources: [{ from: path.resolve("../../output/crusher-electron-app", "playwright/node_modules"), to: "app/playwright/node_modules" }],
			executableName: "Crusher Recorder",
			appId: "com.crusher.electron",
			artifactName: "Crusher.Recorder-${version}-linux.${ext}",
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
				icon: "static/assets/icons/app.png",
			},
			mac: {
				category: "public.app-category.developer-tools",
			},
			directories: {
				buildResources: path.resolve(__dirname, "../../../output/crusher-electron-app/"),
				app: path.resolve(__dirname, "../../../output/crusher-electron-app/"),
				output: path.resolve(__dirname, "../../../output/crusher-electron-app-release/linux"),
			},
			electronDist: path.resolve(__dirname, "../bin/linux-x64"),
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
