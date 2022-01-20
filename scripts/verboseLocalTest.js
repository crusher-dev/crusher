/**
 * @author David Spreekmeester <david@grrr.nl>
 */

const mysql = require('mysql2');
const Client = require('ssh2').Client;
const path = require('path');
const fs = require('fs');
const sh = require('shelljs');
const fetch = require('node-fetch');

var tunnel = (module.exports = {
	/**
	 * @var ssh2.Connection _conn The SSH connection
	 */
	_conn: null,

	/**
	 * @var mysql2.Connection _conn The MySQL connection
	 */
	_sql: null,

	/**
	 * @param obj sshConfig SSH Configuration as defined by ssh2 package
	 * @param obj dbConfig MySQL Configuration as defined by mysql(2) package
	 * @return Promise <mysql2 connection>
	 */
	connect: function (sshConfig, dbConfig) {
		dbConfig = tunnel._addDefaults(dbConfig);
		return new Promise(function (resolve, reject) {
			tunnel._conn = new Client();
			tunnel._conn
				.on('ready', function () {
					tunnel._conn.forwardOut('127.0.0.1', 12345, dbConfig.host, dbConfig.port, function (err, stream) {
						if (err) {
							tunnel.close();
							var msg = err.reason == 'CONNECT_FAILED' ? 'Connection failed.' : err;
							return reject(msg);
						}

						// override db host, since we're operating from within the SSH tunnel
						dbConfig.host = 'localhost';
						dbConfig.stream = stream;

						tunnel._sql = mysql.createConnection(dbConfig);
						resolve(tunnel._sql);
					});
				})
				.connect(sshConfig);
		});
	},

	close: function () {
		if ('end' in tunnel._sql) {
			tunnel._sql.end(function (err) {});
		}

		if ('end' in tunnel._conn) {
			tunnel._conn.end();
		}
	},

	_addDefaults(dbConfig) {
		if (!('port' in dbConfig)) {
			dbConfig.port = 3306;
		}

		if (!('host' in dbConfig)) {
			dbConfig.host = 'localhost';
		}

		return dbConfig;
	},
});

const yargs = require('yargs');
const browserChoices = ['safari', 'firefox', 'chrome'];

const installOptions = {};

function preParseArgv() {
	const argv = yargs
		.options({
			id: {
				describe: 'Id of the test',
				string: true,
			},
			browser: {
				describe: 'Browser to run test against',
				choices: browserChoices,
				default: 'chrome',
			},
		})
		.help()
		.alias('help', 'h').argv;

	if (argv.id) {
		installOptions['id'] = argv.id;
	}
	if (argv.id) {
		installOptions['browser'] = argv.browser;
	}
}

async function init() {
	preParseArgv();
	if (!installOptions.id) {
		console.error('Error: No test id specified');
		process.exit(1);
	}

	fetch(`http://localhost:8000/tests/${installOptions.id}`, { method: 'GET' })
		.then(async (res) => {
			const responseText = await res.text();
			const result = JSON.parse(responseText);
			const actionsFilePath = '/tmp/testActions.json';

			fs.writeFileSync(actionsFilePath, JSON.stringify(result.events));

			const {} = sh.exec(`yarn workspace test-runner generate:local --file="${actionsFilePath}" --browser=${installOptions.browser}`, {});
			const {} = sh.exec(`yarn workspace test-runner run:local`, {});
		})
		.catch((err) => {
			console.log(err);
		});
}

init();
