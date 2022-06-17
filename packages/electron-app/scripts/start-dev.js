const express = require("express");
const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");

const configs = require("../webpack/webpack.t");

const rendererConfig = configs[1];

const server = express();
const compiler = webpack(rendererConfig);
const port = 3000;

const message = "Could not find public path from configuration";
server.use(
	devMiddleware(compiler, {
		publicPath: "http://localhost:3000/",
	}),
);

server.use(hotMiddleware(compiler));

server.listen(port, "localhost", (err) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}

	console.log(`Server running at http://localhost:${3000}`);
});
