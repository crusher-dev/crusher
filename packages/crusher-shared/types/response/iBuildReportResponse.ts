import { TestInstanceResultSetConclusion } from 'crusher-server/crusher-server/src/core/types/TestInstanceResultSetConclusion';
import { TestInstanceResultSetStatus } from 'crusher-server/crusher-server/src/core/types/TestInstanceResultSetStatus';

export interface IBuildReportResponse {
	id:    number;
	name:           string;
	startedAt:       number;
	projectId:       number;
	baselineId: number;
	hasNoReferenceBuildToCompare: boolean;
	status:          string;
	reviewer: any[];
	history:         any[];
	configuration:   Configuration;
	meta:            any;
	tests:           Test[];
	comments:        any[];
}

export interface Configuration {
	environment: Array<Environment>;
}

interface Environment {
	name: string;
	id:   string;
}

interface Test {
	name:      string;
	meta: 		 {  };
	instances: Instance[];
}

interface Instance {
	id:     number;
	title:  string;
	verboseStatus: TestInstanceResultSetStatus;
	status: TestInstanceResultSetConclusion;
	config: TestInstanceConfig;
	output: TestInstanceOutput;
	steps:  TestInstanceStep[];
}

interface TestInstanceOutput {
	video: string | null;
	images: Array<TestInstanceImage>
}

interface TestInstanceImage {
	id: number;
	url: string;
	baselineURL: string;
	diffDelta: number;
	diffURL: string;
};

interface TestInstanceConfig {
	browserType: string;
}

interface TestInstanceStep {
	index:          number;
	stepType:    string;
	description: string;
	status:      string;
	payload:     TestInstanceStepPayload;
}

interface TestInstanceStepPayload {
	// Only available when stepType is screenshot related
	screenshot?: string;
	message: any;
}
