import { getMongoDBConnectionString } from "../../../config/database";
import { Service } from "typedi";

@Service()
export default class MongoManager {
	isConnected: boolean;

	constructor() {
		this.isConnected = false;
		this.init();
	}

	init() {
		const mongoose = require("mongoose");
		const connectionString = getMongoDBConnectionString();

		const _this = this;
		mongoose.connect(connectionString);

		mongoose.connection.on("connected", function () {
			_this.isConnected = true;
			console.log("Connected to mongodb successfully");
		});

		mongoose.connection.on("error", function (error) {
			_this.isConnected = false;
			console.log("Connection to mongodb failed:" + error);
		});

		mongoose.connection.on("disconnected", function () {
			_this.isConnected = false;
			console.log("Disconnected from mongodb");
		});

		process.on("SIGINT", function () {
			mongoose.connection.close(function () {
				_this.isConnected = false;
				console.log("Disconnected from mongodb through app termination");
				process.exit(0);
			});
		});
	}

	isAlive() {
		return this.isConnected;
	}
}
