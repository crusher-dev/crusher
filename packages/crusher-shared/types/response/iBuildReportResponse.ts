import { TestInstanceResultSetStatus, TestInstanceResultSetConclusion } from "crusher-server/src/modules/resources/buildReports/interface";

export interface IBuildReportResponse {
	buildId: number;
	buildReportId: number;
	host?: string | null;
	hostScreenshot?: string| null;
	id: number;
	name: string;
	startedAt: number;
	projectId: number;
	baselineId: number;
	hasNoReferenceBuildToCompare: boolean;
	status: string;
	reviewer: any[];
	history: any[];
	configuration: Configuration;
	meta: any;
	tests: Test[];
	comments: any[];
}

export interface Configuration {
	environment: Array<Environment>;
}

interface Environment {
	name: string;
	id: string;
}

export interface Test {
	name: string;
	meta: {};
	testInstances: Instance[];
}

export interface Instance {
	id: number;
	title: string;
	verboseStatus: TestInstanceResultSetStatus;
	status: TestInstanceResultSetConclusion;
	config: TestInstanceConfig;
	output: TestInstanceOutput;
	steps: TestInstanceStep[];
}

interface TestInstanceOutput {
	video: string | null;
}

interface TestInstanceImage {
	id: number;
	url: string;
	baselineURL: string;
	diffDelta: number;
	diffURL: string;
}

interface TestInstanceConfig {
	browserType: string;
}

interface TestInstanceStep {
	index: number;
	stepType: string;
	isScreenshot?: boolean;
	description: string;
	status: string;
	payload: TestInstanceStepPayload;
}

interface TestInstanceStepPayload {
	// Only available when stepType is screenshot related
	screenshot?: string;
	message: any;
}
