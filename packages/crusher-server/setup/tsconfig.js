const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

require("dotenv").config();

const CRUSHER_MODE = process.env.CRUSHER_MODE ? process.env.CRUSHER_MODE : "open-source";

function copyTemplate(templateFilePath, destinationPath, params) {
	return new Promise((resolve, reject) => {
		ejs.renderFile(templateFilePath, params, (err, str) => {
			if (err) return reject(err);
			fs.writeFileSync(destinationPath, str);
			resolve(true);
		});
	});
}

async function setup() {
	shell.rm("-rf", "../tsconfig.json");
	shell.rm("-rf", path.resolve(__dirname, "../.env"));

	await copyTemplate(path.resolve(__dirname, ".tsconfig.json.ejs"), path.resolve(__dirname, "../tsconfig.json"), {
		isEnterprise: CRUSHER_MODE === "enterprise",
	});
	await copyTemplate(path.resolve(__dirname, ".env.ejs"), path.resolve(__dirname, "../.env"), { mode: CRUSHER_MODE });
}

setup();
