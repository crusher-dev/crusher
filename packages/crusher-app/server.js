// Valid only for production build.
// For dev, use next dev

require("dotenv").config();
// Created this for proxy. Not be used in other cases
const express = require("express");
const proxy = require("express-http-proxy");
const port = process.env.port || 3000;
const server = express();

const bodyParser = require("body-parser");

	server.use(bodyParser({ limit: "50mb" }));
	server.use(bodyParser.urlencoded({ extended: false }));

	server.use("/server", proxy("localhost:8000"));

	// Expose storage folder if using local storage
	// (Default Storage Method in OSS)
	if (process.env.NEXT_PUBLIC_CRUSHER_MODE === "open-source") {
		server.use("/output", proxy("localhost:3001"));
	}

	// This is currently used for server
	server.use("/", express.static("out"));
	server.all("*", (req, res) => {
		return handle(req, res);
	});

	server.listen(port, (err) => {
		if (err) throw err;
		//eslint-disable-next-line
		console.log(`> Ready on http://localhost:${port}`);
	});
