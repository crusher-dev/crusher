import { BaseRowInterface } from "./baseRow";

export interface iDraftInstanceResult extends BaseRowInterface {
	id?: number;
	instance_id: number;
	logs?: string;
	images?: string;
	video_uri?: string;
}
