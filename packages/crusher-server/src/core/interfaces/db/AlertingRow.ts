import { BaseRowInterface } from "./BaseRowInterface";

export interface AlertingRow extends BaseRowInterface {
	user_id: number;
	github_code?: string;
}
