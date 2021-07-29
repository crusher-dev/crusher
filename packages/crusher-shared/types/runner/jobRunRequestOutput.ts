import { iJobRunRequest } from "./jobRunRequest";

export interface iTestRunnerJobOutput {
	runnerJobRequestInfo: iJobRunRequest;
	output: { signedImageUrls: Array<string> } | null;
	error: Error | null | undefined;
}
