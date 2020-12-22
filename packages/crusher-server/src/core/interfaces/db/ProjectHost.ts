import { BaseRowInterface } from "./BaseRowInterface";

export interface ProjectHost extends BaseRowInterface {
	id: number;
	url: string;
	host_name: string;
	project_id: number;
	user_id: number;
}
