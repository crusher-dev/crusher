import { StorageManagerInterface } from "@crusher-shared/lib/storage/interface";
import { ActionStatusEnum, IRunnerLogManagerInterface, IRunnerLogStepMeta } from "@crusher-shared/lib/runnerLog/interface";
import { iAction } from "@crusher-shared/types/action";
import { Browser, Page } from "playwright";
import { LogManager } from "./functions/log";
import { StorageManager } from "./functions/storage";
import { waitForSelectors } from "./functions/waitForSelectors";
import { ACTIONS_IN_TEST } from "@crusher-shared/constants/recordedActions";
import { handlePopup } from "./middlewares/popup";
import { registerCrusherSelectorEngine } from "./functions/registerSelectorEngine";
import { GlobalManager } from "./globals";

const actionsRequireContext = require.context('./actions/', true, /\.ts$/);

type IActionCategory = "PAGE" | "BROWSER" | "ELEMENT";

export enum ActionCategoryEnum {
  PAGE = "PAGE",
  BROWSER = "BROWSER",
  ELEMENT = "ELEMENT"
};

const validActionTypeRegex = new RegExp(/(PAGE|ELEMENT|BROWSER)\_[A-Z0-1_]*$/);

class CrusherRunnerActions {
  actionHandlers: {[type: string]: any};
  logManager: LogManager;
  storageManager: StorageManager;
  globals: GlobalManager;

  constructor(logManger: IRunnerLogManagerInterface, storageManager: StorageManagerInterface, baseAssetPath: string, globalManager: GlobalManager) {
    this.actionHandlers = {};
    this.globals = globalManager;

    this.logManager =  new LogManager(logManger);
    this.storageManager = new StorageManager(storageManager, baseAssetPath);

    if (!this.globals.has("actionResults")) {
      this.globals.set("actionResults", []);
    }

    this.initActionHandlers();
  }

  initActionHandlers() {
    actionsRequireContext.keys().forEach(fileName => {
      const { name, description, handler } = actionsRequireContext(fileName);
      this.registerStepHandler(name, description, handler)
    });
  }

  async handleActionExecutionStatus(actionType: ACTIONS_IN_TEST, status: ActionStatusEnum, message: string = "", meta: IRunnerLogStepMeta = {}) {
    await this.logManager.logStep(actionType, status, message, meta);

    if(status === ActionStatusEnum.COMPLETED || status === ActionStatusEnum.FAILED) {
      this.globals.get("actionResults").push({actionType, status, message, meta});
    }
  }

  stepHandlerHOC(wrappedHandler: any, action: {name: ACTIONS_IN_TEST; category: IActionCategory, description: string}): (step: iAction, browser: Browser, page: Page | null) => Promise<any> {
    return async (step: iAction, browser: Browser, page: Page | null = null): Promise<void> => {
      await this.handleActionExecutionStatus(action.name, ActionStatusEnum.STARTED, `Performing ${action.description} now`);
      let stepResult = null;

      try{
        switch (action.category) {
          case ActionCategoryEnum.PAGE:
            stepResult = await wrappedHandler(page, step, this.globals, this.storageManager);
            break;
          case ActionCategoryEnum.BROWSER:
            stepResult = await wrappedHandler(browser, step, this.globals, this.storageManager);
            break;
          case ActionCategoryEnum.ELEMENT:
            const elementInfo = await waitForSelectors(page, step.payload.selectors);
            stepResult = await wrappedHandler(elementInfo.elementHandle, step, this.globals, this.storageManager);
            break;
          default:
            throw new Error("Invalid action category handler");
        }
      } catch(err) {
        await this.handleActionExecutionStatus(action.name, ActionStatusEnum.FAILED, `Error performing ${action.description}`, {failedReason: err.messsage, meta: err.meta ? err.meta : {}});
        throw err;
      }

      // Woohoo! Action executed without any errors.
      await this.handleActionExecutionStatus(action.name, ActionStatusEnum.COMPLETED, stepResult && stepResult.customLogMessage ? stepResult.customlogMessage : `Finished performing ${action.description}`, stepResult ? stepResult : {});
    }
  }

  registerStepHandler(actionType: ACTIONS_IN_TEST, description: string, handler: any) {
    const validActionRegexMatches = validActionTypeRegex.exec(actionType);
    if (!validActionRegexMatches) throw new Error("Invalid format for action type");

    const actionCategory: IActionCategory = validActionRegexMatches[1] as any;
    this.actionHandlers[actionType] = this.stepHandlerHOC(handler, {name: actionType, description: description, category: actionCategory});
  }

  async runActions(actions: Array<iAction>, browser: Browser, page: Page | null = null) {

    for (let action of actions) {
      if (!this.actionHandlers[action.type]) throw new Error("No handler for this action type");
      await this.actionHandlers[action.type](action, browser, page);
    }
  }

  getStepHandlers() {
    return this.actionHandlers;
  }
}

export { CrusherRunnerActions, handlePopup, registerCrusherSelectorEngine, GlobalManager };