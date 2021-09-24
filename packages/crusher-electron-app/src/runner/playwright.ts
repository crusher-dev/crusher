import { GlobalManagerPolyfill, LogManagerPolyfill, StorageManagerPolyfill } from "./polyfill";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { CrusherSdk, CrusherRunnerActions, handlePopup, getBrowserActions, getMainActions } = require("../../../../output/crusher-runner-utils/");
import { iAction } from "@shared/types/action";
import axios from "axios";
import { resolveToBackendPath } from "../../../crusher-shared/utils/url";

const playwright = typeof __non_webpack_require__ !== "undefined" ? __non_webpack_require__("./playwright/index.js") : require("playwright");

class PlaywrightInstance {
	private logManager: LogManagerPolyfill;
	private storageManager: StorageManagerPolyfill;
	private globalManager: GlobalManagerPolyfill;
	private runnerManager: any;

	private browser: any;
	private browserContext: any;
	private page: any;

	private sdkManager: any;

	constructor() {
		this.logManager = new LogManagerPolyfill();
		this.storageManager = new StorageManagerPolyfill();
		this.globalManager = new GlobalManagerPolyfill();
		this.runnerManager = new CrusherRunnerActions(this.logManager as any, this.storageManager as any, "/tmp/crusher/somedir/", this.globalManager);
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
			return !url.startsWith("chrome-extension://");
		});

		const page = pages[webViewPage];
		return page;
	}

	async connect() {
		this.browser = await playwright.chromium.connectOverCDP("http://localhost:9112/", { customBrowserName: "electron-webview" });
		this.browserContext = (await this.browser.contexts())[0];
		this.page = await this._getWebViewPage();
		this.sdkManager = new CrusherSdk(this.page);

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

	async runActions(actions: Array<iAction>): Promise<boolean> {
		await this.runnerManager.runActions(getMainActions(actions), this.browser, this.page);
		return true;
	}

	async runTestFromRemote(testId: number) {
		const testInfo = await axios.get(resolveToBackendPath(`/tests/${testId}`));
		await this.runnerManager.runActions(getMainActions(testInfo.data.events), this.browser, this.page);
		console.log("Finished performing test");
		return true;
	}
}

export { PlaywrightInstance };
