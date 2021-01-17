import { getMongoDBConnectionString } from "../../../config/database";

export default class MongoManager {
	constructor() {}

	init() {
		const mongoose = require("mongoose");

		const connectionString = getMongoDBConnectionString();
		console.log("This is connection string", connectionString);
		mongoose.connect(connectionString);

		mongoose.connection.on("connected", function () {
			console.log("Connected to mongodb failed");
		});

		mongoose.connection.on("error", function (error) {
			console.log("Connection to mongodb failed:" + error);
		});

		mongoose.connection.on("disconnected", function () {
			console.log("Disconnected from mongodb");
		});

		process.on("SIGINT", function () {
			mongoose.connection.close(function () {
				console.log("Disconnected from mongodb through app termination");
				process.exit(0);
			});
		});
	}
}
