import { BaseRowInterface } from "./BaseRowInterface";

export interface DraftInstanceResult extends BaseRowInterface {
	id?: number;
	instance_id: number;
	logs?: string;
	images?: string;
	video_uri?: string;
}
