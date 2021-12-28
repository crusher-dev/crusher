import { WebContents, ipcMain, webContents, session } from "electron";
import * as path from "path";
import { PlaywrightInstance } from "../lib/playwright";
import { AppWindow } from "./app-window";
import { now } from "./now";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const highlighterStyle = require("./highlighterStyle.json");

export class WebView {
	playwrightInstance: PlaywrightInstance;
	appWindow: AppWindow;
    webContents: WebContents;

	private _startTime: number | null = null;
    private _initializeTime: number | null = null

	getWebContents(): WebContents {
		const allWebContents = webContents.getAllWebContents();

		const webViewWebContents = allWebContents.find((a) => a.getType() === "webview");
		if (!webViewWebContents) throw new Error("No webview initialized");

		return webViewWebContents;
	}

	constructor(appWindow) {
		this.appWindow = appWindow;
        this.webContents = this.getWebContents();
		this._startTime = now();
	}

    async initialize() {
		this.webContents.on("destroyed", this.dispose.bind(this));
        if(this.webContents.debugger.isAttached()) return;

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

		console.log("Path is", path.join(__dirname, "recorder.js"));
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

	async handleDebuggerEvents(event, method, params) {
		if (method === "Overlay.inspectNodeRequested") {
			await this.webContents.debugger.sendCommand("Overlay.setInspectMode", {
				mode: "none",
				highlightConfig: highlighterStyle,
			});
			const nodeObject = await this.webContents.debugger.sendCommand("DOM.resolveNode", { backendNodeId: params.backendNodeId });
			await this.webContents.debugger.sendCommand("Runtime.callFunctionOn", {
				functionDeclaration: "function(){const event = new CustomEvent('elementSelected', {detail:{element: this}}); window.dispatchEvent(event);}",
				objectId: nodeObject.object.objectId,
			});
		}
	}

	dispose() {
		ipcMain.removeHandler("execute-custom-code");
		ipcMain.removeHandler("get-node-id");
		ipcMain.removeAllListeners("turn-on-inspect-mode");
		ipcMain.removeAllListeners("turn-off-inspect-mode");
		ipcMain.removeAllListeners("post-message-to-webview");
		this.playwrightInstance.dispose();
	}
}
