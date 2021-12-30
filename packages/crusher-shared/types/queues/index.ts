import { IJobRunRequest } from "../runner/jobRunRequest";
import { IActionResultItem } from "../common/general";

export type INextTestInstancesDependencies = {
	testInstanceId: number;
	nextTestDependencies: INextTestInstancesDependencies[];
};

export type ITestExecutionQueuePayload = IJobRunRequest & {
	nextTestDependencies: INextTestInstancesDependencies[];
	exports?: [string, any][] | null;
	startingStorageState: { cookies: any[]; origins: any[] } | null;
	startingPersistentContext: string | null;
};

export interface ITestCompleteQueuePayload {
	exports: [string, any][];
	nextTestDependencies: INextTestInstancesDependencies[];
	buildExecutionPayload: ITestExecutionQueuePayload;
	actionResults: IActionResultItem[];
	buildId: number;
	testInstanceId: number;
	buildTestCount: number;
	storageState: { cookies: any[]; origins: any[] } | null;
	hasPassed: boolean;
	failedReason?: Error;
	persistenContextZipURL: string | null;
}

export interface IVideoProcessorQueuePayload {
	buildId: number;
	testInstanceId: number;
	videoRawUrl: string;
}
