import { IDatabaseManager } from "@modules/db/interface";
import { ConnectionOptions, PoolOptions } from "mysql2";
import * as mysql from "mysql2/promise";

class MysqlDatabase implements IDatabaseManager {
	mysqlClient: any;

	constructor(config: ConnectionOptions & PoolOptions) {
		this.mysqlClient = mysql.createPool(config);
		console.log("Ds")
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
					console.error("Cannot connect to mysql database...", err);
					resolve(false);
				});
		});
	}

	insert(query: string, valuesToEscape: Array<string | number | boolean> | any = []) {
		console.log("[INSERT SQL QUERY]", query, valuesToEscape);

		return this.mysqlClient.execute(query, valuesToEscape).then(([result]) => {
			return { insertId: result.insertId };
		});
	}

	update(query: string, valuesToEscape: Array<string | number | boolean> | any = []) {
		console.log("[UPDATE SQL QUERY]", query, valuesToEscape);
		return this.mysqlClient.execute(query, valuesToEscape).then(([result]) => {
			return { changedRows: result.changedRows };
		});
	}

	delete(query: string, valuesToEscape: Array<string | number | boolean> | any = []) {
		console.log("[DELETE SQL QUERY]", query, valuesToEscape);

		return this.mysqlClient.execute(query, valuesToEscape).then(([result]) => {
			return { deletedRows: result.changedRows };
		});
	}

	fetchSingleRow(query: string, valuesToEscape: Array<string | number | boolean> | any = []) {
		console.log("[SQL QUERY]", query, valuesToEscape);

		return this.mysqlClient.execute(query, valuesToEscape).then(([rows]) => {
			return rows[0];
		});
	}

	format(query: string, valuesToEscape: Array<string | number | boolean> | any = []) {
		return this.mysqlClient.format(query, valuesToEscape);
	}

	fetchAllRows(query: string, valuesToEscape: Array<string | number | boolean> | any = []) {
		console.log("[SQL QUERY]", query, valuesToEscape);

		return this.mysqlClient.execute(query, valuesToEscape).then(([rows]) => {
			return rows;
		});
	}
}

export { MysqlDatabase };
