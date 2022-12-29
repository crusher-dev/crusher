// eslint-disable-next-line @typescript-eslint/no-var-requires
import { iAction, iActionResult } from "../../../crusher-shared/types/action";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { app, CookiesSetDetails, session } from "electron";
import { ExportsManager } from "../../../crusher-shared/lib/exports";
import { CrusherCookieSetPayload } from "../../../crusher-shared/types/sdk/types";
import { GlobalManagerPolyfill, LogManagerPolyfill, StorageManagerPolyfill } from "./polyfills";
import { ActionDescriptor, CrusherRunnerActions, CrusherSdk, getMainActions } from "runner-utils/src/index";
import { Browser, BrowserContext, ConsoleMessage, Page, ElementHandle, JSHandle } from "playwright";
import { AppWindow } from "../main-process/app-window";
import * as fs from "fs";
import * as path from "path";
import { ACTION_DESCRIPTIONS } from "../_ui/ui/containers/components/sidebar/steps";
import { uuidv4 } from "runner-utils/src/utils/helper";
import { StepErrorTypeEnum } from "runner-utils/src/error.types";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import Table from "cli-table";
import { getSavedSteps } from "../store/selectors/recorder";
import { getCurrentProjectMetadata } from "../store/selectors/projects";
import { getStore } from "../store/configureStore";

const { performance } = require("perf_hooks");
//@ts-ignore
const playwright = typeof __non_webpack_require__ !== "undefined" ? __non_webpack_require__("./playwright/index.js") : require("playwright");
type ElectronCompatibleCookiePayload = Omit<CrusherCookieSetPayload, "sameSite"> & {
	sameSite: Pick<CookiesSetDetails, "sameSite">;
};

class PlaywrightInstance {
	private _logManager: LogManagerPolyfill;
	private _storageManager: StorageManagerPolyfill;
	private _globalManager: GlobalManagerPolyfill;
	private _exportsManager: ExportsManager;

	private appWindow: AppWindow;

	private runnerManager: CrusherRunnerActions;
	private sdkManager: CrusherSdk;
	private browser: Browser;
	private browserContext: BrowserContext;
	public actionDescriptor: ActionDescriptor;

	/* Map to contain element handles from uniqueId saved in renderer */
	elementsMap: Map<string, { handle: ElementHandle; parentFrameSelectors?: any[] }>;
	page: Page;

	private isBusy = false;

	lastAction: { action: iAction; id: string; time: number };

	constructor(appWindow: AppWindow) {
		this.appWindow = appWindow;
		this.elementsMap = new Map();
		this._logManager = new LogManagerPolyfill();
		this._storageManager = new StorageManagerPolyfill();
		this._globalManager = new GlobalManagerPolyfill();
		this._exportsManager = new ExportsManager();
		this.actionDescriptor = new ActionDescriptor();
		this.actionDescriptor.initActionHandlers();

		this.runnerManager = new CrusherRunnerActions(
			this._logManager as any,
			this._storageManager as any,
			"/tmp/crusher/somedir/",
			this._globalManager,
			this._exportsManager,
			this.sdkManager,
		);

		this._overrideSdkActions();
	}

	public getTestLogs() {
		return this._globalManager.get("TEST_RESULT");
	}

	getContext() {
		return this.runnerManager.context;
	}

	public getElementInfoFromUniqueId(uniqueId: string) {
		return this.elementsMap.get(uniqueId);
	}

	private _overrideSdkActions() {
		CrusherSdk.prototype.spawnTests = () => {
			return;
		};

		CrusherSdk.prototype.reloadPage = async () => {
			await this.page.evaluate(() => {
				window.location.reload();
			}, []);

			return true;
		};

		CrusherSdk.prototype.setCookies = async (cookies) => {
			const getCompatibleElectronSameSiteFormat = (sameSite: string): Pick<CookiesSetDetails, "sameSite"> => {
				switch (sameSite) {
					case "Strict":
						return "strict" as any;
					case "Lax":
						return "lax" as any;
					case "None":
						return "no_restriction" as any;
					default:
						throw new Error("Invalid sameSite type");
				}
			};

			const filteredCookies: ElectronCompatibleCookiePayload[] = cookies.map((cookie) => {
				return {
					...cookie,
					sameSite: cookie.sameSite ? getCompatibleElectronSameSiteFormat(cookie.sameSite) : undefined,
				};
			});

			for (const cookie of filteredCookies) {
				await session.defaultSession.cookies.set(cookie as any);
			}

			return true;
		};
	}

	getSdkManager() {
		return this.sdkManager;
	}

	async _getWebViewPage() {
		const pages = await this.browserContext.pages();

		const pagesMap = await Promise.all(
			pages.map((page) => {
				return page.url();
			}),
		);

		const webViewPage = await pagesMap.findIndex((url: string) => {
			// Webview url will never start from extension url
			return url.startsWith("about:blank");
		});

		const page = pages[webViewPage];
		return page;
	}


