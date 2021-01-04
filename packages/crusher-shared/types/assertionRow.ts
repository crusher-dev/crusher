export interface iField {
	name: string;
	value: string;
	meta: any;
}
export interface iAssertionRow {
	id: string;
	field: iField;
	operation: string;
	validation: string;
}
