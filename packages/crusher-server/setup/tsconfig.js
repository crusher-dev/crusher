const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

require("dotenv").config();

const CRUSHER_MODE = process.env.CRUSHER_MODE ? process.env.CRUSHER_MODE : "open-source";
const STORAGE_MODE = process.env.STORAGE_MODE || "local";
const STORAGE_PORT = process.env.STORAGE_PORT || 3001;
const BASE_STORAGE_FOLDER = process.env.BASE_STORAGE_FOLDER || "/tmp";
const OVERRIDE_STORAGE_URL = process.env.OVERRIDE_STORAGE_URL || null;

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
	await copyTemplate(path.resolve(__dirname, ".env.ejs"), path.resolve(__dirname, "../.env"), {
		mode: CRUSHER_MODE,
		storageMode: STORAGE_MODE,
		storagePort: STORAGE_PORT,
		baseStorageFolder: BASE_STORAGE_FOLDER,
		OverrideStorageUrl: OVERRIDE_STORAGE_URL,
	});
}

setup();
