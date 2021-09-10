import { CookiesSetDetails, Debugger, WebContents } from "electron";
import { ElementSdk } from "./element";
import { KeyboardImpl } from "./keyboard";
import { MouseImpl } from "./mouse";
import { session } from "electron";

import * as types from "./types";
export class SDK {
	private webContents: WebContents;
	private mouseImpl: MouseImpl;
	private keyboardImpl: KeyboardImpl;
	private cdp: Debugger;
	private mainWebContents: WebContents;

	constructor(webContents: WebContents, mainWebContents: WebContents) {
		this.webContents = webContents;
		this.cdp = webContents.debugger;
		this.mouseImpl = new MouseImpl(this.cdp);
		this.keyboardImpl = new KeyboardImpl(this.cdp);
		this.mainWebContents = mainWebContents;
	}

	private async _getNode(selector: string) {
		const functionsResult = await this.cdp.sendCommand("Runtime.evaluate", {
			expression: `window.pwQuerySelector(${JSON.stringify(selector)}, document);`,
		});

		return functionsResult;
	}

	async $(selector: string) {
		const nodeResults = await this._getNode(selector);
		if (!nodeResults.result || !nodeResults.result.objectId) return undefined;
		return new ElementSdk(nodeResults.result.objectId, this.mouseImpl, this.keyboardImpl, this.cdp);
	}

	$nodeWrapper(objectId: string) {
		return new ElementSdk(objectId, this.mouseImpl, this.keyboardImpl, this.cdp);
	}

	async setCookies(cookies: Array<CookiesSetDetails>) {
		for (const cookie of cookies) {
			await session.defaultSession.cookies.set(cookie);
		}

		return true;
	}

	async reloadPage() {
		const result = await this.webContents.executeJavaScript("window.location.reload();");
		return result;
	}

	async sleep(timeout: number) {
		return new Promise((resolve) => {
			setTimeout(() => resolve(true), timeout);
		});
	}
}
