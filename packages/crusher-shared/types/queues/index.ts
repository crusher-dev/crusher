import { IJobRunRequest } from "../runner/jobRunRequest";
import { IActionResultItem } from "../common/general";

export type ITestExecutionQueuePayload = IJobRunRequest;

export interface ITestCompleteQueuePayload {
	exports: Array<[string, any]>;
	actionResults: Array<IActionResultItem>;
	buildId: number;
	testInstanceId: number;
	buildTestCount: number;
	hasPassed: boolean;
	failedReason?: Error;
}

export interface IVideoProcessorQueuePayload {
	buildId: number;
	testInstanceId: number;
	videoRawUrl: string;
}
