const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

function copyTemplate(templateFilePath, destinationPath, params) {
	return new Promise((resolve, reject) => {
		ejs.renderFile(templateFilePath, params, (err, str) => {
			if (err) return reject(err);
			fs.writeFileSync(destinationPath, str);
			resolve(true);
		});
	});
}

async function index() {
	shell.rm("-rf", path.resolve(__dirname, "../.env"));

	await copyTemplate(path.resolve(__dirname, ".env.ejs"), path.resolve(__dirname, "../.env"), {
		appHost: process.env.APP_HOST,
		backendUrl: process.env.BACKEND_URL,
		frontendUrl: process.env.FRONTEND_URL,
	});
}

index();
