import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import {WebContents, ipcMain, webContents} from "electron";
import * as path from "path";
import { PlaywrightInstance } from "../lib/playwright";
import { TRecorderCrashState, TRecorderState } from "../store/reducers/recorder";
import { isInspectModeOn } from "../store/selectors/recorder";
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
	private _listeners: WebViewListener | null = null;

	/* Returns webContents of the available webview */
	public getWebContents(): WebContents {
		const allWebContents = webContents.getAllWebContents();

		const webViewWebContents = allWebContents.find((a) => a.getType() === "webview");
		if (!webViewWebContents) throw new Error("No webview initialized");

		return webViewWebContents;
	}

	constructor(appWindow, private resetCallback) {
		this.appWindow = appWindow;
		this.webContents = this.getWebContents();

		this._listeners = new WebViewListener(this.webContents, this.appWindow);
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

		console.log("Initialized recorder in", this._initializeTime.toFixed(2) + "ms");
		// This signals the renderer process that the webview is ready, and its okay
		// to continue.
		this.appWindow.sendMessage("webview-initialized", { initializeTime: this._initializeTime.toFixed(2)});
	}

	private registerIPCListeners() {
		ipcMain.on("turn-on-inspect-mode", this.turnOnInspectMode.bind(this));
		ipcMain.on("turn-off-inspect-mode", this.turnOffInspectMode.bind(this));
	}

	public async turnOnInspectMode() {
		await this.webContents.debugger.sendCommand("Overlay.setInspectMode", {
			mode: "searchForNode",
			highlightConfig: highlighterStyle,
		});
	}

	public async turnOffInspectMode() {
		await this.webContents.debugger.sendCommand("Overlay.setInspectMode", {
			mode: "none",
			highlightConfig: highlighterStyle,
		});
	}

	public async resumeExecution() {
		try {
			await this.webContents.debugger.sendCommand("Debugger.resume");
		} catch (ex) {
			console.info("Error resuming execution", ex);
		}
	}

	public async disableExecution() {
		try {
			await this.webContents.debugger.sendCommand("Debugger.pause");
		} catch (ex) {
			console.info("Error pausing execution", ex);
		}
	}

	async handleDebuggerEvents(event, method, params) {
		if (method === "Overlay.inspectNodeRequested") {
			const nodeObject = await this.webContents.debugger.sendCommand("DOM.resolveNode", { backendNodeId: params.backendNodeId });
			const payload = isInspectModeOn(this.appWindow.store.getState() as any);
				await this.webContents.debugger.sendCommand("Runtime.callFunctionOn", {
					functionDeclaration: "function(){const event = new CustomEvent('elementSelected', {detail:{element: this}}); window.dispatchEvent(event);}",
					objectId: nodeObject.object.objectId,
				});
				if(payload?.meta?.action) {
					// @TODO: Remove this timeout hack
					setTimeout(() => { this.appWindow.getWebContents().executeJavaScript(`window["elementActionsCallback"](); window["elementActionsCallback"]=null;`) }, 100);
				}
				
			await this.webContents.debugger.sendCommand("Overlay.setInspectMode", {
				mode: "none",
				highlightConfig: highlighterStyle,
			});
		}
	}

	public dispose() {
		try {
			this._listeners.dispose();
			this.resetCallback();
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

class WebViewListener {
	constructor(private webContents: WebContents, private appWindow) {
		webContents.session.webRequest.onBeforeSendHeaders(this.handleBeforeSendHeaders);

		webContents.on("crashed", this.handleCrashed.bind(this));
		webContents.on("did-fail-load", this.handleDidFailLoad.bind(this));
		webContents.on("context-menu", this.handleContextMenu.bind(this));
		webContents.on("did-frame-navigate", this.handleFrameDidNavigate.bind(this));
		webContents.on("-will-add-new-contents" as any, this.handleAddNewContents.bind(this, webContents));
	}

	private handleBeforeSendHeaders(details, callback) {
		details.requestHeaders["Bypass-Tunnel-Reminder"] = "true";
		callback({ requestHeaders: details.requestHeaders });
	}

	private handleCrashed(event, any) {
		console.log("Webview crashed", any);
		this.appWindow.updateRecorderCrashState({ type: TRecorderCrashState.CRASHED });
	}

	private handleDidFailLoad(event, errorCode, errorDescription, validatedURL, isMainFrame) {
		if (isMainFrame) {
			this.appWindow.updateRecorderCrashState({ type: TRecorderCrashState.PAGE_LOAD_FAILED });
		}
	}

	private handleContextMenu(event, any) {
		console.log("Webview context menu", any);
	}

	private handleFrameDidNavigate(event, url, httpResponseCode, httpStatusText, isMainFrame) {
		if (
			isMainFrame &&
			![TRecorderState.PERFORMING_ACTIONS, TRecorderState.PERFORMING_RECORDER_ACTIONS, TRecorderState.CUSTOM_CODE_ON].includes(
				this.appWindow.getRecorderState().type,
			)
		) {
			console.log("Recorder state is", this.appWindow.getRecorderState().type);

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
	}

	private handleAddNewContents(webContents, event, url) {
		event.preventDefault();

		webContents.loadURL(url);
		if (
			![TRecorderState.PERFORMING_ACTIONS, TRecorderState.PERFORMING_RECORDER_ACTIONS, TRecorderState.CUSTOM_CODE_ON].includes(
				this.appWindow.getRecorderState().type,
			)
		) {
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
	}

	public dispose() {
		this.webContents.removeAllListeners();
	}
}
