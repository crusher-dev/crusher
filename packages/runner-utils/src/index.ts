import { StorageManagerInterface } from "@crusher-shared/lib/storage/interface";
import { ActionStatusEnum, IRunnerLogManagerInterface, IRunnerLogStepMeta } from "@crusher-shared/lib/runnerLog/interface";
import { iAction } from "@crusher-shared/types/action";
import { Browser, Page } from "playwright";
import { LogManager, logStep } from "./functions/log";
import { StorageManager } from "./functions/storage";
import { waitForSelectors } from "./functions/waitForSelectors";
import { ACTIONS_IN_TEST } from "@crusher-shared/constants/recordedActions";
import * as fs from "fs";
import * as path from "path";

type IActionCategory = "PAGE" | "BROWSER" | "ELEMENT";

export enum ActionCategoryEnum {
  PAGE = "PAGE",
  BROWSER = "BROWSER",
  ELEMENT = "ELEMENT"
};

const validActionTypeRegex = new RegExp(/(PAGE|ELEMENT|BROWSER)\_[A-Z0-1_]*$/);

class CrusherRunnerActions {
  actionHandlers: {[type: string]: any};
  actionResults: Array<{actionType: ACTIONS_IN_TEST, status: ActionStatusEnum; message: string; meta: IRunnerLogStepMeta}>;
  storageManager: StorageManager;

  constructor(logManger: IRunnerLogManagerInterface, storageManager: StorageManagerInterface, baseAssetPath: string) {
    this.actionHandlers = {};
    this.actionResults = [];
  
    LogManager.initalize(logManger);
    StorageManager.initialize(storageManager, baseAssetPath);
    this.initActionHandlers();
  }

  initActionHandlers() {
    fs.readdirSync("./actions").map((files) => {
      const {name, description, handler} = require(path.join("./actions", files));
      this.registerStepHandler(name, description, handler)
    });
  }

  async handleActionExecutionStatus(actionType: ACTIONS_IN_TEST, status: ActionStatusEnum, message: string = "", meta: IRunnerLogStepMeta = {}) {
    await logStep(actionType, status, message, meta);

    if(status === ActionStatusEnum.COMPLETED || status === ActionStatusEnum.FAILED) {
      this.actionResults.push({actionType, status, message, meta});
    }
  }

  stepHandlerHOC(wrappedHandler: any, action: {name: ACTIONS_IN_TEST; category: IActionCategory, description: string}): (browser: Browser, page: Page, steps: iAction) => Promise<any> {
    return async (browser: Browser, page: Page, step: iAction): Promise<void> => {
      await this.handleActionExecutionStatus(action.name, ActionStatusEnum.STARTED, `Performing ${action.description} now`);

      let stepResult = null;

      try{
        switch (action.category) {
          case ActionCategoryEnum.PAGE:
            stepResult = await wrappedHandler.apply(this, page, step);
            break;
          case ActionCategoryEnum.ELEMENT:
            const elementInfo = await waitForSelectors(page, step.payload.selectors);
            stepResult = await wrappedHandler.apply(this, elementInfo.elementHandle, step);
            break;
          default:
            throw new Error("Invalid action category handler");
        } 
      } catch(err) {
        await this.handleActionExecutionStatus(action.name, ActionStatusEnum.FAILED, `Error performing ${action.description}`, {failedReason: err.messsage, meta: err.meta ? err.meta : {}});
        throw err;
      }

      // Woohoo! Action executed without any errors.
      await this.handleActionExecutionStatus(action.name, ActionStatusEnum.COMPLETED, `Finished performing ${action.description}`, stepResult ? stepResult : {});
    }
  }

  registerStepHandler(actionType: ACTIONS_IN_TEST, description: string, handler: any) {
    const validActionRegexMatches = validActionTypeRegex.exec(actionType);
    if (!validActionRegexMatches) throw new Error("Invalid format for action type");

    const actionCategory: IActionCategory = validActionTypeRegex[1];
    this.actionHandlers[actionType] = this.stepHandlerHOC(handler, {name: actionType, description: description, category: actionCategory});
  }

  getStepHandlers() {
    return this.actionHandlers;
  }
}

export { CrusherRunnerActions };