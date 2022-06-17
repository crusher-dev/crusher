import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { ITestInstancesTable } from "@modules/resources/builds/instances/interface";
import { ICreateBuildRequestPayload } from "@modules/resources/builds/interface";
import { ITestTable } from "@modules/resources/tests/interface";

export enum BrowserEnum {
	CHROME = "CHROME",
	FIREFOX = "FIREFOX",
	SAFARI = "SAFARI",
}

export interface IBuildTaskPayload extends ICreateBuildRequestPayload {
	tests: Array<KeysToCamelCase<ITestTable>>;
	isInitialTest: boolean;
	buildId: number;
	isVideoOn: boolean;
}

export type ITestDependencyArray = Array<
	KeysToCamelCase<ITestTable> & {
		isFirstLevelTest: boolean;
		postTestList: ITestDependencyArray;
		parentTestId: number | null;
		groupId?: string;
		context?: any;
	}
>;

export type ITestInstanceDependencyArray = Array<
	KeysToCamelCase<ITestInstancesTable> & { testInfo: KeysToCamelCase<ITestDependencyArray[0]>; parentTestInstanceId: number }
>;
