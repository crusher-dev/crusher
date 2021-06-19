const shell = require("shelljs");
const path = require("path");

require("dotenv").config();

const CRUSHER_MODE = process.env.CRUSHER_MODE ? process.env.CRUSHER_MODE : "open-source";

function getTSConfig() {
	try {
		return require("../tsconfig.json");
	} catch (ex) {
		return null;
	}
}

function handleEESetup() {
	const currentTSConfig = getTSConfig();

	if (currentTSConfig && currentTSConfig.isEnterprise == "true") {
		return;
	}

	shell.rm("-rf", "../tsconfig.json");
	shell.cp(path.resolve(__dirname, ".tsconfig.ee.json.template"), path.resolve(__dirname, "../tsconfig.json"));
}

function handleOpenSourceSetup() {
	const currentTSConfig = getTSConfig();

	if (currentTSConfig && currentTSConfig.isEnterprise != "true") {
		return;
	}

	shell.rm("-rf", path.resolve(__dirname, "../tsconfig.json"));
	shell.cp(path.resolve(__dirname, ".tsconfig.json.template"), path.resolve(__dirname, "../tsconfig.json"));
}

function init() {
	if (CRUSHER_MODE === "ee") {
		handleEESetup();
	} else {
		handleOpenSourceSetup();
	}
}

init();
