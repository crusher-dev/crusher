import { BaseRowInterface } from './BaseRowInterface';

export interface Comment extends BaseRowInterface {
	id?: number;
	user_id: number;
	job_id: number;
	instance_id: number;
	screenshot_id: number;
	result_set_id: number;
	message: string;
	replied_to?: number;
}
