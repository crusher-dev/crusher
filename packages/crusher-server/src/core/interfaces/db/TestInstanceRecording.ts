import { BaseRowInterface } from "./BaseRowInterface";

export interface TestInstanceRecording extends BaseRowInterface {
	id?: number;
	test_instance_id: number;
	test_id: number;
	video_uri: string;
}
