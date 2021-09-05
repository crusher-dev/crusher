const builder = require("electron-builder");
const Platform = builder.Platform;
const path = require("path");

// Promise is returned
builder
	.build({
		targets: Platform.MAC.createTarget(),
		config: {
			productName: "Crusher Recorder",
			executableName: "Crusher Recorder",
			appId: "com.crusher.electron",
			mac: {
				icon: "icons/app.icns",
				category: "public.app-category.developer-tools",
			},
			directories: {
				buildResources: path.resolve(__dirname, "../../../output/crusher-electron-app/"),
				app: path.resolve(__dirname, "../../../output/crusher-electron-app/"),
				output: path.resolve(__dirname, "../../../output/crusher-electron-app-release/darwin"),
			},
			electronDist: path.resolve(__dirname, "../bin/darwin"),
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
