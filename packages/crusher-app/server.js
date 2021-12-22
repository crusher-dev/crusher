// Valid only for production build.
// For dev, use next dev

require("dotenv").config();
// Created this for proxy. Not be used in other cases
const express = require("express");
const proxy = require("express-http-proxy");
const port = process.env.port || 3000;
const server = express();
const fs = require("fs");

const bodyParser = require("body-parser");

server.use(bodyParser({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ extended: false }));

server.use("/server", proxy("localhost:8000"));

// Expose storage folder if using local storage
// (Default Storage Method in OSS)
server.use("/output", proxy("localhost:3001"));

server.use(async (req, res, next) => {
	if (req.url === "" || req.url === "/") {
		const filePath = "out/index.html";
		serveFile(filePath, res);
		return;
	}

	try {
		const data = await fs.readFileSync("out" + getSanitizedPath(req.url) + ".html");
		if (data !== null) {
			res.end(data);
		}
		next();
	} catch (e) {
		next();
	}
});
// This is currently used for server, next build files
server.use("/", express.static("out"));

server.listen(port, (err) => {
	if (err) throw err;
	// eslint-disable-next-line
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
		return path.substr(0, path.length - 1);
	}

	return path;
}
