import { MysqlDatabase } from "@modules/db/mysql";
import { Service } from "typedi";
import { isOpenSourceEdition } from "@utils/helper";

const DEFAULT_DB_CONNECTION_POOL_LIMIT = isOpenSourceEdition() ? 5 : 10;

// @TODO: Remove this from here, follow dependency inversion principle
function getConnectionObject(): any {
	if (process.env.DB_CONNECTION_STRING) {
		return { uri: process.env.DB_CONNECTION_STRING };
	}

	return {
		connectionLimit: process.env.DB_CONNECTION_POOL || DEFAULT_DB_CONNECTION_POOL_LIMIT,
		host: process.env.DB_HOST || "localhost",
		user: process.env.DB_USERNAME,
		port: process.env.DB_PORT,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		insecureAuth: true,
	};
}

const CONNECTION_OBJECT = getConnectionObject();

@Service()
class DBManager extends MysqlDatabase {
	constructor() {
		super(CONNECTION_OBJECT);
	}
}

export { DBManager };
