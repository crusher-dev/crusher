import { ACTIONS_IN_TEST } from "@crusher-shared/constants/recordedActions";
import { ActionStatusEnum, IRunnerLogManagerInterface, IRunnerLogStepMeta } from "@crusher-shared/lib/runnerLog/interface";

export class LogManager {
  private logManager: IRunnerLogManagerInterface;

  constructor(logManager: IRunnerLogManagerInterface) {
    this.logManager = logManager;
    return this;
  }

  async logStep(actionType: ACTIONS_IN_TEST, status: ActionStatusEnum, message: string = "", meta: IRunnerLogStepMeta = {}) {
    return this.logManager.logStep(actionType, status, message, meta);
  }

  async logStepResult(actionType: ACTIONS_IN_TEST, status: ActionStatusEnum, message: string = "", meta: IRunnerLogStepMeta = {}) {
    return this.logStep(actionType, status, message, meta);
  }
}
