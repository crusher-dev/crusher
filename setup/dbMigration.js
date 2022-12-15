var path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
var { Pool } = require('pg');
var fs = require('fs');
console.log('Running db migration script now...');

var connectionObject = {
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	insecureAuth: true,
};

const connection = new Pool(connectionObject);

function waitAndGetConnection() {
	return new Promise(function (resolve, reject) {
		var currentTime = 0;
		var interval = setInterval(async function () {
			if (currentTime >= 300000) {
				clearInterval(interval);
				reject(new Error("Can't connect to postgres in last 5 minutes"));
			}

			console.log('Waiting for postgres to completely start...');
			try {
				await connection.connect();
				resolve(true);
			} catch (ex) {
				console.log("Can't connect to postgres...");
				console.error(ex);
			}
			currentTime += 5000;
		}, 5000);
	});
}

waitAndGetConnection().then(async () => {
	const connection = new Pool(connectionObject);
	var schema = fs.readFileSync(path.resolve(__dirname, '../packages/crusher-server/db/schema.sql'));
	connection
		.query(schema.toString())
		.then(function () {
			console.log('Finished running all db migrations... Done...');
			process.exit(0);
		})
		.catch(function (err) {
			console.error('Some error occured while running migration', err);
			process.exit(1);
		});
});

