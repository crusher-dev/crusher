import { ActionsInTestEnum, ACTIONS_IN_TEST } from "../../constants/recordedActions";

export enum ActionStatusEnum {
	STARTED = "STARTED",
	COMPLETED = "COMPLETED",
	MANUAL_REVIEW_REQUIRED = "MANUAL_REVIEW_REQUIRED",
	FAILED = "FAILED",
	STALLED = "STALLED",
}

export interface IRunnerLogStepMeta {
	actionName?: string;
	workingSelector?: { type: string; value: string };
	screenshotDuringError?: string;
	failedReason?: string;
	beforeUrl?: string;
	afterUrl?: string;
	outputs?: [{ name: string; value: string }];
	error?: any;
	meta?: any;
}

export interface IRunnerLogManagerInterface {
	logStep: (actionType: ActionsInTestEnum, status: ActionStatusEnum, message: string, meta: IRunnerLogStepMeta) => Promise<void>;
	logTest: (status: ActionStatusEnum, message: string, meta: any) => Promise<void>;
}
