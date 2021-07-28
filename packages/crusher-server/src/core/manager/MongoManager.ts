import { getMongoDBConnectionString } from "../../../config/database";
import { Service } from "typedi";

const IMongoStatus = {
	CONNECTING: "CONNECTING",
	CONNECTED: "CONNECTED",
	DISCONNECTED: "DISCONNECTED",
};

@Service()
export default class MongoManager {
	status: string;

	constructor() {
		this.status = IMongoStatus.CONNECTING;
		this.init();
	}

	init() {
		const mongoose = require("mongoose");
		const connectionString = getMongoDBConnectionString();

		const _this = this;
		mongoose.connect(connectionString);

		mongoose.connection.on("connected", function () {
			_this.status = IMongoStatus.CONNECTED;
			console.log("Connected to mongodb successfully");
		});

		mongoose.connection.on("error", function (error) {
			_this.status = IMongoStatus.DISCONNECTED;
			console.log("Connection to mongodb failed:" + error);
		});

		mongoose.connection.on("disconnected", function () {
			_this.status = IMongoStatus.DISCONNECTED;
			console.log("Disconnected from mongodb");
		});

		process.on("SIGINT", function () {
			mongoose.connection.close(function () {
				_this.status = IMongoStatus.DISCONNECTED;
				console.log("Disconnected from mongodb through app termination");
				process.exit(0);
			});
		});
	}

	isAlive(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			setInterval(() => {
				if (this.status === IMongoStatus.DISCONNECTED) {
					return resolve(false);
				} else if (this.status === IMongoStatus.CONNECTED) {
					resolve(true);
				}
			}, 500);
		});
	}
}
