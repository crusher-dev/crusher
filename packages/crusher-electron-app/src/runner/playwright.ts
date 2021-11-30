import { GlobalManagerPolyfill, LogManagerPolyfill, StorageManagerPolyfill } from "./polyfill";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { CrusherSdk, CrusherRunnerActions, handlePopup, getBrowserActions, getMainActions } = require("../../../../output/crusher-runner-utils/");
import { ActionStatusEnum, iAction } from "../../../crusher-shared/types/action";
import axios from "axios";
import { resolveToBackendPath } from "../../../crusher-shared/utils/url";
import { MainWindow } from "../mainWindow";
import { ActionsInTestEnum } from "../../../crusher-shared/constants/recordedActions";
import { CookiesSetDetails, session, WebContents } from "electron";
import { ExportsManager } from "../../../crusher-shared/lib/exports";
import { CrusherCookieSetPayload } from "../../../crusher-shared/types/sdk/types";
import { getReplayableTestActions } from "../utils";

const playwright = typeof __non_webpack_require__ !== "undefined" ? __non_webpack_require__("./playwright/index.js") : require("playwright");

type ElectronCompatibleCookiePayload = Omit<CrusherCookieSetPayload, "sameSite"> & {
	sameSite: Pick<CookiesSetDetails, "sameSite">;
};

class PlaywrightInstance {
	private logManager: LogManagerPolyfill;
	private storageManager: StorageManagerPolyfill;
	private globalManager: GlobalManagerPolyfill;
	private runnerManager: any;

	browser: any;
	private browserContext: any;
	page: any;
	private mainWindow: MainWindow;

	private sdkManager: any;
	private running = false;
	private exportsManager;

	constructor(mainWindow: MainWindow, willRunFromStart: boolean) {
		this.running = willRunFromStart;
		this.mainWindow = mainWindow;
		this.logManager = new LogManagerPolyfill();
		this.storageManager = new StorageManagerPolyfill();
		this.globalManager = new GlobalManagerPolyfill();
		this.exportsManager = new ExportsManager();
		this.runnerManager = new CrusherRunnerActions(
			this.logManager as any,
			this.storageManager as any,
			"/tmp/crusher/somedir/",
			this.globalManager,
			this.exportsManager,
			this.sdkManager,
		);

		CrusherSdk.prototype.reloadPage = async () => {
			await this.mainWindow.webContents.executeJavaScript("document.querySelector('webview').reload();");
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

			const filteredCookies: Array<ElectronCompatibleCookiePayload> = cookies.map((cookie) => {
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

	isRunning() {
		return this.running;
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
			return !url.startsWith("chrome-extension://");
		});

		const page = pages[webViewPage];
		return page;
	}

	async connect() {
		this.browser = await playwright.chromium.connectOverCDP("http://localhost:9112/", { customBrowserName: "electron-webview" });
		this.browserContext = (await this.browser.contexts())[0];
		this.page = await this._getWebViewPage();
		this.sdkManager = new CrusherSdk(this.page, this.exportsManager, this.storageManager);

		await this.initialize();
	}

	async initialize() {
		this.page.on("console", async (msg) => {
			const [typeObj, valueObj] = msg.args();
			if (!typeObj || !valueObj) return;

			const type = await typeObj.jsonValue();
			switch (type) {
				case "CRUSHER_HOVER_ELEMENT":
					await valueObj.hover();
					break;
				case "CRUSHER_CLICK_ELEMENT":
					await valueObj.click();
					break;
			}
		});
	}

	async runMainActions(actions: Array<iAction>, isRunAfterTestAction: boolean): Promise<boolean> {
		const actionsArr = getMainActions(actions);

		await this.mainWindow.webContents.executeJavaScript("document.querySelector('webview').focus();");
		await this.runnerManager.runActions(actionsArr, this.browser, this.page, async (action: iAction, result) => {
			const { actionType, status, meta }: { actionType: ActionsInTestEnum; status: any, meta: any } = result;
			if(status === "STARTED" && !isRunAfterTestAction) {
				action.status = ActionStatusEnum.STARTED;
				this.mainWindow.saveRecordedStep(action);
			}
			if (status === "FAILED") {
				this.mainWindow.updateLastRecordedStepStatus(ActionStatusEnum.FAILURE);
				this.mainWindow.addToRemainingSteps(meta.meta.remainingActionsArr);
			}
			if (status === "COMPLETED" && !isRunAfterTestAction) {
				this.mainWindow.updateLastRecordedStepStatus(ActionStatusEnum.SUCCESS);
			}
		});
		return true;
	}

	async _changeDeviceIfNotSame(actions: Array<iAction>): Promise<boolean> {
		const extensionUrl = new URL(this.mainWindow.webContents.getURL());
		const deviceAction = actions.find((action) => action.type === "BROWSER_SET_DEVICE");
		if(!deviceAction) return false;
		
		return this.mainWindow.app._setDevice(deviceAction.payload.meta.device.id);
	}

	private _getRunAfterTestTestAction(actions: Array<iAction>): iAction {
		const runAfterTestAction = actions.find((action) => action.type === ActionsInTestEnum.RUN_AFTER_TEST);
		return runAfterTestAction;
	}

	async runActions(actions: any, isRunAfterTestAction = false) {
		this.mainWindow.clearReminingSteps();
		const isDeviceToBeChanged = isRunAfterTestAction ? false : await this._changeDeviceIfNotSame(actions);
		const browserActions = getBrowserActions(actions);
		const runAfterTestAction = this._getRunAfterTestTestAction(actions);
		let error = null;

		if (!isDeviceToBeChanged) {
			try {
				if (runAfterTestAction) {
					runAfterTestAction.status = ActionStatusEnum.STARTED;
					this.mainWindow.saveRecordedStep(runAfterTestAction);

					try {
						await this.runMainActions(await getReplayableTestActions(runAfterTestAction.payload.meta.value), true);
						this.mainWindow.updateLastRecordedStepStatus(ActionStatusEnum.SUCCESS);
					} catch(ex) {
						this.mainWindow.addToRemainingSteps(actions);
						throw ex;
					}
				}

				await this.runMainActions(actions, isRunAfterTestAction);
			} catch (err) {
				error = err;
				console.error(err);
				throw error;
			}

			this.running = false;
			console.log("Finished replaying test");
			return { error };
		}
	}

	async runTestFromRemote(testId: number, isRunAfterTestAction = false) {
		const testInfo = await axios.get(resolveToBackendPath(`/tests/${testId}`));
		const actions = testInfo.data.events;
		try {
			await this.runActions(actions, isRunAfterTestAction);
		} catch(ex) { 
			await this.mainWindow.sendMessage("SET_IS_REPLAYING", { value: false });
		}
		return true;
	}

	async runTempTestForVerification(tempTestId: number): Promise<{ error: null | Error, actions: Array<any> }> {
		const testInfo = await axios.get(resolveToBackendPath(`/tests/actions/get.temp?id=${tempTestId}`));
		const actions = testInfo.data.events;
		try {
		 await this.runActions(actions, false);
		 return { error: null, actions }
		} catch(err) {
			return { error: err, actions };
		}
	}
}

export { PlaywrightInstance };
