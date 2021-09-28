import { addHttpToURLIfNotThere } from "../../crusher-shared/utils/url";
import { BrowserWindow, session, WebContents, app, shell, ipcMain } from "electron";
import * as path from "path";
import { WebView } from "./webView";
import { iAction } from "@shared/types/action";
import { App } from "./app";

const extensionURLRegExp = new RegExp(/(^chrome-extension:\/\/)([^\/.]*)(\/test_recorder\.html?.*)/);
class MainWindow {
	webContents: WebContents;
	webView: WebView;
	app: App;

	state: { targetSite?: string; replayTestId?: string };
	appState: { userAgent: string };

	_getStateFromArgs(): { targetSite?: string; replayTestId?: string } {
		if (!process.argv.length) return { replayTestId: undefined, targetSite: undefined };

		const deepLink = process.argv[process.argv.length - 1];
		if (deepLink && deepLink.startsWith("crusher://replay-test")) {
			const url = new URL(deepLink);
			return { replayTestId: url.searchParams.get("testId"), targetSite: "https://example.com" };
		}

		return {
			replayTestId: app.commandLine.getSwitchValue("replay-test-id") || undefined,
			targetSite: app.commandLine.getSwitchValue("target-site") || undefined,
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
			urlToOpen += `?url=${addHttpToURLIfNotThere(targetSite)}&device=GoogleChromeLargeScreen`;
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

	async handleWebviewAttached(event, webContents) {
		webContents.setUserAgent(this.appState.userAgent);
		this.webView = new WebView(this.browserWindow, this, this.state);
		await this.webView.initialize();
		// this.webContents.setUserAgent(USER_AGENT.value);
	}

	async setupListeners() {
		this.webContents.session.webRequest.onHeadersReceived({ urls: ["*://*/*"] }, this.allowAllNetworkRequests.bind(this));

		ipcMain.on("post-message-to-host", (event, data) => {
			if (!this.webView.isInRunningState()) {
				this.browserWindow.webContents.send("post-message-to-host", data);
			} else {
				if (!["RECORD_ACTION"].includes(data.type)) {
					this.browserWindow.webContents.send("post-message-to-host", data);
				}
			}
		});

		this.webContents.on("new-window", this.handleNewWindow.bind(this));
		this.webContents.on("did-attach-webview", this.handleWebviewAttached.bind(this));
		this.registerIPCListeners();
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
