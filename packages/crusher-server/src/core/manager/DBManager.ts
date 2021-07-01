import { InternalServerError } from "routing-controllers";
import { Logger } from "../../utils/logger";
import * as chalk from "chalk";
import { Service } from "typedi";
import { Pool } from "mysql2";

const mysql = require("mysql2");

@Service()
export default class DBManager {
	private connPool: Pool;

	constructor() {
		this.connPool = mysql.createPool({
			connectionLimit: process.env.DB_CONNECTION_POOL || 10,
			host: process.env.DB_HOST || "localhost",
			user: process.env.DB_USERNAME,
			port: process.env.DB_PORT,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			insecureAuth: true,
		});
	}

	isAlive(): Promise<boolean> {
		return new Promise((resolve) => {
			this.connPool.getConnection((err, connection) => {
				connection.release();
				if (err) return resolve(false);
				return resolve(true);
			});
		});
	}

	queryRunner(query: string, valuesToEscape = null): Promise<any> {
		const queryToExecute = valuesToEscape && valuesToEscape.length ? this.bindValues(query, valuesToEscape) : query;
		const startHrTime = process.hrtime();

		return new Promise((resolve, reject) => {
			this.connPool.query(queryToExecute, (error, result, fields) => {
				const elapsedHrTime = process.hrtime(startHrTime);
				const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

				if (error) {
					Logger.error("DbManager::queryRunner", `Failed running query (${chalk.whiteBright.bold(elapsedTimeInMs)} ms)`, { queryToExecute });
					console.error(error);
					return reject(error);
				}
				Logger.debug("DbManager::queryRunner", `Executing Query (${chalk.whiteBright.bold(elapsedTimeInMs)} ms)`, {
					queryToExecute,
				});
				resolve(result);
			});
		});
	}

	bindValues = (query, values): any => {
		const _sql = mysql.format(query, values);
		return _sql;
	};

	insertData = async (command: any, ...valuesToEscape: any[]): Promise<any> => {
		try {
			const queryResults = await this.queryRunner(command, valuesToEscape);
			return queryResults;
		} catch (e) {
			throw new InternalServerError("Some internal error occurred");
		}
	};

	fetchData = async (command, valuesToEscape = null): Promise<any> => {
		try {
			const queryResults = await this.queryRunner(command, valuesToEscape);
			return queryResults;
		} catch (e) {
			throw new InternalServerError("Some internal error occurred");
		}
	};

	fetchSingleRow = async (command, valuesToEscape = null): Promise<any> => {
		try {
			const queryResults = await this.queryRunner(command, valuesToEscape);
			if (queryResults && queryResults.length) {
				return queryResults[0];
			}

			// Otherwise send nothing
			return null;
		} catch (e) {
			throw new InternalServerError(`Something went wrong with executing this query: ${command} ${e} `);
		}
	};

	checkIfRowExists = async (command, valuesToEscape = null): Promise<any> => {
		const data = await this.fetchSingleRow(command, valuesToEscape);

		return !!data;
	};
}
