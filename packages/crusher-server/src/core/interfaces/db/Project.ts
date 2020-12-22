import { BaseRowInterface } from "./BaseRowInterface";

export interface Project extends BaseRowInterface {
	id: number;
	name: string;
	team_id: number;
}
