import { addHttpToURLIfNotThere } from "../../crusher-shared/utils/url";
import { BrowserWindow, session, WebContents, app, shell, ipcMain } from "electron";
import * as path from "path";
import { WebView } from "./webView";

const extensionURLRegExp = new RegExp(/(^chrome-extension:\/\/)([^\/.]*)(\/test_recorder\.html?.*)/);

class MainWindow {
	webContents: WebContents;
	webView: WebView;

	constructor(private browserWindow: BrowserWindow) {
		this.browserWindow = browserWindow;
		this.webContents = browserWindow.webContents;
	}

	async loadExtension() {
		const targetSite = app.commandLine.getSwitchValue("targetSite");
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

		await this.loadExtension();
		await this.browserWindow.maximize();

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

	async handleWebviewAttached() {
		this.webView = new WebView(this.browserWindow);
		await this.webView.initialize();
		// this.webContents.setUserAgent(USER_AGENT.value);
	}

	async setupListeners() {
		this.webContents.session.webRequest.onHeadersReceived({ urls: ["*://*/*"] }, this.allowAllNetworkRequests.bind(this));

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
		// this.webView = new WebView(this.browserWindow);
		// await this.webView.initialize();
	}
}

export { MainWindow };