	private async handleWebviewScreenshot() {
		const page = this.page;
		const base64 = (await (await page.context().newCDPSession(this.page)).send('Page.captureScreenshot')).data;
		
		await this.appWindow.getWebContents().executeJavaScript(`console.log(${JSON.stringify(base64)})`);
		return base64;
	}

	private async handleWebviewElementScreenshot(elementHandle: ElementHandle) {
		const elScreenshot = await elementHandle.screenshot()
	}

	private async handleWebviewLogInfo(source, message: string) {
		console.log(message);
	}

	private async handleWebviewClick(source, element: ElementHandle) {
		await element.click();
	}

	private async handleWebviewHover(source, element: ElementHandle) {
		await element.hover();
	}

	private async handleSaveElementHandle(source, args: JSHandle) {
		const properties = await args.getProperties();
		const uniqueElementId = await properties.get("uniqueElementId").jsonValue();
		const elementHandle = await properties.get("element").asElement();

		const ownerFrame = await elementHandle.ownerFrame();
		const parentFrame = await ownerFrame.parentFrame();
		let parentFrameSelectors = null;
		if (parentFrame && !(await ownerFrame.isDetached())) {
			const ownerFrameElement = await ownerFrame.frameElement();
			parentFrameSelectors = await parentFrame.evaluate(
				(element) => {
					return (window as any).getSelectors(element[0]);
				},
				[ownerFrameElement],
			);
		}
		if (elementHandle) {
			this.elementsMap.set(uniqueElementId, { handle: elementHandle, parentFrameSelectors });
			this.appWindow.reinstateElementSteps(uniqueElementId, this.elementsMap.get(uniqueElementId));
		}
	}

	async connect() {
		const store = getStore();
		const projectMetadata: any = getCurrentProjectMetadata(store.getState() as any) || {};

		const selectedEnvironment = projectMetadata?.selectedEnvironment;
		const environment = projectMetadata?.environments[selectedEnvironment];

		if(environment?.variables) {
			for(const key in environment.variables) {
				const value = environment.variables[key];
				const contextVar = this.getContext();
				if(contextVar) {
					contextVar[key] = value;
				}
			}
		}

		const debuggingPortFile = fs.readFileSync(path.join(app.getPath("userData"), "DevToolsActivePort"), "utf8");
		const [debuggingPort] = debuggingPortFile.split("\n");
		this.browser = await playwright.chromium.connectOverCDP(`http://localhost:${debuggingPort}/`, { customBrowserName: "electron-webview" });
		[this.browserContext] = await this.browser.contexts();
		// @TODO: Look into this
		this.page = await this._getWebViewPage();
		this.sdkManager = new CrusherSdk(this.page, this._exportsManager as any, this._storageManager as any);

		try {
			this.page.exposeBinding("crusherSdk.screenshot", this.handleWebviewScreenshot.bind(this));
			this.page.exposeBinding("crusherSdk.logInfo", this.handleWebviewLogInfo.bind(this));
			this.page.exposeBinding("crusherSdk.click", this.handleWebviewClick.bind(this));
			this.page.exposeBinding("crusherSdk.hover", this.handleWebviewHover.bind(this));
			this.page.exposeBinding("crusherSdk.saveElementHandle", this.handleSaveElementHandle.bind(this), { handle: true });
		} catch (e) {
			console.error("Error while exposing crusherSdk binding", e);
		}
		global.customLogger = {
			log: (message) => {
				if (!message.includes("immediate._onImmediate") && this.lastAction) {
					const prefix = "";
					this.appWindow.recordLog({
						id: uuidv4(),
						parent: this.lastAction ? this.lastAction.id : null,
						message: prefix + message,
						type: "info",
						args: [],
						time: performance.now(),
					});
				}
			},
		};
	}

	/* Serves as an API to click/hover over elements through playwright */
	private _handleConsoleMessage = async (msg: ConsoleMessage) => {
		const [typeObj, valueObj] = msg.args();
		if (!typeObj || !valueObj) return;

		const type = await typeObj.jsonValue();
		switch (type) {
			case "CRUSHER_HOVER_ELEMENT":
				await (valueObj as ElementHandle).hover();
				break;
			case "CRUSHER_CLICK_ELEMENT":
				await (valueObj as ElementHandle).click();
				break;
		}
	};

	private getErrorType = (error: Error) => {
		const isCrusherCustomizedError = error?.meta;
		let errorType = StepErrorTypeEnum.UNEXPECTED_ERROR_OCCURRED;

		if(isCrusherCustomizedError) {
			if(error?.meta?.type) {
				errorType =  error.meta!.type;
			}
		} else {
			if(error?.name) errorType = error.name;
		}

		return errorType;
	};

