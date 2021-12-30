export interface IDatabaseManager {
	isConnectionAlive: () => Promise<boolean>;
	delete: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<{ deletedRows: 1 }>;
	insert: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<{ insertId: number }>;
	update: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<{ changedRows: number }>;
	fetchSingleRow: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<any>;
	fetchAllRows: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<any[]>;
	format: (query: string, valuesToEscape?: Array<string | number | boolean> | any) => Promise<string>;
}
