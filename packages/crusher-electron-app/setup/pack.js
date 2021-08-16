const builder = require("electron-builder");
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
      electronDist: path.resolve(__dirname, "../bin/linux"),
      electronVersion: "13.1.6",
      asar: false,
      protocols: {
        name: "electron-deep-linking",
        schemes: ["crusher"],
      }
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
