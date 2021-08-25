import { ActionsInTestEnum, ACTIONS_IN_TEST } from "../../constants/recordedActions";

export enum ActionStatusEnum {
	STARTED = "STARTED",
	COMPLETED = "COMPLETED",
	FAILED = "FAILED",
}

export interface IRunnerLogStepMeta {
	actionName?: string;
	workingSelector?: { type: string; value: string };
	failedReason?: string;
	outputs?: [{ name: string; value: string }];
	meta?: any;
}

export interface IRunnerLogManagerInterface {
	logStep: (actionType: ActionsInTestEnum, status: ActionStatusEnum, message: string, meta: IRunnerLogStepMeta) => Promise<void>;
	logTest: (status: ActionStatusEnum, message: string, meta: any) => Promise<void>;
}
