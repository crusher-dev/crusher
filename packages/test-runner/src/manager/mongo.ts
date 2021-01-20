import { getMongoDBConnectionString } from '../../config/database';

export class MongoManager {
	constructor() {}

	init() {
		const mongoose = require('mongoose');

		const connectionString = getMongoDBConnectionString();

		mongoose.connect(connectionString);

		mongoose.connection.on('connected', function () {
			console.log('Connected to ' + connectionString);
		});

		mongoose.connection.on('error', function (error) {
			console.log('Connection to ' + connectionString + ' failed:' + error);
		});

		mongoose.connection.on('disconnected', function () {
			console.log('Disconnected from ' + connectionString);
		});

		process.on('SIGINT', function () {
			mongoose.connection.close(function () {
				console.log('Disconnected from ' + connectionString + ' through app termination');
				process.exit(0);
			});
		});
	}
}
