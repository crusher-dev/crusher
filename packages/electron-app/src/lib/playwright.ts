// eslint-disable-next-line @typescript-eslint/no-var-requires
import { iAction, iActionResult } from "../../../crusher-shared/types/action";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { CookiesSetDetails, session } from "electron";
import { ExportsManager } from "../../../crusher-shared/lib/exports";
import { CrusherCookieSetPayload } from "../../../crusher-shared/types/sdk/types";
import { GlobalManagerPolyfill, LogManagerPolyfill, StorageManagerPolyfill } from "./polyfills";
import { CrusherRunnerActions, CrusherSdk, getMainActions } from "runner-utils/src/index";
import { Browser, BrowserContext, ConsoleMessage, Page, ElementHandle } from "playwright";
import { AppWindow } from "../main-process/app-window";

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

	/* Map to contain element handles from uniqueId saved in renderer */
	elementsMap: Map<string, ElementHandle>;
    page: Page;
    
	private isBusy = false;

	constructor(appWindow: AppWindow) {
		this.appWindow = appWindow;
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

        this._overrideSdkActions();
	}

	public getElementHandleFromUniqueId(uniqueId: string) {
		return this.elementsMap.get(uniqueId);
	}

    private _overrideSdkActions() {
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

	async connect() {
		this.browser = await playwright.chromium.connectOverCDP("http://localhost:9112/", { customBrowserName: "electron-webview" });
		this.browserContext = (await this.browser.contexts())[0];
        // @TODO: Look into this
		this.page = await this._getWebViewPage();
		this.sdkManager = new CrusherSdk(this.page, this._exportsManager as any, this._storageManager as any);

		this.page.on("console", this._handleConsoleMessage);
	}

    /* Serves as an API to click/hover over elements through playwright */
    private _handleConsoleMessage = async (msg: ConsoleMessage) => {
		const messageArgs = msg.args(); 

        const [typeObj, valueObj] = messageArgs;
        if(!typeObj || !valueObj) return;

        const type = await typeObj.jsonValue();
        switch(type) {
            case "CRUSHER_HOVER_ELEMENT":
                await (valueObj as ElementHandle).hover()
                break;
            case "CRUSHER_CLICK_ELEMENT":
                await (valueObj as ElementHandle).click()
                break;
			case "CRUSHER_SAVE_ELEMENT_HANDLE": {
				const uniqueElementId = messageArgs[2].toString();

				const elementHandle = valueObj.asElement();
				if(elementHandle) this.elementsMap.set(uniqueElementId, elementHandle);
			}
        }
    };

	async runActions(actions: Array<iAction>, shouldNotSave: boolean = false): Promise<void> {
		const actionsArr = getMainActions(actions);

        /* Inputs can get affected if webview looses focus */
        await this.appWindow.focusWebView();
		
        await this.runnerManager.runActions(actionsArr, this.browser, this.page, async (action: iAction, result: iActionResult) => {
			if(!shouldNotSave) {
				const { status } = result;
				switch(status) {
					case ActionStatusEnum.STARTED:
						this.appWindow.getRecorder().saveRecordedStep(action, ActionStatusEnum.STARTED);
						break;
					case ActionStatusEnum.FAILED:
						this.appWindow.getRecorder().markRunningStepFailed();
						break;
					case ActionStatusEnum.COMPLETED:
						this.appWindow.getRecorder().markRunningStepCompleted();
						break;
				}
			}
        });
	}

	public addInitScript(scriptPath: string) {
		return this.browser.contexts()[0].addInitScript({
			path: scriptPath,
		});
	}

	public dispose(){
		this.elementsMap.clear();
		this.browser.close();
	}
}

export { PlaywrightInstance };
