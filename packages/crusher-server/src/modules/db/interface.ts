export interface IDatabaseManager {
	isConnectionAlive: () => Promise<boolean>;
	insert: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<{ insertId: number }>;
	update: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<{ changedRows: number }>;
	fetchSingleRow: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<any>;
	fetchAllRows: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<Array<any>>;
}
