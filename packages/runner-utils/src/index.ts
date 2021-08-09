import { iAction } from "@crusher-shared/types/action";
import { Browser, Page } from "playwright";
import { LogManager } from "./functions/log";
import { waitForSelectors } from "./functions/waitForSelectors";

type IActionCategory = "PAGE" | "BROWSER" | "ELEMENT";

export enum ActionCategoryEnum {
  PAGE = "PAGE",
  BROWSER = "BROWSER",
  ELEMENT = "ELEMENT"
};

const validActionTypeRegex = new RegExp(/(PAGE|ELEMENT|BROWSER)\_[A-Z0-1_]$*/);
class CrusheRunnerActions {
  actionHandlers: {[type: string]: any};
  cloudStorage: any;

  constructor(logManger: any, cloudStorage: any) {
    this.actionHandlers = {};
    LogManager.initalize(logManger);
    this.cloudStorage = this.cloudStorage;
  }

  stepHandlerHOC(wrappedHandler: any, actionCategory: IActionCategory, actionDescription = ""): (browser: Browser, page: Page, steps: iAction) => Promise<any> {
    return async (browser: Browser, page: Page, step: iAction): Promise<void> => {
      this.logManager.logStep(`Running ${actionDescription}`);

      switch (actionCategory) {
        case ActionCategoryEnum.BROWSER:
          await wrappedHandler.apply(this, browser);
          break;
        case ActionCategoryEnum.PAGE:
          await wrappedHandler.apply(this, page, step);
          break;
        case ActionCategoryEnum.ELEMENT:
          const elementInfo = await waitForSelectors(page, step.payload.selectors);
        await wrappedHandler.apply(this, elementInfo.elementHandle, step);
          break;
        default:
          throw new Error("Invalid action category handler");
          break;

      }

      this.logManager.logStep(`Completed ${actionDescription}`);
    }
  }

  registerStepHandler(actionType: string, handler: any) {
    const validActionRegexMatches = validActionTypeRegex.exec(actionType);
    if (!validActionRegexMatches) throw new Error("Invalid format for action type");

    const actionCategory: IActionCategory = validActionTypeRegex[1];
    if (actionCategory === "PAGE") {
      this.actionHandlers[actionType] = this.stepHandlerHOC(handler, actionCategory);
    }
  }

  getStepHandlers() {
    return this.actionHandlers;
  }
}
