import { BaseRowInterface } from "./BaseRowInterface";

export interface CliStatus extends BaseRowInterface {
	token?: string;
	status?: string;
	user_id?: string;
	team_id?: string;
}
