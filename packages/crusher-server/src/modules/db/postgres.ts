import { IDatabaseManager } from "@modules/db/interface";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { Pool, PoolConfig } from "pg";
import * as sqlstring from "sqlstring";

class PostgresDatabase implements IDatabaseManager {
	postgresPool: Pool;

	constructor(config: PoolConfig) {
		this.postgresPool = new Pool(config);
		console.log("Sd")
	}

	isConnectionAlive(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.postgresPool
				.connect()
				.then((connection) => {
					connection.release();
					resolve(true);
				})
				.catch((err) => {
					console.error("Cannot connect to postgres database...", err);
					resolve(false);
				});
		});
	}

	insert(query: string, valuesToEscape: Array<string | number | boolean> | any = []) {
		return this.query(query, valuesToEscape, true).then((res) => {
			const { rows } = res;
			return { insertId: rows[0] && rows[0].id ? rows[0].id : null };
		});
	}

	update(query: string, valuesToEscape: Array<string | number | boolean> | any = []): Promise<any> {
		return this.query(query, valuesToEscape).then(({ rowCount }) => {
			return { changedRows: rowCount };
		});
	}

	delete(query: string, valuesToEscape: Array<string | number | boolean> | any = []) {
		return this.query(query, valuesToEscape).then(({ rowCount }) => {
			return { deletedRows: rowCount };
		});
	}

	fetchSingleRow(query: string, valuesToEscape: Array<string | number | boolean> | any = [], shouldCamelizeResponse = false) {
		return this.query(query, valuesToEscape, false, shouldCamelizeResponse).then(({ rows }) => {
			return rows[0];
		});
	}

	// Converts prepared mysql statement's '?' to $1, $2, $3, etc
	private convertToPostgresQuery(query: string, valuesToEscape: Array<any> = []) {
		return sqlstring.format(
			query,
			valuesToEscape.map((index, i) => sqlstring.raw(`$${i + 1}`)),
		);
	}

	// query method that supports mysql prepared statements, i.e ?
	private query(query: string, valuesToEscape, isInsertQuery = false, shouldCamelizeResponse = false) {
		let postgresQuery = this.convertToPostgresQuery(query, valuesToEscape);
		console.log("[SQL QUERY]", postgresQuery, valuesToEscape);
		if (isInsertQuery) postgresQuery += ` RETURNING * `;

		return shouldCamelizeResponse ? this.runCamelizeQuery(postgresQuery, valuesToEscape) : this.postgresPool.query(postgresQuery, valuesToEscape);
	}

	// Does nothing
	async format(query: string, valuesToEscape: Array<string | number | boolean> | any = []) {
		return "";
	}

	@CamelizeResponse()
	async runCamelizeQuery(query, values) {
		console.log("Query", query, values);
		return this.postgresPool.query(query, values);
	}

	fetchAllRows(query: string, valuesToEscape: Array<string | number | boolean> | any = [], shouldCamelizeResponse = false) {
		return this.query(query, valuesToEscape, false, shouldCamelizeResponse).then((res) => {
			return res.rows;
		});
	}
}

export { PostgresDatabase };
