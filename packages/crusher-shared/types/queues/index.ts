import { IJobRunRequest } from "../runner/jobRunRequest";
import { IActionResultItem } from "../common/general";

export type INextTestInstancesDependencies = {
	testInstanceId: number;
	nextTestDependencies: Array<INextTestInstancesDependencies>;
};

export type ITestExecutionQueuePayload = IJobRunRequest & {
	nextTestDependencies: Array<INextTestInstancesDependencies>;
	exports?: Array<[string, any]> | null;
	startingStorageState: { cookies: Array<any>; origins: Array<any> } | null;
	startingPersistentContext: string | null;
	context?: { [k: string]: any } | null;
};

export interface ITestCompleteQueuePayload {
	type?: "complete-build" | "process";
	exports: Array<[string, any]>;
	context?: { [k: string]: any } | null;
	nextTestDependencies: Array<INextTestInstancesDependencies>;
	parameterizedTests: Array<{ testId: number; groupId: string; context: any }>;
	buildExecutionPayload: ITestExecutionQueuePayload;
	actionResults: Array<IActionResultItem>;
	buildId: number;
	testInstanceId: number;
	buildTestCount: number;
	storageState: { cookies: Array<any>; origins: Array<any> } | null;
	hasPassed: boolean;
	failedReason?: Error & { isStalled: boolean };
	isStalled?: boolean;
	persistenContextZipURL: string | null;
	harUrl?: string | null;
}

export interface IVideoProcessorQueuePayload {
	buildId: number;
	testInstanceId: number;
	videoRawUrl: string;
}
