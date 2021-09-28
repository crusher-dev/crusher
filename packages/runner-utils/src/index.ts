import { StorageManagerInterface } from "@crusher-shared/lib/storage/interface";
import { ActionStatusEnum, IRunnerLogManagerInterface, IRunnerLogStepMeta } from "@crusher-shared/lib/runnerLog/interface";
import { iAction } from "@crusher-shared/types/action";
import { Browser, Page } from "playwright";
import { LogManager } from "./functions/log";
import { StorageManager } from "./functions/storage";
import { waitForSelectors } from "./functions/waitForSelectors";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { handlePopup } from "./middlewares/popup";
import { getBrowserActions, getMainActions, isWebpack, toCrusherSelectorsFormat, uuidv4, validActionTypeRegex } from "./utils/helper";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import * as fs from "fs";
import * as path from "path";
import { sleep } from "./functions";
import { CrusherSdk } from "./sdk/sdk";
import { ExportsManager } from "./functions/exports";
import { IExportsManager } from "@crusher-shared/lib/exports/interface";
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
	exportsManager: ExportsManager;

	constructor(logManger: IRunnerLogManagerInterface, storageManager: StorageManagerInterface, baseAssetPath: string, globalManager: IGlobalManager, exportsManager: IExportsManager) {
		this.actionHandlers = {};
		this.globals = globalManager;

		this.logManager = new LogManager(logManger);
		this.storageManager = new StorageManager(storageManager, baseAssetPath);
		this.exportsManager = new ExportsManager(exportsManager);

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

	async handleActionExecutionStatus(actionType: ActionsInTestEnum, status: ActionStatusEnum, message: string = "", meta: IRunnerLogStepMeta = {}, actionCallback: any) {
		await this.logManager.logStep(actionType, status, message, meta);

		if(actionCallback)
			await actionCallback({ actionType, status, message, meta });

		if (status === ActionStatusEnum.COMPLETED || status === ActionStatusEnum.FAILED) {
			this.globals.get(TEST_RESULT_KEY).push({ actionType, status, message, meta });
		}
	}

	async _getCurrentScreenshot(page: Page): Promise<string | null> {
		try {
			const currentScreenshotBuffer = await page.screenshot();
			const currentScreenshotUrl = await this.storageManager.uploadAsset(`${uuidv4()}.png`, currentScreenshotBuffer);
			return currentScreenshotUrl;
		}
		catch (err) { return null };
	}

	stepHandlerHOC(
		wrappedHandler: any,
		action: { name: ActionsInTestEnum; category: IActionCategory; description: string },
	): (step: iAction, browser: Browser, page: Page | null) => Promise<any> {
		return async (step: iAction, browser: Browser, page: Page | null = null, actionCallback: any = null): Promise<void> => {
			await this.handleActionExecutionStatus(action.name, ActionStatusEnum.STARTED, `Performing ${action.description} now`, {
				actionName: step.name ? step.name : null,
			}, actionCallback);
			let stepResult = null;

			try {
				switch (action.category) {
					case ActionCategoryEnum.PAGE:
						stepResult = await wrappedHandler(page, step, this.globals, this.storageManager, this.exportsManager);
						break;
					case ActionCategoryEnum.BROWSER:
						stepResult = await wrappedHandler(browser, step, this.globals, this.storageManager, this.exportsManager);
						break;
					case ActionCategoryEnum.ELEMENT:
						const elementLocator = page.locator(toCrusherSelectorsFormat(step.payload.selectors).value);
						stepResult = await wrappedHandler(elementLocator.first(), null, step, this.globals, this.storageManager, this.exportsManager);
						break;
					default:
						throw new Error("Invalid action category handler");
				}

				await sleep(500);
				// Woohoo! Action executed without any errors.
				await this.handleActionExecutionStatus(
					action.name,
					ActionStatusEnum.COMPLETED,
					stepResult && stepResult.customLogMessage ? stepResult.customlogMessage : `Finished performing ${action.description}`,
					stepResult
						? {
								...stepResult,
								actionName: step.name ? step.name : null,
						  }
						: {
								actionName: step.name ? step.name : null,
						},
					actionCallback,
				);
			} catch (err) {
				await this.handleActionExecutionStatus(action.name, ActionStatusEnum.FAILED, `Error performing ${action.description}`, {
					failedReason: err.messsage,
					screenshotDuringError: await this._getCurrentScreenshot(page),
					actionName: step.name ? step.name : null,
					meta: err.meta ? err.meta : {},
				}, actionCallback);
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

	async runActions(actions: Array<iAction>, browser: Browser, page: Page | null = null, actionCallback: any = null) {
		for (let action of actions) {
			if (!this.actionHandlers[action.type]) throw new Error("No handler for this action type");
			await this.actionHandlers[action.type](action, browser, page, actionCallback ? actionCallback.bind(this, action) : null);
		}
	}

	getStepHandlers() {
		return this.actionHandlers;
	}
}

export { CrusherRunnerActions, handlePopup, getBrowserActions, getMainActions, CrusherSdk };
