import { BaseRowInterface } from "./baseRow";

export interface iTestInstanceRecording extends BaseRowInterface {
	id?: number;
	test_instance_id: number;
	test_id: number;
	video_uri: string;
}
