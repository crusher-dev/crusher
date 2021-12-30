import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { ActionStatusEnum, IRunnerLogManagerInterface, IRunnerLogStepMeta } from "@crusher-shared/lib/runnerLog/interface";

export class LogManager {
	private logManager: IRunnerLogManagerInterface;

	constructor(logManager: IRunnerLogManagerInterface) {
		this.logManager = logManager;
		return this;
	}

	async logStep(actionType: ActionsInTestEnum, status: ActionStatusEnum, message: string = "", meta: IRunnerLogStepMeta = {}) {
		return this.logManager.logStep(actionType, status, message, meta);
	}

	async logStepResult(actionType: ActionsInTestEnum, status: ActionStatusEnum, message: string = "", meta: IRunnerLogStepMeta = {}) {
		return this.logStep(actionType, status, message, meta);
	}
}
