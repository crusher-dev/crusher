// Created this for proxy. Not be used in other cases
const express = require("express");
const next = require("next");
const proxy = require("express-http-proxy");
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = express();

	server.use("/server", proxy("localhost:8000"));
	// // This is currently used for
	server.use("/assets", express.static(".next/public/assets"));
	server.use("/js", express.static(".next/public/js"));
	server.use("/lotties", express.static(".next/public/lotties"));
	server.use("/svg", express.static(".next/public/svg"));
	server.all("*", (req, res) => {
		return handle(req, res);
	});

	const serverInstance = server.listen(port, (err) => {
		if (err) throw err;
		//eslint-disable-next-line
		console.log(`> Ready on http://localhost:${port}`);
	});
});
