const tasks = require("./tasks");

(async () => {
	console.log("[Bundle templates]");
	console.log("-".repeat(80));
	await tasks.bundleTemplates("build");
	console.log("-".repeat(80));

	console.log("[Webpack Build]");
	console.log("-".repeat(80));
})();
