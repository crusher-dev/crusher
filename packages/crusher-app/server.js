// Valid only for production build.
// For dev, use next dev

require("dotenv").config();
// Created this for proxy. Not be used in other cases
const express = require("express");
const proxy = require("express-http-proxy");
const port = process.env.port || 3000;
const server = express();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

server.use(bodyParser({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ extended: false }));

server.use("/server", proxy(eval("process.env").NEXT_PUBLIC_INTERNAL_BACKEND_URL || "localhost:8000"));

// Expose storage folder if using local storage
// (Default Storage Method in OSS)
server.use("/output", proxy(eval("process.env").STORAGE_PROXY || "localhost:3001"));

const buildRegex = new RegExp(/^\/app\/build\/[\d]+/gm);
server.use(async (req, res, next) => {
	if (req.url === "" || req.url === "/") {
		const filePath = "out/index.html";
		serveFile(filePath, res);
		return;
	}

	// Special case for build dynamic url
	if (buildRegex.test(req.url)) {
		const filePath = "out/app/build/[id].html";
		serveFile(filePath, res);
		return;
	}

	try {
		const data = await fs.readFileSync(path.resolve(__dirname, "out" + getSanitizedPath(req.url) + (path.extname(req.url).length ? "" : ".html")));
		if (data !== null) {
			res.end(data);
			return;
		}
		next();
	} catch (e) {
		console.error("Error while handling route: ", e);
		next();
	}
});
// This is currently used for server, next build files
server.use("/", express.static("out"));

server.listen(port, (err) => {
	if (err) throw err;
	//eslint-disable-next-line
	console.log(`> Ready on http://localhost:${port}`);
});

function serveFile(filePath, res) {
	fs.readFile(filePath, function (err, data) {
		res.end(data);
	});
}

function getSanitizedPath(path) {
	path = path.split("?")[0];
	if (path.charAt(path.length - 1) === "/") {
		return unescape(path.substr(0, path.length - 1));
	}

	return unescape(path);
}
