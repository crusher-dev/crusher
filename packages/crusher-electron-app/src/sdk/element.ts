import { Debugger } from "electron";
import { KeyboardImpl } from "./keyboard";
import { MouseImpl } from "./mouse";
import * as types from "./types";

class ElementSdk {
	private _pressedModifiers = new Set<types.KeyboardModifier>();

	objectId: string;
	mouseImpl: MouseImpl;
	keyboardImpl: KeyboardImpl;
	cdp: Debugger;

	constructor(objectId: string, mouseImpl: MouseImpl, keyboardImpl: KeyboardImpl, cdp: Debugger) {
		this.objectId = objectId;
		this.mouseImpl = mouseImpl;
		this.keyboardImpl = keyboardImpl;
		this.cdp = cdp;
	}

	click() {
		return this.mouseImpl.click(this.objectId);
	}

	hover() {
		return this.mouseImpl.hover(this.objectId);
	}

	async focus() {
		await this.cdp.sendCommand("DOM.focus", { objectId: this.objectId });
	}

	async fill(text: string) {
		await this.focus();
		await this.keyboardImpl.sendText(text);
	}

	async type(text: string) {
		await this.focus();
		await this.keyboardImpl.type(text, { delay: 0 });
	}
}

export { ElementSdk };
