import { ACTIONS_IN_TEST } from "../../constants/recordedActions";

export enum ActionStatusEnum {
    STARTED = "STARTED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

export interface IRunnerLogStepMeta {
    workingSelector?: {type: string; value: string};
    failedReason?: string;
    outputs?: [{name: string; value: string}];
    meta?: any;
};

export interface IRunnerLogManagerInterface {
    logStep: (actionType: ACTIONS_IN_TEST, status: ActionStatusEnum, message: string, meta: IRunnerLogStepMeta) => Promise<void>;
    logTest: (status: ActionStatusEnum, message: string, meta: any) => Promise<void>;
}