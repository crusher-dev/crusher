import { iAction } from "@shared/types/action";
import { Store } from "redux";
import { iReduxState } from "../store/reducers";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { recordStep, updateCurrentRunningStepStatus } from "../store/actions/recorder";
import { StepErrorTypeEnum } from "runner-utils/src/error.types";

class Recorder {
	private store: Store<iReduxState>;
	private recordStep: any;
	constructor(store, recordStep: any) {
		this.store = store;
		this.recordStep = recordStep;
	}

	saveRecordedStep(action: iAction, status: ActionStatusEnum) {
		this.recordStep(action, status);
	}

	markRunningStepFailed(errorType: StepErrorTypeEnum) {
		this.store.dispatch(updateCurrentRunningStepStatus(ActionStatusEnum.FAILED, {errorType}));
	}

	markRunningStepCompleted() {
		this.store.dispatch(updateCurrentRunningStepStatus(ActionStatusEnum.COMPLETED));
	}
}

export { Recorder };
