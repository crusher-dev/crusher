import { KeysToCamelCase } from "@modules/common/typescript/interface";
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
