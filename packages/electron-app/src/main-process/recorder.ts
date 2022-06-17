import { iAction } from "@shared/types/action";
import { Store } from "redux";
import { iReduxState } from "../store/reducers";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { recordStep, updateCurrentRunningStepStatus } from "../store/actions/recorder";

class Recorder {
	private store: Store<iReduxState>;

	constructor(store) {
		this.store = store;
	}

	saveRecordedStep(action: iAction, status: ActionStatusEnum) {
		this.store.dispatch(recordStep(action, status));
	}

	markRunningStepFailed() {
		this.store.dispatch(updateCurrentRunningStepStatus(ActionStatusEnum.FAILED));
	}

	markRunningStepCompleted() {
		this.store.dispatch(updateCurrentRunningStepStatus(ActionStatusEnum.COMPLETED));
	}
}

export { Recorder };
