import { addHttpToURLIfNotThere } from "../../crusher-shared/utils/url";
import { BrowserWindow, session, WebContents, app, shell, ipcMain } from "electron";
import * as path from "path";
import { WebView } from "./webView";
import { ActionStatusEnum, iAction } from "../../crusher-shared/types/action";
import { App } from "./app";
import * as fs from "fs";

const extensionURLRegExp = new RegExp(/(^chrome-extension:\/\/)([^\/.]*)(\/test_recorder\.html?.*)/);
class MainWindow {
	webContents: WebContents;
	webView: WebView;
	app: App;

	state: {
		targetSite?: string;
		replayTestId?: string;
		shouldRunAfterTest?: boolean;
		runAfterTestId?: string;
		isTestRunning: boolean;
		isTestVerified: boolean;
		webViewSrc?: string;
		remainingSteps?: Array<iAction>;
	};
	appState: { userAgent: string };

	_getStateFromArgs(): { targetSite?: string; replayTestId?: string; shouldRunAfterTest: boolean; isTestRunning: false; isTestVerified: boolean } {
		if (!process.argv.length)
			return { replayTestId: undefined, targetSite: undefined, shouldRunAfterTest: false, isTestRunning: false, isTestVerified: false };

		const deepLink = process.argv[process.argv.length - 1];
		if (deepLink && deepLink.startsWith("crusher://replay-test")) {
			const url = new URL(deepLink);
			return {
				replayTestId: url.searchParams.get("testId"),
				targetSite: "https://example.com",
				shouldRunAfterTest: false,
				isTestRunning: false,
				isTestVerified: false,
			};
		}

		return {
			replayTestId: app.commandLine.getSwitchValue("replay-test-id") || undefined,
			targetSite: app.commandLine.getSwitchValue("target-site") || undefined,
			shouldRunAfterTest: false,
			isTestRunning: false,
			isTestVerified: false,
		};
	}

	constructor(app: App, private browserWindow: BrowserWindow, appState: { userAgent: string }) {
		this.app = app;
		this.browserWindow = browserWindow;
		this.webContents = browserWindow.webContents;
		this.state = this._getStateFromArgs();
		this.appState = appState;
	}

	async loadExtension() {
		const targetSite = this.state.targetSite;
		const openExtensionUrl = app.commandLine.getSwitchValue("open-extension-url");

		const { id: extensionId } = await session.defaultSession.loadExtension(path.resolve(__dirname, "./extension"), { allowFileAccess: true });
		let urlToOpen = openExtensionUrl ? openExtensionUrl : `chrome-extension://${extensionId}/test_recorder.html`;

		if (!openExtensionUrl && targetSite) {
			urlToOpen += `?url=${addHttpToURLIfNotThere(targetSite)}&device=GoogleChromeMediumScreen`;
		}

		if (openExtensionUrl && urlToOpen.match(extensionURLRegExp)) {
			// Need to update extension id in the previous url
			// to latest extension id
			urlToOpen = urlToOpen.replace(extensionURLRegExp, `$1${extensionId}$3`);
		}

		await this.browserWindow.loadURL(urlToOpen);
		return true;
	}

	async initialize() {
		await this.setupListeners();
		await this.browserWindow.maximize();

		await this.loadExtension();

		await this.setupDebugger();
	}

	async setupDebugger() {
		this.webContents.debugger.attach("1.3");

		await this.webContents.debugger.sendCommand("Debugger.enable");
		await this.webContents.debugger.sendCommand("DOM.enable");
		await this.webContents.debugger.sendCommand("Runtime.enable");
	}

	allowAllNetworkRequests(responseDetails, updateCallback) {
		Object.keys(responseDetails.responseHeaders).map((headers) => {
			if (["x-frame-options", "content-security-policy", "frame-options"].includes(headers.toString().toLowerCase())) {
				delete responseDetails.responseHeaders[headers];
			}
		});

		updateCallback({ cancel: false, responseHeaders: responseDetails.responseHeaders });
	}

	handleNewWindow(event, popupUrl) {
		if (this.webContents.getURL().startsWith("chrome-extension")) {
			if (popupUrl.endsWith("#crusherExternalLink")) {
				event.preventDefault();
				shell.openExternal(popupUrl.substring(0, popupUrl.length - "#crusherExternalLink".length));
			} else if (!popupUrl.endsWith("#crusherBackendServer")) {
				event.preventDefault();
				this.webContents.executeJavaScript(
					`document.querySelector('#device_browser').src = "${popupUrl.substring(0, popupUrl.length - "#crusherBackendServer".length)}"`,
				);
			}
		} else {
			event.preventDefault();
			this.webContents.executeJavaScript(`window.location.href = "${popupUrl}"`);
		}
	}

	saveRecordedStep(action: iAction) {
		this.browserWindow.webContents.send("post-message-to-host", { type: "RECORD_REPLAY_ACTION", meta: action });
		return true;
	}

	clearReminingSteps() {
		this.state.remainingSteps = undefined;
	}

	addToRemainingSteps(actions: Array<iAction>) {
		if(!this.state.remainingSteps) {
			this.state.remainingSteps = [];
		}

		this.state.remainingSteps.push(...actions);
	}

