import { Service } from "typedi";
import { isOpenSourceEdition } from "@utils/helper";
import { PostgresDatabase } from "./postgres";
import { PoolConfig } from "pg";

const DEFAULT_DB_CONNECTION_POOL_LIMIT = isOpenSourceEdition() ? 5 : 10;

// @TODO: Remove this from here, follow dependency inversion principle
function getConnectionObject() {
	if (process.env.DB_CONNECTION_STRING) {
		return { uri: process.env.DB_CONNECTION_STRING, multipleStatements: true };
	}

	return {
		poolSize: process.env.DB_CONNECTION_POOL || DEFAULT_DB_CONNECTION_POOL_LIMIT,
		host: process.env.DB_HOST || "localhost",
		user: process.env.DB_USERNAME,
		port: process.env.DB_PORT as any,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		insecureAuth: true,
		multipleStatements: true,
		ssl:
			process.env.DISABLE_POSTGRES_SSL && process.env.DISABLE_POSTGRES_SSL === "true"
				? false
				: { rejectUnauthorized: typeof process.env.DATABASE_SSL !== "undefined" ? true : false },
	};
}

const CONNECTION_OBJECT: PoolConfig = getConnectionObject();

@Service()
class DBManager extends PostgresDatabase {
	constructor() {
		console.log("sd")
		super(CONNECTION_OBJECT);
	}
}

export { DBManager };
