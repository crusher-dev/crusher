import { BaseRowInterface } from "./baseRow";

export interface iDraft extends BaseRowInterface {
	id?: number;
	user_id: number;
	events?: string;
	code: string;
	name?: string;
	project_id?: number;
}
