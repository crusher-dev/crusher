export interface IDatabaseManager {
	isConnectionAlive: () => Promise<boolean>;
	delete: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<{ deletedRows: number }>;
	insert: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<{ insertId: number }>;
	update: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<{ changedRows: number }>;
	fetchSingleRow: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<any>;
	fetchAllRows: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<Array<any>>;
	format: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<string>;
}
