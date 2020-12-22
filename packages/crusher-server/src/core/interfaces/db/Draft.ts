import { BaseRowInterface } from "./BaseRowInterface";
import { TestFramework } from "../TestFramework";

export interface Draft extends BaseRowInterface {
	id?: number;
	user_id: number;
	events?: string;
	code: string;
	name?: string;
	project_id?: number;
}
