import * as fs from "fs";
require("dotenv").config();

// Created this for proxy. Not be used in other cases
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const bodyParser = require("body-parser");
const url = require("url");

const SERVER_PROXY = new URL(process.env.FILE_SERVER_PROXY || "http://localhost:3001/");
const baseFolder = process.env.BASE_STORAGE_FOLDER || "/tmp/";

const serveStatic = require("serve-static");
const serve = serveStatic(baseFolder);
const finalhandler = require("finalhandler");

class LocalServer {
	baseFolder;
	bucketName;
	basePath;
	server;

	constructor(options) {
		this.baseFolder = options.baseFolder;
		this.bucketName = options.bucketName;
		this.basePath = path.join(this.baseFolder, this.bucketName);
		fs.mkdirSync(this.basePath, { recursive: true });

		this.server = new express();
		this.server.use(bodyParser.json({ limit: "50mb" }));
		this.server.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
		// allow cors
		this.server.use((req, res, next) => {
			res.header("Access-Control-Allow-Origin", `${"http://localhost:3000"}`);
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			res.header("Access-Control-Allow-Credentials", "true");
			next();
		});
		this.server.use(fileUpload());
		this.initRoutes();

		this.server.listen(3001);
		console.log("Server started");
	}

	initRoutes() {
		this.server.route("/health").get((req, res) => {
			res.send("OK");
		});

		this.server.route("/upload").post((req, res) => this.uploadFile(req, res));
		this.server.route("/get.url").post((req, res) => this.getUrl(req, res));

		this.server.route("/remove").post((req, res) => this.removeFile(req, res));
		this.server.use(serve);
	}

	getUrl(req, res) {
		const { destination } = req.body;
		res.send(url.resolve(SERVER_PROXY.toString(), `${this.bucketName}/${destination}`));
	}

	removeFile(req, res) {
		const { name } = req.body;
		if (!fs.existsSync(path.resolve(__dirname, name))) {
			res.send("Failed");
		} else {
			fs.unlinkSync(path.resolve(__dirname, name));
			res.send("OK");
		}
	}

	uploadFile(req, res) {
		const fileName = Object.keys(req.files)[0]; // <--- Alsao the relatve path where we want to save
		const file = req.files[fileName];
		const destinationPath = path.resolve(__dirname, this.basePath, fileName);

		fs.mkdirSync(path.parse(destinationPath).dir, { recursive: true });
		fs.writeFileSync(destinationPath, file.data);
		res.send(url.resolve(SERVER_PROXY.toString(), `${this.bucketName}/${fileName}`));
	}
}

new LocalServer({ baseFolder: baseFolder, bucketName: "crusher-videos" });
