require("dotenv").config();
// Created this for proxy. Not be used in other cases
const express = require("express");
const next = require("next");
const proxy = require("express-http-proxy");
const port = process.env.port || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, conf: require("./next.config") });
const handle = app.getRequestHandler();
const bodyParser = require("body-parser");

app.prepare().then(() => {
	const server = express();
	server.use(bodyParser({ limit: "50mb" }));
	server.use(bodyParser.urlencoded({ extended: false }));

	server.use("/server", proxy("localhost:8000"));

	// Expose storage folder if using local storage
	// (Default Storage Method in OSS)
	server.use("/output", proxy("localhost:3001"));

	// // This is currently used for
	server.use("/assets", express.static(".next/public/assets"));
	server.use("/js", express.static(".next/public/js"));
	server.use("/lotties", express.static(".next/public/lotties"));
	server.use("/svg", express.static(".next/public/svg"));
	server.all("*", (req, res) => {
		return handle(req, res);
	});

	server.listen(port, (err) => {
		if (err) throw err;
		//eslint-disable-next-line
		console.log(`> Ready on http://localhost:${port}`);
	});
});
