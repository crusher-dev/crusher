import { TestFramework } from "../../TestFramework";

export interface CreateTestRequest {
	testName: string;
	events: string;
	framework: TestFramework;
	projectId: number;
	code: string;
	userId: number;
	featured_video_uri?: string;
	draft_id?: number;
}
