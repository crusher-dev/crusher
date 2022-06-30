import { StorageManagerInterface } from "@crusher-shared/lib/storage/interface";
import { ActionStatusEnum, IRunnerLogManagerInterface, IRunnerLogStepMeta } from "@crusher-shared/lib/runnerLog/interface";
import { iAction, iActionResult } from "@crusher-shared/types/action";
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
import { CommunicationChannel } from "./functions/communicationChannel";
import { ActionDescriptor } from "./functions/actionDescriptor";
import { handleProxyBrowserContext, handleProxyPage } from "./utils/proxy";

type IActionCategory = "PAGE" | "BROWSER" | "ELEMENT";

export enum ActionCategoryEnum {
	PAGE = "PAGE",
	BROWSER = "BROWSER",
	ELEMENT = "ELEMENT",
}

const TEST_RESULT_KEY = "TEST_RESULT";

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
export type ActionStatusCallbackFn = (action: iAction, result: iActionResult) => Promise<number | void | boolean>;

class CrusherRunnerActions {
	actionHandlers: { [type: string]: any };
	logManager: LogManager;
	storageManager: StorageManager;
	globals: IGlobalManager;
	exportsManager: ExportsManager;
	communicationChannel: CommunicationChannel;
	sdk: CrusherSdk | null;
	context: any;
	isUsingProxy: boolean;

	constructor(
		logManger: IRunnerLogManagerInterface,
		storageManager: StorageManagerInterface,
		baseAssetPath: string,
		globalManager: IGlobalManager,
		exportsManager: IExportsManager,
		communicationChannel: CommunicationChannel,
		sdk: CrusherSdk | null = null,
		context: any = {},
		isUsingProxy: boolean = false,
	) {
		this.actionHandlers = {};
		this.globals = globalManager;

		this.logManager = new LogManager(logManger);
		this.storageManager = new StorageManager(storageManager, baseAssetPath);
		this.exportsManager = new ExportsManager(exportsManager);
		this.communicationChannel = communicationChannel;
		this.sdk = sdk;
		this.context = context;
		this.isUsingProxy = isUsingProxy;

		if (!this.globals.has(TEST_RESULT_KEY)) {
			this.globals.set(TEST_RESULT_KEY, []);
		}

		this.initActionHandlers();
	}

