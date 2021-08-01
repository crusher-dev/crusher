import { IDatabaseManager } from "@modules/db/interface";
import { ConnectionOptions, PoolOptions } from "mysql2";
import { Logger } from "@utils/logger";
import * as mysql from "mysql2/promise";

class MysqlDatabase implements IDatabaseManager {
	mysqlClient: any;

	constructor(config: ConnectionOptions & PoolOptions) {
		this.mysqlClient = mysql.createPool(config);
	}

	isConnectionAlive(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.mysqlClient
				.getConnection()
				.then((connection) => {
					connection.release();
					resolve(true);
				})
				.catch((err) => {
					Logger.error("Cannot connect to mysql database...", err);
					resolve(false);
				});
		});
	}

	insert(query: string, valuesToEscape: Array<string | number | boolean> | any = []) {
		return this.mysqlClient.query(query, valuesToEscape).then(([result]) => {
			if (!result.insertId) throw new Error("Some unexpected error occurred while inserting the row");
			return { insertId: result.insertId };
		});
	}

	update(query: string, valuesToEscape: Array<string | number | boolean> | any = []) {
		return this.mysqlClient.query(query, valuesToEscape).then(([result]) => {
			return { changedRows: result.changedRows };
		});
	}

	fetchSingleRow(query: string, valuesToEscape: Array<string | number | boolean> | any = []) {
		return this.mysqlClient.execute(query, valuesToEscape).then(([rows]) => {
			if (!rows.length) throw new Error("No row available for selection");
			return rows[0];
		});
	}

	fetchAllRows(query: string, valuesToEscape: Array<string | number | boolean> | any = []) {
		return this.mysqlClient.execute(query, valuesToEscape).then(([rows]) => {
			return rows;
		});
	}
}

export { MysqlDatabase };