	updateLastRecordedStepStatus(status: ActionStatusEnum) {
		this.browserWindow.webContents.send("post-message-to-host", { type: "UPDATE_LAST_RECORDED_ACTION_STATUS", meta: { status } });
		return true;
	}

	async handleWebviewAttached(event, webContents) {
		webContents.setUserAgent(this.appState.userAgent);
		this.webView = new WebView(this.browserWindow, this, this.state);
		await this.webView.initialize();
		// this.webContents.setUserAgent(USER_AGENT.value);
	}

	async isTestVerified(event) {
		return this.state.isTestVerified;
	}

	async verifyTest(event, tempTestId) {
		await this.browserWindow.webContents.send("post-message-to-host", { type: "SET_IS_VERIFYING_STATE", meta: { value: true } });

		await this.webView.webContents().loadURL("https://example.com");

		await this.app.cleanupStorage();
		this.state.isTestRunning = true;
		this.browserWindow.webContents.send("post-message-to-host", { type: "CLEAR_RECORDED_ACTIONS" });
		const { error } = await this.webView.playwrightInstance.runTempTestForVerification(tempTestId);
		this.state.isTestRunning = false;

		if (error) {
			this.webContents.executeJavaScript('alert("Test steps cannot pe perfomed successfully");');
		} else {
			this.state.isTestVerified = true;
			this.browserWindow.webContents.send("post-message-to-host", { type: "SAVE_RECORDED_TEST" });
		}

		await this.browserWindow.webContents.send("post-message-to-host", { type: "SET_IS_VERIFYING_STATE", meta: { value: false } });
	}

	async setupListeners() {
		this.webContents.session.webRequest.onHeadersReceived({ urls: ["*://*/*"] }, this.allowAllNetworkRequests.bind(this));

		ipcMain.on("post-message-to-host", (event, data) => {
			if (!this.webView.isInRunningState()) {
				if (["RECORD_ACTION"].includes(data.type)) {
					this.state.isTestVerified = false;
				}

				this.browserWindow.webContents.send("post-message-to-host", data);
			} else {
				if (!["RECORD_ACTION"].includes(data.type)) {
					this.browserWindow.webContents.send("post-message-to-host", data);
				}
			}
		});
		ipcMain.handle("is-test-verified", this.isTestVerified.bind(this));
		ipcMain.handle("verify-test", this.verifyTest.bind(this));
		ipcMain.handle("steps-updated", this.handleStepsUpdated.bind(this));
		ipcMain.handle("continue-remaining-test", this.continueRemainingTest.bind(this));
		ipcMain.handle("navigate-page", this.handleNavigatePage.bind(this));

		ipcMain.handle("run-after-this-test", this.handleRunAfterThisTest.bind(this));

		this.webContents.on("new-window", this.handleNewWindow.bind(this));
		this.webContents.on("did-attach-webview", this.handleWebviewAttached.bind(this));
		this.webContents.on("will-attach-webview", this.handleWebviewWillAttach.bind(this));
		// on reload listener
		this.webContents.on("did-finish-load", () => {
			this.app.cleanupStorage();
		});
		this.registerIPCListeners();
	}


	async handleNavigatePage(event, url) {
		if(this.webView){
			this.webView.webContents().loadURL(url);
		}
		return true;
	}

	async continueRemainingTest(event) {
		if(!this.state.remainingSteps || !this.state.remainingSteps.length) return false;
		console.log("Reaming steps are", this.state.remainingSteps);
		await this.sendMessage("SET_IS_REPLAYING", { value: true });
		this.webView.setRunningState(true);
		this.webView.playwrightInstance.runActions(this.state.remainingSteps).finally(() => {
			this.state.remainingSteps = undefined;
			this.sendMessage("SET_IS_REPLAYING", { value: false });
			this.webView.setRunningState(false);
		});
		return true;
	}

	handleGetContentScript(event) {
		const scriptContent = fs.readFileSync(path.join(__dirname, "extension/js/content_script.js"));
		return scriptContent;
	}

	handleWebviewWillAttach(event,
		webPreferences, params) {
			if(params.src.startsWith("about:blank")) {
				const internalURL = new URL(params.src);
				this.state.webViewSrc = internalURL.searchParams.get("url");
			} else {
				this.state.webViewSrc = params.src;
			}
	}

	async handleStepsUpdated(event) {
		// @TODO: Add functionality here
		return true;
	}

	async handleRunAfterThisTest(event, testId) {
		this.state = {
			...this.state,
			replayTestId: null,
			targetSite: "https://example.com",
			shouldRunAfterTest: true,
			runAfterTestId: testId,
		};

		const currentUrl = new URL(this.browserWindow.webContents.getURL());
		currentUrl.searchParams.set("url", "https://example.com");
		this.webView = null;

		return this.browserWindow.loadURL(currentUrl.toString());
	}

	registerIPCListeners() {
		ipcMain.on("init-web-view", this.initWebView.bind(this));
	}

	destroy() {
		ipcMain.removeAllListeners("init-web-view");
		this.webContents.removeAllListeners();
	}

	async initWebView(event, webContentsId) {
		// DUmmy method
	}

	async sendMessage(messageType: string, meta: any) {
		return this.browserWindow.webContents.send("post-message-to-host", { type: messageType, meta });
	}
}

export { MainWindow };
