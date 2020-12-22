import { BaseRowInterface } from "./BaseRowInterface";
import { TestInstanceResultStatus } from "../TestInstanceResultStatus";

export interface TestInstanceResult extends BaseRowInterface {
	id?: number;
	screenshot_id: number;
	target_screenshot_id: number;
	instance_result_set_id: number;
	diff_delta: number;
	diff_image_url: string;
	status: TestInstanceResultStatus;
	action_by?: number;
}
