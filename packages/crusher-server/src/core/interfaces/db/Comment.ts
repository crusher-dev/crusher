import { BaseRowInterface } from "./BaseRowInterface";

export interface Comment extends BaseRowInterface {
	id?: number;
	user_id: number;
	report_id: number;
	result_id: number;
	message: string;
	replied_to?: number;
}
