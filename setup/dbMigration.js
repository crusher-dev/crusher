var path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
var mysql = require('mysql2');
var fs = require('fs');
console.log('Running db migration script now...');

var IS_HEROKU = process.env.IS_HEROKU;
var connectionString = IS_HEROKU ? process.env.CLEARDB_DATABASE_URL : process.env.DB_CONNECTION_STRING;

var connectionObject = connectionString
	? { uri: connectionString }
	: {
			host: process.env.DB_HOST || 'localhost',
			port: process.env.DB_PORT,
			user: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE || 'crusher',
			insecureAuth: true,
	  };
var connection = mysql.createConnection(
	Object.assign(connectionObject, {
		multipleStatements: true,
	}),
);

var schema = fs.readFileSync(path.resolve(__dirname, '../db/schema.sql'));

connection.query('SHOW TABLES', function (err, results) {
	if (err) throw err;
	if (results.length) {
		console.debug('DB already bootstrap-ed... Exiting now...');
		process.exit(0);
	}

	connection
		.promise()
		.query(schema.toString())
		.then(function () {
			console.log('Finished running all db migrations... Done...');
			connection.close();
			process.exit(0);
		})
		.catch(function (err) {
			console.error('Some error occured while running migration', err);
			connection.release();
			process.exit(1);
		});
});
