import { BrowserWindow, Debugger, WebContents, ipcMain, webContents, app } from "electron";
import { MainWindow } from "./mainWindow";
import { PlaywrightInstance } from "./runner/playwright";
import { ExportsManager } from "../../crusher-shared/lib/exports/index";
import axios from "axios";
import { resolveToBackendPath } from "../../crusher-shared/utils/url";
import { ActionsInTestEnum } from "../../crusher-shared/constants/recordedActions";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const highlighterStyle = require("./highlighterStyle.json");

export class WebView {
	debugger: Debugger;
	playwrightInstance: PlaywrightInstance;
	mainWindow: MainWindow;
	appState: {
		targetSite?: string;
		replayTestId?: string;
		replayTestInfo?: any;
		shouldRunAfterTest?: boolean;
		runAfterTestId?: string;
		isTestRunning: boolean;
	};
	browserWindow: BrowserWindow;
	exportsManager: ExportsManager;

	webContents() {
		const allWebContents = webContents.getAllWebContents();

		const webViewWebContents = allWebContents.find((a) => a.getType() === "webview");
		if (!webViewWebContents) throw new Error("No webview initialized");

		return webViewWebContents;
	}

	constructor(
		browserWindow: BrowserWindow,
		mainWindow: MainWindow,
		state: {
			targetSite?: string;
			replayTestId?: string;
			replayTestInfo?: any;
			shouldRunAfterTest?: boolean;
			runAfterTestId?: string;
			isTestRunning: boolean;
		},
	) {
		this.appState = state;
		this.browserWindow = browserWindow;
		this.mainWindow = mainWindow;
		this.exportsManager = new ExportsManager();
		this.debugger = this.webContents().debugger;
	}

	async initialize() {
		if (this.debugger.isAttached()) return;
		if (this.appState.shouldRunAfterTest || this.appState.replayTestId) {
			this.appState.isTestRunning = true;
		}

		this.destroy();

		this.playwrightInstance = new PlaywrightInstance(this.mainWindow, !!this.appState.replayTestId);

		this.debugger.attach("1.3");
		await this.debugger.sendCommand("Debugger.enable");
		await this.debugger.sendCommand("DOM.enable");
		await this.debugger.sendCommand("Runtime.enable");
		await this.debugger.sendCommand("Overlay.enable");
		await this.debugger.sendCommand("Page.enable");
		await this.debugger.sendCommand("Network.enable");
		await this.debugger.sendCommand("Emulation.setFocusEmulationEnabled", { enabled: true });
		await this.debugger.sendCommand("Debugger.setAsyncCallStackDepth", { maxDepth: 9999 });
		await this.debugger.sendCommand("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: true, flatten: true });
		// @TODO: This should not be necessary. Look into this
		// It's here to enable DOMDebugger, which is not getting enabled by default
		await this.debugger.sendCommand("DOMDebugger.setXHRBreakpoint", { url: "http://nonsense.com" });
		this.debugger.on("message", this.handleDebuggerEvents.bind(this));

		this.registerIPCListeners();

		await this.playwrightInstance.connect();

		// Add proper logic here
		if (this.appState.shouldRunAfterTest) {
			await this.mainWindow.sendMessage("SET_IS_REPLAYING", { value: true });
			await this.playwrightInstance.runTestFromRemote(parseInt(this.appState.runAfterTestId), true);
			await this.mainWindow.sendMessage("SET_IS_REPLAYING", { value: false });
			await this.mainWindow.saveRecordedStep({ type: ActionsInTestEnum.RUN_AFTER_TEST, payload: { meta: { value: this.appState.runAfterTestId } } });
		} else if (this.appState.replayTestId) {
			await this.mainWindow.sendMessage("SET_IS_REPLAYING", { value: true });
			await this.playwrightInstance.runTestFromRemote(parseInt(this.appState.replayTestId));
			await this.mainWindow.sendMessage("SET_IS_REPLAYING", { value: false });
		}

		this.appState.isTestRunning = false;
	}

	async _focusWebView() {
		await this.browserWindow.webContents.debugger.sendCommand("Runtime.evaluate", { expression: "document.querySelector('webview').focus();" });
	}

	registerIPCListeners() {
		ipcMain.handle("execute-custom-code", this._executeCustomCode.bind(this));
		ipcMain.on("turn-on-inspect-mode", this._turnOnInspectMode.bind(this));
		ipcMain.on("turn-off-inspect-mode", this._turnOffInspectMode.bind(this));
		ipcMain.on("post-message-to-webview", this._postMessageToWebView.bind(this));
	}

	async _postMessageToWebView(event, data) {
		if (!this.webContents().isDestroyed()) this.webContents().send("post-message-to-webview", data);
	}

	async _turnOnInspectMode() {
		await this.debugger.sendCommand("Overlay.setInspectMode", {
			mode: "searchForNode",
			highlightConfig: highlighterStyle,
		});
	}

	async _turnOffInspectMode() {
		await this.debugger.sendCommand("Overlay.setInspectMode", {
			mode: "none",
			highlightConfig: highlighterStyle,
		});
	}

	async _executeCustomCode(event, scriptFunction: string) {
		await this._focusWebView();
		console.log("Function body", `${scriptFunction} return validate(crusherSdk);`);

		await new Function("exports", "require", "module", "__filename", "__dirname", "crusherSdk", `${scriptFunction} return validate(crusherSdk);`)(
			exports,
			typeof __webpack_require__ === "function" ? __non_webpack_require__ : require,
			module,
			__filename,
			__dirname,
			this.playwrightInstance.getSdkManager(),
		);

		return true;
	}

	async handleDebuggerEvents(event, method, params) {
		if (method === "Overlay.inspectNodeRequested") {
			await this.debugger.sendCommand("Overlay.setInspectMode", {
				mode: "none",
				highlightConfig: highlighterStyle,
			});
			const nodeObject = await this.debugger.sendCommand("DOM.resolveNode", { backendNodeId: params.backendNodeId });
			await this.debugger.sendCommand("Runtime.callFunctionOn", {
				functionDeclaration: "function(){const event = new CustomEvent('elementSelected', {detail:{element: this}}); window.dispatchEvent(event);}",
				objectId: nodeObject.object.objectId,
			});
		}
	}

	isInRunningState() {
		return this.appState.isTestRunning;
	}

	destroy() {
		ipcMain.removeHandler("execute-custom-code");
		ipcMain.removeAllListeners("turn-on-inspect-mode");
		ipcMain.removeAllListeners("turn-off-inspect-mode");
		ipcMain.removeAllListeners("post-message-to-webview");
	}
}
