import { Debugger, WebContents } from "electron";
import { ElementSdk } from "./element";
import { KeyboardImpl } from "./keyboard";
import { MouseImpl } from "./mouse";

export class SDK {
	private webContents: WebContents;
	private mouseImpl: MouseImpl;
	private keyboardImpl: KeyboardImpl;
	private cdp: Debugger;

	constructor(webContents: WebContents) {
		this.webContents = webContents;
		this.cdp = webContents.debugger;
		this.mouseImpl = new MouseImpl(this.cdp);
		this.keyboardImpl = new KeyboardImpl(this.cdp);
	}

	private async _getNode(selector: string) {
		const functionsResult = await this.cdp.sendCommand("Runtime.evaluate", {
			expression: `window.pwQuerySelector(${JSON.stringify(selector)}, document);`,
		});

		return functionsResult;
	}

	static async initialize(webContents: WebContents) {
		return new SDK(webContents);
	}

	async $(selector: string) {
		const nodeResults = await this._getNode(selector);
		if (!nodeResults.result || !nodeResults.result.objectId) return undefined;
		return new ElementSdk(nodeResults.result.objectId, this.mouseImpl, this.keyboardImpl, this.cdp);
	}

	$nodeWrapper(objectId: string) {
		return new ElementSdk(objectId, this.mouseImpl, this.keyboardImpl, this.cdp);
	}
}
