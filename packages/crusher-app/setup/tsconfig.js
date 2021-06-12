const shell = require("shelljs");
const path = require("path");

require("dotenv").config();

const CRUSHER_MODE = process.env.CRUSHER_MODE ? process.env.CRUSHER_MODE : "open-source";

(function init() {

	const isEE = CRUSHER_MODE === "ee";

	shell.rm("-rf", "../tsconfig.json");
	shell.cp(path.resolve(__dirname, `${isEE ? "src_ee/" : ''}.tsconfig.json.template`), path.resolve(__dirname, "../tsconfig.json"));

})()


