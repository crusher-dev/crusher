import { BrowserWindow, Debugger, WebContents, ipcMain, webContents, app } from "electron";
import { PlaywrightInstance } from "./runner/playwright";
import { SDK } from "./sdk/sdk";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const highlighterStyle = require("./highlighterStyle.json");

export class WebView {
	debugger: Debugger;
	sdk: SDK;
	playwrightInstance: PlaywrightInstance;

	webContents() {
		const allWebContents = webContents.getAllWebContents();

		const webViewWebContents = allWebContents.find((a) => a.getType() === "webview");
		if (!webViewWebContents) throw new Error("No webview initialized");

		return webViewWebContents;
	}

	constructor(private browserWindow: BrowserWindow) {
		this.browserWindow = browserWindow;
		this.debugger = this.webContents().debugger;
		this.sdk = new SDK(this.webContents(), this.browserWindow.webContents);
	}

	async initialize() {
		if (this.debugger.isAttached()) return;

		this.destroy();

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

		this.playwrightInstance = new PlaywrightInstance();
		await this.playwrightInstance.connect();

		const replayTestId = app.commandLine.getSwitchValue("replay-test-id");
		// Add proper logic here
		if (replayTestId) {
			await this.playwrightInstance.runTestFromRemote(parseInt(replayTestId));
		}
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
			this.sdk,
		);

		return true;
	}

	async handleDebuggerEvents(event, method, params) {
		if (method === "Runtime.consoleAPICalled") {
			const { args } = params;
			if (args.length === 2 && args[0].type === "string" && ["CRUSHER_HOVER_ELEMENT", "CRUSHER_CLICK_ELEMENT"].includes(args[0].value)) {
				switch (args[0].value) {
					case "CRUSHER_HOVER_ELEMENT":
						// @TODO: Fix thi
						await this.sdk.$nodeWrapper(args[1].objectId).hover();
						break;
					case "CRUSHER_CLICK_ELEMENT":
						await this.sdk.$nodeWrapper(args[1].objectId).click();
						break;
					default:
						console.error("This simulated action not supported");
				}
			}
		}

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

	destroy() {
		ipcMain.removeHandler("execute-custom-code");
		ipcMain.removeAllListeners("turn-on-inspect-mode");
		ipcMain.removeAllListeners("turn-off-inspect-mode");
		ipcMain.removeAllListeners("post-message-to-webview");
	}
}