	initActionHandlers() {
		if (isWebpack()) {
			// @ts-ignore
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

	async handleActionExecutionStatus(
		actionType: ActionsInTestEnum,
		status: ActionStatusEnum,
		message: string = "",
		meta: IRunnerLogStepMeta = {},
		actionCallback: OmitFirstArg<ActionStatusCallbackFn> | null = null,
	) {
		await this.logManager.logStep(actionType, status, message, meta);

		if (actionCallback) await actionCallback({ actionType, status, message, meta });

		if (status === ActionStatusEnum.COMPLETED || status === ActionStatusEnum.FAILED || status === ActionStatusEnum.STALLED) {
			this.globals.get(TEST_RESULT_KEY).push({ actionType, status, message, meta });
		}
	}

	async _getCurrentScreenshot(page: Page): Promise<string | null> {
		try {
			const currentScreenshotBuffer = await page.screenshot();
			const currentScreenshotUrl = await this.storageManager.uploadAsset(`${uuidv4()}.png`, currentScreenshotBuffer);
			return currentScreenshotUrl;
		} catch (err) {
			return null;
		}
	}

	stepHandlerHOC(
		wrappedHandler: any,
		action: { name: ActionsInTestEnum; category: IActionCategory; description: string },
	): (step: iAction, browser: Browser, page: Page | null) => Promise<any> {
		return async (
			step: iAction,
			browser: Browser,
			page: Page | null = null,
			actionCallback: OmitFirstArg<ActionStatusCallbackFn> | null = null,
			shouldSleepAfterComplete = true,
			remainingActionsArr: Array<iAction> = [],
			shouldLog: boolean = true,
		): Promise<void> => {
			let startingScreenshot = null;
			let stepResult = null;

			if (shouldLog) {
				await this.handleActionExecutionStatus(
					action.name,
					ActionStatusEnum.STARTED,
					`Performing ${action.description} now`,
					{
						actionName: step.name ? step.name : null,
					},
					actionCallback,
				);

				try {
					startingScreenshot = await this._getCurrentScreenshot(page);
				} catch (ex) {}
			}

			const beforeUrl = page ? await page.url() : null;

			try {
				switch (action.category) {
					case ActionCategoryEnum.PAGE:
						stepResult = await wrappedHandler(
							page,
							step,
							this.globals,
							this.storageManager,
							this.exportsManager,
							this.communicationChannel,
							this.sdk,
							this.context,
							browser,
							this.runActions.bind(this),
							this.isUsingProxy,
						);
						break;
					case ActionCategoryEnum.BROWSER:
						stepResult = await wrappedHandler(
							browser,
							step,
							this.globals,
							this.storageManager,
							this.exportsManager,
							this.communicationChannel,
							this.sdk,
							this.context,
						);
						break;
					case ActionCategoryEnum.ELEMENT:
						const crusherSelector = toCrusherSelectorsFormat(step.payload.selectors);
						let elementLocator = page.locator(crusherSelector.value);
						let parentFrame = null;
						if (step.payload.meta?.parentFrameSelectors) {
							const crusherParentFrameSelector = toCrusherSelectorsFormat(step.payload.meta.parentFrameSelectors);

							const parentFrameElement = await page.waitForSelector(crusherParentFrameSelector.value);
							parentFrame = await parentFrameElement.contentFrame();
							elementLocator = parentFrame.locator(crusherSelector.value);
						}
						stepResult = await wrappedHandler(
							elementLocator.first(),
							null,
							step,
							this.globals,
							this.storageManager,
							this.exportsManager,
							this.communicationChannel,
							this.sdk,
							this.context,
						);
						break;
					default:
						throw new Error("Invalid action category handler");
				}

				if (shouldSleepAfterComplete) {
					await sleep(500);
				}
				// Woohoo! Action executed without any errors.
				if (shouldLog) {
					await this.handleActionExecutionStatus(
						action.name,
						ActionStatusEnum.COMPLETED,
						stepResult && stepResult.customLogMessage ? stepResult.customlogMessage : `Finished performing ${action.description}`,
						stepResult
							? {
									...stepResult,
									actionName: step.name ? step.name : null,
									beforeUrl: beforeUrl,
									afterUrl: page ? await page.url() : null,
									meta: {
										...stepResult,
									},
							  }
							: {
									actionName: step.name ? step.name : null,
									beforeUrl: beforeUrl,
									afterUrl: page ? await page.url() : null,
							  },
						actionCallback,
					);
				}
			} catch (err) {
				if (shouldLog) {
					let endingScreenshot = null;
					try {
						endingScreenshot = await this._getCurrentScreenshot(page);
					} catch (ex) {}
					console.error(err);
					await this.handleActionExecutionStatus(
						action.name,
						err.isStalled ? ActionStatusEnum.STALLED : ActionStatusEnum.FAILED,
						`Error performing ${action.description}`,
						{
							failedReason: err.matcherResult ? err.matcherResult.message : err.message,
							screenshotDuringError: JSON.stringify({ startingScreenshot, endingScreenshot }),
							actionName: step.name ? step.name : null,
							beforeUrl: beforeUrl,
							afterUrl: page ? await page.url() : null,
							meta: {
								...(err.meta ? err.meta : {}),
								remainingActionsArr: [...remainingActionsArr],
							},
						},
						actionCallback,
					);
				}
				if (!step.payload.isOptional || err.isStalled) {
					throw err;
				}
			}
		};
	}

	registerStepHandler(actionType: ActionsInTestEnum, description: string, handler: any) {
		const validActionRegexMatches = validActionTypeRegex.exec(actionType);
		if (!validActionRegexMatches) throw new Error("Invalid format for action type" + actionType);

		const actionCategory: IActionCategory = validActionRegexMatches[1] as any;
		this.actionHandlers[actionType] = this.stepHandlerHOC(handler, { name: actionType, description: description, category: actionCategory });
	}

	async runActions(
		actions: Array<iAction>,
		browser: Browser,
		page: Page | null = null,
		actionCallback: ActionStatusCallbackFn | null = null,
		shouldLog: boolean = true,
	) {
		let index = 0;

		const remainingActionsArr = [...actions];

		for (let action of actions) {
			remainingActionsArr.shift();

			if (!this.actionHandlers[action.type]) throw new Error("No handler for this action type");
			await this.actionHandlers[action.type](
				action,
				browser,
				page,
				actionCallback ? actionCallback.bind(this, action) : null,
				actions[index + 1] ? (actions[index + 1].type !== ActionsInTestEnum.WAIT_FOR_NAVIGATION ? true : false) : false,
				remainingActionsArr,
				shouldLog,
			);
			index++;
		}
	}

	getStepHandlers() {
		return this.actionHandlers;
	}
}

export {
	CrusherRunnerActions,
	handlePopup,
	getBrowserActions,
	getMainActions,
	CrusherSdk,
	CommunicationChannel,
	ActionDescriptor,
	handleProxyPage,
	handleProxyBrowserContext,
};