	private handleFailedStep(failedAction: iAction, result: iActionResult, shouldNotSave: boolean, startTime) {
		const { meta } = result;
		const { error, failedReason } = meta;
		
		const errorType = this.getErrorType(error);
		
		const isStalled = result.status === ActionStatusEnum.STALLED;			
		const uniqueId = uuidv4();
		this.appWindow.recordLog({
			id: uniqueId,
			message: `Error performing ${ACTION_DESCRIPTIONS[failedAction.type]} `,
			type: "error",
			args: [],
			time: performance.now(),
		});
		this.appWindow.recordLog({
			id: uuidv4(),
			message: `<= ${failedReason.replace(/[\u001b\u009b][#();?[]*(?:\d{1,4}(?:;\d{0,4})*)?[\d<=>A-ORZcf-nqry]/g, "")}`,
			type: "error",
			args: [],
			time: performance.now(),
			parent: uniqueId,
		});

		if(failedAction.type === ActionsInTestEnum.ASSERT_ELEMENT) {
			if(result?.meta?.meta?.type) {
				const {type, meta: assertMeta } = result.meta.meta;

				if(type === StepErrorTypeEnum.ASSERTIONS_FAILED) {
					const { logs } = assertMeta;
					// Create table
					const table = new Table({ head: ["Field", "Operation", "Current", "Expected", "Status"],
					colors: false, colAligns: ["middle", "middle", "middle", "middle", "middle"],
					colWidths: [15, 15, 40, 40, 10]
				});


					logs.forEach((log) => {
						const { meta: logItemMeta, status }= log;
						table.push([logItemMeta.field, logItemMeta.operation, logItemMeta.elementValue, logItemMeta.valueToMatch, status !== "FAILED" ? "✅" : "❌"]);
					});

					this.appWindow.recordLog({
						id: uuidv4(),
						message: table.toString(),
						type: "error",
						args: [],
						time: performance.now(),
						parent: uniqueId,
					});
				}
			}
		}
		if (!shouldNotSave) {
			if (isStalled) {
				// @TODO: Update it ActionStatusEnum.STALLED
				this.appWindow.getRecorder().markRunningStepCompleted();
			} else {
				this.appWindow.getRecorder().markRunningStepFailed(errorType);
			}
		}

		const stepIndex = getSavedSteps(this.appWindow.store.getState() as any).length - 1;
		 this.appWindow.sendMessage("recorder-step-error", {
			stepIndex,
			error,
			startTime: startTime,
			endTime: performance.now()
		});
	}

	async runActions(actions: iAction[], shouldNotSave = false): Promise<void> {
		const actionsArr = getMainActions(actions);

		/* Inputs can get affected if webview looses focus */
		await this.appWindow.focusWebView();

		await this.runnerManager.runActions(actionsArr, this.browser, this.page, (action: iAction, result: iActionResult) => {
			const { status } = result;
			switch (status) {
				case ActionStatusEnum.STARTED:
					this.lastAction = { id: uuidv4(), action, time: performance.now() };
					this.appWindow.recordLog({
						id: this.lastAction.id,
						message: String(action.name || this.actionDescriptor.describeAction(action as any)),
						type: "info",
						args: [],
						time: performance.now(),
					});

					if (!shouldNotSave) this.appWindow.getRecorder().saveRecordedStep(action, ActionStatusEnum.STARTED);
					break;
				case ActionStatusEnum.FAILED:
				case ActionStatusEnum.STALLED:
					const startTime = this.lastAction.time;
					this.lastAction = null;
					this.handleFailedStep(action, result, shouldNotSave, startTime);
					break;
				case ActionStatusEnum.COMPLETED:
					this.appWindow.recordLog({
						id: uuidv4(),
						message: `Performed ${ACTION_DESCRIPTIONS[action.type]}`,
						type: "info",
						args: [],
						time: performance.now(),
						parent: this.lastAction.id,
					});
					this.lastAction = null;
					if (!shouldNotSave) this.appWindow.getRecorder().markRunningStepCompleted();
					break;
			}
		}, true, false);
	}

	public addInitScript(scriptPath: string) {
		return this.browser.contexts()[0].addInitScript({
			path: scriptPath,
		});
	}

	public clear() {
		this.elementsMap = new Map();
		this._logManager = new LogManagerPolyfill();
		this._storageManager = new StorageManagerPolyfill();
		this._globalManager = new GlobalManagerPolyfill();
		this._exportsManager = new ExportsManager();

		this.runnerManager = new CrusherRunnerActions(
			this._logManager as any,
			this._storageManager as any,
			"/tmp/crusher/somedir/",
			this._globalManager,
			this._exportsManager,
			this.sdkManager,
		);
	}

	public dispose() {
		this.elementsMap.clear();
		this.browser.close();
	}
}

export { PlaywrightInstance };
