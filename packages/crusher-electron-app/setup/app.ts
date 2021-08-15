import builder from "electron-builder";
const Platform = builder.Platform;
const path = require("path");

// Promise is returned
builder
	.build({
		targets: Platform.LINUX.createTarget(),
		config: {
			appId: "com.crusher.electron",
			mac: {
				category: "public.app-category.developer-tools",
      },
      directories: {
        app: path.resolve(__dirname, "../../../output/crusher-electron-app/"),
      },
		},
	})
	.then(() => {
		// handle result
	})
	.catch((error) => {
		// handle error
	});
