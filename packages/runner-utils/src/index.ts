import { StorageManagerInterface } from "@crusher-shared/lib/storage/interface";
import { ActionStatusEnum, IRunnerLogManagerInterface, IRunnerLogStepMeta } from "@crusher-shared/lib/runnerLog/interface";
import { iAction } from "@crusher-shared/types/action";
import { Browser, Page } from "playwright";
import { LogManager } from "./functions/log";
import { StorageManager } from "./functions/storage";
import { waitForSelectors } from "./functions/waitForSelectors";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { handlePopup } from "./middlewares/popup";
import { registerCrusherSelectorEngine } from "./functions/registerSelectorEngine";
import { getBrowserActions, getMainActions, isWebpack, toCrusherSelectorsFormat, validActionTypeRegex } from "./utils/helper";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import * as fs from "fs";
import * as path from "path";
import { sleep } from "./functions";
type IActionCategory = "PAGE" | "BROWSER" | "ELEMENT";

export enum ActionCategoryEnum {
	PAGE = "PAGE",
	BROWSER = "BROWSER",
	ELEMENT = "ELEMENT",
}

const TEST_RESULT_KEY = "TEST_RESULT";
class CrusherRunnerActions {
	actionHandlers: { [type: string]: any };
	logManager: LogManager;
	storageManager: StorageManager;
	globals: IGlobalManager;

	constructor(logManger: IRunnerLogManagerInterface, storageManager: StorageManagerInterface, baseAssetPath: string, globalManager: IGlobalManager) {
		this.actionHandlers = {};
		this.globals = globalManager;

		this.logManager = new LogManager(logManger);
		this.storageManager = new StorageManager(storageManager, baseAssetPath);

		if (!this.globals.has(TEST_RESULT_KEY)) {
			this.globals.set(TEST_RESULT_KEY, []);
		}

		this.initActionHandlers();
	}

	initActionHandlers() {
		if (isWebpack()) {
			const actionsRequireContext = require.context("./actions/", true, /\.ts$/);

			actionsRequireContext.keys().forEach((fileName) => {
				const { name, description, handler } = actionsRequireContext(fileName);
				this.registerStepHandler(name, description, handler);
			});
		} else {
			const actionsDir = fs.readdirSync(path.join(__dirname, "./actions"));
			for (let actionFilePath of actionsDir) {
				const { name, description, handler } = require(path.join(__dirname, "./actions", actionFilePath));
				this.registerStepHandler(name, description, handler);
			}
		}
	}

	async handleActionExecutionStatus(actionType: ActionsInTestEnum, status: ActionStatusEnum, message: string = "", meta: IRunnerLogStepMeta = {}) {
		await this.logManager.logStep(actionType, status, message, meta);

		if (status === ActionStatusEnum.COMPLETED || status === ActionStatusEnum.FAILED) {
			this.globals.get(TEST_RESULT_KEY).push({ actionType, status, message, meta });
		}
	}

	stepHandlerHOC(
		wrappedHandler: any,
		action: { name: ActionsInTestEnum; category: IActionCategory; description: string },
	): (step: iAction, browser: Browser, page: Page | null) => Promise<any> {
		return async (step: iAction, browser: Browser, page: Page | null = null): Promise<void> => {
			await this.handleActionExecutionStatus(action.name, ActionStatusEnum.STARTED, `Performing ${action.description} now`);
			let stepResult = null;

			try {
				switch (action.category) {
					case ActionCategoryEnum.PAGE:
						stepResult = await wrappedHandler(page, step, this.globals, this.storageManager);
						break;
					case ActionCategoryEnum.BROWSER:
						stepResult = await wrappedHandler(browser, step, this.globals, this.storageManager);
						break;
					case ActionCategoryEnum.ELEMENT:
						const playwrightSelector = step.payload.selectors.shift();
						const elementLocator = page.locator(playwrightSelector.value);
						stepResult = await wrappedHandler(elementLocator.first(), null, step, this.globals, this.storageManager);
						break;
					default:
						throw new Error("Invalid action category handler");
				}
				// Woohoo! Action executed without any errors.
				await this.handleActionExecutionStatus(
					action.name,
					ActionStatusEnum.COMPLETED,
					stepResult && stepResult.customLogMessage ? stepResult.customlogMessage : `Finished performing ${action.description}`,
					stepResult ? stepResult : {},
				);
			} catch (err) {
				await this.handleActionExecutionStatus(action.name, ActionStatusEnum.FAILED, `Error performing ${action.description}`, {
					failedReason: err.messsage,
					meta: err.meta ? err.meta : {},
				});
				throw err;
			}
		};
	}

	registerStepHandler(actionType: ActionsInTestEnum, description: string, handler: any) {
		const validActionRegexMatches = validActionTypeRegex.exec(actionType);
		if (!validActionRegexMatches) throw new Error("Invalid format for action type");

		const actionCategory: IActionCategory = validActionRegexMatches[1] as any;
		this.actionHandlers[actionType] = this.stepHandlerHOC(handler, { name: actionType, description: description, category: actionCategory });
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

export { CrusherRunnerActions, handlePopup, registerCrusherSelectorEngine, getBrowserActions, getMainActions };
