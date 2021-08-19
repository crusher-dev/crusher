import { Service } from "typedi";
import * as mongoose from "mongoose";

const IMongoStatus = {
	CONNECTING: "CONNECTING",
	CONNECTED: "CONNECTED",
	DISCONNECTED: "DISCONNECTED",
};

function getConnectionString() {
	if (process.env.MONGODB_CONNECTION_STRING && process.env.MONGODB_CONNECTION_STRING !== "null") {
		return process.env.MONGODB_CONNECTION_STRING;
	}
	const host = process.env.MONGODB_HOST;
	const port = process.env.MONGODB_PORT;
	const username = process.env.MONGODB_USERNAME;
	const password = process.env.MONGODB_PASSWORD;
	const database = process.env.MONGODB_DATABASE;

	return `mongodb://${username}${password ? `:${password}` : ""}@${host}:${port}/${database}`;
}

@Service()
class MongoManager {
	status: string;
	mongoClient: typeof mongoose;

	constructor() {
		this.status = IMongoStatus.CONNECTING;
		this.init();
	}

	private async init() {
		this.mongoClient = await mongoose.connect(getConnectionString());

		this.mongoClient.connection.on("connected", this.onConnected.bind(this));
		this.mongoClient.connection.on("error", this.onError.bind(this));
		this.mongoClient.connection.on("disconnected", this.onDisconnected.bind(this));

		// To make sure mongodb connection closes
		process.on("SIGINT", async function () {
			await mongoose.connection.close();
			process.exit(0);
		});
	}

	private onConnected() {
		this.status = IMongoStatus.CONNECTED;
	}

	private onError() {
		this.status = IMongoStatus.DISCONNECTED;
	}

	private onDisconnected() {
		this.status = IMongoStatus.DISCONNECTED;
	}

	isAlive(): boolean {
		return this.status === IMongoStatus.CONNECTED;
	}

	waitUntilAlive(): Promise<boolean> {
		return new Promise((resolve) => {
			setInterval(() => {
				if (this.isAlive()) {
					resolve(true);
				}
			}, 500);
		});
	}
}

export { MongoManager };
