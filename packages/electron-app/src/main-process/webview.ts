import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { WebContents, ipcMain, webContents, session } from "electron";
import * as path from "path";
import { PlaywrightInstance } from "../lib/playwright";
import { TRecorderCrashState, TRecorderState } from "../store/reducers/recorder";
import { AppWindow } from "./app-window";
import { now } from "./now";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const highlighterStyle = require("./highlighterStyle.json");

export class WebView {
	playwrightInstance: PlaywrightInstance;
	appWindow: AppWindow;
	webContents: WebContents;

	private _startTime: number | null = null;
	private _initializeTime: number | null = null;

	getWebContents(): WebContents {
		const allWebContents = webContents.getAllWebContents();

		const webViewWebContents = allWebContents.find((a) => a.getType() === "webview");
		if (!webViewWebContents) throw new Error("No webview initialized");

		webViewWebContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
			details.requestHeaders["Bypass-Tunnel-Reminder"] = "true";
			callback({ requestHeaders: details.requestHeaders });
		});

		webViewWebContents.on("crashed", (event, any) => {
			console.log("Webview crashed", any);
			this.appWindow.updateRecorderCrashState({type: TRecorderCrashState.CRASHED });
		});

		webViewWebContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
			if(isMainFrame) {
				this.appWindow.updateRecorderCrashState({type: TRecorderCrashState.PAGE_LOAD_FAILED});
			}
		});

		webViewWebContents.on("context-menu", (event, any) => {
			console.log("Webview context menu", any);
		});

		webViewWebContents.on("did-frame-navigate", (event, url, httpResponseCode, httpStatusText, isMainFrame) => {
			if(isMainFrame && this.appWindow.getRecorderState().type !== TRecorderState.PERFORMING_ACTIONS) {
				this.appWindow.handleSaveStep(null, {
					action: {
						type: ActionsInTestEnum.WAIT_FOR_NAVIGATION as ActionsInTestEnum,
						payload: {
							meta: {
								value: url,
							},
						},
					},
				});			}
		});

		webViewWebContents.on("-will-add-new-contents" as any, (event, url) => {
			event.preventDefault();
			console.log("New url is this", url);

			webViewWebContents.loadURL(url);
			if (this.appWindow.getRecorderState().type !== TRecorderState.PERFORMING_ACTIONS) {
				this.appWindow.handleSaveStep(null, {
					action: {
						type: ActionsInTestEnum.WAIT_FOR_NAVIGATION as ActionsInTestEnum,
						payload: {
							meta: {
								value: url,
							},
						},
					},
				});
			}
		});

		return webViewWebContents;
	}

	constructor(appWindow) {
		this.appWindow = appWindow;
		this.webContents = this.getWebContents();
		this._startTime = now();
	}

	async initialize() {
		this.webContents.on("destroyed", this.dispose.bind(this));
		if (this.webContents.debugger.isAttached()) return;

		const _debugger = this.webContents.debugger;

		this.playwrightInstance = new PlaywrightInstance(this.appWindow);

		_debugger.attach("1.3");
		await _debugger.sendCommand("Debugger.enable");
		await _debugger.sendCommand("DOM.enable");
		await _debugger.sendCommand("Runtime.enable");
		await _debugger.sendCommand("Overlay.enable");
		await _debugger.sendCommand("Page.enable");
		await _debugger.sendCommand("Network.enable");
		await _debugger.sendCommand("Emulation.setFocusEmulationEnabled", { enabled: true });
		await _debugger.sendCommand("Debugger.setAsyncCallStackDepth", { maxDepth: 9999 });
		await _debugger.sendCommand("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: true, flatten: true });
		// // @TODO: This should not be necessary. Look into this
		// // It's here to enable DOMDebugger, which is not getting enabled by default
		// await _debugger.sendCommand("DOMDebugger.setXHRBreakpoint", { url: "http://nonsense.com" });
		await _debugger.on("message", this.handleDebuggerEvents.bind(this));

		this.registerIPCListeners();
		await this.playwrightInstance.connect();

		await this.playwrightInstance.addInitScript(path.join(__dirname, "recorder.js"));
		this._initializeTime = now() - this._startTime;

		console.log("Initialized in", this._initializeTime);
		this.appWindow.sendMessage("webview-initialized", { initializeTime: this._initializeTime });
	}

	registerIPCListeners() {
		ipcMain.on("turn-on-inspect-mode", this._turnOnInspectMode.bind(this));
		ipcMain.on("turn-off-inspect-mode", this._turnOffInspectMode.bind(this));
	}

	async _turnOnInspectMode() {
		await this.webContents.debugger.sendCommand("Overlay.setInspectMode", {
			mode: "searchForNode",
			highlightConfig: highlighterStyle,
		});
	}

	async _turnOffInspectMode() {
		await this.webContents.debugger.sendCommand("Overlay.setInspectMode", {
			mode: "none",
			highlightConfig: highlighterStyle,
		});
	}

	async _resumeExecution() {
		try {
			await this.webContents.debugger.sendCommand("Debugger.resume");
		} catch(ex){}
	}

	async _disableExecution() {
		try {
			await this.webContents.debugger.sendCommand("Debugger.pause");
		} catch(ex) {}
	}

	async handleDebuggerEvents(event, method, params) {
		if (method === "Overlay.inspectNodeRequested") {
			const nodeObject = await this.webContents.debugger.sendCommand("DOM.resolveNode", { backendNodeId: params.backendNodeId });
			await this.webContents.debugger.sendCommand("Runtime.callFunctionOn", {
				functionDeclaration: "function(){const event = new CustomEvent('elementSelected', {detail:{element: this}}); window.dispatchEvent(event);}",
				objectId: nodeObject.object.objectId,
			});
			await this.webContents.debugger.sendCommand("Overlay.setInspectMode", {
				mode: "none",
				highlightConfig: highlighterStyle,
			});
		}
	}

	dispose() {
		try {
			if (this.webContents && !this.webContents.isDestroyed()) {
				this.webContents.debugger.detach();
			}
			if (ipcMain) {
				ipcMain.removeHandler("execute-custom-code");
				ipcMain.removeHandler("get-node-id");
				ipcMain.removeAllListeners("turn-on-inspect-mode");
				ipcMain.removeAllListeners("turn-off-inspect-mode");
				ipcMain.removeAllListeners("post-message-to-webview");
			}
			if (this.playwrightInstance) {
				this.playwrightInstance.dispose();
			}
		} catch (e) {
			console.error("Error while diposing", e);
		}
	}
}
