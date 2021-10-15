import { IJobRunRequest } from "../runner/jobRunRequest";
import { IActionResultItem } from "../common/general";

export type INextTestInstancesDependencies = {
	testInstanceId: number;
	nextTestDependencies: Array<INextTestInstancesDependencies>;
};

export type ITestExecutionQueuePayload = IJobRunRequest & {
	nextTestDependencies: Array<INextTestInstancesDependencies>;
	exports?: Array<[string, any]> | null;
	startingStorageState: { cookies: Array<any>; origins: Array<any>; } | null,
	browserContextUrl: string | null,
};

export interface ITestCompleteQueuePayload {
	exports: Array<[string, any]>;
	nextTestDependencies: Array<INextTestInstancesDependencies>;
	buildExecutionPayload: ITestExecutionQueuePayload,
	actionResults: Array<IActionResultItem>;
	buildId: number;
	testInstanceId: number;
	buildTestCount: number;
	storageState: { cookies: Array<any>; origins: Array<any>; } | null,
	hasPassed: boolean;
	failedReason?: Error;
}

export interface IVideoProcessorQueuePayload {
	buildId: number;
	testInstanceId: number;
	videoRawUrl: string;
}
