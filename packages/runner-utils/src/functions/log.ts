import { ACTIONS_IN_TEST } from "@crusher-shared/constants/recordedActions";
import { ActionStatusEnum, IRunnerLogManagerInterface, IRunnerLogStepMeta } from "@crusher-shared/lib/runnerLog/interface";

export class LogManager {
  private static logManager: IRunnerLogManagerInterface;

  static initalize(logManager: IRunnerLogManagerInterface) {
    this.logManager = logManager;
    return this;
  }

  static async logStep(actionType: ACTIONS_IN_TEST, status: ActionStatusEnum, message: string = "", meta: IRunnerLogStepMeta = {}) {
    return this.logManager.logStep(actionType, status, message, meta);
  }
}

export async function logStep(actionType: ACTIONS_IN_TEST, status: ActionStatusEnum, message: string = "", meta: IRunnerLogStepMeta = {}) {
  return LogManager.logStep(actionType, status, message, meta);
}

export async function logStepResult(actionType: ACTIONS_IN_TEST, status: ActionStatusEnum, message: string = "", meta: IRunnerLogStepMeta = {}) {
  return LogManager.logStep(actionType, status, message, meta);
}